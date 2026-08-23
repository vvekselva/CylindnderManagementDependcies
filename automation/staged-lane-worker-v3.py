#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, os, re, time
from datetime import datetime, timezone
from pathlib import Path

SQL_OBJECT_RE = re.compile(r"(?:(?:public)\.)?(tbl_[A-Za-z0-9_]+|vw_[A-Za-z0-9_]+)")
TABLE_RE = re.compile(r"@Table\s*\((?P<body>[^)]*)\)", re.S)
NAME_RE = re.compile(r'name\s*=\s*"([^"]+)"')
SCHEMA_RE = re.compile(r'schema\s*=\s*"([^"]+)"')
IMPORT_RE = re.compile(r"^\s*import\s+([A-Za-z0-9_.$]+);\s*$", re.M)
FIELD_RE = re.compile(r"\b(?:private|protected|public)\s+(?:(?:static|final)\s+)*([A-Z][A-Za-z0-9_]*(?:\s*<[^;=]+>)?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=[^;]*)?;")
CTOR_RE = re.compile(r"\bpublic\s+[A-Z][A-Za-z0-9_]*\s*\((.*?)\)\s*\{", re.S)
JPA_GENERIC_RE = re.compile(r"(?:JpaRepository|JpaSpecificationExecutor|CrudRepository|PagingAndSortingRepository)\s*<\s*([A-Z][A-Za-z0-9_]*)")
TERMINAL_REPO_RE = re.compile(r"\bextends\s+[^\{;]*(?:JpaRepository|JpaSpecificationExecutor|CrudRepository|PagingAndSortingRepository)\s*<")
QUALIFIER_RE = re.compile(r'@Qualifier\s*\(\s*"([^"]+)"\s*\)')
INTERFACE_RE = re.compile(r"\bpublic\s+interface\s+([A-Z][A-Za-z0-9_]*)")
FOLLOW_SUFFIXES=("Service","Dao","DAO","Repository","JpaDao","Controller","Mapper","Mediator","Validator")

def utc_now(): return datetime.now(timezone.utc).isoformat()
def git_blob_sha(path):
    data=path.read_bytes(); return hashlib.sha1(f"blob {len(data)}\0".encode()+data).hexdigest()
def load_manifest(path): return json.loads(path.read_text(encoding='utf-8'))['source_snapshot']
def manifest_index(m): return {r['path']:r['git_blob_sha'] for r in m.get('files',[])}
def verify_file(root,rel,index):
    p=root/rel; key=rel.as_posix()
    if not p.is_file(): return False,'MISSING'
    exp=index.get(key)
    if not exp: return False,'NOT_IN_MANIFEST'
    act=git_blob_sha(p)
    return (act==exp, act if act==exp else f'BLOB_MISMATCH expected={exp} actual={act}')
def imports(text):
    out={}
    for fq in IMPORT_RE.findall(text): out[fq.rsplit('.',1)[-1]]=fq
    return out
def type_parts(expr):
    raw=expr.strip().split('<',1)[0].strip(); args=[]
    if '<' in expr and '>' in expr:
        inner=expr.split('<',1)[1].rsplit('>',1)[0]
        args=re.findall(r'\b([A-Z][A-Za-z0-9_]*)\b',inner)
    return raw,args
def followable(n): return n.endswith(FOLLOW_SUFFIXES) or n.endswith('Do') or (n.startswith('I') and n.endswith(("Service","Mediator","Validator")))
def append_event(log,event,task,eid,result=None):
    ts=utc_now(); lines=[f'## {event}',f'Time: {ts}',f'Execution: {eid}',f'Lane: {task["lane"]}',f'Task ID: {task["task_id"]}',f'Task: {task["task"]}',f'Task Description: {task["task_description"]}']
    if result is not None: lines.append(f'Result: {result}')
    lines.append('')
    with log.open('a',encoding='utf-8') as h: h.write('\n'.join(lines)+'\n')
    return ts
