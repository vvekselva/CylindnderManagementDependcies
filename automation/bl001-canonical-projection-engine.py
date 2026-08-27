#!/usr/bin/env python3
"""BL-001 transactional canonical projection engine.

Runs the existing deterministic 123+11 transformer only inside a staged repository copy,
validates every authoritative projection against one 134-key model, and publishes to the
real checkout only after all gates pass. Publication is rollback-protected and idempotent.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

import yaml

TARGET = 134
PRE_PROJECTION_TARGET = 123
TARGETS = (
    "traceability/controller-traceability.md",
    "traceability/unresolved-traceability.md",
    "traceability/matrix-progress.yaml",
    "traceability/explorer/traceability-matrix.json",
    "traceability/explorer/matrix-data.js",
    "traceability/explorer/index.html",
    "backlog/runtime/BL-001/local-execution.yaml",
)
MANIFEST = "backlog/runtime/BL-001/canonical-projection-manifest.yaml"
LEGACY = "automation/consolidate-traceability-explorer.py"


def fail(message: str) -> None:
    raise RuntimeError(message)


def key(row: dict[str, Any]) -> str:
    return f"{str(row.get('method', '')).upper()} {row.get('path', '')}"


def sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def parse_js(text: str) -> dict[str, Any]:
    prefix = "window.TRACEABILITY_DATA = "
    value = text.strip()
    if not value.startswith(prefix) or not value.endswith(";"):
        fail("matrix-data.js is not a canonical TRACEABILITY_DATA assignment")
    return json.loads(value[len(prefix):-1])


def markdown_keys(text: str) -> list[str]:
    out: list[str] = []
    for line in text.splitlines():
        match = re.match(r"^\|\s*([A-Z]+)\s*\|\s*`([^`]+)`\s*\|", line)
        if match:
            out.append(f"{match.group(1)} {match.group(2)}")
    return out


def validate(repo: Path) -> tuple[set[str], dict[str, str]]:
    contents = {path: (repo / path).read_text(encoding="utf-8") for path in TARGETS}
    json_doc = json.loads(contents["traceability/explorer/traceability-matrix.json"])
    js_doc = parse_js(contents["traceability/explorer/matrix-data.js"])
    json_rows = json_doc.get("endpoints") or []
    js_rows = js_doc.get("endpoints") or []
    json_keys = [key(row) for row in json_rows]
    js_keys = [key(row) for row in js_rows]
    if len(json_keys) != TARGET or len(set(json_keys)) != TARGET:
        fail(f"JSON projection is not exactly {TARGET} unique keys")
    if json_doc != js_doc or set(json_keys) != set(js_keys):
        fail("JSON and browser JS projections differ")

    md_keys = markdown_keys(contents["traceability/controller-traceability.md"])
    if len(md_keys) != TARGET or set(md_keys) != set(json_keys):
        fail("Markdown keyset differs from the canonical JSON keyset")

    progress = yaml.safe_load(contents["traceability/matrix-progress.yaml"]) or {}
    reported = progress.get("reported_source_check") or {}
    if reported.get("materialized_unique_method_path_keys") != TARGET:
        fail("matrix-progress.yaml does not report 134 materialized unique keys")
    if reported.get("pending_unique_method_path_keys") != 0:
        fail("matrix-progress.yaml still reports pending unique keys")

    runtime = yaml.safe_load(contents["backlog/runtime/BL-001/local-execution.yaml"]) or {}
    state = (runtime.get("local_execution") or {}).get("unique_recovery_state") or {}
    if state.get("materialized_unique_method_path_keys") != TARGET:
        fail("Level-3 runtime does not report 134 materialized unique keys")

    index = contents["traceability/explorer/index.html"]
    if re.search(r'matrix-delta-[^"]+\.js', index) or 'src="apply-deltas.js"' in index:
        fail("Explorer still references incremental delta application")
    if "ZERO UNRESOLVED" not in contents["traceability/unresolved-traceability.md"]:
        fail("Unresolved traceability artifact is inconsistent with 134/134")
    return set(json_keys), contents


def effective_model(repo: Path) -> tuple[dict[str, Any], list[str]]:
    explorer = repo / "traceability/explorer"
    index = (explorer / "index.html").read_text(encoding="utf-8")
    delta_names = re.findall(r'<script\s+src="(matrix-delta-[^"]+\.js)"', index)
    node = r'''
const fs=require('fs'),vm=require('vm'),path=require('path');
const dir=process.argv[1], deltas=JSON.parse(process.argv[2]), ctx={window:{}};
vm.createContext(ctx);
const run=n=>vm.runInContext(fs.readFileSync(path.join(dir,n),'utf8'),ctx,{filename:n});
run('matrix-data.js'); for(const n of deltas) run(n); if(deltas.length) run('apply-deltas.js');
process.stdout.write(JSON.stringify(ctx.window.TRACEABILITY_DATA || {metadata:{},endpoints:[],unresolved:[]}));
'''
    proc = subprocess.run(["node", "-e", node, str(explorer), json.dumps(delta_names)], capture_output=True, text=True)
    if proc.returncode != 0:
        fail(f"Cannot assemble effective Explorer model: {proc.stderr.strip()}")
    try:
        return json.loads(proc.stdout), delta_names
    except json.JSONDecodeError as exc:
        fail(f"Cannot decode effective Explorer model: {exc}")


def reconciliation_diagnostic(repo: Path, model: dict[str, Any], delta_names: list[str]) -> dict[str, Any]:
    effective_rows = model.get("endpoints") or []
    effective_keys = [key(row) for row in effective_rows]
    effective_set = set(effective_keys)

    md_text = (repo / "traceability/controller-traceability.md").read_text(encoding="utf-8")
    md_keys = markdown_keys(md_text)
    md_set = set(md_keys)

    json_doc = json.loads((repo / "traceability/explorer/traceability-matrix.json").read_text(encoding="utf-8"))
    json_keys = [key(row) for row in (json_doc.get("endpoints") or [])]
    json_set = set(json_keys)

    base_doc = parse_js((repo / "traceability/explorer/matrix-data.js").read_text(encoding="utf-8"))
    base_keys = [key(row) for row in (base_doc.get("endpoints") or [])]

    return {
        "effective_unique_count": len(effective_set),
        "effective_physical_count": len(effective_keys),
        "effective_duplicates": sorted(k for k in set(effective_keys) if effective_keys.count(k) > 1),
        "base_unique_count": len(set(base_keys)),
        "ordered_delta_count": len(delta_names),
        "markdown_unique_count": len(md_set),
        "json_unique_count": len(json_set),
        "markdown_missing_from_effective": sorted(md_set - effective_set),
        "effective_missing_from_markdown": sorted(effective_set - md_set),
        "json_missing_from_effective": sorted(json_set - effective_set),
        "effective_missing_from_json": sorted(effective_set - json_set),
    }


def write_manifest(stage: Path, keys: set[str], contents: dict[str, str]) -> None:
    doc = {
        "canonical_projection_manifest": {
            "backlog_item": "BL-001",
            "engine": "automation/bl001-canonical-projection-engine.py",
            "row_key": "HTTP_METHOD_PLUS_PATH",
            "unique_rows": TARGET,
            "duplicates": 0,
            "canonical_keyset_sha256": hashlib.sha256("\n".join(sorted(keys)).encode("utf-8")).hexdigest(),
            "artifacts": [{"path": path, "sha256": sha(text)} for path, text in sorted(contents.items())],
            "publication_rule": "STAGE_VALIDATE_ALL_THEN_PUBLISH_WITH_ROLLBACK",
            "partial_publication_allowed": False,
        }
    }
    path = stage / MANIFEST
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")


def publish(repo: Path, stage: Path) -> None:
    paths = list(TARGETS) + [MANIFEST]
    originals = {p: ((repo / p).read_bytes() if (repo / p).exists() else None) for p in paths}
    replaced: list[str] = []
    try:
        for relative in paths:
            target = repo / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            temp = target.with_name(target.name + ".bl001-new")
            temp.write_bytes((stage / relative).read_bytes())
            os.replace(temp, target)
            replaced.append(relative)
    except Exception:
        for relative in reversed(replaced):
            target = repo / relative
            old = originals[relative]
            if old is None:
                target.unlink(missing_ok=True)
            else:
                restore = target.with_name(target.name + ".bl001-restore")
                restore.write_bytes(old)
                os.replace(restore, target)
        raise


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", required=True)
    ap.add_argument("--candidate", default="backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml")
    ap.add_argument("--corrections", default="backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    repo = Path(args.repo_root).resolve()

    model, delta_names = effective_model(repo)
    count = len({key(row) for row in (model.get("endpoints") or [])})
    if count == TARGET:
        keys, contents = validate(repo)
        state = "NOOP_ALREADY_VALID_134"
        print(json.dumps({"state": state, "unique_rows": len(keys), "duplicates": 0}, indent=2))
        return 0
    if count != PRE_PROJECTION_TARGET:
        diagnostic = reconciliation_diagnostic(repo, model, delta_names)
        fail(
            f"Expected {PRE_PROJECTION_TARGET} pre-projection or {TARGET} idempotent unique rows, found {count}; "
            f"RECONCILIATION_DIAGNOSTIC={json.dumps(diagnostic, sort_keys=True)}"
        )

    stage_parent = Path(tempfile.mkdtemp(prefix="bl001-projection-", dir=str(repo.parent)))
    stage = stage_parent / "repo"
    try:
        shutil.copytree(repo, stage, ignore=shutil.ignore_patterns(".git", "*.bl001-new", "*.bl001-restore"))
        legacy = stage / LEGACY
        if not legacy.exists():
            fail(f"Legacy deterministic transformer is missing: {LEGACY}")
        proc = subprocess.run([
            sys.executable, str(legacy), "--repo-root", str(stage),
            "--candidate", args.candidate, "--corrections", args.corrections,
        ], capture_output=True, text=True)
        if proc.returncode != 0:
            fail(f"Staged canonical reconstruction failed: {proc.stderr.strip() or proc.stdout.strip()}")

        keys, contents = validate(stage)
        write_manifest(stage, keys, contents)
        if not args.dry_run:
            publish(repo, stage)
            published_keys, _ = validate(repo)
            if published_keys != keys:
                fail("Post-publication canonical keyset differs from staged keyset")
        print(json.dumps({
            "state": "DRY_RUN_VALIDATED" if args.dry_run else "ATOMIC_PROJECTION_PUBLISHED",
            "unique_rows": len(keys), "duplicates": 0,
            "canonical_keyset_sha256": hashlib.sha256("\n".join(sorted(keys)).encode("utf-8")).hexdigest(),
        }, indent=2))
        return 0
    finally:
        shutil.rmtree(stage_parent, ignore_errors=True)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}", file=sys.stderr)
        raise SystemExit(2)
