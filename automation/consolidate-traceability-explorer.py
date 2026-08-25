#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

import yaml

BASELINE = "3ae6e61442132d94a307275b08dd65fcef228d89"
TARGET_UNIQUE = 134


def fail(message: str) -> None:
    raise RuntimeError(message)


def endpoint_key(row: dict[str, Any]) -> str:
    return f"{str(row.get('method', '')).upper()} {row.get('path', '')}"


def read_yaml(path: Path) -> dict[str, Any]:
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def write_yaml(path: Path, doc: dict[str, Any]) -> None:
    path.write_text(yaml.safe_dump(doc, sort_keys=False, allow_unicode=True), encoding="utf-8")


def load_existing_explorer(repo: Path) -> dict[str, Any]:
    explorer = repo / "traceability" / "explorer"
    index = (explorer / "index.html").read_text(encoding="utf-8")
    delta_names = re.findall(r'<script\s+src="(matrix-delta-[^"]+\.js)"', index)
    node_script = r'''
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const dir = process.argv[1];
const deltas = JSON.parse(process.argv[2]);
const ctx = {window:{}};
vm.createContext(ctx);
function run(name){vm.runInContext(fs.readFileSync(path.join(dir,name),'utf8'),ctx,{filename:name});}
run('matrix-data.js');
for (const name of deltas) run(name);
run('apply-deltas.js');
process.stdout.write(JSON.stringify(ctx.window.TRACEABILITY_DATA));
'''
    proc = subprocess.run(
        ["node", "-e", node_script, str(explorer), json.dumps(delta_names)],
        check=True,
        capture_output=True,
        text=True,
    )
    data = json.loads(proc.stdout)
    rows = data.get("endpoints") or []
    keys = [endpoint_key(r) for r in rows]
    if len(keys) != len(set(keys)):
        dupes = sorted({k for k in keys if keys.count(k) > 1})
        fail(f"Existing Explorer contains duplicate keys: {dupes}")
    return data


def normalize_candidate_row(row: dict[str, Any]) -> dict[str, Any]:
    if not row.get("paths"):
        fail(f"Candidate {endpoint_key(row)} has no ordered/branching paths; projection is fail-closed")
    evidence: list[str] = []
    if row.get("evidence"):
        if isinstance(row["evidence"], list):
            evidence.extend(str(x) for x in row["evidence"])
        else:
            evidence.append(str(row["evidence"]))
    for blob in row.get("evidence_blobs") or []:
        evidence.append(f"git-blob:{blob}@{BASELINE}")
    if row.get("controller_blob"):
        evidence.append(f"git-blob:{row['controller_blob']}@{BASELINE}")

    final_dependencies: list[str] = []
    final_types = {
        "POSTGRES_TABLE", "POSTGRES_TABLE_GROUP", "DATABASE_VIEW", "FILE", "SQLITE_TABLE",
        "CONFIGURATION", "EXTERNAL_API", "TERMINAL_VIEW", "TERMINAL_REDIRECT", "TERMINAL_JSON",
        "TERMINAL_HTTP_RESPONSE", "CLASSPATH_RESOURCE"
    }
    for p in row["paths"]:
        nodes = p.get("nodes") or []
        if not nodes:
            fail(f"Candidate {endpoint_key(row)} contains an empty path")
        for n in nodes:
            if n.get("type") in final_types and n.get("name") and n["name"] not in final_dependencies:
                final_dependencies.append(str(n["name"]))

    return {
        "method": str(row.get("method", "")).upper(),
        "path": row.get("path"),
        "controller": row.get("controller"),
        "controllerMethod": row.get("controller_method") or row.get("controllerMethod"),
        "state": "COMPLETE",
        "chainCompleteness": row.get("chain_completeness") or row.get("chainCompleteness") or "FULL",
        "paths": row["paths"],
        "finalDependencies": final_dependencies,
        "evidence": evidence,
        "sourceBaseline": BASELINE,
    }


def apply_corrections(candidate: dict[str, Any], corrections: dict[str, Any]) -> list[dict[str, Any]]:
    rows = list((candidate.get("projection_candidate") or {}).get("rows") or [])
    replacement_rows = list((corrections.get("projection_corrections") or {}).get("rows") or [])
    by_key = {endpoint_key(r): r for r in rows}
    for r in replacement_rows:
        k = endpoint_key(r)
        if k not in by_key:
            fail(f"Correction key not present in original candidate: {k}")
        by_key[k] = r
    out = list(by_key.values())
    if len(out) != 11 or len({endpoint_key(r) for r in out}) != 11:
        fail(f"Expected exactly 11 unique recovery rows, got {len(out)}")
    return out


