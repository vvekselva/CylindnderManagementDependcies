# Automation Log Policy

## Purpose

The automation log is the human-readable audit history of what the Orchestrator and execution lanes did. It must be understandable without reading tool-call JSON, raw stack traces or shell output.

The machine-enforced lifecycle event contract is `governance/execution-lifecycle-logging.yaml`.

## Mandatory logging principle

Execution is **log-first at lifecycle boundaries** and **clean at invocation boundaries**.

The framework persists the required boundary record before the corresponding phase starts. Individual lane logs may exist only while an invocation is active. Before a new invocation begins execution, there must be no leftover individual lane log from a prior invocation. Before an invocation closes, every lane log must be accumulated, verified and removed.

```text
SCHEDULER / MANUAL TRIGGER
        |
        v
PRE-INVOCATION LANE-LOG HYGIENE CHECK
  individual lane logs = 0 ?
        | NO -> recovery/aggregate/delete only; no new execution
        | YES
        v
ORCHESTRATOR_INVOCATION_START
        |
        v
ELIGIBLE LANE EXECUTION
  LANE_INIT_START -> init -> LANE_INIT_END
  LANE_SERVICE_START -> service -> LANE_SERVICE_END
  close -> LANE_CLOSE_END
        |
        v
ALL STARTED LANES CLOSED / RECOVERY-CLOSED
        |
        v
ORCHESTRATOR_LOG_AGGREGATION_START
        |
        +-- accumulate each lane log into invocation aggregate
        +-- consolidate meaningful entries to shared audit
        +-- verify every lane log represented
        +-- delete each accumulated individual lane log
        +-- rescan: individual lane logs = 0
        |
        v
ORCHESTRATOR_LOG_AGGREGATION_END (PASS)
        |
        v
RUNTIME / STATUS SYNCHRONIZATION
        |
        v
ORCHESTRATOR_INVOCATION_END
```

## Log locations and parallel safety

Shared audit log:

```text
logs/automation-log.md
```

The coordinator is the only writer to the shared audit log.

Invocation aggregate log:

```text
logs/runs/INVOCATION-<timestamp>.md
```

Transient individual lane log while the invocation is active:

```text
logs/runs/INVOCATION-<timestamp>-LANE-<nn>.md
```

The lane logs exist only to make parallel lifecycle logging safe. They are **not long-term repository artifacts**. At invocation closure, the coordinator accumulates their complete lifecycle evidence into the invocation aggregate, serializes the meaningful audit summary into `logs/automation-log.md`, verifies the transfer, and deletes the individual lane logs.

## Pre-invocation lane-log hygiene check

Before a new invocation begins repository analysis, planning, lane assignment or backlog/application execution, the coordinator scans `logs/runs/` for files matching the individual-lane pattern.

Required result:

```text
Individual lane logs found: 0
Preflight lane-log hygiene: PASS
```

This is a read-only safety check and may occur before the START record. `ORCHESTRATOR_INVOCATION_START` remains the first persisted execution-audit action.

If any individual lane log exists, the coordinator must **not** start new execution. It enters recovery-only mode:

1. identify the prior invocation/run;
2. verify or recovery-close the lifecycle;
3. accumulate the lane log into the correct invocation aggregate/shared audit;
4. verify the accumulation;
5. delete the lane log;
6. repeat the scan until the count is zero.

Only then may a new invocation proceed.

## Orchestrator invocation START record

`ORCHESTRATOR_INVOCATION_START` is mandatory after the preflight hygiene check and before repository analysis, planning, lane assignment or execution begins.

It records at minimum:

- timestamp and invocation ID;
- coordinator identity and trigger;
- exact coordinator task and task description;
- expected/current Backlog Item and Work Unit;
- control repository and branch;
- intended backlog-selection policy;
- `preflight_individual_lane_log_count: 0`;
- `preflight_lane_log_hygiene_result: PASS`.

If this record cannot be persisted, or the preflight lane-log count is not zero, the invocation must not begin new backlog/application execution.

## Lane lifecycle boundary records

Each lane uses this exact applicable sequence:

