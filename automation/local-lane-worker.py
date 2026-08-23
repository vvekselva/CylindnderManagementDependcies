#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

COMPONENT_SUFFIXES = ("Service", "Dao", "DAO", "Repository", "JpaDao", "Controller")
SQL_OBJECT_RE = re.compile(r"(?:(?:public)\.)?(tbl_[A-Za-z0-9_]+|vw_[A-Za-z0-9_]+)")
TABLE_RE = re.compile(r"@Table\s*\((?P<body>[^)]*)\)", re.S)
NAME_RE = re.compile(r"name\s*=\s*\"([^\"]+)\"")
SCHEMA_RE = re.compile(r"schema\s*=\s*\"([^\"]+)\"")
FIELD_RE = re.compile(r"\b(?:private|protected|public)\s+(?:final\s+)?([A-Z][A-Za-z0-9_]*)\s+[A-Za-z_][A-Za-z0-9_]*\s*;")
MAPPING_RE = re.compile(r"@(RequestMapping|GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)\s*(\([^\n]*\))?")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def git_head(root: Path) -> str:
    return subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True).strip()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def find_java(root: Path, type_name: str) -> Path | None:
    matches = list(root.rglob(f"{type_name}.java"))
    return matches[0] if matches else None


def evidence_lines(path: Path, text: str, patterns: list[re.Pattern[str]]) -> list[str]:
    out: list[str] = []
    for no, line in enumerate(text.splitlines(), 1):
        if any(p.search(line) for p in patterns):
            out.append(f"{path.as_posix()}:{no}: {line.strip()}")
    return out[:250]


def physical_dependencies(path: Path, text: str) -> list[dict[str, str]]:
    found: dict[tuple[str, str], dict[str, str]] = {}
    for match in TABLE_RE.finditer(text):
        body = match.group("body")
        name = NAME_RE.search(body)
        schema = SCHEMA_RE.search(body)
        if name:
            obj = f"{schema.group(1) if schema else 'public'}.{name.group(1)}"
            found[("JPA_TABLE", obj)] = {"type": "JPA_TABLE", "object": obj, "source": path.as_posix()}
    for match in SQL_OBJECT_RE.finditer(text):
        raw = match.group(0)
        obj = raw if "." in raw else f"public.{match.group(1)}"
        found[("SQL_OBJECT", obj)] = {"type": "SQL_OBJECT", "object": obj, "source": path.as_posix()}
    low = text.lower()
    if "jdbc:sqlite:" in low:
        found[("SQLITE", "jdbc:sqlite")] = {"type": "SQLITE", "object": "jdbc:sqlite", "source": path.as_posix()}
        for table in ("tiles", "metadata"):
            if re.search(rf"\b(from|into|update|join)\s+{table}\b", low):
                found[("SQLITE_TABLE", table)] = {"type": "SQLITE_TABLE", "object": table, "source": path.as_posix()}
    if any(token in text for token in ("Paths.get(", "new File(", ".getResource(", "ClassPathResource")):
        found[("FILE_OR_CLASSPATH", path.as_posix())] = {"type": "FILE_OR_CLASSPATH", "object": "explicit file/classpath access", "source": path.as_posix()}
    return sorted(found.values(), key=lambda x: (x["type"], x["object"]))


def append_event(log_path: Path, event: str, task: dict[str, Any], execution_id: str, result: str | None = None) -> str:
    ts = utc_now()
    lines = [
        f"## {event}",
        f"Time: {ts}",
        f"Execution: {execution_id}",
        f"Lane: {task['lane']}",
        f"Task ID: {task['task_id']}",
        f"Task: {task['task']}",
        f"Task Description: {task['task_description']}",
    ]
    if result is not None:
        lines.append(f"Result: {result}")
    lines.append("")
    with log_path.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    return ts


