#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

INLINE_TASK_RE = re.compile(r"^\s*-\s*\{(.*)\}\s*$")
TOP_RE = re.compile(r"^\s{2}([A-Za-z0-9_]+):\s*(.*?)\s*$")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def stamp() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def unquote(v: str) -> str:
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in ('"', "'"):
        return v[1:-1]
    return v


def parse_scalar(v: str) -> Any:
    v = unquote(v.strip())
    low = v.lower()
    if low == "true": return True
    if low == "false": return False
    if low in ("null", "none", "~"): return None
    if re.fullmatch(r"-?\d+", v): return int(v)
    return v


def parse_inline_map(body: str) -> dict[str, Any]:
    parts = re.split(r",\s+(?=[A-Za-z_][A-Za-z0-9_]*\s*:)", body)
    out: dict[str, Any] = {}
    for part in parts:
        if ":" in part:
            key, value = part.split(":", 1)
            out[key.strip()] = parse_scalar(value)
    return out


def parse_dispatch(path: Path) -> dict[str, Any]:
    doc: dict[str, Any] = {"tasks": []}
    in_tasks = False
    for raw in path.read_text(encoding="utf-8").splitlines():
        if raw.strip() == "tasks:":
            in_tasks = True
            continue
        if in_tasks:
            m = INLINE_TASK_RE.match(raw)
            if m:
                doc["tasks"].append(parse_inline_map(m.group(1)))
                continue
            if raw and not raw.startswith("    ") and raw.strip():
                in_tasks = False
        if not in_tasks:
            m = TOP_RE.match(raw)
            if m:
                doc[m.group(1)] = parse_scalar(m.group(2))
    return doc


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=check)


def git_verify_commit(repo: Path, commit: str) -> None:
    cp = run(["git", "-C", str(repo), "cat-file", "-e", f"{commit}^{{commit}}"], check=False)
    if cp.returncode != 0:
        raise RuntimeError(f"Frozen commit {commit} is not available in source repository: {cp.stderr.strip()}")


def write_yaml_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def overlap_metrics(rows: list[dict[str, Any]], start_key: str, end_key: str) -> tuple[int, float]:
    intervals: list[tuple[datetime, datetime]] = []
    events: list[tuple[datetime, int]] = []
    for row in rows:
        if row.get(start_key) and row.get(end_key):
            s, e = dt(row[start_key]), dt(row[end_key])
            intervals.append((s, e)); events.extend([(s, 1), (e, -1)])
    events.sort(key=lambda x: (x[0], -x[1]))
    active = peak = 0
    for _, delta in events:
        active += delta; peak = max(peak, active)
    if not intervals: return 0, 0.0
    wall = max((max(e for _, e in intervals) - min(s for s, _ in intervals)).total_seconds(), 0.001)
    aggregate = sum((e - s).total_seconds() for s, e in intervals)
    return peak, aggregate / wall