def heartbeat(path,state,task,eid):
    path.write_text(json.dumps({'execution_id':eid,'lane':task['lane'],'task_id':task['task_id'],'task':task['task'],'state':state,'pid':os.getpid(),'timestamp':utc_now()},indent=2),encoding='utf-8')
def physical(rel,text):
    out={}
    for m in TABLE_RE.finditer(text):
        body=m.group('body'); nm=NAME_RE.search(body); sc=SCHEMA_RE.search(body)
        if nm:
            obj=f"{sc.group(1) if sc else 'public'}.{nm.group(1)}"; out[('JPA_TABLE',obj,rel.as_posix())]={'type':'JPA_TABLE','object':obj,'source':rel.as_posix()}
    for m in SQL_OBJECT_RE.finditer(text):
        raw=m.group(0); obj=raw if '.' in raw else f'public.{m.group(1)}'; out[('SQL_OBJECT',obj,rel.as_posix())]={'type':'SQL_OBJECT','object':obj,'source':rel.as_posix()}
    return list(out.values())
def find_java(root,name):
    xs=list(root.rglob(name+'.java')); return xs[0] if xs else None
def field_injection_sites(text,source_rel):
    im=imports(text); sites=[]; qualifier=None
    for line in text.splitlines():
        qm=QUALIFIER_RE.search(line)
        if qm: qualifier=qm.group(1); continue
        fm=FIELD_RE.search(line)
        if fm:
            expr,var=fm.group(1),fm.group(2); raw,args=type_parts(expr)
            if followable(raw):
                sites.append({'source_path':source_rel,'injection_kind':'FIELD','declared_type':raw,'generic_args':args,'variable_name':var,'qualifier':qualifier,'import_fqcn':im.get(raw)})
            else:
                for arg in args:
                    if followable(arg):
                        sites.append({'source_path':source_rel,'injection_kind':'FIELD_GENERIC','declared_type':arg,'generic_args':[],'variable_name':var,'qualifier':qualifier,'import_fqcn':im.get(arg)})
            qualifier=None
    return sites
def ctor_injection_sites(text,source_rel):
    im=imports(text); sites=[]
    for m in CTOR_RE.finditer(text):
        params=m.group(1)
        for part in re.split(r',\s*(?![^<]*>)',params):
            part=part.strip()
            if not part: continue
            q=QUALIFIER_RE.search(part); qualifier=q.group(1) if q else None
            part=QUALIFIER_RE.sub('',part).strip(); mm=re.search(r'([A-Z][A-Za-z0-9_]*(?:\s*<[^>]+>)?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*$',part)
            if not mm: continue
            expr,var=mm.group(1),mm.group(2); raw,args=type_parts(expr)
            if followable(raw): sites.append({'source_path':source_rel,'injection_kind':'CONSTRUCTOR','declared_type':raw,'generic_args':args,'variable_name':var,'qualifier':qualifier,'import_fqcn':im.get(raw)})
    return sites
def binding_key(site):
    return '|'.join([site.get('source_path') or '',site.get('injection_kind') or '',site.get('variable_name') or '',site.get('declared_type') or '',','.join(site.get('generic_args') or []),site.get('qualifier') or ''])
def binding_index(manifest): return {r['binding_key']:r for r in manifest.get('bindings',[]) if r.get('binding_key')}
def is_interface_file(text): return bool(INTERFACE_RE.search(text)) and not TERMINAL_REPO_RE.search(text)
def lower_camel(name): return name[:1].lower()+name[1:] if name else name
def validate_binding_source(root,impl_rel,index,site):
    ok,reason=verify_file(root,impl_rel,index)
    if not ok: return False,reason
    text=(root/impl_rel).read_text(encoding='utf-8',errors='replace'); declared=re.escape(site['declared_type']); args=site.get('generic_args') or []
    if args:
        generic='\\s*,\\s*'.join(re.escape(a) for a in args); pat=re.compile(r'\bimplements\s+[^\{;]*\b'+declared+r'\s*<\s*'+generic+r'\s*>',re.S)
    else:
        pat=re.compile(r'\bimplements\s+[^\{;]*\b'+declared+r'\b',re.S)
    if not pat.search(text): return False,'IMPLEMENTATION_SIGNATURE_MISMATCH'
    q=site.get('qualifier')
    if q:
        simple=impl_rel.stem; default=lower_camel(simple); named=re.search(r'@(Service|Component)\s*\(\s*"'+re.escape(q)+r'"\s*\)',text)
        if q!=default and not named: return False,f'QUALIFIER_MISMATCH qualifier={q} defaultBean={default}'
    return True,reason

