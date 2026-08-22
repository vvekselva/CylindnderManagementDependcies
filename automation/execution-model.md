# Automation Execution Model

## Purpose

This document explains how automation work is executed against `vvekselva/CylinderManagement` under the control of `vvekselva/CylindnderManagementDependcies`.

The system has **two separate execution planes**:

1. an orchestration/control plane that decides what work must happen and assigns Jobs to ten worker lanes;
2. an independent Source Analysis Worker that only reads source code and returns proved source facts.

## Overall hierarchy

```text
TASK / REQUEST
      |
      v
WORKFLOW
      |
      +-- JOB
      |    |
      |    +-- init()
      |    +-- service()
      |    |     +-- ACTION
      |    |     +-- ACTION
      |    +-- close()
      |
      +-- JOB
           |
           +-- init()
           +-- service()
           +-- close()
```

The ten orchestration workers follow that hierarchy.

Source-code analysis is separated from those workers:

```text
                    CONTROL REPOSITORY
                           |
                           v
                       COORDINATOR
                           |
             +-------------+-------------+
             |                           |
             v                           v
       WORKFLOW/JOB QUEUE        SOURCE ANALYSIS WORKER
             |                   independent, read-only
             v                           |
      10 WORKER LANES                    v
  LANE-01 ... LANE-10             SOURCE FACTS PACKAGE
             |                           |
             +-------------+-------------+
                           v
                    WORKFLOW ARTIFACTS
```

## Coordinator and orchestration workers

The automation uses one coordinator and ten orchestration worker lanes.

- The coordinator does not consume a worker slot.
- Worker lanes are `LANE-01` through `LANE-10`.
- Each lane may own only one active Job attempt at a time.
- Up to 10 independent Jobs may run in parallel.
- The Source Analysis Worker is **not** counted among these ten lanes.

## Independent Source Analysis Worker

The Source Analysis Worker is defined by `automation/source-analysis-worker-contract.md`.

Its only responsibility is to read source files at a specified immutable commit and return source facts with evidence.

It is intentionally outside orchestration scheduling.

It does not:

- choose Workflow priorities;
- claim Jobs from the orchestration queue;
- consume an orchestration lane;
- update TaskStatus;
- update the shared automation log;
- change source code;
- decide architecture or remediation;
- notify the user directly.

The coordinator or an orchestration Job sends it an Analysis Request such as:

```text
Which Spring components expose HTTP requests at source commit X?
```

or:

```text
For endpoint EP-007-02, which method is called next and what source evidence proves it?
```

The Source Analysis Worker returns only `PROVED`, `UNRESOLVED` or `NOT_APPLICABLE` source facts.

### Source Analysis lifecycle

The Source Analysis Worker has its own independent lifecycle:

```text
init()
  -> validate analysis request and source baseline
  -> explain what source will be analysed
  -> open Source Analysis run record

service()
  -> inspect source files
  -> follow requested source relationships
  -> produce evidence-backed source facts

close()
  -> explain what was proved and what was not
  -> record the next deeper analysis request when needed
  -> close Source Analysis run record
```

This lifecycle is separate from the orchestration worker lifecycle.

## Mandatory orchestration worker lifecycle

Every orchestration Job attempt follows the contract in `automation/worker-service-contract.md`:

```text
init() -> service() -> close()
```

### init()

Before actual work begins, the worker:

- identifies the Workflow and Job;
- confirms the source baseline;
- checks prerequisites and locks;
- states what work it is about to perform;
- states the expected result;
- returns an INIT record so the coordinator opens the human-readable log event.

If required information is missing, the worker returns `BLOCKED_BEFORE_SERVICE`, skips `service()`, and goes directly to `close()`.

### service()

The worker performs only the Actions defined by the assigned Job.

When an Action needs source-code facts, the worker uses the Source Analysis Worker result rather than guessing source structure.

It records meaningful evidence and returns one of:

- `COMPLETED`;
- `PARTIAL`;
- `BLOCKED`;
- `FAILED`.

### close()

`close()` always runs after `init()`.

It records:

- what completed;
- what did not complete;
- outputs and evidence;
- blocker/failure explanation;
- alternatives requiring a decision;
- final worker result;
- next action;
- end time;
- log state `CLOSED`.

Once `init()` opens a run, `close()` must execute exactly once.

A worker is not released to another Job until its current log is closed.

## Scheduling cycle

For each scheduling cycle, the coordinator:

