# Worker Operating Guide

## Purpose

The automation has two execution roles:

1. orchestration lanes `LANE-01` through `LANE-10` for eligible independent Jobs/tasks inside one coordinator invocation;
2. a separate Generic Worker that executes one approved Worker Input.

`backlog/runtime/<BL-ID>/lane-status.yaml` is the current Lane-to-Task SSOT.

## Safe lane utilization

The ten lanes are execution slots inside one finite coordinator invocation; they are not persistent background processes. IDLE between invocations is valid. During an active invocation, safe independent work should use available lanes, and released lanes should be refilled while more eligible independent work remains.

Do not parallelize dependent Work Units, shared-file conflicts or resource-lock conflicts. Reuse source relationships only when the frozen source proves the same path.

## Mandatory lane lifecycle logging

Every new lane run is governed by `governance/execution-lifecycle-logging.yaml` and must use this sequence:

```text
LANE_INIT_START
   -> init()
LANE_INIT_END
   -> LANE_SERVICE_START
   -> service()
LANE_SERVICE_END
   -> close()
LANE_CLOSE_END
```

If `LANE_INIT_END = BLOCKED_BEFORE_SERVICE`, SERVICE_START/SERVICE_END are omitted; close and LANE_CLOSE_END remain mandatory.

Rules:

- persist `LANE_INIT_START` before init executes;
- persist `LANE_INIT_END` immediately after init;
- service may start only when persisted INIT_END is `INITIALIZED`;
- persist `LANE_SERVICE_START` before service;
- persist `LANE_SERVICE_END` immediately after service;
- persist `LANE_CLOSE_END` after close with `Log State: CLOSED`;
- do not release/reuse a lane until its close or recovery-close log is persisted;
- new results require `QG-LOG-001` lifecycle reconciliation before acceptance.

Each lane writes its own per-run artifact:

```text
logs/runs/INV-<invocation-id>-<lane-id>-<run-id>.md
```

This avoids ten lanes editing the same file. The coordinator alone serializes meaningful records into `logs/automation-log.md`.

## Generic Worker flow

```text
worker/inputs/WI-####.yaml
        |
        v
GENERIC WORKER
 init -> service -> close
        |
        +--> worker/runs/WI-####.md
        +--> worker/results/WI-####.yaml / .md
        |
        v
Coordinator validates result
```

The Generic Worker performs no task without a valid input. It does not select Backlog Items, broaden scope, invent follow-up work, increase permissions or guess unresolved facts.

## Blocked versus failed

`BLOCKED` means required information/permission/decision is missing. `FAILED` means the action was attempted but did not produce a valid result. Blockers must be explained in simple English.

## No guessing

Inspection/proof tasks use `PROVED`, `UNRESOLVED` and `NOT_APPLICABLE`. Never convert UNRESOLVED into an assumption.

## Shared-file rule

Parallel lanes do not edit shared control files such as `TaskStatus.md`, `logs/automation-log.md`, repository catalogue or synchronization register. The coordinator serializes shared-file updates.

## BL-001 traceability example

`WU-BL001-001` may partition independent controller/endpoint-family traces across up to ten lanes in one coordinator invocation. Lane utilization does not unlock the Matrix early and does not change the final 134/134 evidence requirement.

Every lane batch must now produce lifecycle log evidence under QG-LOG-001 in addition to source-trace evidence.
