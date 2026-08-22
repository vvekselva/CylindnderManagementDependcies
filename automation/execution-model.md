# Automation Execution Model

## Purpose

This repository uses two different execution mechanisms:

1. an **orchestration plane** that controls Workflows, Jobs, Actions, dependencies, priorities, gates and the ten parallel lanes;
2. an independent **Worker component** that performs a task only when that task is supplied through a Worker Input file.

The independent Worker is generic. It is not a Controller worker, source-analysis worker, database worker, or deployment worker.

The task comes from the input file.

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
      +------------------------------+
      |                              |
      v                              v
ORCHESTRATION LANES             WORKER INPUT FILE
LANE-01 ... LANE-10                  |
      |                              v
      |                         GENERIC WORKER
      |                        init -> service -> close
      |                              |
      |                              v
      |                         WORKER RESULT
      |                              |
      +--------------<---------------+
      |
      v
WORKFLOW ARTIFACTS / GATES / STATUS
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
   |    +-- ACTION
   |
   +-- JOB
```

The coordinator decides which Jobs are READY and assigns orchestration Jobs to `LANE-01` through `LANE-10`.

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

The Worker contains execution behaviour only.

It does not permanently contain instructions such as:

- find Controllers;
- inspect repositories;
- find database tables;
- compare commits;
- validate APIs.

Those are tasks, and tasks belong in Worker Input files.

## Worker Input file

A Worker execution begins with:

```text
worker/inputs/WI-####.yaml
```

The input defines:

- who requested the work;
- task name and purpose;
- exact target repository/resource;
- exact source ref/baseline when required;
- allowed scope;
- requested permissions;
- ordered Actions;
- evidence requirements;
- output path;
- completion check;
- blocker policy.

The Worker must not execute without a valid input file.

## Generic Worker lifecycle

Every input execution uses:

```text
init()
   |
   v
service()
   |
   v
close()
```

### init()

The Worker reads the input file and logs in simple English:

- which Worker Input it received;
- what it is going to do;
- why the task exists;
- target and baseline;
- scope;
- permissions;
- Actions;
- expected result;
- completion check.

Once `init()` succeeds, the input is treated as immutable.

If the task changes, a new Worker Input ID is required.

### service()

The Worker performs only the Actions in the input file.

It must not:

- invent another task;
- broaden the scope;
- increase permissions;
- change the Workflow;
- choose a new architecture;
- hide unresolved results;
- guess facts that cannot be proved.

### close()

The Worker closes every run and records:

- Actions completed;
- Actions not completed;
- outputs;
- evidence;
- blockers/failures in simple English;
- alternatives when useful;
- final result;
- next input/task needed, if any;
- run state `CLOSED`.

The coordinator accepts a Worker result only from a closed run.

## Runtime files

Each request has three records:

```text
worker/inputs/WI-0007.yaml
worker/runs/WI-0007.md
worker/results/WI-0007.md
```

Meaning:

```text
INPUT  = What should be done?
RUN    = What happened during init/service/close?
RESULT = What was proved/produced?
```

## Permissions

Permissions are stated by the input but remain constrained by governance.

Example:

```yaml
permissions:
  source_read: true
  source_write: false
  database_read: false
  database_write: false
```

An input can reduce permissions. It cannot grant a permission forbidden by governance.

## Relationship with the ten orchestration lanes

The ten lanes own orchestration Jobs and their Job lifecycle.

The Generic Worker is an independent service that may be called by the coordinator or by a Job through an approved Worker Input.

Example:

```text
LANE-04
  owns Controller Traceability Job item CTL-007
        |
        | needs source evidence
        v
Coordinator selects/creates WI-0042.yaml
        |
        v
Generic Worker
  init -> service -> close
        |
        v
worker/results/WI-0042.md
        |
        v
LANE-04 consumes result
        |
        v
CTL-007 artifact
```

The lane does not rewrite the Worker behaviour. It changes the input.

## Controller Traceability example

Controller Traceability now uses Worker Inputs rather than a special source-analysis worker.

```text
WI-0001
Task: determine production web source boundary

WI-0002
Task: verify first exposed-component batch

WI-0003
Task: verify remaining exposed components

Later inputs
Task: extract endpoint mappings
Task: trace a specific endpoint call path
Task: prove database objects
```

The same Generic Worker executes every one of these inputs.

## Blockers

If the Worker is blocked, its `close()` must explain:

1. what the input asked it to do;
2. where it stopped;
3. what prevented it from continuing;
4. why continuing would require guessing or unsafe behaviour;
5. what information/permission/input is needed;
6. alternatives that can be considered.

The Worker does not make the policy decision itself.

## Shared-file ownership

The Generic Worker does not directly update shared orchestration files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `repository-catalogue.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability reports.

The coordinator consumes closed Worker results and serializes shared-file updates.

## Verification

A Worker result is evidence, not automatically a verified Workflow result.

The coordinator still checks:

- correct input was executed;
- run is CLOSED;
- required evidence exists;
- completion check passed;
- Workflow gate passed;
- shared artifacts/status are synchronized.

Only then may the Workflow Job advance to `VERIFIED`.

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
          |<----------- closed result -------+
          |
          v
     Workflow artifacts
          |
          v
 Quality Gates / Sync / Human Log / TaskStatus
```
