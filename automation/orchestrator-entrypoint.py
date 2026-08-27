#!/usr/bin/env python3
"""Hosted Cylinder orchestrator bridge.

This entrypoint runs on a real process host (for example a GitHub-hosted runner).
It proves the runtime prerequisites, preserves the existing governance contract,
and executes deterministic backlog work without treating a scheduler callback as
the process host.

The script intentionally fails closed. It does not fabricate completion and it
never performs a BL-008 SQL fallback when Flyway is unavailable.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

CONTROL_BRANCH = "chore/rename-dependency-files"
FROZEN_SOURCE = "3ae6e61442132d94a307275b08dd65fcef228d89"
BL001_ENGINE = "automation/bl001-canonical-projection-engine.py"


def run(cmd: list[str], cwd: Path | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, check=check)


def command_exists(name: str) -> bool:
    return shutil.which(name) is not None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--control-root", default=".")
    ap.add_argument("--source-root", required=True)
    ap.add_argument("--mode", choices=["manual", "scheduled"], default="manual")
    ap.add_argument("--bl001", action="store_true")
    ap.add_argument("--bl002", action="store_true")
    ap.add_argument("--bl008", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    control = Path(args.control_root).resolve()
    source = Path(args.source_root).resolve()
    invocation_id = os.environ.get("CYLINDER_INVOCATION_ID") or (
        "CYLINDER-HOSTED-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    )

    result: dict[str, object] = {
        "invocation_id": invocation_id,
        "mode": args.mode,
        "control_branch": CONTROL_BRANCH,
        "frozen_source": FROZEN_SOURCE,
        "runtime": {
            "python": sys.version.split()[0],
            "git": command_exists("git"),
            "node": command_exists("node"),
            "java": command_exists("java"),
            "maven": command_exists("mvn"),
        },
        "streams": {},
    }

    if not (control / "backlog/orchestrator-run-config.yaml").exists():
        raise RuntimeError("control repository is not mounted")
    if not (source / "cylinder.datascripts/pom.xml").exists():
        raise RuntimeError("CylinderManagement source repository is not mounted")

    source_head = run(["git", "rev-parse", "HEAD"], cwd=source).stdout.strip()
    result["source_head"] = source_head
    if source_head != FROZEN_SOURCE:
        raise RuntimeError(f"source checkout mismatch: expected {FROZEN_SOURCE}, got {source_head}")

    # BL-001: execute the existing transactional projection engine on a real filesystem.
    if args.bl001:
        engine = control / BL001_ENGINE
        if not engine.exists():
            raise RuntimeError(f"missing BL-001 engine: {BL001_ENGINE}")
        cmd = [sys.executable, str(engine), "--repo-root", str(control)]
        if args.dry_run:
            cmd.append("--dry-run")
        proc = run(cmd, cwd=control, check=False)
        result["streams"]["BL-001"] = {
            "returncode": proc.returncode,
            "stdout": proc.stdout[-8000:],
            "stderr": proc.stderr[-8000:],
        }

    # BL-002 remains source-analysis work. The hosted bridge proves that the exact
    # frozen source is mounted; story-specific workers can consume it under the
    # existing accepted/non-stale-row governance.
    if args.bl002:
        result["streams"]["BL-002"] = {
            "state": "HOSTED_SOURCE_RUNTIME_READY",
            "source_root": str(source),
            "next_action": "RUN_RELEASE_1_UI_SOURCE_ANALYSIS_FROM_ACCEPTED_MATERIALIZED_ROWS",
        }

    # BL-008: prove Flyway/Maven execution capability only. The workflow supplies
    # Neon credentials as runtime environment variables and invokes one target
    # migration at a time. No direct SQL fallback exists here.
    if args.bl008:
        required_env = ["NEON_JDBC_URL", "NEON_DB_USER", "NEON_DB_PASSWORD"]
        missing = [name for name in required_env if not os.environ.get(name)]
        if missing:
            result["streams"]["BL-008"] = {
                "state": "BLOCKED_MISSING_RUNTIME_SECRET",
                "missing": missing,
            }
        elif not command_exists("mvn"):
            result["streams"]["BL-008"] = {"state": "BLOCKED_MAVEN_UNAVAILABLE"}
        else:
            ds = source / "cylinder.datascripts"
            common = [
                "mvn", "-B", "-ntp",
                f"-Ddb.url={os.environ['NEON_JDBC_URL']}",
                f"-Ddb.user={os.environ['NEON_DB_USER']}",
                f"-Ddb.password={os.environ['NEON_DB_PASSWORD']}",
                "-Dflyway.target=1",
            ]
            info = run(common + ["flyway:info"], cwd=ds, check=False)
            validate = run(common + ["flyway:validate"], cwd=ds, check=False)
            migrate_rc = None
            migrate_out = ""
            migrate_err = ""
            if not args.dry_run and info.returncode == 0 and validate.returncode == 0:
                migrate = run(common + ["flyway:migrate"], cwd=ds, check=False)
                migrate_rc = migrate.returncode
                migrate_out = migrate.stdout[-8000:]
                migrate_err = migrate.stderr[-8000:]
            result["streams"]["BL-008"] = {
                "state": "DRY_RUN_VALIDATED" if args.dry_run else "FLYWAY_V1_ATTEMPTED",
                "info_returncode": info.returncode,
                "validate_returncode": validate.returncode,
                "migrate_returncode": migrate_rc,
                "info_stdout": info.stdout[-8000:],
                "info_stderr": info.stderr[-8000:],
                "validate_stdout": validate.stdout[-8000:],
                "validate_stderr": validate.stderr[-8000:],
                "migrate_stdout": migrate_out,
                "migrate_stderr": migrate_err,
            }

    print(json.dumps(result, indent=2))

    # Return failure only for an attempted stream whose deterministic executor failed.
    bl001 = result["streams"].get("BL-001") if isinstance(result["streams"], dict) else None
    if isinstance(bl001, dict) and bl001.get("returncode") not in (None, 0):
        return 2
    bl008 = result["streams"].get("BL-008") if isinstance(result["streams"], dict) else None
    if isinstance(bl008, dict):
        for key in ("info_returncode", "validate_returncode", "migrate_returncode"):
            value = bl008.get(key)
            if value not in (None, 0):
                return 3
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}", file=sys.stderr)
        raise SystemExit(1)
