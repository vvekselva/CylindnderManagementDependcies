#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def parse_time(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def overlap_metrics(rows: list[dict[str, Any]], start_key: str, end_key: str) -> tuple[int, float]:
    intervals: list[tuple[datetime, datetime]] = []
    events: list[tuple[datetime, int]] = []
    for row in rows:
        if row.get(start_key) and row.get(end_key):
            start = parse_time(row[start_key])
            end = parse_time(row[end_key])
            intervals.append((start, end))
            events.extend([(start, 1), (end, -1)])
    events.sort(key=lambda x: (x[0], -x[1]))
    active = peak = 0
    for _, delta in events:
        active += delta
        peak = max(peak, active)
    if not intervals:
        return 0, 0.0
    wall = max((max(end for _, end in intervals) - min(start for start, _ in intervals)).total_seconds(), 0.001)
    aggregate = sum((end - start).total_seconds() for start, end in intervals)
    return peak, aggregate / wall


def main() -> int:
    parser = argparse.ArgumentParser(description="Execute a manifest-verified Orchestrator-staged Cylinder source snapshot.")
    parser.add_argument("--source-root", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--tasks", required=True, help="JSON array of approved safe-independent dispatch tasks")
    parser.add_argument("--worker", default="automation/staged-lane-worker.py")
    parser.add_argument("--out", required=True)
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--configured-lanes", type=int, default=10)
    args = parser.parse_args()

    source_root = Path(args.source_root).resolve()
    manifest_path = Path(args.manifest).resolve()
    worker_path = Path(args.worker).resolve()
    tasks = json.loads(Path(args.tasks).read_text(encoding="utf-8"))
    out = Path(args.out).resolve()
    if out.exists():
        shutil.rmtree(out)
    (out / "workers").mkdir(parents=True)
    (out / "logs").mkdir()

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))["source_snapshot"]
    if manifest.get("provider") != "ORCHESTRATOR_STAGED_SNAPSHOT":
        raise SystemExit("Source manifest provider must be ORCHESTRATOR_STAGED_SNAPSHOT")
    if manifest.get("repository") != "vvekselva/CylinderManagement":
        raise SystemExit("Source manifest repository mismatch")
    if manifest.get("baseline") != args.baseline:
        raise SystemExit("Source manifest baseline mismatch")
    if not tasks:
        raise SystemExit("No tasks supplied")
    if len(tasks) > args.configured_lanes:
        raise SystemExit("Dispatch exceeds configured lane count")
    if int(manifest.get("task_roots_verified", 0)) < len(tasks):
        raise SystemExit("Manifest does not verify every dispatched controller root")
    for task in tasks:
        if task.get("safe_independent") is not True:
            raise SystemExit(f"Unsafe task in staged dispatch: {task.get('task_id')}")
        if not (source_root / task["controller_path"]).is_file():
            raise SystemExit(f"Missing staged controller root: {task['controller_path']}")

    execution_id = "PROD-STAGED-BL001-" + datetime.now().strftime("%Y%m%d-%H%M%S")
    started_at = utc_now()
    service_barrier = time.time() + 3.0
    processes: list[dict[str, Any]] = []

    for task in tasks:
        lane_dir = out / "workers" / task["lane"]
        lane_dir.mkdir()
        task_json = lane_dir / "task.json"
        result_json = lane_dir / "result.json"
        lane_log = out / "logs" / f"{execution_id}-{task['lane']}-{task['task_id']}-LANE-WORK.md"
        task_json.write_text(json.dumps(task, indent=2), encoding="utf-8")
        command = [
            sys.executable, str(worker_path),
            "--task-json", str(task_json),
            "--source-root", str(source_root),
            "--snapshot-manifest", str(manifest_path),
            "--expected-commit", args.baseline,
            "--execution-id", execution_id,
            "--lane-log", str(lane_log),
            "--result-json", str(result_json),
            "--service-not-before-epoch", str(service_barrier),
        ]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        processes.append({"task": task, "process": process, "result": result_json, "lane_log": lane_log})

    worker_meta: list[dict[str, Any]] = []
    for item in processes:
        stdout, stderr = item["process"].communicate(timeout=180)
        result: dict[str, Any] = {}
        if item["result"].is_file():
            result = json.loads(item["result"].read_text(encoding="utf-8")).get("lane_result", {})
        worker_meta.append({
            "task": item["task"],
            "exit_code": item["process"].returncode,
            "result": result,
            "stdout": stdout,
            "stderr": stderr,
            "lane_log": item["lane_log"],
        })

    rows = [item["result"] for item in worker_meta if item["result"]]
    service_peak, service_average = overlap_metrics(rows, "service_started_at", "service_ended_at")
    missing = sorted({name for row in rows for name in row.get("missing_component_references", [])})
    failures = [
        item for item in worker_meta
        if item["exit_code"] != 0 or item["result"].get("status") != "EVIDENCE_COLLECTED"
    ]

    aggregate_log = out / f"{execution_id}.md"
    lines = [
        f"# Production Staged Snapshot Fire - {execution_id}", "",
        f"Start: {started_at}",
        f"End: {utc_now()}",
        "Source provider: ORCHESTRATOR_STAGED_SNAPSHOT",
        f"Frozen baseline: {args.baseline}",
        f"Workers: {len(tasks)}",
        f"Peak SERVICE concurrency: {service_peak}/{args.configured_lanes}",
        f"Average SERVICE concurrency: {service_average:.2f}",
        f"Worker failures: {len(failures)}",
        f"Missing staged component references: {len(missing)}", "",
        "## Lane lifecycle aggregation",
    ]
    for item in processes:
        task = item["task"]
        lines.extend(["", f"### {task['lane']} / {task['task_id']} - {task['task']}", ""])
        if item["lane_log"].exists():
            lines.extend(item["lane_log"].read_text(encoding="utf-8").splitlines())
            item["lane_log"].unlink()
    aggregate_log.write_text("\n".join(lines) + "\n", encoding="utf-8")

    remaining_logs = len(list((out / "logs").glob("*-LANE-WORK.md")))
    expected = min(args.configured_lanes, len(tasks))
    if failures:
        qg_lane = "FAILED_WORKER_EXECUTION"
    elif service_peak >= expected:
        qg_lane = "PASS"
    else:
        qg_lane = "UNDERUTILIZED"

    source_state = "PASS_SOURCE_CLOSURE_COMPLETE" if not missing else "PASS_ROOTS_VERIFIED_SOURCE_CLOSURE_PARTIAL"
    summary = {
        "production_staged_fire": {
            "execution_id": execution_id,
            "state": "CLOSED" if not failures else "CLOSED_WITH_FAILURES",
            "source_provider": "ORCHESTRATOR_STAGED_SNAPSHOT",
            "repository": "vvekselva/CylinderManagement",
            "source_baseline": args.baseline,
            "manifest": str(manifest_path),
            "controller_roots_verified": int(manifest.get("task_roots_verified", 0)),
            "materialized_file_count": int(manifest.get("materialized_file_count", 0)),
            "workers_started": len(tasks),
            "worker_results_received": len(rows),
            "worker_failures": len(failures),
            "peak_service_concurrent_lanes": service_peak,
            "average_service_concurrent_lanes": round(service_average, 2),
            "peak_capacity_utilization_percentage": round((service_peak / args.configured_lanes * 100) if args.configured_lanes else 0, 2),
            "all_controller_blobs_verified": all(row.get("controller_blob_verified") for row in rows),
            "missing_component_references": missing,
            "source_closure_complete": not missing,
            "qg_source_001_state": source_state,
            "trace_evidence_auto_accepted": False,
            "individual_lane_logs_remaining": remaining_logs,
            "qg_lane_001_state": qg_lane,
            "aggregate_log": str(aggregate_log),
            "workers": [
                {
                    "lane": row.get("lane"),
                    "task_id": row.get("task_id"),
                    "status": row.get("status"),
                    "components_examined": len(row.get("components_examined", [])),
                    "missing_component_references": row.get("missing_component_references", []),
                    "physical_dependency_candidates": row.get("physical_dependency_candidates", []),
                }
                for row in rows
            ],
        }
    }
    (out / "production-fire-summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0 if not failures else 2


if __name__ == "__main__":
    raise SystemExit(main())
