# Scheduler-to-Orchestrator Handoff Reliability

**Effective:** 31 August 2026  
**Status:** ACTIVE  
**Problem:** Scheduled-task `last_run_time` advanced after the latest durable Production Fire, but no matching scheduler receipt, live-run start, event stream, or terminal run record was durably created.

## Root-cause boundary

The proven failure is at the scheduler-to-orchestrator observability boundary. A Scheduled Task `last_run_time` proves that the scheduler attempted/delivered an invocation. It does **not** prove that the Production Fire entered the governed orchestration lifecycle, created a run ID, started workers, checkpointed, or terminalized.

For the observed gap, there is insufficient durable evidence to prove a deeper platform/runtime cause because the old architecture had no durable scheduler-fire acknowledgement before normal orchestration startup. The absence of that acknowledgement made the pre-start failure interval unobservable.

## Architectural correction

Every Production Fire scheduler invocation must use this lifecycle:

`SCHEDULER FIRE -> DURABLE TRIGGER RECEIPT -> RUN ID ALLOCATION -> RECEIPT/RUN LINK -> LIVE-RUN + INVOCATION_STARTED EVENT -> RECONCILE -> PLAN/CLAIM/DISPATCH -> CHECKPOINT/HEARTBEAT -> TERMINATION -> RECEIPT TERMINAL UPDATE`

The first orchestrator tool write must create:

`.orchestrator/scheduler-fire-receipts/<scheduler-task>/<fire-id>.yaml`

with scheduler task name, observed/scheduled fire time, receipt persistence time, `TRIGGER_RECEIVED`, and intended scope. After run-ID allocation, the receipt must link the run ID, live-run path and event stream. At terminalization, it must record terminal classification and observable termination time.

## Failure classifications

- `SCHEDULER_HANDOFF_NOT_ACKNOWLEDGED`: scheduler `last_run_time` exists but no durable trigger receipt exists.
- `ORCHESTRATOR_START_NOT_CONFIRMED`: receipt exists but no linked live-run / `INVOCATION_STARTED` evidence exists.
- `ORCHESTRATOR_TERMINATION_EVIDENCE_MISSING`: run started but terminal evidence is absent/invalid.
- `TRIGGER_AND_DURABLE_RUN_CONFIRMED`: scheduler fire, receipt, run start and terminal evidence correlate.

## Watchdog contract

The watchdog must correlate Scheduled Task `last_run_time` with scheduler-fire receipts, `.orchestrator/live-run.yaml`, run events, termination records, `.orchestrator/last-run.yaml`, and newer backlog checkpoints. It must report every scheduler fire after the latest durable run and classify the handoff state. It must never call a scheduler `last_run_time` a successful Production Fire by itself.

The progress comparison table must place previous and current durable Production Fire times directly in the column headings and show previous/current values side-by-side. A newer durable checkpoint must be shown separately from Production Fire execution time.

## Recovery rule

The next Production Fire must resolve any unresolved scheduler-handoff/start/termination gap before normal backlog dispatch. A missing trigger receipt is not retroactively fabricated; it is reported as an observability defect. New scheduler invocations must follow the receipt-first contract.

## Quality gate

`QG_TRIGGER`: a scheduled invocation counts as orchestrator execution only after a durable scheduler-fire receipt is linked to a run ID. Scheduler `last_run_time` alone never satisfies this gate.