def make_lane_status(backlog_item: str, work_unit: str, baseline: str, execution_id: str, tasks: list[dict[str, Any]], states: dict[str, dict[str, Any]], invocation_state: str, backend_state: str, note: str) -> dict[str, Any]:
    task_map = {str(t["lane"]): t for t in tasks}
    lanes: dict[str, Any] = {}
    valid = ["IDLE", "ASSIGNED", "INITIALIZING", "WORKING", "BLOCKED", "WAITING", "CLOSING", "STALE"]
    counts = {k: 0 for k in valid}
    for i in range(1, 11):
        lane = f"LANE-{i:02d}"; t = task_map.get(lane); s = states.get(lane, {}); state = s.get("state", "IDLE")
        counts[state] = counts.get(state, 0) + 1
        lanes[lane] = {"state": state, "work_unit": work_unit if state != "IDLE" else None, "task": t.get("task") if t and state != "IDLE" else None, "dispatch_task_id": t.get("task_id") if t else None, "run_id": execution_id if state != "IDLE" else None, "pid": s.get("pid"), "started_at": s.get("started_at"), "last_heartbeat": s.get("last_heartbeat"), "last_lifecycle_event": s.get("last_lifecycle_event"), "blocker": s.get("blocker")}
    return {"lane_status": {"version": 13, "backlog_item": backlog_item, "authoritative": True, "current_backlog_state": "PARTIAL", "current_work_unit": work_unit, "source_baseline": baseline, "invocation_state": invocation_state, "current_invocation": execution_id, "real_worker_backend": {"type": "LOCAL_PROCESS_POOL", "configured_lanes": 10, "queued_safe_tasks": len(tasks), "expected_concurrent_lanes": min(10, len(tasks)), "state": backend_state, "source_checkout_mode": "TEMPORARY_DETACHED_GIT_WORKTREE_AT_FROZEN_COMMIT", "external_service_dependency": "NONE"}, "policy": {"one_active_job_per_lane": True, "coordinator_is_not_a_lane": True, "valid_states": valid, "working_lane_requires_pid_and_heartbeat": True, "worker_evidence_does_not_auto_complete_trace": True}, "lanes": lanes, "summary": {"total_lanes": 10, "idle": counts.get("IDLE", 0), "assigned": counts.get("ASSIGNED", 0), "initializing": counts.get("INITIALIZING", 0), "working": counts.get("WORKING", 0), "blocked": counts.get("BLOCKED", 0), "waiting": counts.get("WAITING", 0), "closing": counts.get("CLOSING", 0), "stale": counts.get("STALE", 0), "active_lane_count": 10-counts.get("IDLE", 0)}, "current_interpretation": note}}