def markdown_summary(row: dict[str, Any]) -> tuple[str, str]:
    deps = row.get("finalDependencies") or []
    dep = "; ".join(deps) if deps else "source-proved terminal dependency"
    kinds = []
    for p in row.get("paths") or []:
        for n in p.get("nodes") or []:
            t = n.get("type")
            if t and t not in kinds:
                kinds.append(t)
    return "_AND_".join(kinds[-3:]) if kinds else "SOURCE_PROVED", dep


def update_markdown(path: Path, new_rows: list[dict[str, Any]]) -> None:
    text = path.read_text(encoding="utf-8")
    existing = set(re.findall(r"^\|\s*(GET|POST|PUT|DELETE|PATCH)\s*\|\s*`([^`]+)`", text, flags=re.M))
    lines = []
    for row in sorted(new_rows, key=lambda r: (r["path"], r["method"])):
        tup = (row["method"], row["path"])
        if tup in existing:
            fail(f"Markdown already contains recovery key {row['method']} {row['path']}")
        dep_type, dep = markdown_summary(row)
        evidence = "; ".join(row.get("evidence") or [])
        controller_method = f"{row.get('controller')}.{row.get('controllerMethod')}"
        lines.append(
            f"| {row['method']} | `{row['path']}` | `{controller_method}` | COMPLETE | {row['chainCompleteness']} | {dep_type} | `{dep}` | `{evidence}` |"
        )
    text = text.rstrip() + "\n" + "\n".join(lines) + "\n"
    text = re.sub(r"Status: \*\*[^*]+\*\*", "Status: **READY_FOR_FINAL_RECONCILIATION**", text, count=1)
    text = re.sub(r"Rows currently materialized below: \*\*\d+\*\*\.[^\n]*", "Rows currently materialized below: **134**. Unique HTTP method/path coverage is now source-proved and atomically projected.", text, count=1)
    path.write_text(text, encoding="utf-8")


def rewrite_index(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'<script\s+src="matrix-delta-[^"]+\.js"></script>', '', text)
    text = re.sub(r'<script\s+src="apply-deltas\.js"></script>', '', text)
    path.write_text(text, encoding="utf-8")


def update_progress(path: Path) -> None:
    doc = read_yaml(path)
    doc["version"] = int(doc.get("version", 0)) + 1
    doc["state"] = "READY_FOR_FINAL_RECONCILIATION"
    doc["projection_state"] = "CONSOLIDATED_CANONICAL_134"
    r = doc.setdefault("reported_source_check", {})
    r.update({
        "canonical_endpoint_inventory_target": 134,
        "unique_method_path_coverage_proved": True,
        "materialized_unique_method_path_keys": 134,
        "pending_unique_method_path_keys": 0,
        "fully_source_proved_pending_atomic_projection": 0,
        "reason": "Exactly 134 unique HTTP method/path keys are represented once in the canonical Markdown and consolidated Explorer model."
    })
    uk = doc.setdefault("unique_key_recovery", {})
    uk.update({"state": "ATOMIC_PROJECTION_COMPLETE", "materialized_unique_keys": 134, "pending_unique_keys": 0, "fully_source_proved_keys": 11, "atomic_projection_required": False})
    hist = doc.setdefault("matrix_reconciliation_history", {})
    hist.update({"materialized_matrix_rows": 134, "confirmed_missing_canonical_keys": 0, "reconciliation_work_unit_state": "READY_TO_RESUME_WU_BL001_002"})
    doc["accepted_changes_this_checkpoint"] = {
        "new_endpoint_rows": 11,
        "historical_rows_promoted": 0,
        "recovery_keys_source_proved": 11,
        "unresolved_changes": 0,
        "worker_generation_started": False,
        "transient_lane_logs_created": 0,
    }
    doc["next_action"] = "WU-BL001-002 reconciles the consolidated 134-row model and WU-BL001-003 validates final traceability gates."
    write_yaml(path, doc)


