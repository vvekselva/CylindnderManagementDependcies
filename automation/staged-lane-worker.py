#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

COMPONENT_SUFFIXES = ("Service", "Dao", "DAO", "Repository", "JpaDao", "Controller")
SQL_OBJECT_RE = re.compile(r"(?:(?:public)\.)?(tbl_[A-Za-z0-9_]+|vw_[A-Za-z0-9_]+)")
TABLE_RE = re.compile(r"@Table\s*\((?P<body>[^)]*)\)", re.S)
NAME_RE = re.compile(r'name\s*=\s*"([^"]+)"')
SCHEMA_RE = re.compile(r'schema\s*=\s*"([^"]+)"')
FIELD_RE = re.compile(r"\b(?:private|protected|public)\s+(?:final\s+)?([A-Z][A-Za-z0-9_]*)\s+[A-Za-z_][A-Za-z0-9_]*\s*;")
MAPPING_RE = re.compile(r"@(RequestMapping|GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)\s*(\([^\n]*\))?")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def git_blob_sha(path: Path) -> str:
    data = path.read_bytes()
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


def load_manifest(path: Path) -> dict[str, Any]:
    doc = json.loads(path.read_text(encoding="utf-8"))
    return doc["source_snapshot"]


def manifest_index(manifest: dict[str, Any]) -> dict[str, str]:
    return {row["path"]: row["git_blob_sha"] for row in manifest.get("files", [])}


def verify_file(root: Path, rel: Path, index: dict[str, str]) -> tuple[bool, str]:
    key = rel.as_posix()
    path = root / rel
    if not path.is_file():
        return False, "MISSING"
    expected = index.get(key)
    if not expected:
        return False, "NOT_IN_MANIFEST"
    actual = git_blob_sha(path)
    if actual != expected:
        return False, f"BLOB_MISMATCH expected={expected} actual={actual}"
    return True, actual


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def find_java(root: Path, type_name: str) -> Path | None:
    matches = list(root.rglob(f"{type_name}.java"))
    return matches[0] if matches else None


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
    if any(token in text for token in ("Paths.get(", "new File(", ".getResource(", "ClassPathResource")):
        found[("FILE_OR_CLASSPATH", path.as_posix())] = {
            "type": "FILE_OR_CLASSPATH", "object": "explicit file/classpath access", "source": path.as_posix()
        }
    return sorted(found.values(), key=lambda x: (x["type"], x["object"]))


def evidence_lines(path: Path, text: str) -> list[str]:
    patterns = [
        MAPPING_RE,
        SQL_OBJECT_RE,
        TABLE_RE,
        re.compile(r"jdbc:sqlite:"),
        re.compile(r"\b(private|protected)\b.*(Service|Dao|Repository)"),
    ]
    out: list[str] = []
    for no, line in enumerate(text.splitlines(), 1):
        if any(pattern.search(line) for pattern in patterns):
            out.append(f"{path.as_posix()}:{no}: {line.strip()}")
    return out[:250]


def append_event(log: Path, event: str, task: dict[str, Any], execution_id: str, result: str | None = None) -> str:
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
    with log.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")
    return ts