```text
LANE_INIT_START        <- before init(); exact task required
init()
LANE_INIT_END          <- immediately after init()
LANE_SERVICE_START     <- before service(); exact task/actions required
service()
LANE_SERVICE_END       <- immediately after service()
close()
LANE_CLOSE_END         <- after close(); Log State = CLOSED
```

If `LANE_INIT_END = BLOCKED_BEFORE_SERVICE`, SERVICE_START and SERVICE_END are omitted, but `close()` and `LANE_CLOSE_END` remain mandatory.

A lane may be reused within the same invocation only after its persisted CLOSE/recovery-close evidence exists. Its individual log remains available until Orchestrator closure so it can be accumulated and verified.

## Orchestrator log aggregation and cleanup

Once every started lane is CLOSED or recovery-closed, the coordinator begins the mandatory aggregation subphase.

### `ORCHESTRATOR_LOG_AGGREGATION_START`

Record:

- invocation ID;
- number and names of individual lane logs detected;
- aggregation target invocation log.

### Accumulation requirements

For each individual lane log, the invocation aggregate must preserve enough complete lifecycle evidence to prove:

- lane ID;
- exact task;
- Work Unit;
- run ID / attempt;
- INIT start/end;
- SERVICE start/end when applicable;
- CLOSE/recovery close;
- final result;
- evidence/blocker summary;
- source lane-log identity.

The coordinator then writes the meaningful consolidated audit record to `logs/automation-log.md`.

### Verification before deletion

Before deleting a lane log, the coordinator verifies that the invocation aggregate contains that lane's lifecycle evidence and source identity. Only after successful verification may the individual lane file be deleted.

After all lane logs are processed, the coordinator rescans `logs/runs/`.

Required result:

```text
Individual lane logs accumulated: <count>
Individual lane logs deleted: <same count>
Individual lane logs remaining: 0
Aggregation result: PASS
```

### `ORCHESTRATOR_LOG_AGGREGATION_END`

This record is emitted only when the postcondition is satisfied.

If accumulation, verification or deletion fails, the invocation remains `RECOVERY_REQUIRED/OPEN`; final execution results are not accepted and another invocation may not begin execution.

## Orchestrator invocation END record

`ORCHESTRATOR_INVOCATION_END` is written only after:

1. all started lanes are CLOSED/recovery-closed;
2. `ORCHESTRATOR_LOG_AGGREGATION_END = PASS`;
3. individual lane logs remaining = 0;
4. runtime/status/shared audit synchronization has completed.

The END record includes the selected backlog, Work Units touched, lanes used, work completed, blockers/stop condition, runtime sync result, lane-log aggregation result, individual lane logs remaining, final invocation result and next action.

An invocation that cannot satisfy the aggregation/cleanup postcondition is not considered successfully closed.

## QG-LOG-001 - Lifecycle Logging Completeness

`QG-LOG-001` passes only when:

1. the invocation begins execution with **zero** leftover individual lane logs;
2. every START event contains a specific task/task description;
3. every lane run contains applicable lifecycle boundaries in order;
4. no phase starts before its mandatory START record;
5. every started lane has persisted CLOSE/recovery-close evidence;
6. all lane logs are accumulated into the invocation aggregate/shared audit;
7. each source lane log is verified as represented before deletion;
8. all individual lane logs are deleted before invocation END;
9. post-close individual lane log count is **zero**;
10. runtime/lane-status/run-log evidence reconciles and no orphan OPEN event remains.

Historical runs before this contract remain legacy evidence and are not retroactively invalidated.

## Plain-English content rule

Every meaningful log explains what task is about to happen, why it is needed, what happened, what changed, what evidence supports the result, what blocked progress if anything, why unsafe continuation was avoided, and what happens next.

Do not make raw tool JSON, internal messages, secrets, long stack traces or low-level protocol output the primary log content.

## Immutability and corrections

A completed CLOSED lifecycle event must not be silently rewritten to make history cleaner. Corrections are new records that identify the earlier event and explain what is being corrected. Aggregating a lane log into the invocation aggregate is preservation/consolidation, not rewriting its meaning.

## Story generation

`automation/generate-automation-story.py` reads `logs/automation-log.md` and produces `logs/automation-story.md`. The story generator must preserve PARTIAL/BLOCKED/FAILED/RESULT_NOT_CONFIRMED meaning and must not invent missing facts.
