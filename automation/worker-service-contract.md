# Worker Service Contract

## Purpose

Every orchestration lane executes an assigned Job using the same three-stage lifecycle:

```text
init() -> service() -> close()
```

The lifecycle is wrapped by mandatory log-boundary events defined in `governance/execution-lifecycle-logging.yaml`.

## Mandatory lifecycle and logging sequence

A lane may not skip the required boundary records.

```text
LANE_INIT_START
   |
   v
init()
   |
   v
LANE_INIT_END
   |
   +-- BLOCKED_BEFORE_SERVICE -> close() -> LANE_CLOSE_END
   |
   v
LANE_SERVICE_START
   |
   v
service()
   |
   v
LANE_SERVICE_END
   |
   v
close()
   |
   v
LANE_CLOSE_END
```

The required logging is not optional progress reporting. It is part of the execution contract.

## START log task rule

Every lane START record must identify the exact task that is about to execute.

- `LANE_INIT_START` contains `task` and `task_description` before `init()` begins.
- `LANE_SERVICE_START` repeats the same task identity and lists the assigned Actions before `service()` begins.
- Generic values such as `run traceability` are not sufficient when the real task is known. Prefer specific names such as `Trace VehicleTripController endpoint family` or `Resolve Supplier search service to final dependency`.
- The task identity must reconcile with the current Work Unit and `lane-status.yaml` assignment.
- If the task is missing, ambiguous or inconsistent, the phase must not start.

## Transient individual lane-log rule

Each lane writes its lifecycle boundary evidence to a lane-specific log while the Orchestrator invocation is active. That file exists only to make parallel logging safe.

```text
logs/runs/INVOCATION-<timestamp>-LANE-<nn>.md
```

The individual lane log is **transient**:

1. it may exist while the invocation is ACTIVE;
2. it must contain complete CLOSE or recovery-close evidence before the lane can be treated as finished;
3. it may remain temporarily after lane close so the same invocation can reuse the lane and the coordinator can later aggregate all lifecycle evidence;
4. during Orchestrator closure, its complete lifecycle evidence must be accumulated into the invocation aggregate log and meaningful audit content synchronized to `logs/automation-log.md`;
5. only after successful accumulation verification may the individual lane log be deleted;
6. `ORCHESTRATOR_INVOCATION_END` is not allowed while any individual lane log remains.

A lane run therefore produces durable audit evidence through the invocation aggregate/shared audit, not by leaving the individual per-lane file permanently in the repository.

## Fail-closed rules

1. If `LANE_INIT_START` cannot be persisted, `init()` must not execute.
2. If `LANE_INIT_START` does not identify the exact task, `init()` must not execute.
3. `service()` may start only after `LANE_INIT_END = INITIALIZED` is persisted.
4. If `LANE_SERVICE_START` cannot be persisted, `service()` must not execute.
5. If `LANE_SERVICE_START` does not identify the exact task and assigned Actions, `service()` must not execute.
6. After `service()` returns, `LANE_SERVICE_END` must be persisted with the actual service result.
7. `close()` still runs for safety even if post-service logging encounters a failure.
8. The lane may not be released/reused until `LANE_CLOSE_END` or coordinator recovery-close evidence is persisted.
9. The execution result is not accepted until `QG-LOG-001` reconciles the lifecycle.
10. Invocation closure is blocked until the lane log is accumulated, verified and deleted.

## 1. init()

`init()` prepares one lane to perform one assigned Job. It does not perform the actual engineering/business work.

### Before init()

The lane persists `LANE_INIT_START` with:

- timestamp;
- invocation ID;
- backlog item;
- Work Unit;
- lane ID;
- exact task;
- plain-English task description;
- Worker Input when applicable;
- run ID and attempt;
- target repository;
- source baseline;
- expected output/completion rule.

### init() confirms

- Workflow/Job identity;
- target repository and baseline;
- dependencies and resource locks;
- expected output;
- completion check;
- assigned Actions.

### After init()

The lane persists `LANE_INIT_END` with one result:

- `INITIALIZED` - `service()` may start;
- `BLOCKED_BEFORE_SERVICE` - skip `service()` and go to `close()`.

## 2. service()

`service()` performs only the Actions authorized by the Job/Work Unit.

### Before service()

The lane persists `LANE_SERVICE_START` identifying the exact task, task description and Actions that are about to run.

### During service()

Optional meaningful progress records/heartbeats may be written, for example:

- `LANE_SERVICE_PROGRESS`;
- `LANE_HEARTBEAT`;
- `LANE_BLOCKER_DETECTED`.

The lane must not log low-level noise as the main human-readable narrative.

### After service()

Immediately after `service()` returns, persist `LANE_SERVICE_END` with one result:

- `COMPLETED`;
- `PARTIAL`;
- `BLOCKED`;
- `FAILED`.

It must state Actions completed/not completed, evidence summary, and blocker/failure explanation when applicable.

## 3. close()

`close()` ends the lane Job attempt. It must run exactly once after a started attempt, including when `service()` did not start.

### close() records internally

- lane/Workflow/Job/run/attempt;
- start/end times;
- task performed;
- init result;
- whether service ran;
- completed/not-completed Actions;
- outputs/evidence;
- blocker/failure;
- final result;
- next action.

### After close()

The lane persists `LANE_CLOSE_END` with `Log State: CLOSED`.

Only after this record is persisted may the coordinator release the lane to IDLE or assign new work within the same invocation.

If the lane stops unexpectedly before close, the coordinator performs recovery closure with `RESULT_NOT_CONFIRMED` and persists recovery evidence before release.

The per-lane file is **not deleted by the lane itself**. The coordinator deletes it only during invocation closure after successful accumulation verification.

## Relationship to lane-status.yaml

The lifecycle and Lane SSOT must agree:

```text
LANE_INIT_START      -> lane ASSIGNED/INITIALIZING + exact task
LANE_INIT_END        -> lane INITIALIZING or BLOCKED
LANE_SERVICE_START   -> lane WORKING + same task
LANE_SERVICE_END     -> lane WORKING/BLOCKED/CLOSING
LANE_CLOSE_END       -> lane may be released/reused in same invocation
INVOCATION AGGREGATION PASS -> individual lane log may be deleted
```

A historical aggregate log never overrides current `lane-status.yaml`, but the current lane state must reconcile with the most recent lifecycle event for its open run.

## Plain-English blocker rule

If execution stops, the lane explains what it was trying to do, where it stopped, what is missing, why continuing would require guessing/unsafe action, and what alternatives or decision are needed.

## Worker ownership

A lane owns only its current assigned Job attempt and its transient per-run lifecycle log. The coordinator owns invocation-wide log accumulation, shared audit log ordering, final status changes, verification gates, retry/replan decisions, lane-log deletion and invocation closure.

## Completion rule

The Worker may return `COMPLETED` only when all required Actions and completion checks pass. Otherwise use `PARTIAL`, `BLOCKED` or `FAILED`.

A result is not accepted as final input until the run is closed, the declared result contract validates, and required lifecycle logging passes `QG-LOG-001`. The Orchestrator invocation itself is not closed until all individual lane logs have been accumulated and removed.