def main() -> int:
    parser = argparse.ArgumentParser(description="Read-only lane worker for an Orchestrator-staged source snapshot.")
    parser.add_argument("--task-json", required=True)
    parser.add_argument("--source-root", required=True)
    parser.add_argument("--snapshot-manifest", required=True)
    parser.add_argument("--expected-commit", required=True)
    parser.add_argument("--execution-id", required=True)
    parser.add_argument("--lane-log", required=True)
    parser.add_argument("--result-json", required=True)
    parser.add_argument("--service-not-before-epoch", type=float, default=0.0)
    args = parser.parse_args()

    task = json.loads(Path(args.task_json).read_text(encoding="utf-8"))
    source_root = Path(args.source_root).resolve()
    manifest = load_manifest(Path(args.snapshot_manifest))
    index = manifest_index(manifest)
    lane_log = Path(args.lane_log)
    result_path = Path(args.result_json)
    lane_log.parent.mkdir(parents=True, exist_ok=True)
    result_path.parent.mkdir(parents=True, exist_ok=True)

    lane_log.write_text(f"# Staged Snapshot Lane Lifecycle - {task['lane']} / {task['task_id']}\n\n", encoding="utf-8")
    worker_started = append_event(lane_log, "LANE_INIT_START", task, args.execution_id)

    baseline_ok = (
        manifest.get("provider") == "ORCHESTRATOR_STAGED_SNAPSHOT"
        and manifest.get("repository") == "vvekselva/CylinderManagement"
        and manifest.get("baseline") == args.expected_commit
    )
    controller_rel = Path(task["controller_path"])
    controller_ok, controller_reason = verify_file(source_root, controller_rel, index)
    init_ok = baseline_ok and controller_ok and task.get("safe_independent") is True
    append_event(lane_log, "LANE_INIT_END", task, args.execution_id,
                 "INITIALIZED" if init_ok else "BLOCKED_BEFORE_SERVICE")

    lane_result: dict[str, Any] = {
        "execution_id": args.execution_id,
        "lane": task["lane"],
        "task_id": task["task_id"],
        "task": task["task"],
        "task_description": task["task_description"],
        "pid": os.getpid(),
        "worker_started_at": worker_started,
        "worker_ended_at": None,
        "service_started_at": None,
        "service_ended_at": None,
        "source_provider": manifest.get("provider"),
        "source_baseline_expected": args.expected_commit,
        "source_baseline_actual": manifest.get("baseline"),
        "source_baseline_verified": baseline_ok,
        "controller_path": task["controller_path"],
        "controller_blob_verified": controller_ok,
        "controller_blob_verification": controller_reason,
        "status": "FAILED",
        "endpoint_mapping_evidence": [],
        "components_examined": [],
        "physical_dependency_candidates": [],
        "evidence_lines": [],
        "missing_component_references": [],
        "manifest_verified_components": [],
        "notes": [],
    }

    if not init_ok:
        lane_result["notes"].append(
            f"Source snapshot init failed: baseline_ok={baseline_ok}, controller={controller_reason}"
        )
        append_event(lane_log, "LANE_CLOSE_END", task, args.execution_id, "BLOCKED")
    else:
        if args.service_not_before_epoch > 0:
            remaining = args.service_not_before_epoch - time.time()
            if remaining > 0:
                time.sleep(remaining)

        lane_result["service_started_at"] = append_event(lane_log, "LANE_SERVICE_START", task, args.execution_id)
        queue: list[Path] = [source_root / controller_rel]
        seen: set[Path] = set()
        physical: list[dict[str, str]] = []
        mappings: list[str] = []
        ev_lines: list[str] = []
        missing: set[str] = set()
        verified: list[dict[str, str]] = []
        max_components = int(task.get("max_components", 40))

        while queue and len(seen) < max_components:
            path = queue.pop(0)
            if path in seen or not path.is_file():
                continue
            rel = path.relative_to(source_root)
            ok, reason = verify_file(source_root, rel, index)
            if not ok:
                lane_result["notes"].append(f"Manifest verification failed for {rel.as_posix()}: {reason}")
                continue
            verified.append({"path": rel.as_posix(), "git_blob_sha": reason})
            seen.add(path)
            text = read_text(path)
            if path == source_root / controller_rel:
                mappings.extend(match.group(0) for match in MAPPING_RE.finditer(text))
            physical.extend(physical_dependencies(rel, text))
            ev_lines.extend(evidence_lines(rel, text))
            for type_name in FIELD_RE.findall(text):
                if type_name.endswith(COMPONENT_SUFFIXES):
                    candidate = find_java(source_root, type_name)
                    if candidate and candidate not in seen and candidate not in queue:
                        queue.append(candidate)
                    elif not candidate:
                        missing.add(type_name)

        dedup = {(row["type"], row["object"], row["source"]): row for row in physical}
        lane_result["endpoint_mapping_evidence"] = sorted(set(mappings))
        lane_result["components_examined"] = sorted(path.relative_to(source_root).as_posix() for path in seen)
        lane_result["physical_dependency_candidates"] = list(dedup.values())
        lane_result["evidence_lines"] = ev_lines[:500]
        lane_result["missing_component_references"] = sorted(missing)
        lane_result["manifest_verified_components"] = verified
        lane_result["status"] = "EVIDENCE_COLLECTED"
        lane_result["notes"].append(
            "Evidence collection only; missing staged component references remain explicit and final trace acceptance belongs to the Orchestrator."
        )
        lane_result["service_ended_at"] = append_event(lane_log, "LANE_SERVICE_END", task, args.execution_id, "COMPLETED")
        append_event(lane_log, "LANE_CLOSE_END", task, args.execution_id, "EVIDENCE_COLLECTED_CLOSED")

    lane_result["worker_ended_at"] = utc_now()
    result_path.write_text(json.dumps({"lane_result": lane_result}, indent=2), encoding="utf-8")
    return 0 if lane_result["status"] == "EVIDENCE_COLLECTED" else 2


if __name__ == "__main__":
    raise SystemExit(main())
