#!/usr/bin/env python3
"""Hosted execution bridge for governed Cylinder production fires.

The scheduler creates/observes execution requests. This runner supplies the real
process runtime. Bootstrap and execution are separate phases so the invocation
START, heartbeat and globally unique claims can be committed/read back before any
backlog executor runs.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

import yaml

CONTROL_BRANCH = "chore/rename-dependency-files"
FROZEN_SOURCE = "3ae6e61442132d94a307275b08dd65fcef228d89"
BL001_CLAIM = "BL-001|WU-BL001-001|ATOMIC-134-PROJECTION"
BL008_CLAIM = "BL-008|WU-BL008-001|INITIAL-FLYWAY-REQUIREMENT"


def now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def iso(ts: dt.datetime | None = None) -> str:
    return (ts or now()).isoformat(timespec="seconds").replace("+00:00", "Z")


def load_yaml(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def save_yaml(path: Path, doc: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(doc, sort_keys=False, width=140), encoding="utf-8")


def redact(value: str, secrets: list[str] | None) -> str:
    text = value
    for secret in secrets or []:
        if secret:
            text = text.replace(secret, "***REDACTED***")
    return text


def run(cmd: list[str], cwd: Path, env: dict[str, str] | None = None, secrets: list[str] | None = None) -> dict[str, Any]:
    proc = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True, env=env)
    safe_cmd = [redact(str(arg), secrets) for arg in cmd]
    return {
        "command": safe_cmd,
        "returncode": proc.returncode,
        "stdout": redact(proc.stdout[-8000:], secrets),
        "stderr": redact(proc.stderr[-8000:], secrets),
    }


def append_log(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(text.rstrip() + "\n")


def invocation_id() -> str:
    explicit = os.environ.get("CYLINDER_INVOCATION_ID", "").strip()
    if explicit:
        return explicit
    run_id = os.environ.get("GITHUB_RUN_ID_VALUE", "manual")
    return f"CYLINDER-HOSTED-RUNNER-{run_id}"


def find_entry(registry: dict[str, Any], iid: str) -> dict[str, Any] | None:
    for entry in registry.get("active_invocations") or []:
        if entry.get("invocation_id") == iid:
            return entry
    return None


def active_claims(registry: dict[str, Any]) -> list[dict[str, Any]]:
    work_claims = registry.setdefault("work_claims", {})
    return work_claims.setdefault("active", [])


def claim_owned(registry: dict[str, Any], iid: str, key: str) -> bool:
    return any(c.get("claim_key") == key and c.get("owner_invocation_id") == iid for c in active_claims(registry))


def add_claim(registry: dict[str, Any], iid: str, key: str) -> None:
    claims = active_claims(registry)
    other = next((c for c in claims if c.get("claim_key") == key and c.get("owner_invocation_id") != iid), None)
    if other:
        raise RuntimeError(f"claim already owned by another invocation: {key}")
    if not claim_owned(registry, iid, key):
        claims.append({
            "claim_key": key,
            "owner_invocation_id": iid,
            "state": "CLAIMED",
            "claimed_at": iso(),
        })


def release_owned_claims(registry: dict[str, Any], iid: str, durable_state: dict[str, str]) -> None:
    work_claims = registry.setdefault("work_claims", {})
    claims = work_claims.setdefault("active", [])
    completed = work_claims.setdefault("completed", [])
    remaining: list[dict[str, Any]] = []
    for claim in claims:
        if claim.get("owner_invocation_id") != iid:
            remaining.append(claim)
            continue
        key = str(claim.get("claim_key"))
        completed.insert(0, {
            "claim_key": key,
            "prior_owner_invocation_id": iid,
            "state": "RELEASED_AFTER_HOSTED_EXECUTION",
            "completed_at": iso(),
            "durable_state_found": durable_state.get(key, "HOSTED_EXECUTION_TERMINAL_EVIDENCE_PERSISTED"),
        })
    work_claims["active"] = remaining
    work_claims["completed"] = completed[:100]


def runtime_secret_state() -> tuple[bool, list[str]]:
    source_token_declared = os.environ.get("CYLINDER_SOURCE_CREDENTIAL_DECLARED", "false").lower() == "true"
    neon_url = os.environ.get("NEON_JDBC_URL", "")
    neon_user = os.environ.get("NEON_DB_USER", "")
    neon_password = os.environ.get("NEON_DB_PASSWORD", "")
    missing: list[str] = []
    if not source_token_declared:
        missing.append("CYLINDER_SOURCE_TOKEN")
    if not neon_url:
        missing.append("NEON_JDBC_URL")
    if not neon_user:
        missing.append("NEON_DB_USER")
    if not neon_password:
        missing.append("NEON_DB_PASSWORD")
    return source_token_declared and bool(neon_url and neon_user and neon_password), missing


def bootstrap(repo: Path, iid: str) -> int:
    stamp = now()
    registry_path = repo / "backlog/runtime/invocation-registry.yaml"
    registry = load_yaml(registry_path)
    active = registry.setdefault("active_invocations", [])

    existing = find_entry(registry, iid)
    if existing:
        print(json.dumps({"invocation_id": iid, "state": "BOOTSTRAP_ALREADY_PRESENT"}, indent=2))
        return 0

    other_active = [e for e in active if e.get("invocation_id") != iid]
    if other_active:
        raise RuntimeError(f"another active invocation exists: {[e.get('invocation_id') for e in other_active]}")

    bl008_runtime_ready, _ = runtime_secret_state()
    add_claim(registry, iid, BL001_CLAIM)
    selected_claims = [BL001_CLAIM]
    if bl008_runtime_ready:
        add_claim(registry, iid, BL008_CLAIM)
        selected_claims.append(BL008_CLAIM)

    entry: dict[str, Any] = {
        "invocation_id": iid,
        "execution_state": "RUNNING",
        "health_state": "ACTIVE",
        "started_at": iso(stamp),
        "completed_at": None,
        "heartbeat_at": iso(stamp),
        "last_progress_at": iso(stamp),
        "last_lane_activity_at": iso(stamp),
        "active_lane_count": 0,
        "coordinator_phase": "ORCHESTRATOR_STARTED",
        "current_backlog_item": "MULTI_STREAM_BL001_BL002_BL008",
        "current_work_unit": "HOSTED_RUNTIME_PREFLIGHT",
        "progress_fingerprint": "HOSTED_RUNNER_START_CLAIMS_PERSISTED",
        "blocked_reason": None,
        "recovery_action": None,
        "workers_started": 0,
        "claims_created": len(selected_claims),
        "canonical_progress_delta": 0,
        "bootstrap_acknowledged": True,
        "outcome": None,
    }
    active.append(entry)
    registry["max_concurrent_invocations"] = 1
    save_yaml(registry_path, registry)

    # Local readback is mandatory; workflow performs a second remote Git readback
    # after committing/pushing this bootstrap checkpoint.
    readback = load_yaml(registry_path)
    if find_entry(readback, iid) is None:
        raise RuntimeError("invocation START readback failed")
    for key in selected_claims:
        if not claim_owned(readback, iid, key):
            raise RuntimeError(f"claim readback failed: {key}")

    log_path = repo / f"logs/runs/{iid}.md"
    append_log(log_path, f"# {iid}")
    append_log(log_path, f"- START: {iso(stamp)}")
    append_log(log_path, f"- control_branch: {CONTROL_BRANCH}")
    append_log(log_path, f"- frozen_source: {FROZEN_SOURCE}")
    append_log(log_path, "- bootstrap_acknowledged: true")
    append_log(log_path, "- claims:")
    for key in selected_claims:
        append_log(log_path, f"  - {key}")

    print(json.dumps({
        "invocation_id": iid,
        "state": "BOOTSTRAP_AND_CLAIMS_READBACK_VERIFIED",
        "claims": selected_claims,
    }, indent=2))
    return 0


def execute(repo: Path, iid: str) -> int:
    registry_path = repo / "backlog/runtime/invocation-registry.yaml"
    registry = load_yaml(registry_path)
    entry = find_entry(registry, iid)
    if entry is None:
        raise RuntimeError("durable bootstrap START is missing; execution forbidden")
    if not claim_owned(registry, iid, BL001_CLAIM):
        raise RuntimeError("durable BL-001 claim is missing; execution forbidden")

    stamp_text = str(entry.get("started_at") or iso())
    log_path = repo / f"logs/runs/{iid}.md"
    outcomes: dict[str, Any] = {}
    blockers: list[str] = []
    workers_started = 0
    canonical_delta = 0
    durable_states: dict[str, str] = {}

    # BL-001 atomic projection uses already-staged/source-proved recovery evidence
    # in the control repository. The engine itself performs a full fail-closed dry
    # run and validates all seven canonical artifacts before publication. Private
    # source checkout is therefore not a prerequisite for this transaction.
    workers_started += 1
    entry["current_backlog_item"] = "BL-001"
    entry["current_work_unit"] = "WU-BL001-001"
    entry["coordinator_phase"] = "EXECUTING"
    entry["active_lane_count"] = 1
    entry["heartbeat_at"] = iso()
    save_yaml(registry_path, registry)

    dry = run([
        sys.executable,
        "automation/bl001-canonical-projection-engine.py",
        "--repo-root", str(repo),
        "--dry-run",
    ], repo)
    outcomes["BL-001_dry_run"] = dry
    if dry["returncode"] == 0:
        publish = run([
            sys.executable,
            "automation/bl001-canonical-projection-engine.py",
            "--repo-root", str(repo),
        ], repo)
        outcomes["BL-001_publish"] = publish
        if publish["returncode"] == 0:
            try:
                payload = json.loads(publish["stdout"])
                state = payload.get("state")
                if state == "ATOMIC_PROJECTION_PUBLISHED":
                    canonical_delta = 11
                    durable_states[BL001_CLAIM] = "CANONICAL_134_ATOMIC_PROJECTION_PUBLISHED"
                elif state == "NOOP_ALREADY_VALID_134":
                    durable_states[BL001_CLAIM] = "CANONICAL_134_ALREADY_VALID"
                else:
                    durable_states[BL001_CLAIM] = f"BL001_EXECUTOR_STATE_{state}"
            except Exception:
                durable_states[BL001_CLAIM] = "BL001_EXECUTOR_SUCCEEDED_OUTPUT_PARSE_UNAVAILABLE"
        else:
            blockers.append("BL001_ATOMIC_PROJECTION_FAILED")
            durable_states[BL001_CLAIM] = "BL001_ATOMIC_PROJECTION_FAILED_WITH_EVIDENCE"
    else:
        blockers.append("BL001_ATOMIC_DRY_RUN_FAILED")
        durable_states[BL001_CLAIM] = "BL001_ATOMIC_DRY_RUN_FAILED_WITH_EVIDENCE"

    source_available = os.environ.get("CYLINDER_SOURCE_AVAILABLE", "false").lower() == "true"
    source_root = Path(os.environ.get("CYLINDER_SOURCE_ROOT", ""))
    source_verified = source_available and source_root.exists()
    outcomes["BL-002"] = {
        "state": "SOURCE_RUNTIME_AVAILABLE" if source_verified else "SOURCE_RUNTIME_UNAVAILABLE",
        "next_action": "CONTINUE_RELEASE_1_UI_SOURCE_ANALYSIS_WITH_PRIMARY_AUTOMATION_TOOL",
        "auto_approval": False,
    }

    neon_url = os.environ.get("NEON_JDBC_URL", "")
    neon_user = os.environ.get("NEON_DB_USER", "")
    neon_password = os.environ.get("NEON_DB_PASSWORD", "")
    secrets = [neon_url, neon_user, neon_password]
    bl008_claimed = claim_owned(registry, iid, BL008_CLAIM)
    if bl008_claimed and source_verified and neon_url and neon_user and neon_password:
        workers_started += 1
        entry["current_backlog_item"] = "BL-008"
        entry["current_work_unit"] = "WU-BL008-001"
        entry["active_lane_count"] = 1
        entry["heartbeat_at"] = iso()
        save_yaml(registry_path, registry)

        module = source_root / "cylinder.datascripts"
        mvn = [
            "mvn", "-B", "-f", str(module / "pom.xml"),
            f"-Ddb.url={neon_url}",
            f"-Ddb.user={neon_user}",
            f"-Ddb.password={neon_password}",
            "-Dflyway.target=1",
        ]
        info_before = run(mvn + ["flyway:info"], module, secrets=secrets)
        outcomes["BL-008_info_before"] = {**info_before, "command": ["mvn", "...", "flyway:info"]}
        validate = run(mvn + ["flyway:validate"], module, secrets=secrets)
        outcomes["BL-008_validate"] = {**validate, "command": ["mvn", "...", "flyway:validate"]}
        if info_before["returncode"] == 0 and validate["returncode"] == 0:
            migrate = run(mvn + ["flyway:migrate"], module, secrets=secrets)
            outcomes["BL-008_migrate_V1"] = {**migrate, "command": ["mvn", "...", "-Dflyway.target=1", "flyway:migrate"]}
            if migrate["returncode"] == 0:
                info_after = run(mvn + ["flyway:info"], module, secrets=secrets)
                outcomes["BL-008_info_after"] = {**info_after, "command": ["mvn", "...", "flyway:info"]}
                if info_after["returncode"] == 0:
                    durable_states[BL008_CLAIM] = "V1_FLYWAY_MIGRATE_AND_INFO_SUCCEEDED"
                else:
                    blockers.append("BL008_POST_MIGRATION_FLYWAY_INFO_FAILED")
                    durable_states[BL008_CLAIM] = "V1_MIGRATED_POST_INFO_FAILED_WITH_EVIDENCE"
            else:
                blockers.append("BL008_V1_FLYWAY_MIGRATE_FAILED")
                durable_states[BL008_CLAIM] = "V1_FLYWAY_MIGRATE_FAILED_WITH_EVIDENCE"
        else:
            blockers.append("BL008_FLYWAY_PREFLIGHT_FAILED")
            durable_states[BL008_CLAIM] = "V1_FLYWAY_INFO_OR_VALIDATE_FAILED_WITH_EVIDENCE"
    else:
        missing: list[str] = []
        if not source_verified:
            missing.append("CYLINDER_SOURCE_TOKEN")
        if not neon_url:
            missing.append("NEON_JDBC_URL")
        if not neon_user:
            missing.append("NEON_DB_USER")
        if not neon_password:
            missing.append("NEON_DB_PASSWORD")
        blockers.append("BL008_HOSTED_RUNTIME_SECRETS_UNAVAILABLE")
        outcomes["BL-008"] = {
            "state": "BLOCKED_HOSTED_RUNTIME_SECRETS_UNAVAILABLE",
            "missing_secret_names": missing,
            "manual_sql_fallback_used": False,
        }
        if bl008_claimed:
            durable_states[BL008_CLAIM] = "BL008_RUNTIME_SECRETS_OR_SOURCE_UNAVAILABLE"

    completed = now()
    entry["completed_at"] = iso(completed)
    entry["heartbeat_at"] = iso(completed)
    entry["last_progress_at"] = iso(completed)
    entry["last_lane_activity_at"] = iso(completed)
    entry["active_lane_count"] = 0
    entry["workers_started"] = workers_started
    entry["canonical_progress_delta"] = canonical_delta
    entry["coordinator_phase"] = "SYNCHRONIZED_TERMINAL_HANDOFF"
    entry["blocked_reason"] = "; ".join(blockers) if blockers else None
    entry["recovery_action"] = "RESOLVE_RECORDED_RUNTIME_BLOCKERS_THEN_REFIRE" if blockers else "CONTINUE_NEXT_ELIGIBLE_WORK"
    entry["execution_state"] = "PARTIAL_CONTINUE_REQUIRED" if blockers else "PROGRESSED"
    entry["health_state"] = "TERMINAL_HANDOFF"
    entry["progress_fingerprint"] = f"HOSTED_RUNNER_workers_{workers_started}_claims_{entry.get('claims_created', 0)}_delta_{canonical_delta}"
    entry["outcome"] = entry["execution_state"]

    release_owned_claims(registry, iid, durable_states)
    registry["active_invocations"] = [x for x in registry.get("active_invocations", []) if x.get("invocation_id") != iid]
    recent = registry.setdefault("recent_completed_invocations", [])
    recent.insert(0, entry)
    registry["recent_completed_invocations"] = recent[:20]
    registry["max_concurrent_invocations"] = 1
    bootstrap_control = registry.setdefault("bootstrap_control", {})
    bootstrap_control["latest_successful_bootstrap_ack_at"] = stamp_text
    save_yaml(registry_path, registry)

    result_path = repo / "backlog/runtime/hosted-runner/latest-result.yaml"
    save_yaml(result_path, {
        "invocation_id": iid,
        "started_at": stamp_text,
        "completed_at": iso(completed),
        "outcome": entry["outcome"],
        "workers_started": workers_started,
        "claims_created": entry.get("claims_created", 0),
        "canonical_progress_delta": canonical_delta,
        "blockers": blockers,
        "stream_outcomes": outcomes,
    })
    append_log(log_path, f"- END: {iso(completed)}")
    append_log(log_path, f"- outcome: {entry['outcome']}")
    append_log(log_path, f"- workers_started: {workers_started}")
    append_log(log_path, f"- claims_created: {entry.get('claims_created', 0)}")
    append_log(log_path, f"- canonical_progress_delta: {canonical_delta}")
    if blockers:
        append_log(log_path, "- blockers:")
        for blocker in blockers:
            append_log(log_path, f"  - {blocker}")

    print(json.dumps({
        "invocation_id": iid,
        "outcome": entry["outcome"],
        "workers_started": workers_started,
        "claims_created": entry.get("claims_created", 0),
        "canonical_progress_delta": canonical_delta,
        "blockers": blockers,
    }, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", required=True)
    parser.add_argument("--phase", choices=["bootstrap", "execute"], required=True)
    args = parser.parse_args()
    repo = Path(args.repo_root).resolve()
    iid = invocation_id()
    if args.phase == "bootstrap":
        return bootstrap(repo, iid)
    return execute(repo, iid)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}", file=sys.stderr)
        raise SystemExit(2)