1. reads the catalogue and governance files;
2. loads `automation/automation-config.yaml`;
3. loads registered Workflows;
4. finds Jobs whose dependencies are satisfied;
5. checks required resource locks;
6. places safe Jobs into the READY queue;
7. assigns Jobs to free orchestration worker lanes;
8. creates a Run ID and attempt number;
9. receives the worker INIT record and opens the human-readable log event;
10. requests source facts from the independent Source Analysis Worker when the Job requires source analysis;
11. lets the orchestration worker use those facts during `service()`;
12. receives the worker CLOSE record for every outcome;
13. closes the human-readable log event;
14. checks required evidence and quality gates;
15. updates shared status and synchronization files;
16. releases the worker lane;
17. recalculates which later Jobs are READY.

A Source Analysis request has its own `init -> service -> close` cycle and returns to its caller. It does not alter the orchestration queue.

## Controller traceability execution

Controller Traceability uses the separation explicitly:

```text
JOB-001 Freeze Source Baseline
              |
              v
SOURCE ANALYSIS REQUEST
Discover exposed Spring components
              |
              v
Source Facts Package
              |
              v
JOB-002 Build Controller Inventory
              |
              v
SOURCE ANALYSIS REQUEST
Discover exposed handler methods and mappings
              |
              v
JOB-003 Build Endpoint Inventory
              |
              v
       Controller Work Queue
              |
      +-------+-------+
      v               v
   LANE-01          LANE-02      ... up to LANE-10
      |               |
      | asks Source Analysis Worker for deeper endpoint call facts
      v               v
 Controller artifact  Controller artifact
```

The ten lanes own workflow work and artifacts. The Source Analysis Worker owns source understanding.

## Parallelism

Parallel work is allowed only when Jobs are independent.

A free lane does not allow a dependent Job to start early.

Controller traceability may fan out across all ten orchestration lanes after controller and endpoint discovery is complete.

The Source Analysis Worker may perform parallel read-only source reads internally when the source baseline is the same and no mutable output collision is created.

## Shared files

Orchestration workers return lifecycle records and findings to the coordinator.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- `repository-catalogue.md`;
- consolidated traceability reports.

The Source Analysis Worker is also forbidden from directly editing those shared files.

Its runtime records are isolated under:

```text
source-analysis/runs/
source-analysis/results/
```

## Resource locks

Some operations remain serial:

- `PRODUCTION_DATABASE_WRITE` - capacity 1;
- `MAIN_BRANCH_WRITE` - capacity 1;
- `RELEASE_OPERATION` - capacity 1;
- `SAME_FILE_SET` - capacity 1 for overlapping files;
- `SHARED_CONTROL_FILES` - coordinator owned.

Source Analysis is read-only and does not acquire source-write or database-write locks.

## Blockers

A blocker must be explained in simple English.

An orchestration worker must state:

1. what it was trying to do;
2. where it stopped;
3. what prevented progress;
4. why continuing would require guessing or unsafe action;
5. what information or decision is needed;
6. what alternatives can be considered.

A Source Analysis Worker uses the same plain-English principle but does not decide the alternative. It returns the last proven source location and the next safe analysis question.

## Retry

Every orchestration retry is a new Job attempt and gets a new lifecycle:

```text
Attempt 1: init -> service -> close
Attempt 2: init -> service -> close
```

Every Source Analysis retry is likewise a new Analysis Request attempt and gets its own lifecycle.

## Stale worker recovery

Orchestration workers are expected to refresh their heartbeat every 5 minutes and are considered stale after 20 minutes without a heartbeat.

If an orchestration worker disappears after `init()` but before `close()`:

- the coordinator does not assume success;
- the coordinator creates a recovery CLOSE entry;
- the final result is recorded as `RESULT_NOT_CONFIRMED`;
- side effects are checked before retry or reassignment.

Source Analysis runs are read-only. If one is interrupted, its result is not accepted until its independent close record confirms what facts were produced.

## Verification

A worker closing a Job does not itself mean the Job is verified.

After `close()`, the coordinator checks the expected output, Source Analysis evidence where relevant, quality gate, unresolved side effects, status updates and synchronization requirements.

Only then may the result become `VERIFIED` and later `CLOSED` at Workflow level.

## Final model

```text
                         TASK / REQUEST
                               |
                               v
                            WORKFLOW
                               |
                               v
                         COORDINATOR
                               |
                 +-------------+-------------+
                 |                           |
                 v                           v
          ORCHESTRATION JOBS          SOURCE ANALYSIS
                 |                    WORKER SERVICE
        10 Lanes |                    Read-only
                 |                           |
                 |<----- Source Facts -------+
                 v
        init -> service -> close
                 |
                 v
          Workflow Artifacts
                 |
                 v
          Coordinator Gates
                 |
       +---------+---------+
       v         v         v
   Human Log  TaskStatus  Sync Register
       |
       v
   Human Story / Next READY Jobs
```
