#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,shutil,subprocess,sys,time,hashlib
from datetime import datetime, timezone
from pathlib import Path

def utc_now(): return datetime.now(timezone.utc).isoformat()
def dt(v): return datetime.fromisoformat(v.replace('Z','+00:00'))
def overlap(rows,sk,ek):
    ints=[]; ev=[]
    for r in rows:
        if r.get(sk) and r.get(ek):
            s,e=dt(r[sk]),dt(r[ek]); ints.append((s,e)); ev += [(s,1),(e,-1)]
    ev.sort(key=lambda x:(x[0],-x[1])); a=p=0
    for _,d in ev: a+=d; p=max(p,a)
    if not ints: return 0,0.0
    wall=max((max(e for _,e in ints)-min(s for s,_ in ints)).total_seconds(),0.001); agg=sum((e-s).total_seconds() for s,e in ints); return p,agg/wall
def fingerprint(tasks,baseline): return hashlib.sha256(json.dumps({'baseline':baseline,'tasks':tasks},sort_keys=True,separators=(',',':')).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser()
    for a in ['source-root','manifest','tasks','worker','out','baseline']: ap.add_argument('--'+a,required=True)
    ap.add_argument('--configured-lanes',type=int,default=10); ap.add_argument('--stale-log-dir'); args=ap.parse_args()
    root=Path(args.source_root).resolve(); mp=Path(args.manifest).resolve(); tasks=json.loads(Path(args.tasks).read_text()); worker=Path(args.worker).resolve(); out=Path(args.out).resolve(); lanes=[t.get('lane') for t in tasks]; ids=[t.get('task_id') for t in tasks]
    if not tasks: raise SystemExit('no tasks supplied')
    if len(set(lanes))!=len(lanes): raise SystemExit('duplicate lane in dispatch')
    if len(set(ids))!=len(ids): raise SystemExit('duplicate task_id in dispatch')
    if len(tasks)>args.configured_lanes: raise SystemExit('dispatch exceeds configured lane count')
    if any(t.get('safe_independent') is not True for t in tasks): raise SystemExit('unsafe task in dispatch')
    if args.stale_log_dir:
        leftovers=list(Path(args.stale_log_dir).glob('*-LANE-WORK.md'))
        if leftovers: raise SystemExit(f'fail-closed stale lane logs={len(leftovers)}')
    manifest=json.loads(mp.read_text())['source_snapshot']
    if manifest.get('provider')!='ORCHESTRATOR_STAGED_SNAPSHOT' or manifest.get('repository')!='vvekselva/CylinderManagement' or manifest.get('baseline')!=args.baseline: raise SystemExit('manifest identity/baseline mismatch')
    for t in tasks:
        if not (root/t['controller_path']).is_file(): raise SystemExit('missing controller root '+t['controller_path'])
    if out.exists(): shutil.rmtree(out)
    (out/'workers').mkdir(parents=True); (out/'logs').mkdir(); eid='E2E-STAGED-'+datetime.now().strftime('%Y%m%d-%H%M%S'); barrier=time.time()+2.0; procs=[]; journal={'execution_id':eid,'dispatch_fingerprint':fingerprint(tasks,args.baseline),'phase':'STARTING','started_at':utc_now(),'sync_state':'NOT_STARTED','workers':[]}; (out/'execution-journal.json').write_text(json.dumps(journal,indent=2))
    for t in tasks:
        d=out/'workers'/t['lane']; d.mkdir(); tj=d/'task.json'; rj=d/'result.json'; hb=d/'heartbeat.json'; log=out/'logs'/f'{eid}-{t["lane"]}-{t["task_id"]}-LANE-WORK.md'; tj.write_text(json.dumps(t,indent=2)); cmd=[sys.executable,str(worker),'--task-json',str(tj),'--source-root',str(root),'--snapshot-manifest',str(mp),'--expected-commit',args.baseline,'--execution-id',eid,'--lane-log',str(log),'--result-json',str(rj),'--heartbeat',str(hb),'--service-not-before-epoch',str(barrier)]; p=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True); procs.append((t,p,rj,hb,log)); journal['workers'].append({'lane':t['lane'],'task_id':t['task_id'],'pid':p.pid,'state':'STARTED'}); (out/'execution-journal.json').write_text(json.dumps(journal,indent=2))
    journal['phase']='RUNNING'; (out/'execution-journal.json').write_text(json.dumps(journal,indent=2)); rows=[]; failures=[]
    for t,p,rj,hb,log in procs:
        o,e=p.communicate(timeout=180); row={}
        if rj.is_file(): row=json.loads(rj.read_text()).get('lane_result',{}); rows.append(row)
        if p.returncode!=0 or row.get('status')!='EVIDENCE_COLLECTED': failures.append({'lane':t['lane'],'task_id':t['task_id'],'exit_code':p.returncode,'stderr':e[-1000:]})
    journal['phase']='AGGREGATING'; (out/'execution-journal.json').write_text(json.dumps(journal,indent=2)); peak,avg=overlap(rows,'service_started_at','service_ended_at'); src_reqs=[]; bind_reqs=[]
    for r in rows: src_reqs += r.get('missing_source_requests',[]); bind_reqs += r.get('missing_binding_requests',[])
    sr={json.dumps(x,sort_keys=True):x for x in src_reqs}; br={x['binding_key']:x for x in bind_reqs}; src_reqs=list(sr.values()); bind_reqs=list(br.values()); closure=not src_reqs and not bind_reqs
    agg=out/f'{eid}.md'; parts=[f'# E2E staged execution {eid}','',f'dispatch_fingerprint: {journal["dispatch_fingerprint"]}',f'workers: {len(tasks)}',f'peak_service_concurrency: {peak}',f'average_service_concurrency: {avg:.2f}',f'worker_failures: {len(failures)}',f'missing_source_requests: {len(src_reqs)}',f'missing_binding_requests: {len(bind_reqs)}','']
    for t,p,rj,hb,log in procs:
        parts += [f'## {t["lane"]} / {t["task_id"]}']
        if log.exists(): parts += log.read_text().splitlines(); log.unlink()
    agg.write_text('\n'.join(parts)+'\n'); remaining=len(list((out/'logs').glob('*-LANE-WORK.md'))); expected=min(args.configured_lanes,len(tasks)); qgl='FAILED_WORKER_EXECUTION' if failures else ('PASS' if peak>=expected else 'UNDERUTILIZED'); phase='CLOSED_READY_FOR_VALIDATION' if closure and not failures else ('CLOSED_RESTAGE_REQUIRED' if not failures else 'CLOSED_WITH_FAILURES')
    handoff={'executor_state':'COMPLETED','assigned_executor_work_remaining':False,'orchestrator_signal':'EXECUTOR_COMPLETED_REPLAN_REQUIRED','return_control_to':'PRIMARY_ORCHESTRATOR','required_orchestrator_action':'VALIDATE_SYNC_REPLAN_AND_ASSIGN_NEXT_WORK'}
    summary={'execution_id':eid,'dispatch_fingerprint':journal['dispatch_fingerprint'],'state':'CLOSED' if not failures else 'CLOSED_WITH_FAILURES','phase':phase,'workers_started':len(tasks),'worker_results_received':len(rows),'worker_failures':len(failures),'peak_service_concurrent_lanes':peak,'average_service_concurrent_lanes':round(avg,2),'source_closure_complete':closure,'missing_source_requests':src_reqs,'missing_binding_requests':bind_reqs,'individual_lane_logs_remaining':remaining,'qg_source_001_state':'SOURCE_CLOSURE_COMPLETE' if closure else 'PASS_ROOTS_VERIFIED_SOURCE_CLOSURE_PARTIAL','qg_lane_001_state':qgl,'trace_evidence_auto_accepted':False,'aggregate_log':str(agg),'executor_handoff':handoff,'workers':rows}
    (out/'summary.json').write_text(json.dumps(summary,indent=2)); (out/'source-staging-requests.json').write_text(json.dumps({'source_staging_requests':{'execution_id':eid,'source_requests':src_reqs,'binding_requests':bind_reqs}},indent=2)); journal.update({'phase':phase,'ended_at':utc_now(),'aggregate_log':str(agg),'source_closure_complete':closure,'individual_lane_logs_remaining':remaining,'result_fingerprint':hashlib.sha256(json.dumps(summary,sort_keys=True,default=str).encode()).hexdigest(),'sync_state':'PENDING_ORCHESTRATOR_VALIDATION','executor_handoff':handoff}); (out/'execution-journal.json').write_text(json.dumps(journal,indent=2)); print(json.dumps(summary,indent=2)); return 0 if not failures else 2
if __name__=='__main__': raise SystemExit(main())
