#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

COMPONENT_SUFFIXES = ("Service", "Dao", "DAO", "Repository", "JpaDao", "Controller")
SQL_OBJECT_RE = re.compile(r"(?:(?:public)\.)?(tbl_[A-Za-z0-9_]+|vw_[A-Za-z0-9_]+)")
TABLE_RE = re.compile(r"@Table\s*\((?P<body>[^)]*)\)", re.S)
NAME_RE = re.compile(r"name\s*=\s*\"([^\"]+)\"")
SCHEMA_RE = re.compile(r"schema\s*=\s*\"([^\"]+)\"")
FIELD_RE = re.compile(r"\b(?:private|protected|public)\s+(?:final\s+)?([A-Z][A-Za-z0-9_]*)\s+[A-Za-z_][A-Za-z0-9_]*\s*;")
MAPPING_RE = re.compile(r"@(RequestMapping|GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)\s*(\([^\n]*\))?")


def now() -> str:
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


def lifecycle_append(events: list[dict[str, Any]], event: str, task: dict[str, Any], lane: str, result: str | None = None) -> None:
    row: dict[str, Any] = {
        "event": event,
        "timestamp": now(),
        "lane": lane,
        "task": task.get("task"),
        "task_description": task.get("task_description"),
    }
    if result is not None:
        row["result"] = result
    events.append(row)


def write_lifecycle(path: Path, events: list[dict[str, Any]], backlog: str, work_unit: str, task_id: str) -> None:
    lines = [f"# Matrix Lane Lifecycle - {task_id}", "", f"Backlog: {backlog}", f"Work Unit: {work_unit}", ""]
    for e in events:
        lines += [f"## {e['event']}", f"Time: {e['timestamp']}", f"Lane: {e['lane']}", f"Task: {e['task']}", f"Task Description: {e['task_description']}"]
        if e.get("result") is not None:
            lines.append(f"Result: {e['result']}")
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dispatch", required=True)
    ap.add_argument("--lane", required=True)
    ap.add_argument("--task-id", required=True)
    ap.add_argument("--source-root", required=True)
    ap.add_argument("--output-dir", required=True)
    args = ap.parse_args()

    dispatch_doc = yaml.safe_load(Path(args.dispatch).read_text(encoding="utf-8")) or {}
    dispatch = dispatch_doc.get("lane_dispatch", {})
    tasks = dispatch.get("tasks", [])
    task = next((t for t in tasks if t.get("task_id") == args.task_id and t.get("lane") == args.lane), None)
    if not task:
        raise SystemExit(f"No matching task {args.task_id} for {args.lane}")

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    lifecycle: list[dict[str, Any]] = []
    lifecycle_append(lifecycle, "LANE_INIT_START", task, args.lane)

    source_root = Path(args.source_root).resolve()
    expected_commit = str(dispatch.get("source_baseline"))
    actual_commit = git_head(source_root)
    controller_rel = task.get("controller_path")
    controller = source_root / controller_rel
    init_ok = actual_commit == expected_commit and controller.is_file() and task.get("safe_independent") is True
    lifecycle_append(lifecycle, "LANE_INIT_END", task, args.lane, "INITIALIZED" if init_ok else "BLOCKED_BEFORE_SERVICE")

    started = lifecycle[0]["timestamp"]
    result: dict[str, Any] = {
        "lane_result": {
            "lane": args.lane,
            "task_id": args.task_id,
            "task": task.get("task"),
            "task_description": task.get("task_description"),
            "backlog_item": dispatch.get("backlog_item"),
            "work_unit": dispatch.get("work_unit"),
            "started_at": started,
            "ended_at": None,
            "source_baseline_expected": expected_commit,
            "source_baseline_actual": actual_commit,
            "source_baseline_verified": actual_commit == expected_commit,
            "controller_path": controller_rel,
            "status": "FAILED",
            "endpoint_mapping_evidence": [],
            "components_examined": [],
            "physical_dependency_candidates": [],
            "evidence_lines": [],
            "notes": [],
            "lifecycle_events": lifecycle,
        }
    }
    lr = result["lane_result"]

    if not init_ok:
        if actual_commit != expected_commit:
            lr["notes"].append("Frozen source baseline mismatch; service not started.")
        elif not controller.is_file():
            lr["notes"].append("Controller path missing at frozen baseline; service not started.")
        else:
            lr["notes"].append("Task is not marked safe_independent; service not started.")
        lifecycle_append(lifecycle, "LANE_CLOSE_END", task, args.lane, "BLOCKED")
    else:
        lifecycle_append(lifecycle, "LANE_SERVICE_START", task, args.lane)
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
            ev_lines.extend(evidence_lines(rel, text, [MAPPING_RE, SQL_OBJECT_RE, TABLE_RE, re.compile(r"jdbc:sqlite:"), re.compile(r"\b(private|protected)\b.*(Service|Dao|Repository)")]))
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
        lifecycle_append(lifecycle, "LANE_SERVICE_END", task, args.lane, "COMPLETED")
        lifecycle_append(lifecycle, "LANE_CLOSE_END", task, args.lane, "EVIDENCE_COLLECTED_CLOSED")

    lr["ended_at"] = lifecycle[-1]["timestamp"]
    lr["lifecycle_events"] = lifecycle
    (output_dir / "lane-result.yaml").write_text(yaml.safe_dump(result, sort_keys=False, allow_unicode=True), encoding="utf-8")
    write_lifecycle(output_dir / "lane-lifecycle.md", lifecycle, str(dispatch.get("backlog_item")), str(dispatch.get("work_unit")), args.task_id)

    md = [
        f"# Lane Evidence - {args.lane} / {args.task_id}", "",
        f"Task: {lr['task']}", f"Status: {lr['status']}", f"Source baseline verified: {lr['source_baseline_verified']}",
        f"Started: {lr['started_at']}", f"Ended: {lr['ended_at']}", "",
        "## Endpoint mapping evidence", *[f"- `{x}`" for x in lr["endpoint_mapping_evidence"]], "",
        "## Components examined", *[f"- `{x}`" for x in lr["components_examined"]], "",
        "## Physical dependency candidates", *[f"- {x['type']}: `{x['object']}` from `{x['source']}`" for x in lr["physical_dependency_candidates"]], "",
        "## Evidence lines", *[f"- `{x}`" for x in lr["evidence_lines"]], "",
        "## Acceptance rule", "This artifact is evidence collection, not a final traceability decision. The Orchestrator validates each endpoint path before accepting COMPLETE.",
    ]
    (output_dir / "lane-evidence.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    return 0 if lr["status"] == "EVIDENCE_COLLECTED" else 2


if __name__ == "__main__":
    raise SystemExit(main())
