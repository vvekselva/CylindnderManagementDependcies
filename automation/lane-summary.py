#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml


def dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--results-root", required=True)
    ap.add_argument("--output-dir", required=True)
    ap.add_argument("--configured-lanes", type=int, default=10)
    ap.add_argument("--eligible-tasks", type=int, required=True)
    args = ap.parse_args()

    root = Path(args.results_root)
    rows: list[dict[str, Any]] = []
    for fp in root.rglob("lane-result.yaml"):
        doc = yaml.safe_load(fp.read_text(encoding="utf-8")) or {}
        row = doc.get("lane_result", {})
        if row:
            rows.append(row)

    intervals: list[tuple[datetime, datetime]] = []
    events: list[tuple[datetime, int]] = []
    for row in rows:
        if row.get("started_at") and row.get("ended_at"):
            s, e = dt(row["started_at"]), dt(row["ended_at"])
            intervals.append((s, e))
            events.extend([(s, 1), (e, -1)])
    events.sort(key=lambda x: (x[0], -x[1]))

    active = 0
    peak = 0
    for _, delta in events:
        active += delta
        peak = max(peak, active)

    if intervals:
        wall_start = min(s for s, _ in intervals)
        wall_end = max(e for _, e in intervals)
        wall_seconds = max((wall_end - wall_start).total_seconds(), 0.001)
        worker_seconds = sum((e - s).total_seconds() for s, e in intervals)
        average = worker_seconds / wall_seconds
    else:
        wall_seconds = 0.0
        worker_seconds = 0.0
        average = 0.0

    distinct_lanes = len({r.get("lane") for r in rows if r.get("lane")})
    expected = min(args.configured_lanes, args.eligible_tasks)
    failed = sum(1 for r in rows if r.get("status") != "EVIDENCE_COLLECTED")
    qg_state = "PASS" if expected == 0 or peak >= expected else "UNDERUTILIZED"

    summary = {
        "lane_dispatch_summary": {
            "configured_lanes": args.configured_lanes,
            "eligible_independent_tasks": args.eligible_tasks,
            "expected_concurrent_lanes": expected,
            "worker_results_received": len(rows),
            "distinct_lanes_used": distinct_lanes,
            "peak_concurrent_lanes": peak,
            "average_concurrent_lanes": round(average, 2),
            "distinct_lane_participation_percentage": round((distinct_lanes / args.configured_lanes * 100) if args.configured_lanes else 0, 2),
            "peak_capacity_utilization_percentage": round((peak / args.configured_lanes * 100) if args.configured_lanes else 0, 2),
            "wall_clock_seconds": round(wall_seconds, 3),
            "aggregate_worker_seconds": round(worker_seconds, 3),
            "worker_failures": failed,
            "qg_lane_001_state": qg_state,
            "qg_lane_001_reason": (
                "Peak concurrency reached expected safe concurrency."
                if qg_state == "PASS"
                else f"Peak concurrency {peak} was below expected safe concurrency {expected}; investigate runner/platform or dispatch under-utilization."
            ),
            "workers": [
                {
                    "lane": r.get("lane"),
                    "task_id": r.get("task_id"),
                    "task": r.get("task"),
                    "status": r.get("status"),
                    "started_at": r.get("started_at"),
                    "ended_at": r.get("ended_at"),
                }
                for r in sorted(rows, key=lambda x: str(x.get("lane")))
            ],
        }
    }

    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "lane-dispatch-summary.yaml").write_text(yaml.safe_dump(summary, sort_keys=False), encoding="utf-8")
    s = summary["lane_dispatch_summary"]
    lines = [
        "# Lane Dispatch Concurrency Summary",
        "",
        f"- Configured lanes: **{s['configured_lanes']}**",
        f"- Eligible independent tasks: **{s['eligible_independent_tasks']}**",
        f"- Expected concurrent lanes: **{s['expected_concurrent_lanes']}**",
        f"- Distinct lanes used: **{s['distinct_lanes_used']}**",
        f"- Peak concurrent lanes: **{s['peak_concurrent_lanes']}**",
        f"- Average concurrent lanes: **{s['average_concurrent_lanes']}**",
        f"- Peak capacity utilization: **{s['peak_capacity_utilization_percentage']}%**",
        f"- QG-LANE-001: **{s['qg_lane_001_state']}**",
        "",
        s["qg_lane_001_reason"],
        "",
        "## Workers",
    ]
    for row in s["workers"]:
        lines.append(f"- {row['lane']} / {row['task_id']}: {row['status']} - {row['task']}")
    (out / "lane-dispatch-summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
