# Cylinder Orchestrator Invocation Health and Recovery Architecture

## Objective

A Cylinder production invocation must be classified from observable health evidence, not from a `RUNNING` flag alone. The framework must distinguish healthy execution, healthy non-worker coordination, durable blocking, stale ownership and genuine no-progress/stuck execution before deciding whether a later trigger should NOOP, recover, or start different work.

## Core rule

**A lease or invocation-registry state proves ownership, not liveness. A fresh heartbeat proves liveness. Recent durable progress or an explicit governed phase proves useful activity.**

## Required runtime fields

Every active invocation records at minimum:

- `invocation_id`
- `execution_state`
- `health_state`
- `acquired_at`
- `heartbeat_at`
- `last_progress_at`
- `last_lane_activity_at`
- `active_lane_count`
- `coordinator_phase`
- `current_backlog_item`
- `current_work_unit`
- `progress_fingerprint`
- `blocked_reason`
- `recovery_action`

Workers may emit their own heartbeats, but worker heartbeats never replace the Primary Orchestrator heartbeat.

## Default timing thresholds

| Signal | Default |
|---|---:|
| Orchestrator heartbeat interval | 60 seconds |
| STALE threshold | 5 minutes without heartbeat |
| STUCK threshold | 10 minutes without meaningful progress while heartbeat remains fresh |
| Productive assignment target | 30 minutes |

Total invocation runtime alone never proves stale or stuck. A healthy long-running task may exceed the productive assignment target.

## Health states

### ACTIVE

Heartbeat is fresh and either worker activity or recent meaningful durable progress is present.

### IDLE_BUT_HEALTHY

Heartbeat is fresh, worker lanes may be zero, and the coordinator is performing legitimate orchestration such as planning, aggregation, validation, synchronization, replanning or recovery. This state is time-bounded by the no-progress threshold.

### BLOCKED

Every work item owned by the invocation has a durable explicit blocker and there is no other eligible unclaimed work that the invocation can safely take. The invocation should checkpoint and terminate cleanly rather than remain `RUNNING` indefinitely.

### STALE

The invocation is recorded as running but its Primary Orchestrator heartbeat is older than the stale threshold. Stale ownership must be recovered fail-closed before another invocation reclaims the work.

### STUCK

The Primary Orchestrator heartbeat is fresh, so the process appears alive, but the durable progress fingerprint has not changed for longer than the stuck threshold and there is no explicit blocker justifying the lack of progress.

### RECOVERING

Fail-closed stale/stuck recovery is actively validating workers, claims, partial output and synchronization state.

### COMPLETE

The invocation's terminal checkpoint is durable, claims are released and its capacity no longer blocks later triggers.

## Why zero active lanes is not enough

`active_lane_count: 0` has several valid meanings:

- planning the next safe task;
- aggregating worker evidence;
- validating evidence;
- serializing shared SSOT;
- retrying PENDING_SYNC;
- recovering interrupted work;
- all work is blocked and the coordinator is preparing a clean exit.

Therefore zero lanes is interpreted together with heartbeat age, coordinator phase, last-progress age and blocker state.

## Health evaluation decision tree

```text
RUNNING INVOCATION
      |
      v
heartbeat fresh? ---------------- NO ---> STALE ---> FAIL-CLOSED RECOVERY
      |
     YES
      |
      v
explicit durable blocker for all owned work
and no other eligible work? ----- YES ---> BLOCKED ---> CHECKPOINT + EXIT
      |
     NO
      |
      v
meaningful progress within 10 min? --- YES ---> ACTIVE / IDLE_BUT_HEALTHY
      |
     NO
      |
      v
STUCK ---> DIAGNOSE TASK/EXECUTOR ---> RECOVER OR CONVERT TO BLOCKED
```

## Progress fingerprint

The progress fingerprint must change only for meaningful durable state changes, for example:

- accepted matrix row count/fingerprint changes;
- Story disposition or approved evidence changes;
- database requirement state changes;
- executor result becomes terminal and validated;
- work-unit state changes;
- synchronization state advances;
- blocker classification changes.

Heartbeat writes alone must not change the progress fingerprint or `last_progress_at`.

## Trigger behavior

Before a manual or scheduled trigger decides to NOOP, start a parallel invocation, or recover work, it evaluates every recorded running invocation:

- `ACTIVE` / `IDLE_BUT_HEALTHY`: respect normal concurrency and work-claim rules;
- `STALE`: recover stale ownership before counting it as live capacity;
- `STUCK`: diagnose/recover without duplicating claimed work;
- `BLOCKED`: finalize the old invocation and release its capacity;
- `COMPLETE`: ignore it for concurrency capacity.

A trigger must never report only `RUNNING`. It must report both execution and health state, such as `RUNNING / ACTIVE`, `RUNNING / IDLE_BUT_HEALTHY`, `RUNNING / STALE`, or `RUNNING / STUCK`.

## Stale recovery

1. Prove the Primary Orchestrator heartbeat exceeded the stale threshold.
2. Verify whether any executor/worker still owns live task execution.
3. Preserve closed/validated durable evidence.
4. Reject incomplete partial output.
5. Persist the recovery checkpoint.
6. Release stale work claims only after evidence is durable.
7. Mark the old invocation recovered.
8. Permit later invocation to reclaim only eligible recovered work.

## Stuck recovery

1. Persist stuck diagnosis including the unchanged progress fingerprint and last-progress timestamp.
2. Do not duplicate the same claimed task.
3. Isolate the executor/task proven to be non-progressing.
4. Preserve healthy sibling executors.
5. Recover/retry only according to execution-journal idempotency rules.
6. If the true cause is an external dependency, convert the task/invocation to `BLOCKED` rather than entering a restart loop.

## Status reporting

Every production-fire status must show:

| Field | Example |
|---|---|
| Execution state | RUNNING |
| Health state | ACTIVE / IDLE_BUT_HEALTHY / STALE / STUCK / BLOCKED |
| Heartbeat age | 34 seconds |
| Time since meaningful progress | 3 minutes 10 seconds |
| Active lanes | 0–10 |
| Coordinator phase | VALIDATING |
| Current work | BL-002 / WU-BL002-... |
| Recovery/blocker | NONE or exact reason |

This allows both the scheduler and the user to distinguish a healthy long-running fire from a zombie lease.

## Safety rules

- Never duplicate claimed work while invocation health is uncertain.
- Never classify an invocation stale only because it exceeded 30 minutes.
- Never classify zero worker lanes as stuck without checking coordinator activity.
- Never keep a fully blocked invocation in `RUNNING` merely to satisfy a minimum duration.
- Never restart PENDING_SYNC or already-validated work from scratch.
- Always prefer explicit recovery evidence over assumptions.