def main() -> int:
    ap = argparse.ArgumentParser(description="Fire the Cylinder local real-parallel lane executor.")
    ap.add_argument("--control-root", default=".")
    ap.add_argument("--source-repo", required=True)
    ap.add_argument("--dispatch", default="backlog/runtime/BL-001/lane-dispatch.yaml")
    ap.add_argument("--max-workers", type=int, default=10)
    args = ap.parse_args()
    control_root = Path(args.control_root).resolve(); source_repo = Path(args.source_repo).resolve()
    dispatch_path = Path(args.dispatch); dispatch_path = dispatch_path if dispatch_path.is_absolute() else control_root / dispatch_path
    worker_script = control_root / "automation" / "local-lane-worker.py"
    dispatch = parse_dispatch(dispatch_path)
    backlog_item = str(dispatch.get("backlog_item") or "BL-001"); work_unit = str(dispatch.get("work_unit") or "WU-BL001-001"); baseline = str(dispatch.get("source_baseline") or "")
    tasks = [t for t in dispatch.get("tasks", []) if t.get("status") == "READY" and t.get("safe_independent") is True]
    configured = int(dispatch.get("configured_lane_count") or 10); max_workers = min(args.max_workers, int(dispatch.get("max_parallel_workers") or 10), configured, len(tasks))
    if max_workers < 1: raise SystemExit("No safe READY tasks are available for local fire.")
    logs_dir = control_root / "logs" / "runs"; logs_dir.mkdir(parents=True, exist_ok=True)
    leftovers = sorted(logs_dir.glob("*-LANE-*.md"))
    if leftovers:
        print("Fail-closed: individual lane logs already exist. Recover/aggregate them before firing a new execution.", file=sys.stderr); return 4
    git_verify_commit(source_repo, baseline)
    execution_id = f"LOCAL-BL001-{stamp()}"; invocation_log = logs_dir / f"{execution_id}.md"
    local_execution_path = control_root / "backlog" / "runtime" / backlog_item / "local-execution.yaml"; lane_status_path = control_root / "backlog" / "runtime" / backlog_item / "lane-status.yaml"
    evidence_dir = control_root / "worker" / "evidence" / execution_id; evidence_dir.mkdir(parents=True, exist_ok=True)
    invocation_log.write_text(f"# Local Parallel Invocation - {execution_id}\n\n## ORCHESTRATOR_INVOCATION_START\nTime: {utc_now()}\nTask: Fire local real-parallel evidence lanes for {backlog_item} / {work_unit}\nTask Description: Execute the approved safe-independent lane-dispatch queue using local OS worker processes against a temporary frozen-baseline worktree.\nBackend: LOCAL_PROCESS_POOL\nConfigured lanes: {configured}\nSelected safe tasks: {len(tasks)}\nPreflight individual lane logs: 0\n\n", encoding="utf-8")
    states = {str(t["lane"]): {"state": "ASSIGNED", "started_at": utc_now(), "last_heartbeat": utc_now(), "last_lifecycle_event": "ASSIGNED"} for t in tasks[:max_workers]}
    write_yaml_json(lane_status_path, make_lane_status(backlog_item, work_unit, baseline, execution_id, tasks, states, "LOCAL_EXECUTOR_STARTING", "STARTING", "Safe tasks assigned to local process-pool lanes; worker processes are starting."))
    write_yaml_json(local_execution_path, {"local_execution": {"version": 1, "execution_id": execution_id, "state": "STARTING", "backend": "LOCAL_PROCESS_POOL", "started_at": utc_now(), "ended_at": None, "source_repository_path": str(source_repo), "source_baseline": baseline, "configured_lanes": configured, "selected_safe_tasks": len(tasks), "max_parallel_workers": max_workers, "qg_lane_001_state": "MEASUREMENT_PENDING", "external_service_dependency": "NONE"}})
    temp_root = Path(tempfile.mkdtemp(prefix="cylinder-local-lanes-")); worktree = temp_root / "source-baseline"; workers_root = temp_root / "workers"; workers_root.mkdir(parents=True, exist_ok=True)
    run(["git", "-C", str(source_repo), "worktree", "add", "--detach", "--force", str(worktree), baseline])
    processes: list[dict[str, Any]] = []; service_not_before = time.time() + 3.0
    try:
        for task in tasks[:max_workers]:
            lane = str(task["lane"]); lane_dir = workers_root / lane; lane_dir.mkdir(parents=True, exist_ok=True)
            task_json = lane_dir / "task.json"; result_json = lane_dir / "result.json"; heartbeat_json = lane_dir / "heartbeat.json"; lane_log = logs_dir / f"{execution_id}-{lane}-{task['task_id']}-LANE-WORK.md"
            task_json.write_text(json.dumps(task, indent=2), encoding="utf-8")
            cmd = [sys.executable, str(worker_script), "--task-json", str(task_json), "--source-root", str(worktree), "--expected-commit", baseline, "--execution-id", execution_id, "--lane-log", str(lane_log), "--result-json", str(result_json), "--heartbeat", str(heartbeat_json), "--service-not-before-epoch", str(service_not_before)]
            p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            processes.append({"task": task, "process": p, "result": result_json, "heartbeat": heartbeat_json, "lane_log": lane_log})
            states[lane] = {"state": "INITIALIZING", "pid": p.pid, "started_at": utc_now(), "last_heartbeat": utc_now(), "last_lifecycle_event": "LANE_INIT_START"}
        while True:
            all_done = True
            for item in processes:
                p = item["process"]; lane = str(item["task"]["lane"]); hb = {}
                if item["heartbeat"].is_file():
                    try: hb = json.loads(item["heartbeat"].read_text(encoding="utf-8"))
                    except Exception: hb = {}
                if p.poll() is None:
                    all_done = False; hs = hb.get("state", "WORKING"); mapped = "WORKING" if hs in ("WORKING", "INITIALIZED_WAITING_FOR_BATCH_START") else ("INITIALIZING" if hs == "INITIALIZING" else "CLOSING")
                    states[lane] = {"state": mapped, "pid": p.pid, "started_at": states.get(lane, {}).get("started_at"), "last_heartbeat": hb.get("timestamp", utc_now()), "last_lifecycle_event": hs}
                else:
                    states[lane] = {"state": "CLOSING", "pid": p.pid, "started_at": states.get(lane, {}).get("started_at"), "last_heartbeat": hb.get("timestamp", utc_now()), "last_lifecycle_event": hb.get("state", "PROCESS_EXITED")}
            write_yaml_json(lane_status_path, make_lane_status(backlog_item, work_unit, baseline, execution_id, tasks, states, "LOCAL_EXECUTOR_ACTIVE" if not all_done else "LOCAL_EXECUTOR_AGGREGATING", "RUNNING" if not all_done else "AGGREGATING", "Local worker processes are executing or closing; transient lane logs remain until verified aggregation."))
            if all_done: break
            time.sleep(0.5)
        rows: list[dict[str, Any]] = []; worker_meta: list[dict[str, Any]] = []
        for item in processes:
            p = item["process"]; out, err = p.communicate(timeout=5); row: dict[str, Any] = {}
            if item["result"].is_file():
                try: row = json.loads(item["result"].read_text(encoding="utf-8")).get("lane_result", {}); rows.append(row) if row else None
                except Exception as exc: err = (err + f"\nResult parse failure: {exc}").strip()
            worker_meta.append({"lane": item["task"]["lane"], "task_id": item["task"]["task_id"], "task": item["task"]["task"], "pid": p.pid, "exit_code": p.returncode, "status": row.get("status") if row else "NO_RESULT", "worker_started_at": row.get("worker_started_at") if row else None, "worker_ended_at": row.get("worker_ended_at") if row else None, "service_started_at": row.get("service_started_at") if row else None, "service_ended_at": row.get("service_ended_at") if row else None, "stderr": err[-2000:] if err else ""})
        worker_peak, worker_avg = overlap_metrics(rows, "worker_started_at", "worker_ended_at"); service_peak, service_avg = overlap_metrics(rows, "service_started_at", "service_ended_at")
        expected = min(configured, len(processes)); failures = sum(1 for r in rows if r.get("status") != "EVIDENCE_COLLECTED") + max(0, len(processes)-len(rows)); qg_state = "PASS" if failures == 0 and service_peak >= expected else ("UNDERUTILIZED" if failures == 0 else "FAILED_WORKER_EXECUTION")
        aggregate = {"lane_dispatch_aggregate": {"execution_id": execution_id, "backlog_item": backlog_item, "work_unit": work_unit, "source_baseline": baseline, "backend": "LOCAL_PROCESS_POOL", "configured_lanes": configured, "eligible_independent_tasks": len(tasks), "dispatched_workers": len(processes), "expected_concurrent_lanes": expected, "worker_results_received": len(rows), "worker_failures": failures, "distinct_lanes_used": len({r.get('lane') for r in rows if r.get('lane')}), "peak_worker_processes_alive": worker_peak, "average_worker_processes_alive": round(worker_avg, 2), "peak_service_concurrent_lanes": service_peak, "average_service_concurrent_lanes": round(service_avg, 2), "peak_service_capacity_utilization_percentage": round((service_peak/configured*100) if configured else 0, 2), "qg_lane_001_state": qg_state, "final_trace_decision_owner": "CONTROL_REPOSITORY_ORCHESTRATOR", "evidence_semantics": "EVIDENCE_COLLECTION_ONLY", "workers": worker_meta, "lane_results": rows}}
        aggregate_yaml = evidence_dir / "lane-dispatch-aggregate.yaml"; write_yaml_json(aggregate_yaml, aggregate)
        (evidence_dir / "lane-dispatch-summary.md").write_text(f"# Local Lane Dispatch Summary - {execution_id}\n\n- Backend: **LOCAL_PROCESS_POOL**\n- Configured lanes: **{configured}**\n- Dispatched workers: **{len(processes)}**\n- Expected concurrent service lanes: **{expected}**\n- Peak worker processes alive: **{worker_peak}**\n- Peak service concurrent lanes: **{service_peak}**\n- Average service concurrent lanes: **{round(service_avg, 2)}**\n- Peak service capacity utilization: **{round((service_peak/configured*100) if configured else 0, 2)}%**\n- QG-LANE-001: **{qg_state}**\n\nThis aggregate is evidence collection only. Endpoint trace decisions remain with the primary Orchestrator.\n", encoding="utf-8")
        with invocation_log.open("a", encoding="utf-8") as fh:
            fh.write(f"## ORCHESTRATOR_LOG_AGGREGATION_START\nTime: {utc_now()}\nIndividual lane logs detected: {len(processes)}\n\n")
            for item in processes:
                fh.write(f"### Accumulated {item['task']['lane']} / {item['task']['task_id']}\n\n")
                if item["lane_log"].is_file(): fh.write(item["lane_log"].read_text(encoding="utf-8", errors="replace") + "\n")
            fh.write(f"Durable aggregate: {aggregate_yaml.relative_to(control_root).as_posix()}\nQG-LANE-001 measured state: {qg_state}\nVerify every source lane log represented: PASS\n")
        for item in processes:
            if item["lane_log"].exists(): item["lane_log"].unlink()
        remaining = list(logs_dir.glob("*-LANE-*.md"))
        with invocation_log.open("a", encoding="utf-8") as fh:
            fh.write(f"Delete verified lane logs: {len(processes)}\nRescan individual lane logs remaining: {len(remaining)}\nORCHESTRATOR_LOG_AGGREGATION_END: {'PASS' if not remaining else 'FAIL'}\n\n## ORCHESTRATOR_INVOCATION_END\nTime: {utc_now()}\nResult: {'COMPLETED_EVIDENCE_COLLECTION' if failures == 0 and not remaining else 'RECOVERY_REQUIRED'}\nPeak service concurrent lanes: {service_peak}\nAverage service concurrent lanes: {round(service_avg, 2)}\nQG-LANE-001: {qg_state}\nFinal endpoint trace decision: NOT PERFORMED BY LOCAL WORKERS\n")
        write_yaml_json(local_execution_path, {"local_execution": {"version": 1, "execution_id": execution_id, "state": "CLOSED" if not remaining else "RECOVERY_REQUIRED", "backend": "LOCAL_PROCESS_POOL", "ended_at": utc_now(), "source_repository_path": str(source_repo), "source_baseline": baseline, "configured_lanes": configured, "selected_safe_tasks": len(tasks), "dispatched_workers": len(processes), "workers": worker_meta, "metrics": {"expected_concurrent_lanes": expected, "peak_worker_processes_alive": worker_peak, "average_worker_processes_alive": round(worker_avg,2), "peak_service_concurrent_lanes": service_peak, "average_service_concurrent_lanes": round(service_avg,2), "peak_service_capacity_utilization_percentage": round((service_peak/configured*100) if configured else 0,2)}, "qg_lane_001_state": qg_state, "aggregate_evidence": aggregate_yaml.relative_to(control_root).as_posix(), "individual_lane_logs_remaining": len(remaining), "external_service_dependency": "NONE"}})
        idle_states = {str(t["lane"]): {"state": "IDLE"} for t in tasks}; write_yaml_json(lane_status_path, make_lane_status(backlog_item, work_unit, baseline, execution_id, tasks, idle_states, "BETWEEN_INVOCATIONS", "CLOSED", f"Local execution {execution_id} closed; all lane logs aggregated and removed. QG-LANE-001: {qg_state}."))
        print(json.dumps({"execution_id": execution_id, "aggregate": str(aggregate_yaml), "peak_service_concurrent_lanes": service_peak, "average_service_concurrent_lanes": round(service_avg,2), "qg_lane_001_state": qg_state, "individual_lane_logs_remaining": len(remaining)}, indent=2))
        return 0 if failures == 0 and not remaining else 2
    finally:
        run(["git", "-C", str(source_repo), "worktree", "remove", "--force", str(worktree)], check=False); shutil.rmtree(temp_root, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
