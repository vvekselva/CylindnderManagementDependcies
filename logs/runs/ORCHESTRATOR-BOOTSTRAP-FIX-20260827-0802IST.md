# Cylinder Orchestrator Bootstrap Reliability Fix

Timestamp: 2026-08-27T08:02:34+05:30

## Observed failure

The task scheduler recorded a fire, but the durable Orchestrator state did not progress. Invocation `CYLINDER-PRODUCTION-FIRE-20260827-070139IST` remained at `STARTUP_HANDSHAKE`, with the same initial heartbeat and progress timestamp, zero active lanes and zero claims. A scheduler `last_run_time` therefore did not prove that the Orchestrator execution loop was alive.

## Root cause

The framework required START and heartbeat but did not require the scheduled execution to read those writes back and prove a work claim before the run was considered `ORCHESTRATOR_STARTED`. This left an unacknowledged gap between scheduler trigger and backlog ownership.

## Implemented fix

- Added `governance/orchestrator-bootstrap-gate.yaml`.
- Added `architecture/orchestrator-bootstrap-transaction.md`.
- Updated `governance/production-fire-progress-guarantee.yaml` to version 2 with START/heartbeat/claim read-back gates.
- Recovered and terminalized stale invocation `CYLINDER-PRODUCTION-FIRE-20260827-070139IST`; canonical backlog state was unchanged.
- Disabled the competing legacy Cylinder hourly scheduler.
- Updated the authoritative Cylinder hourly scheduler to require the bootstrap acknowledgement transaction before backlog execution.
- While BL-001 remains at 123 + 11, the required first BL-001 claim is `BL-001|WU-BL001-001|ATOMIC-134-PROJECTION`, executed by `automation/bl001-canonical-projection-engine.py`.

## Required next-fire evidence

A correct next fire must durably prove, in order:

1. new invocation START;
2. START read-back verification;
3. initial heartbeat;
4. heartbeat read-back verification;
5. stale/stuck prior invocation reconciliation;
6. BL-001 atomic projection claim when eligible;
7. claim read-back ownership verification;
8. `coordinator_phase: ORCHESTRATOR_STARTED`;
9. execution of the BL-001 Canonical Projection Engine;
10. truthful terminal state (`PARTIAL_CONTINUE_REQUIRED`, `BLOCKED`, or `COMPLETE`) based on durable evidence.

Scheduler invocation by itself is no longer accepted as production progress.
