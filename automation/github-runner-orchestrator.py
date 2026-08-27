#!/usr/bin/env python3
"""Hosted execution bridge for governed Cylinder production fires.

The ChatGPT scheduler creates/observes execution requests; this runner supplies the
real process runtime needed by BL-001 and BL-008. It always writes a durable local
START/terminal lifecycle record that the workflow commits back to the control branch.
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


def run(cmd: list[str], cwd: Path, env: dict[str, str] | None = None) -> dict[str, Any]:
    proc = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True, env=env)
    return {
        "command": cmd,
        "returncode": proc.returncode,
        "stdout": proc.stdout[-8000:],
        "stderr": proc.stderr[-8000:],
    }


def append_log(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(text.rstrip() + "\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", required=True)
    args = parser.parse_args()
    repo = Path(args.repo_root).resolve()

    run_id = os.environ.get("GITHUB_RUN_ID_VALUE", "manual")
    stamp = now()
    invocation_id = f"CYLINDER-HOSTED-RUNNER-{stamp.strftime('%Y%m%dT%H%M%SZ')}-{run_id}"
    registry_path = repo / "backlog/runtime/invocation-registry.yaml"
    registry = load_yaml(registry_path)
    active = registry.setdefault("active_invocations", [])

    # Hosted bridge intentionally serializes Primary Orchestrator invocations while
    # retaining up to ten internal workers. Existing healthy work is not cancelled.
    if active:
        report = repo / f"logs/runs/{invocation_id}.md"
        append_log(report, f"# {invocation_id}")
        append_log(report, f"- started_at: {iso(stamp)}")
        append_log(report, "- outcome: NOOP_CONCURRENCY_LIMIT_WITH_EVIDENCE")
        append_log(report, f"- active_invocations_seen: {len(active)}")
        return 0

    entry: dict[str, Any] = {
        "invocation_id": invocation_id,
        "execution_state": "RUNNING",
        "health_state": "ACTIVE",
        "started_at": iso(stamp),
        "completed_at": None,
        "heartbeat_at": iso(stamp),
        "last_progress_at": iso(stamp),
        "last_lane_activity_at": iso(stamp),
        "active_lane_count": 0,
        "coordinator_phase": "BOOTSTRAPPING",
        "current_backlog_item": "MULTI_STREAM_BL001_BL002_BL008",
        "current_work_unit": "HOSTED_RUNTIME_PREFLIGHT",
        "progress_fingerprint": "HOSTED_RUNNER_START",
        "blocked_reason": None,
        "recovery_action": None,
        "workers_started": 0,
        "claims_created": 0,
        "canonical_progress_delta": 0,
        "bootstrap_acknowledged": True,
        "outcome": None,
    }
    active.append(entry)
    save_yaml(registry_path, registry)

    log_path = repo / f"logs/runs/{invocation_id}.md"
    append_log(log_path, f"# {invocation_id}")
    append_log(log_path, f"- START: {iso(stamp)}")
    append_log(log_path, f"- control_branch: {CONTROL_BRANCH}")
    append_log(log_path, f"- frozen_source: {FROZEN_SOURCE}")

    outcomes: dict[str, Any] = {}
    blockers: list[str] = []
    workers_started = 0
    claims_created = 0
    canonical_delta = 0

    # BL-001: execute only when the private frozen source checkout is present.
    source_available = os.environ.get("CYLINDER_SOURCE_AVAILABLE", "false").lower() == "true"
    source_root = Path(os.environ.get("CYLINDER_SOURCE_ROOT", ""))
    if source_available and source_root.exists():
        claims_created += 1
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
                    if payload.get("state") == "ATOMIC_PROJECTION_PUBLISHED":
                        canonical_delta = 11
                except Exception:
                    pass
            else:
                blockers.append("BL001_ATOMIC_PROJECTION_FAILED")
        else:
            blockers.append("BL001_ATOMIC_DRY_RUN_FAILED")
    else:
        blockers.append("BL001_PRIVATE_FROZEN_SOURCE_CHECKOUT_UNAVAILABLE")
        outcomes["BL-001"] = {
            "state": "BLOCKED_SOURCE_RUNTIME_CREDENTIAL",
            "required_secret": "CYLINDER_SOURCE_TOKEN",
        }

    # BL-002: hosted runner proves source availability only. Semantic Story generation
    # remains Primary Automation Tool work; it must not invent field meaning.
    outcomes["BL-002"] = {
        "state": "SOURCE_RUNTIME_AVAILABLE" if source_available and source_root.exists() else "SOURCE_RUNTIME_UNAVAILABLE",
        "next_action": "CONTINUE_RELEASE_1_UI_SOURCE_ANALYSIS_WITH_PRIMARY_AUTOMATION_TOOL",
        "auto_approval": False,
    }

    # BL-008: run only V1 through the existing Maven/Flyway project when all runtime
    # secrets and the private source checkout are available. No manual SQL fallback.
    neon_url = os.environ.get("NEON_JDBC_URL", "")
    neon_user = os.environ.get("NEON_DB_USER", "")
    neon_password = os.environ.get("NEON_DB_PASSWORD", "")
    if source_available and source_root.exists() and neon_url and neon_user and neon_password:
        claims_created += 1
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
        info_before = run(mvn + ["flyway:info"], module)
        outcomes["BL-008_info_before"] = {**info_before, "command": ["mvn", "...", "flyway:info"]}
        if info_before["returncode"] == 0:
            migrate = run(mvn + ["flyway:migrate"], module)
            outcomes["BL-008_migrate_V1"] = {**migrate, "command": ["mvn", "...", "-Dflyway.target=1", "flyway:migrate"]}
            if migrate["returncode"] == 0:
                info_after = run(mvn + ["flyway:info"], module)
                outcomes["BL-008_info_after"] = {**info_after, "command": ["mvn", "...", "flyway:info"]}
                if info_after["returncode"] != 0:
                    blockers.append("BL008_POST_MIGRATION_FLYWAY_INFO_FAILED")
            else:
                blockers.append("BL008_V1_FLYWAY_MIGRATE_FAILED")
        else:
            blockers.append("BL008_FLYWAY_INFO_FAILED")
    else:
        missing = []
        if not source_available or not source_root.exists():
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

    completed = now()
    entry["completed_at"] = iso(completed)
    entry["heartbeat_at"] = iso(completed)
    entry["last_progress_at"] = iso(completed)
    entry["last_lane_activity_at"] = iso(completed)
    entry["active_lane_count"] = 0
    entry["workers_started"] = workers_started
    entry["claims_created"] = claims_created
    entry["canonical_progress_delta"] = canonical_delta
    entry["coordinator_phase"] = "SYNCHRONIZED_TERMINAL_HANDOFF"
    entry["blocked_reason"] = "; ".join(blockers) if blockers else None
    entry["recovery_action"] = "RESOLVE_RECORDED_RUNTIME_BLOCKERS_THEN_REFIRE" if blockers else "CONTINUE_NEXT_ELIGIBLE_WORK"
    entry["execution_state"] = "PARTIAL_CONTINUE_REQUIRED" if blockers else "PROGRESSED"
    entry["health_state"] = "TERMINAL_HANDOFF"
    entry["progress_fingerprint"] = f"HOSTED_RUNNER_workers_{workers_started}_claims_{claims_created}_delta_{canonical_delta}"
    entry["outcome"] = entry["execution_state"]

    # Move terminal invocation out of active set and prepend to recent history.
    registry["active_invocations"] = [x for x in active if x.get("invocation_id") != invocation_id]
    recent = registry.setdefault("recent_completed_invocations", [])
    recent.insert(0, entry)
    registry["recent_completed_invocations"] = recent[:20]
    registry["max_concurrent_invocations"] = 1
    save_yaml(registry_path, registry)

    result_path = repo / "backlog/runtime/hosted-runner/latest-result.yaml"
    save_yaml(result_path, {
        "invocation_id": invocation_id,
        "started_at": iso(stamp),
        "completed_at": iso(completed),
        "outcome": entry["outcome"],
        "workers_started": workers_started,
        "claims_created": claims_created,
        "canonical_progress_delta": canonical_delta,
        "blockers": blockers,
        "stream_outcomes": outcomes,
    })
    append_log(log_path, f"- END: {iso(completed)}")
    append_log(log_path, f"- outcome: {entry['outcome']}")
    append_log(log_path, f"- workers_started: {workers_started}")
    append_log(log_path, f"- claims_created: {claims_created}")
    append_log(log_path, f"- canonical_progress_delta: {canonical_delta}")
    if blockers:
        append_log(log_path, "- blockers:")
        for blocker in blockers:
            append_log(log_path, f"  - {blocker}")

    print(json.dumps({
        "invocation_id": invocation_id,
        "outcome": entry["outcome"],
        "workers_started": workers_started,
        "claims_created": claims_created,
        "canonical_progress_delta": canonical_delta,
        "blockers": blockers,
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
