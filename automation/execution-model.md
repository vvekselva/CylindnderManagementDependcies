# Automation Execution Model

## Purpose

This document explains how automation work is executed against `vvekselva/CylinderManagement` under the control of `vvekselva/CylindnderManagementDependcies`.

The execution hierarchy is:

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

## Coordinator and Workers

The automation uses one coordinator and ten worker lanes.

- The coordinator does not consume a worker slot.
- Worker lanes are `LANE-01` through `LANE-10`.
- Each lane may own only one active Job attempt at a time.
- Up to 10 independent Jobs may run in parallel.

## Mandatory Worker Lifecycle

Every Job attempt follows the contract in `automation/worker-service-contract.md`:

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

## Scheduling Cycle

For each scheduling cycle, the coordinator:

1. reads the catalogue and governance files;
2. loads `automation/automation-config.yaml`;
3. loads registered Workflows;
4. finds Jobs whose dependencies are satisfied;
5. checks required resource locks;
6. places safe Jobs into the READY queue;
7. assigns Jobs to free worker lanes;
8. creates a Run ID and attempt number;
9. receives the worker INIT record and opens the human-readable log event;
10. lets the worker run `service()` when initialization succeeds;
11. receives the worker CLOSE record for every outcome;
12. closes the human-readable log event;
13. checks required evidence and quality gates;
14. updates shared status and synchronization files;
15. releases the worker lane;
16. recalculates which later Jobs are READY.

## Parallelism

Parallel work is allowed only when Jobs are independent.

A free lane does not allow a dependent Job to start early.

Controller traceability may fan out across all ten lanes after controller and endpoint discovery is complete.

```text
Controller Queue
      |
      +--> LANE-01 -> init -> service -> close
      +--> LANE-02 -> init -> service -> close
      +--> LANE-03 -> init -> service -> close
      ...
      +--> LANE-10 -> init -> service -> close
```

When a worker finishes `close()`, that lane may receive the next READY work item.

## Shared Files

Workers return lifecycle records and independent findings to the coordinator.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- `repository-catalogue.md`;
- consolidated traceability reports.

This prevents ten workers from overwriting each other.

## Resource Locks

Some operations remain serial:

- `PRODUCTION_DATABASE_WRITE` - capacity 1;
- `MAIN_BRANCH_WRITE` - capacity 1;
- `RELEASE_OPERATION` - capacity 1;
- `SAME_FILE_SET` - capacity 1 for overlapping files;
- `SHARED_CONTROL_FILES` - coordinator owned.

## Blockers

A blocker must be explained in simple English.

The worker must state:

1. what it was trying to do;
2. where it stopped;
3. what prevented progress;
4. why continuing would require guessing or unsafe action;
5. what information or decision is needed;
6. what alternatives can be considered.

The worker then calls `close()` and returns control to the coordinator.

## Retry

Every retry is a new Job attempt and therefore gets a new lifecycle:

```text
Attempt 1: init -> service -> close
Attempt 2: init -> service -> close
```

After the safe retry limit, the Job moves to `WAITING_FOR_DECISION`.

## Stale Worker Recovery

Workers are expected to refresh their heartbeat every 5 minutes and are considered stale after 20 minutes without a heartbeat.

If a worker disappears after `init()` but before `close()`:

- the coordinator does not assume success;
- the coordinator creates a recovery CLOSE entry;
- the final result is recorded as `RESULT_NOT_CONFIRMED`;
- side effects are checked before retry or reassignment.

## Verification

A worker closing a Job does not itself mean the Job is verified.

After `close()`, the coordinator checks the expected output, evidence, quality gate, unresolved side effects, status updates and synchronization requirements.

Only then may the result become `VERIFIED` and later `CLOSED` at Workflow level.

## Overall Shape

```text
Control Repository
       |
       v
Coordinator
       |
       v
Workflow / Job Queue
       |
       +--> Worker -> init -> service(Actions) -> close
       +--> Worker -> init -> service(Actions) -> close
       +--> ... up to 10 workers
       |
       v
Coordinator
       |
       +--> Human Log
       +--> TaskStatus
       +--> Sync Register
       +--> Consolidated Artifact
       +--> Quality Gate
       |
       v
Human Story / Next READY Jobs
```