def main():
    ap=argparse.ArgumentParser()
    for a in ['task-json','source-root','snapshot-manifest','expected-commit','execution-id','lane-log','result-json','heartbeat']: ap.add_argument('--'+a,required=True)
    ap.add_argument('--service-not-before-epoch',type=float,default=0.0); args=ap.parse_args()
    task=json.loads(Path(args.task_json).read_text()); root=Path(args.source_root).resolve(); manifest=load_manifest(Path(args.snapshot_manifest)); idx=manifest_index(manifest); binds=binding_index(manifest); log=Path(args.lane_log); resultp=Path(args.result_json); hb=Path(args.heartbeat)
    for p in [log.parent,resultp.parent,hb.parent]: p.mkdir(parents=True,exist_ok=True)
    log.write_text(f'# Staged Snapshot Lane Lifecycle - {task["lane"]} / {task["task_id"]}\n\n',encoding='utf-8'); ws=append_event(log,'LANE_INIT_START',task,args.execution_id); heartbeat(hb,'INITIALIZING',task,args.execution_id)
    baseline_ok=manifest.get('provider')=='ORCHESTRATOR_STAGED_SNAPSHOT' and manifest.get('repository')=='vvekselva/CylinderManagement' and manifest.get('baseline')==args.expected_commit
    crel=Path(task['controller_path']); cok,creason=verify_file(root,crel,idx); init_ok=baseline_ok and cok and task.get('safe_independent') is True
    append_event(log,'LANE_INIT_END',task,args.execution_id,'INITIALIZED' if init_ok else 'BLOCKED_BEFORE_SERVICE')
    lr={'execution_id':args.execution_id,'lane':task['lane'],'task_id':task['task_id'],'task':task['task'],'task_description':task['task_description'],'pid':os.getpid(),'worker_started_at':ws,'worker_ended_at':None,'service_started_at':None,'service_ended_at':None,'source_provider':manifest.get('provider'),'source_baseline_expected':args.expected_commit,'source_baseline_actual':manifest.get('baseline'),'source_baseline_verified':baseline_ok,'controller_path':task['controller_path'],'controller_blob_verified':cok,'controller_blob_verification':creason,'status':'FAILED','components_examined':[],'physical_dependency_candidates':[],'dependency_edges':[],'missing_source_requests':[],'missing_binding_requests':[],'manifest_verified_components':[],'notes':[]}
    if not init_ok:
        lr['notes'].append(f'Source snapshot init failed: baseline_ok={baseline_ok}, controller={creason}'); heartbeat(hb,'CLOSING',task,args.execution_id); append_event(log,'LANE_CLOSE_END',task,args.execution_id,'BLOCKED')
    else:
        rem=args.service_not_before_epoch-time.time()
        if rem>0: heartbeat(hb,'INITIALIZED_WAITING_FOR_BATCH_START',task,args.execution_id); time.sleep(rem)
        lr['service_started_at']=append_event(log,'LANE_SERVICE_START',task,args.execution_id); heartbeat(hb,'WORKING',task,args.execution_id)
        queue=[root/crel]; seen=set(); verified=[]; phys=[]; edges=[]; missing_src={}; missing_bind={}; maxc=int(task.get('max_components',60))
        while queue and len(seen)<maxc:
            p=queue.pop(0)
            if p in seen or not p.is_file(): continue
            rel=p.relative_to(root); ok,reason=verify_file(root,rel,idx)
            if not ok:
                missing_src[rel.as_posix()]={'type':'INTEGRITY_FAILURE','path':rel.as_posix(),'reason':reason,'discovered_from':rel.as_posix()}; continue
            verified.append({'path':rel.as_posix(),'git_blob_sha':reason}); seen.add(p); text=p.read_text(encoding='utf-8',errors='replace'); phys.extend(physical(rel,text)); sites=field_injection_sites(text,rel.as_posix())+ctor_injection_sites(text,rel.as_posix()); im=imports(text)
            for ent in JPA_GENERIC_RE.findall(text): sites.append({'source_path':rel.as_posix(),'injection_kind':'REPOSITORY_GENERIC','declared_type':ent,'generic_args':[],'variable_name':None,'qualifier':None,'import_fqcn':im.get(ent)})
            for site in sites:
                edges.append(site); raw=site['declared_type']; cand=find_java(root,raw)
                if cand:
                    ctext=cand.read_text(encoding='utf-8',errors='replace')
                    if is_interface_file(ctext):
                        key=binding_key(site); b=binds.get(key)
                        if not b:
                            missing_bind[key]={'binding_key':key,**site,'reason':'INTERFACE_BINDING_REQUIRED'}
                            if cand not in seen and cand not in queue: queue.append(cand)
                        else:
                            impl_rel=Path(b['implementation_path']); bok,breason=validate_binding_source(root,impl_rel,idx,site)
                            if not bok:
                                missing_bind[key]={'binding_key':key,**site,'reason':'BOUND_IMPLEMENTATION_VALIDATION_FAILURE','implementation_path':b.get('implementation_path'),'verification':breason}
                            else:
                                if cand not in seen and cand not in queue: queue.append(cand)
                                impl=root/impl_rel
                                if impl not in seen and impl not in queue: queue.append(impl)
                    else:
                        if cand not in seen and cand not in queue: queue.append(cand)
                else:
                    key=(site.get('import_fqcn') or raw); missing_src[key]={'type':raw,'import_fqcn':site.get('import_fqcn'),'source_path':site['source_path'],'variable_name':site.get('variable_name'),'qualifier':site.get('qualifier'),'generic_args':site.get('generic_args'),'reason':'SOURCE_FILE_NOT_STAGED'}
        dedup={(x['type'],x['object'],x['source']):x for x in phys}; lr['components_examined']=sorted(p.relative_to(root).as_posix() for p in seen); lr['physical_dependency_candidates']=list(dedup.values()); lr['dependency_edges']=edges; lr['missing_source_requests']=sorted(missing_src.values(),key=lambda x:(x.get('import_fqcn') or x.get('type') or '')); lr['missing_binding_requests']=sorted(missing_bind.values(),key=lambda x:x['binding_key']); lr['manifest_verified_components']=verified; lr['status']='EVIDENCE_COLLECTED'; lr['notes'].append('Evidence collection only. QG-SOURCE-001 SOURCE_CLOSURE_COMPLETE requires zero missing_source_requests and zero missing_binding_requests. Final trace acceptance belongs to the Orchestrator.'); lr['service_ended_at']=append_event(log,'LANE_SERVICE_END',task,args.execution_id,'COMPLETED'); heartbeat(hb,'CLOSING',task,args.execution_id); append_event(log,'LANE_CLOSE_END',task,args.execution_id,'EVIDENCE_COLLECTED_CLOSED')
    lr['worker_ended_at']=utc_now(); resultp.write_text(json.dumps({'lane_result':lr},indent=2),encoding='utf-8'); heartbeat(hb,'CLOSED',task,args.execution_id); return 0 if lr['status']=='EVIDENCE_COLLECTED' else 2
if __name__=='__main__': raise SystemExit(main())
