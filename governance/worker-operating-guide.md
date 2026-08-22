# Worker Operating Guide

## Purpose

This guide defines how the automation uses Workers.

There are two roles:

1. **Orchestration lanes** `LANE-01` through `LANE-10` execute Workflow Jobs.
2. A separate independent **Generic Worker** executes one task supplied through one Worker Input file.

The Generic Worker is not a source-analysis worker and is not `LANE-11`.

## Core rule

```text
WORKER = fixed execution behaviour
INPUT FILE = actual task
```

The Generic Worker must not contain permanent project-specific instructions.

If the task changes, the input file changes.

## Orchestration hierarchy

```text
WORKFLOW
   |
   +-- JOB
         |
         +-- ACTION
         +-- ACTION
         +-- ACTION
```

The coordinator decides which Jobs are READY and assigns them to the ten orchestration lanes.

## Generic Worker input flow

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
        +--> worker/results/WI-####.md
        |
        v
Coordinator / orchestration Job consumes result
```

The Generic Worker performs no task without a valid input file.

## What belongs in an input file

Every Worker Input must define:

- Worker Input ID;
- requesting Workflow/Job/Action when applicable;
- task name;
- task purpose;
- target repository/resource;
- exact baseline/ref when required;
- allowed scope;
- requested permissions;
- ordered Actions;
- evidence requirements;
- expected output;
- completion check;
- blocker policy.

Use `worker/worker-input-template.yaml`.

## Generic Worker lifecycle

### init()

The Worker reads the input file and logs:

- input ID;
- task to perform;
- purpose;
- target and baseline;
- scope;
- permissions;
- Actions;
- expected output;
- completion rule.

If the input is missing, ambiguous or asks for a forbidden permission, `service()` does not start. `close()` still runs with `BLOCKED_BEFORE_SERVICE`.

### service()

The Worker performs only the Actions listed in the input.

The Worker must not:

- invent another task;
- broaden scope;
- increase permissions;
- silently alter a Workflow;
- choose a different architecture;
- perform unrelated cleanup;
- guess facts that cannot be proved.

### close()

The Worker records:

- Actions completed;
- Actions not completed;
- outputs;
- evidence;
- blockers/failures in simple English;
- alternatives when useful;
- final result;
- next task/input required if more work is needed;
- run state `CLOSED`.

A Worker result is not accepted as final evidence until its run is CLOSED.

## Input immutability

Once `init()` succeeds, the input file is frozen for that execution.

Do not edit the same input to change the task while it is running or after it has produced evidence.

A changed task requires a new ID:

```text
WI-0017 -> original task
WI-0018 -> follow-up or changed task
```

## Orchestration lane lifecycle

The ten orchestration lanes continue to use:

```text
automation/worker-service-contract.md
```

Each Job attempt follows:

```text
init -> service -> close
```

When a Job requires separate evidence-gathering work, the coordinator creates/selects a Worker Input and the Generic Worker executes it.

The lane then consumes the CLOSED Worker result.

## Permissions

Worker permissions are explicit in the input file.

Example:

```yaml
permissions:
  source_read: true
  source_write: false
  database_read: false
  database_write: false
```

Governance always wins over the input. An input cannot grant a permission forbidden by policy.

## Blocked versus failed

`BLOCKED` means required information, permission or a decision is missing.

`FAILED` means the requested Action was attempted but did not produce a valid result.

A blocker must be explained in simple English:

1. What did the input ask the Worker to do?
2. Where did it stop?
3. What exactly prevents progress?
4. Why would continuing require guessing or unsafe behaviour?
5. What information, permission or new input is needed?
6. What alternatives can be considered?

## No guessing

When a task asks the Worker to inspect or prove a fact, use:

- `PROVED`;
- `UNRESOLVED`;
- `NOT_APPLICABLE`.

Do not replace `UNRESOLVED` with an assumption.

## Shared-file rule

The Generic Worker does not directly edit shared control files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `repository-catalogue.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated workflow reports.

The coordinator serializes shared-file updates after consuming CLOSED Worker results.

## Controller Traceability example

The Worker remains generic while input files carry the Controller Traceability tasks:

```text
WI-0001 -> determine production web-source boundary
WI-0002 -> verify first exposed-component batch
WI-0003 -> verify remaining exposed components
later WI files -> endpoint mappings, call paths, repository/query/table evidence
```

If a later Workflow needs a completely different task, the same Worker is used with different inputs.

## Completion rule

The Worker may return `COMPLETED` only when all required input Actions and completion checks pass.

Otherwise use `PARTIAL`, `BLOCKED` or `FAILED`.

The coordinator decides whether the Worker result satisfies the calling Workflow gate.
