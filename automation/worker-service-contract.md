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

- `LANE_INIT_START` must contain `task` and `task_description` before `init()` begins.
- `LANE_SERVICE_START` must repeat the same task identity and list the assigned Actions before `service()` begins.
- A generic value such as `run traceability` is not sufficient when the real task is known. Prefer specific names such as `Trace VehicleTripController endpoint family` or `Resolve Supplier search service to final dependency`.
- The task identity must reconcile with the current Work Unit and with the assignment stored in `lane-status.yaml`.
- If the task is missing, ambiguous or inconsistent, the phase must not start.

## Fail-closed rules

1. If `LANE_INIT_START` cannot be persisted, `init()` must not execute.
2. If `LANE_INIT_START` does not identify the exact task, `init()` must not execute.
3. `service()` may start only after `LANE_INIT_END = INITIALIZED` is persisted.
4. If `LANE_SERVICE_START` cannot be persisted, `service()` must not execute.
5. If `LANE_SERVICE_START` does not identify the exact task and assigned Actions, `service()` must not execute.
6. After `service()` returns, `LANE_SERVICE_END` must be persisted with the actual service result.
7. `close()` still runs for safety even if post-service logging encounters a failure.
8. The lane is not reusable until `LANE_CLOSE_END` or a coordinator recovery-close record is persisted.
9. Missing lifecycle logs make the result ineligible for final acceptance until `QG-LOG-001` is satisfied.

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

Only after this record is persisted may the coordinator release the lane to IDLE or assign new work.

If the lane stops unexpectedly before close, the coordinator performs recovery closure with `RESULT_NOT_CONFIRMED` and persists the recovery close before release.

## Relationship to lane-status.yaml

The lifecycle and Lane SSOT must agree:

```text
LANE_INIT_START      -> lane ASSIGNED/INITIALIZING + exact task
LANE_INIT_END        -> lane INITIALIZING or BLOCKED
LANE_SERVICE_START   -> lane WORKING + same task
LANE_SERVICE_END     -> lane WORKING/BLOCKED/CLOSING
LANE_CLOSE_END       -> lane may be released to IDLE
```

A historical log never overrides current `lane-status.yaml`, but the current lane state must reconcile with the most recent lifecycle event for its open run.

## Plain-English blocker rule

If execution stops, the lane explains what it was trying to do, where it stopped, what is missing, why continuing would require guessing/unsafe action, and what alternatives or decision are needed.

## Worker ownership

A lane owns only its current assigned Job attempt and its own per-run lifecycle log artifact. The coordinator owns shared-file consolidation, shared audit log ordering, final status changes, verification gates, retry/replan decisions and lane release.

## Completion rule

The Worker may return `COMPLETED` only when all required Actions and completion checks pass. Otherwise use `PARTIAL`, `BLOCKED` or `FAILED`.

A result is not accepted as final input until the run is closed, the declared result contract validates, and required lifecycle logging passes `QG-LOG-001`.