def heartbeat(path: Path, state: str, task: dict[str, Any], execution_id: str, pid: int) -> None:
    payload = {
        "execution_id": execution_id,
        "lane": task["lane"],
        "task_id": task["task_id"],
        "task": task["task"],
        "state": state,
        "pid": pid,
        "timestamp": utc_now(),
    }
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--task-json", required=True)
    ap.add_argument("--source-root", required=True)
    ap.add_argument("--expected-commit", required=True)
    ap.add_argument("--execution-id", required=True)
    ap.add_argument("--lane-log", required=True)
    ap.add_argument("--result-json", required=True)
    ap.add_argument("--heartbeat", required=True)
    ap.add_argument("--service-not-before-epoch", type=float, default=0.0)
    args = ap.parse_args()

    task = json.loads(Path(args.task_json).read_text(encoding="utf-8"))
    source_root = Path(args.source_root).resolve()
    lane_log = Path(args.lane_log)
    result_path = Path(args.result_json)
    heartbeat_path = Path(args.heartbeat)
    lane_log.parent.mkdir(parents=True, exist_ok=True)
    result_path.parent.mkdir(parents=True, exist_ok=True)
    heartbeat_path.parent.mkdir(parents=True, exist_ok=True)

    pid = os.getpid()
    lane_log.write_text(f"# Local Lane Lifecycle - {task['lane']} / {task['task_id']}\n\n", encoding="utf-8")
    worker_started_at = append_event(lane_log, "LANE_INIT_START", task, args.execution_id)
    heartbeat(heartbeat_path, "INITIALIZING", task, args.execution_id, pid)

    actual_commit = git_head(source_root)
    controller = source_root / task["controller_path"]
    init_ok = actual_commit == args.expected_commit and controller.is_file() and task.get("safe_independent") is True
    append_event(lane_log, "LANE_INIT_END", task, args.execution_id, "INITIALIZED" if init_ok else "BLOCKED_BEFORE_SERVICE")

    result: dict[str, Any] = {
        "lane_result": {
            "execution_id": args.execution_id,
            "lane": task["lane"],
            "task_id": task["task_id"],
            "task": task["task"],
            "task_description": task["task_description"],
            "pid": pid,
            "worker_started_at": worker_started_at,
            "worker_ended_at": None,
            "service_started_at": None,
            "service_ended_at": None,
            "source_baseline_expected": args.expected_commit,
            "source_baseline_actual": actual_commit,
            "source_baseline_verified": actual_commit == args.expected_commit,
            "controller_path": task["controller_path"],
            "status": "FAILED",
            "endpoint_mapping_evidence": [],
            "components_examined": [],
            "physical_dependency_candidates": [],
            "evidence_lines": [],
            "notes": [],
        }
    }
    lr = result["lane_result"]

    if not init_ok:
        if actual_commit != args.expected_commit:
            lr["notes"].append("Frozen source baseline mismatch; service not started.")
        elif not controller.is_file():
            lr["notes"].append("Controller path missing at frozen baseline; service not started.")
        else:
            lr["notes"].append("Task is not marked safe_independent; service not started.")
        heartbeat(heartbeat_path, "CLOSING", task, args.execution_id, pid)
        append_event(lane_log, "LANE_CLOSE_END", task, args.execution_id, "BLOCKED")
    else:
        if args.service_not_before_epoch > 0:
            remaining = args.service_not_before_epoch - time.time()
            if remaining > 0:
                heartbeat(heartbeat_path, "INITIALIZED_WAITING_FOR_BATCH_START", task, args.execution_id, pid)
                time.sleep(remaining)

        service_started = append_event(lane_log, "LANE_SERVICE_START", task, args.execution_id)
        lr["service_started_at"] = service_started
        heartbeat(heartbeat_path, "WORKING", task, args.execution_id, pid)

        queue: list[Path] = [controller]
        seen: set[Path] = set()
        physical: list[dict[str, str]] = []
        mappings: list[str] = []
        ev_lines: list[str] = []
        max_components = int(task.get("max_components", 40))

        while queue and len(seen) < max_components:
            path = queue.pop(0)
            if path in seen or not path.is_file():
                continue
            seen.add(path)
            text = read_text(path)
            rel = path.relative_to(source_root)
            if path == controller:
                mappings.extend(m.group(0) for m in MAPPING_RE.finditer(text))
            physical.extend(physical_dependencies(rel, text))
            ev_lines.extend(evidence_lines(rel, text, [
                MAPPING_RE,
                SQL_OBJECT_RE,
                TABLE_RE,
                re.compile(r"jdbc:sqlite:"),
                re.compile(r"\b(private|protected)\b.*(Service|Dao|Repository)"),
            ]))
            for type_name in FIELD_RE.findall(text):
                if type_name.endswith(COMPONENT_SUFFIXES):
                    candidate = find_java(source_root, type_name)
                    if candidate and candidate not in seen and candidate not in queue:
                        queue.append(candidate)

        dedup_phys = {(x["type"], x["object"], x["source"]): x for x in physical}
        lr["endpoint_mapping_evidence"] = sorted(set(mappings))
        lr["components_examined"] = sorted(p.relative_to(source_root).as_posix() for p in seen)
        lr["physical_dependency_candidates"] = list(dedup_phys.values())
        lr["evidence_lines"] = ev_lines[:500]
        lr["status"] = "EVIDENCE_COLLECTED"
        lr["notes"].append("Evidence collection only; Orchestrator validates final endpoint trace state.")

        service_ended = append_event(lane_log, "LANE_SERVICE_END", task, args.execution_id, "COMPLETED")
        lr["service_ended_at"] = service_ended
        heartbeat(heartbeat_path, "CLOSING", task, args.execution_id, pid)
        append_event(lane_log, "LANE_CLOSE_END", task, args.execution_id, "EVIDENCE_COLLECTED_CLOSED")

    lr["worker_ended_at"] = utc_now()
    result_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    heartbeat(heartbeat_path, "CLOSED", task, args.execution_id, pid)
    return 0 if lr["status"] == "EVIDENCE_COLLECTED" else 2


if __name__ == "__main__":
    raise SystemExit(main())
