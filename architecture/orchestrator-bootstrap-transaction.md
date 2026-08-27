# Cylinder Orchestrator Bootstrap Transaction

## Problem fixed

A scheduled task can report a new `last_run_time` even when the Cylinder Orchestrator never reaches backlog execution. The scheduler trigger and the Orchestrator execution loop are therefore separate states. Previously the framework required START and heartbeat, but did not require the running task to read those writes back and prove a work claim before declaring the Orchestrator started.

The failure observed on 27 Aug 2026 demonstrated the gap: a START record remained at `STARTUP_HANDSHAKE`, its heartbeat never advanced, there were zero active lanes and no work claim, while a later scheduler fire was still recorded by the task system.

## New rule

`SCHEDULER_FIRED` is not `ORCHESTRATOR_STARTED`.

The bootstrap is a transaction:

```text
Scheduler fire
    |
    v
Pin chore/rename-dependency-files
    |
    v
Generate unique invocation ID
    |
    v
Persist START + durable START log + initial heartbeat
    |
    v
READ BACK and verify own START + fresh heartbeat
    |
    v
Recover stale/stuck prior invocations
    |
    v
Select eligible work
    |
    v
Persist work claim
    |
    v
READ BACK and verify claim ownership
    |
    v
ORCHESTRATOR_STARTED
    |
    v
Dispatch / validate / replan / refill
```

If any mandatory bootstrap step fails, the fire is classified as a bootstrap/start failure and must not be reported as production progress.

## BL-001 fast path

While the 123 + 11 canonical projection remains pending, the first eligible BL-001 claim is:

`BL-001|WU-BL001-001|ATOMIC-134-PROJECTION`

The executor is:

`automation/bl001-canonical-projection-engine.py`

After a verified claim, the run executes the transactional 134-key projection and proceeds to WU-BL001-002 and WU-BL001-003 as the remaining execution window and gates permit.

## Stale invocation recovery

A previous invocation whose Primary Orchestrator heartbeat is older than 300 seconds is not allowed to remain an active RUNNING owner. Before a new work claim is accepted, the new invocation must prove the old owner is stale, prove that no worker/executor still owns its claimed work, preserve durable completed evidence, reject incomplete partial output, persist the recovery, and release only claims proven safe to release.

## Bootstrap acknowledgement

The Orchestrator can set `coordinator_phase: ORCHESTRATOR_STARTED` only after all of these are true:

- its own START record was read back from the authoritative registry;
- its initial heartbeat was read back and is fresh;
- stale/stuck prior invocations were reconciled;
- if eligible work exists, its global work claim was read back and is owned by the same invocation;
- if no eligible work exists, a clean terminal state was durably verified instead.

This prevents the scheduler UI and the backlog runtime from reporting contradictory states.

## Failure classes

- `SCHEDULER_TO_ORCHESTRATOR_START_FAILURE`: scheduler fire but no durable current invocation START.
- `ORCHESTRATOR_BOOTSTRAP_HEARTBEAT_FAILURE`: START exists but initial heartbeat is missing.
- `ORCHESTRATOR_BOOTSTRAP_ACK_FAILURE`: START/heartbeat cannot be read back consistently.
- `ORCHESTRATOR_BOOTSTRAP_RECOVERY_FAILURE`: stale prior ownership cannot be safely reconciled.
- `ORCHESTRATOR_BOOTSTRAP_CLAIM_FAILURE`: eligible work exists but no claim can be persisted.
- `ORCHESTRATOR_BOOTSTRAP_CLAIM_ACK_FAILURE`: a claim write cannot be read back and verified.

All bootstrap failures are fail-closed for backlog mutation and are not production success.
