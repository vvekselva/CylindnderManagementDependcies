# Automation Log Policy

## Purpose

The automation log is the human-readable audit history of what the Orchestrator and execution lanes did. It must be understandable without reading tool-call JSON, raw stack traces or shell output.

The machine-enforced lifecycle event contract is `governance/execution-lifecycle-logging.yaml`.

## Mandatory logging principle

Execution is **log-first at lifecycle boundaries**.

The framework must persist the required boundary record before the corresponding phase is allowed to start. A missing mandatory pre-phase record is a fail-closed condition.

```text
ORCHESTRATOR INVOCATION
  ORCHESTRATOR_INVOCATION_START   <- written before analysis/planning/assignment/execution
        |
        v
  eligible lane execution
        |
        v
  runtime/result synchronization
        |
        v
  ORCHESTRATOR_INVOCATION_END     <- written after all started lanes are closed/recovery-closed

EACH LANE RUN
  LANE_INIT_START                  <- before init()
        |
        v
      init()
        |
        v
  LANE_INIT_END                    <- after init()
        |
        +-- BLOCKED_BEFORE_SERVICE -> close() -> LANE_CLOSE_END
        |
        v
  LANE_SERVICE_START               <- before service()
        |
        v
     service()
        |
        v
  LANE_SERVICE_END                 <- after service()
        |
        v
      close()
        |
        v
  LANE_CLOSE_END                   <- after close(); Log State = CLOSED
```

## Log locations and parallel safety

The shared audit log is:

```text
logs/automation-log.md
```

The coordinator is the only writer to this shared file.

Every Orchestrator invocation also has its own run log:

```text
logs/runs/INV-<invocation-id>-ORCHESTRATOR.md
```

Every lane run has its own run log:

```text
logs/runs/INV-<invocation-id>-<lane-id>-<run-id>.md
```

This lets ten independent lanes persist their own lifecycle evidence without racing to edit one shared file. The coordinator serially consolidates meaningful records into `logs/automation-log.md`.

## Orchestrator invocation START record

`ORCHESTRATOR_INVOCATION_START` is mandatory and must be persisted **before any repository analysis, planning, lane assignment or execution work begins**.

It records at minimum:

- timestamp;
- invocation ID;
- coordinator identity;
- trigger/scheduler source;
- control repository and branch;
- intended backlog-selection policy;
- statement that execution has not yet started.

If this record cannot be persisted, the invocation must not begin application/backlog execution.

Example:

> The primary Cylinder Orchestrator invocation has started. No lane work has started yet. The coordinator will load the control repository, validate Level 1/2/3 SSOT and gates, select only eligible work, and then assign safe independent tasks.

## Orchestrator invocation END record

`ORCHESTRATOR_INVOCATION_END` is mandatory after all started lanes are CLOSED or recovery-closed and the canonical runtime has been synchronized.

It records at minimum:

- timestamp and invocation ID;
- selected backlog item;
- Work Units touched;
- lanes used;
- work completed;
- blockers or valid stop condition;
- runtime/status synchronization result;
- final invocation result;
- next action.

An END record is mandatory even when no eligible work ran, the invocation failed, or a hard blocker stopped execution.

## Lane INIT boundary records

Before `init()` executes, the lane must persist `LANE_INIT_START`.

It identifies:

- invocation ID;
- backlog item and Work Unit;
- lane;
- task;
- Worker Input when applicable;
- run ID and attempt;
- source baseline;
- what the lane is about to initialize and why.

Immediately after `init()` returns, the lane persists `LANE_INIT_END` with either:

- `INITIALIZED`; or
- `BLOCKED_BEFORE_SERVICE`.

`service()` may not start unless `LANE_INIT_END = INITIALIZED` has been persisted.

## Lane SERVICE boundary records

Immediately before `service()` executes, the lane persists `LANE_SERVICE_START` containing the task and assigned Actions.

Immediately after `service()` returns, the lane persists `LANE_SERVICE_END` containing:

- service result: `COMPLETED`, `PARTIAL`, `BLOCKED` or `FAILED`;
- Actions completed/not completed;
- meaningful evidence summary;
- blocker/failure explanation when applicable.

Meaningful progress events and heartbeats may be logged between these boundaries, but they do not replace the mandatory START/END records.

## Lane CLOSE boundary record

`close()` always runs after a started lane attempt, including blocked or failed attempts and `BLOCKED_BEFORE_SERVICE`.

After `close()` completes, the lane must persist `LANE_CLOSE_END` with:

- final result;
- outputs/evidence;
- unresolved/blocker information;
- next action;
- end time;
- `Log State: CLOSED`.

A lane is **not reusable** until its persisted close record exists. If a lane disappears before close, the coordinator writes a recovery close with `RESULT_NOT_CONFIRMED` before releasing the lane.

## QG-LOG-001 - Lifecycle Logging Completeness

`QG-LOG-001` passes only when:

1. every in-scope invocation has START and END records;
2. every lane run has the applicable boundary events in the required order;
3. no phase starts before its mandatory START record;
4. no lane is released without a persisted close/recovery-close record;
5. runtime/lane-status and run logs reconcile;
6. no orphan OPEN lifecycle event remains.

Historical runs before activation of this contract remain legacy evidence and are not retroactively invalidated. All new invocations/runs must comply.

## Plain-English content rule

Every meaningful log must explain:

- what is about to happen;
- why it is needed;
- what happened;
- what changed;
- what evidence supports the result;
- what blocked progress, if anything;
- why unsafe continuation was avoided;
- what happens next.

Do not make raw tool JSON, internal messages, secrets, long stack traces or low-level protocol output the primary log content.

## Immutability and corrections

A completed CLOSED lifecycle event must not be silently rewritten to make history cleaner. Corrections are new records that identify the earlier event and explain what is being corrected.

## Story generation

`automation/generate-automation-story.py` reads `logs/automation-log.md` and produces `logs/automation-story.md`. The story generator must preserve PARTIAL/BLOCKED/FAILED/RESULT_NOT_CONFIRMED meaning and must not invent missing facts.
