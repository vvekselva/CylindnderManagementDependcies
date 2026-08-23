# Worker Operating Guide

## Purpose

This guide defines how the automation uses Workers.

There are two roles:

1. **Orchestration lanes** `LANE-01` through `LANE-10` execute eligible independent orchestration Jobs/tasks inside an active coordinator invocation.
2. A separate independent **Generic Worker** executes one task supplied through one Worker Input file.

The Generic Worker is not a source-analysis worker and is not `LANE-11`.

## Core rule

```text
WORKER = fixed execution behaviour
INPUT FILE = actual task
RESULT FILE = canonical output returned to caller
```

The Generic Worker must not contain permanent project-specific instructions.

## Orchestration hierarchy

```text
WORKFLOW
   |
   +-- JOB
         |
         +-- ACTION
         +-- ACTION
```

The coordinator decides which Jobs/tasks are READY and assigns them to the ten orchestration lanes. `backlog/runtime/<BL-ID>/lane-status.yaml` is the current Lane-to-Task SSOT.

## Orchestration lane utilization

The ten lanes are execution slots inside a coordinator invocation; they are not persistent background workers. `IDLE` between invocations is therefore valid. During an active invocation, the coordinator should use available safe lane capacity while independent eligible work remains.

```text
Eligible independent tasks
        |
        v
Fill available lanes
        |
        v
INIT -> SERVICE -> CLOSE
        |
        v
Released lane
        |
        +--> More eligible independent work? YES -> reassign in same invocation
        |
        NO
        v
End invocation / checkpoint
```

Rules:

- do not impose a fixed small batch such as three endpoints when more independent work is eligible;
- prefer controller/service-family batches where that reduces repeated source discovery;
- use up to ten lanes only where the Work Unit permits lane parallelism;
- never parallelize dependent Work Units prematurely;
- never parallelize conflicting shared-file writes or resource-lock conflicts;
- update `lane-status.yaml` before execution, while WORKING, on blocker/stale transitions and after close;
- preserve the same evidence/no-guessing requirements regardless of throughput;
- refill released lanes within the same invocation while safe eligible work remains.

A coordinator invocation may stop when there is no eligible independent work left, a hard blocker prevents further safe work, resource/shared-file locks prevent useful progress, the invocation/tool execution limit is reached, or the Work Unit completion boundary is reached.

## Generic Worker input/output flow

```text
Workflow/Job needs work performed
        |
        v
worker/inputs/WI-####.yaml
        |
        v
GENERIC WORKER
 init -> service -> close
        |
        +--> worker/runs/WI-####.md
        |
        +--> worker/results/WI-####.md
        |        or
        +--> worker/results/WI-####.yaml
        |
        v
Coordinator validates result
        |
        v
Orchestrator/consumer Job uses accepted result
```

The Generic Worker performs no task without a valid input file.

## What belongs in an input file

Every Worker Input must define:

- Worker Input ID;
- requesting Workflow/Job/Action when applicable;
- task name and purpose;
- target repository/resource;
- exact baseline/ref when required;
- allowed scope;
- requested permissions;
- ordered Actions;
- evidence requirements;
- expected result path and format;
- result contract when the result is machine-consumed;
- downstream consumer when applicable;
- completion check;
- blocker policy.

Use `worker/worker-input-template.yaml`.

## Generic Worker lifecycle

### init()

The Worker reads the input file and logs the task, purpose, target/baseline, scope, permissions, Actions, expected result format/contract and completion rule.

If the input is missing, ambiguous or requests a forbidden permission, `service()` does not start. `close()` still runs with `BLOCKED_BEFORE_SERVICE`.

### service()

The Worker performs only the Actions listed in the input.

It must not invent another task, broaden scope, increase permissions, silently alter a Workflow, choose a different architecture, perform unrelated cleanup or guess facts that cannot be proved.

When a YAML result contract is declared, the Worker must populate only proved values and preserve unresolved values explicitly.

### close()

The Worker records Actions completed/not completed, outputs, evidence, blockers/failures, final result and run state `CLOSED`.

A Worker result is not accepted as final input until its run is CLOSED and any declared result contract validates.

## Input immutability

Once `init()` succeeds, the input file is frozen for that execution. A changed task requires a new Worker Input ID.

## Orchestration lane lifecycle

The ten orchestration lanes use `automation/worker-service-contract.md` and each Job attempt follows:

```text
init -> service -> close
```

A lane consumes only an **accepted** Worker result when its Job declares that result as formal input.

## Machine-readable handoff rule

For producer/consumer automation, prefer:

```text
worker/runs/WI-####.md        # human lifecycle record
worker/results/WI-####.yaml   # canonical machine result
```

The coordinator validates the YAML against its Workflow-specific output contract and records the handoff state before the consumer Job becomes READY.

The consumer Job must not bypass a rejected/missing result by reconstructing data from the Worker run log.

## Permissions

Worker permissions are explicit in the input file and remain constrained by governance. An input cannot grant a permission forbidden by policy.

## Blocked versus failed

`BLOCKED` means required information, permission or a decision is missing.

`FAILED` means the requested Action was attempted but did not produce a valid result.

Blockers must be explained in simple English and must not be replaced by guesses.

## No guessing

Inspection/proof tasks use:

- `PROVED`;
- `UNRESOLVED`;
- `NOT_APPLICABLE`.

Do not replace `UNRESOLVED` with an assumption.

## Shared-file rule

The Generic Worker does not directly edit shared control files such as `TaskStatus.md`, the shared log/story, repository catalogue, synchronization register or consolidated workflow reports.

The coordinator serializes shared-file updates after consuming accepted Worker results.

## Initial Controller Traceability example

The first baseline uses one authoritative source-check input:

```text
WI-0004
  -> Complete Source Repository Check
  -> worker/results/WI-0004.yaml
```

That YAML result is validated against:

```text
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
```

and becomes `SOURCE_CHECK_OUTPUT` for the Traceability Matrix consumer Work Unit.

For the current BL-001 execution plan, independent controller/endpoint-family traces inside `WU-BL001-001` may use up to ten orchestration lanes during one coordinator invocation. This parallelism does not unlock the Matrix early and does not change the final 134/134 evidence requirement.

Earlier `WI-0001` and `WI-0002` remain historical evidence; `WI-0003` is superseded.

## Completion rule

The Worker may return `COMPLETED` only when all required input Actions and completion checks pass.

Otherwise use `PARTIAL`, `BLOCKED` or `FAILED`.

The coordinator decides whether the Worker result satisfies the calling Workflow gate and whether it can be accepted as input to a dependent Job.
