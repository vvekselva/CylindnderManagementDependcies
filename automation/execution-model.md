# Automation Execution Model

## Purpose

This repository uses two execution mechanisms:

1. an **orchestration plane** that controls Workflows, Jobs, Actions, dependencies, gates and the ten orchestration lanes;
2. an independent **Generic Worker** that performs exactly the task supplied through a Worker Input file.

The Generic Worker is task-agnostic. Its canonical result may be consumed by an Orchestrator Job as formal input.

## Overall model

```text
TASK / REQUEST
      |
      v
WORKFLOW
      |
      v
COORDINATOR
      |
      +-------------------------------+
      |                               |
      v                               v
ORCHESTRATION LANES              WORKER INPUT
LANE-01 ... LANE-10                   |
      |                               v
      |                          GENERIC WORKER
      |                     init -> service -> close
      |                               |
      |                               v
      |                        CANONICAL RESULT
      |                               |
      +----------------<--------------+
      |
      v
ORCHESTRATOR JOB / ARTIFACTS / GATES
```

The Generic Worker is not `LANE-11` and does not consume orchestration capacity.

## Orchestration hierarchy

```text
WORKFLOW
   |
   +-- JOB
   |    |
   |    +-- ACTION
   |    +-- ACTION
   |
   +-- JOB
```

The coordinator determines which Jobs are READY and assigns orchestration Jobs to `LANE-01` through `LANE-10` when lane execution is needed.

## Generic Worker

The independent Worker is defined by:

```text
automation/worker-component-contract.md
```

Its workspace is:

```text
worker/
  inputs/
  runs/
  results/
```

The Worker contains execution behaviour only. Project-specific tasks belong in Worker Input files.

## Worker Input

A Worker execution starts from:

```text
worker/inputs/WI-####.yaml
```

The input defines:

- requester Workflow/Job/Action;
- task name and purpose;
- target and immutable source ref when required;
- allowed scope;
- permissions;
- ordered Actions;
- evidence requirements;
- result path, format and result contract;
- downstream consumer, when applicable;
- completion check;
- blocker policy.

The Worker must not execute without a valid input.

## Worker lifecycle

Every execution uses:

```text
init() -> service() -> close()
```

### init()

The Worker reads the input, validates scope/permissions/result contract, explains the task in simple English and opens the human-readable run record.

Once `init()` succeeds, the input is immutable. A changed task requires a new Worker Input ID.

### service()

The Worker performs only the Actions in the input. It must not invent work, broaden scope, increase permissions, change orchestration policy, hide unresolved results or guess unproved facts.

### close()

The Worker records completed/not-completed Actions, result/evidence, blockers or failures, final result and run state `CLOSED`.

The coordinator accepts a Worker result only when the run is closed and any declared machine-result contract validates.

## Worker runtime files

A Worker request has:

```text
worker/inputs/WI-0007.yaml
worker/runs/WI-0007.md
worker/results/WI-0007.md     # human-oriented result when requested
```

or:

```text
worker/inputs/WI-0007.yaml
worker/runs/WI-0007.md
worker/results/WI-0007.yaml   # machine-oriented result when another component consumes it
```

Meaning:

```text
INPUT  = What should the Worker do?
RUN    = What happened during init/service/close?
RESULT = What canonical data/evidence did the Worker return?
```

The run log is not a replacement for a structured machine result.

## Producer / consumer handoff

When a Worker result is the input to a later Orchestrator Job, the handoff must declare:

- producing Worker Input ID;
- producing Job;
- canonical result path;
- result contract;
- required Worker result state;
- required run state;
- consumer Job;
- consumer input name;
- acceptance/rejection rules.

Example:

```text
JOB-002
  produces worker/results/WI-0004.yaml
                   |
                   v
       validate result contract
                   |
                   v
ORCHESTRATOR INPUT: SOURCE_CHECK_OUTPUT
                   |
                   v
JOB-003 Complete Traceability Matrix
```

The runtime handoff state is recorded separately so a consumer Job cannot start merely because a file exists.

## Initial Controller Traceability example

The first Controller Traceability baseline uses one complete Source Check before matrix construction:

```text
JOB-001 Freeze Source Baseline
            |
            v
JOB-002 Complete Source Repository Check
            |
            v
worker/inputs/WI-0004.yaml
            |
            v
       GENERIC WORKER
   init -> service -> close
            |
            +--> worker/runs/WI-0004.md
            |
            v
worker/results/WI-0004.yaml
            |
            | contract validation
            v
SOURCE_CHECK_OUTPUT accepted
            |
            v
JOB-003 Complete Traceability Matrix
            |
            +--> traceability/source-repository-check.md
            +--> traceability/controller-inventory.md
            +--> traceability/endpoint-inventory.md
            +--> traceability/controller-traceability.md
            +--> traceability/unresolved-traceability.md
```

For this initial run:

- the Source Check Worker owns source inspection;
- `worker/results/WI-0004.yaml` owns the canonical source facts;
- the Orchestrator owns stable IDs, matrix organization, gates and artifact production;
- JOB-003 must not re-read the source repository to recreate source facts;
- JOB-003 must not create another source-inspection Worker Input;
- unresolved source conclusions remain unresolved rather than being silently repaired by orchestration.

## Permissions

Permissions are requested by the Worker Input but constrained by governance. An input can reduce permissions but cannot grant forbidden capabilities.

## Relationship with the ten orchestration lanes

The ten lanes own orchestration Jobs. The Generic Worker is an independent service invoked through input files.

A source-check task does not consume a lane. Once its result is accepted, the consuming Orchestrator Job may be assigned to one free lane.

Example:

```text
Independent Worker
  produces Source Check Output
          |
          v
Coordinator accepts handoff
          |
          v
LANE-01 receives JOB-003
          |
          v
LANE-01 consumes SOURCE_CHECK_OUTPUT
          |
          v
Traceability Matrix artifacts
```

## Blockers

A Worker blocker must explain what was requested, where it stopped, what prevented continuation, why guessing is unsafe and what would allow continuation.

An Orchestrator input rejection must likewise record why the producer output is not acceptable; the consumer Job remains WAITING rather than attempting to compensate by bypassing the contract.

## Shared-file ownership

The Generic Worker does not directly update shared orchestration files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `repository-catalogue.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability reports.

The coordinator serializes shared-file updates.

## Verification

A Worker result is evidence, not automatically a verified Workflow result.

The coordinator verifies:

- correct Worker Input was executed;
- run is CLOSED;
- required result exists;
- declared result contract validates;
- completion check passed;
- source baseline matches where required;
- downstream handoff acceptance rules pass;
- Workflow quality gate passes.

Only then may the producing Job become `VERIFIED` and the consumer Job become `READY`.

## Final architecture

```text
                    CONTROL REPOSITORY
                           |
                           v
                       COORDINATOR
                           |
          +----------------+----------------+
          |                                 |
          v                                 v
 WORKFLOW / JOB QUEUE                WORKER INPUT FILES
          |                                 |
          v                                 v
 LANE-01 ... LANE-10                GENERIC WORKER
          |                         init/service/close
          |                                 |
          |                    canonical Worker result
          |                                 |
          +---------------<-----------------+
                          |
                          v
                Orchestrator input handoff
                          |
                          v
                  Consumer Workflow Job
                          |
                          v
                    Workflow artifacts
                          |
                          v
           Quality Gates / Sync / Human Log / TaskStatus
```