def update_runtime(path: Path) -> None:
    doc = read_yaml(path)
    root = doc.setdefault("local_execution", {})
    root["version"] = int(root.get("version", 0)) + 1
    root["work_unit"] = "WU-BL001-002"
    root["state"] = "UNIQUE_KEY_RECOVERY_ATOMIC_PROJECTION_COMPLETE_FINAL_RECONCILIATION_READY"
    inv = root.setdefault("current_invocation", {})
    inv.update({
        "outcome": "ATOMIC_CANONICAL_PROJECTION_COMPLETE_134_UNIQUE_KEYS",
        "canonical_rows_added": 11,
        "materialized_rows_after": 134,
        "pending_unique_keys_after": 0,
        "worker_generation_started": False,
        "workers_started": 0,
        "residual_transient_lane_logs": 0,
    })
    rec = root.setdefault("unique_recovery_state", {})
    rec.update({
        "canonical_endpoint_inventory_target": 134,
        "materialized_unique_method_path_keys": 134,
        "pending_unique_keys": 0,
        "fully_source_proved_pending_atomic_projection": 0,
        "unique_method_path_coverage_proved": True,
    })
    handoff = root.setdefault("work_unit_handoff", {})
    handoff.update({
        "WU-BL001-001": "COMPLETE_TRUE_UNIQUE_SOURCE_CHECK_134",
        "WU-BL001-002": "IN_PROGRESS_FINAL_RECONCILIATION",
        "WU-BL001-003": "BLOCKED_WAITING_FOR_RECONCILIATION",
        "WU-BL001-004": "WAITING_FOR_DEPENDENCY",
        "close_allowed": False,
    })
    root["next_action"] = "Run WU-BL001-002 consistency reconciliation on the consolidated 134-row Markdown/JSON/browser model; do not close BL-001."
    write_yaml(path, doc)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", required=True)
    ap.add_argument("--candidate", default="backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml")
    ap.add_argument("--corrections", default="backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml")
    args = ap.parse_args()
    repo = Path(args.repo_root).resolve()

    data = load_existing_explorer(repo)
    existing_rows = data.get("endpoints") or []
    existing_keys = {endpoint_key(r) for r in existing_rows}
    if len(existing_keys) != 123:
        fail(f"Expected 123 unique rows before recovery projection, got {len(existing_keys)}")

    candidate = read_yaml(repo / args.candidate)
    corrections = read_yaml(repo / args.corrections)
    candidate_rows = apply_corrections(candidate, corrections)
    normalized = [normalize_candidate_row(r) for r in candidate_rows]
    recovery_keys = {endpoint_key(r) for r in normalized}
    overlap = sorted(existing_keys & recovery_keys)
    if overlap:
        fail(f"Recovery rows overlap existing canonical rows: {overlap}")

    merged = existing_rows + normalized
    merged_keys = [endpoint_key(r) for r in merged]
    if len(merged) != TARGET_UNIQUE or len(set(merged_keys)) != TARGET_UNIQUE:
        fail(f"Atomic projection failed uniqueness: rows={len(merged)} unique={len(set(merged_keys))}")

    data["endpoints"] = sorted(merged, key=lambda r: (r.get("controller") or "", r.get("path") or "", r.get("method") or ""))
    data["unresolved"] = []
    md = data.setdefault("metadata", {})
    md.update({
        "backlogItem": "BL-001",
        "status": "READY_FOR_FINAL_RECONCILIATION",
        "projectionState": "CONSOLIDATED_CANONICAL_134",
        "sourceBaseline": BASELINE,
        "canonicalEndpointInventory": 134,
        "canonicalAcceptedExamined": 134,
        "canonicalComplete": 134,
        "canonicalUnresolved": 0,
        "canonicalBlocked": 0,
        "canonicalFailed": 0,
        "canonicalNotYetExamined": 0,
        "materializedMatrixRows": 134,
        "historicalAcceptedRowsPendingBackfill": 0,
    })

    explorer = repo / "traceability" / "explorer"
    json_text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    (explorer / "traceability-matrix.json").write_text(json_text, encoding="utf-8")
    (explorer / "matrix-data.js").write_text("window.TRACEABILITY_DATA = " + json_text.rstrip() + ";\n", encoding="utf-8")
    rewrite_index(explorer / "index.html")
    update_markdown(repo / "traceability" / "controller-traceability.md", normalized)

    unresolved = repo / "traceability" / "unresolved-traceability.md"
    unresolved.write_text("# BL-001 Unresolved Traceability\n\nStatus: **ZERO UNRESOLVED / READY FOR FINAL RECONCILIATION**\n\nAll 134 unique caller-visible HTTP method/path keys are materialized. Final gate validation remains pending.\n", encoding="utf-8")
    update_progress(repo / "traceability" / "matrix-progress.yaml")
    update_runtime(repo / "backlog" / "runtime" / "BL-001" / "local-execution.yaml")

    print(json.dumps({
        "state": "ATOMIC_PROJECTION_COMPLETE",
        "unique_rows_before": 123,
        "recovery_rows": 11,
        "unique_rows_after": 134,
        "duplicates": 0,
        "unresolved": 0,
        "worker_replay": 0,
    }, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}", file=sys.stderr)
        raise SystemExit(2)
