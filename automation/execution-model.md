# Automation Execution Model

## Purpose

This document explains, in simple English, how automation work is executed against `vvekselva/CylinderManagement` under the control of `vvekselva/CylindnderManagementDependcies`.

The execution hierarchy is:

```text
WORKFLOW
   |
   +-- JOB
   |    |
   |    +-- ACTION
   |    +-- ACTION
   |
   +-- JOB
        |
        +-- ACTION
        +-- ACTION
```

The detailed structure is defined in `automation/workflow-contract.md`.

## Control Plane and Worker Pool

The automation uses one coordinator and ten worker lanes.

- The coordinator is the scheduler and control plane.
- The coordinator does not consume one of the ten worker slots.
- Ten worker lanes are available: `LANE-01` through `LANE-10`.
- Each worker may own at most one active job at a time.
- Therefore the maximum normal parallelism is ten independent jobs.

The workers follow `governance/worker-operating-guide.md`.

## What the coordinator does

The coordinator does not perform ordinary worker jobs. It controls the work.

For every scheduling cycle the coordinator:

1. reads `repository-catalogue.md`;
2. reads the governance files;
3. reads `automation/automation-config.yaml`;
4. reads `TaskStatus.md`;
5. loads the registered workflow YAML files;
6. checks which jobs have satisfied their `needs` dependencies;
7. checks which jobs are safe to run in parallel;
8. builds the READY job queue;
9. assigns READY jobs to free worker lanes;
10. collects worker results;
11. writes shared status and human-readable logs in a controlled order;
12. runs quality gates;
13. updates the source-artifact synchronization register when required;
14. recalculates which later jobs are now READY.

## What a worker does

A worker receives one job.

The worker:

1. reads the workflow and assigned job;
2. confirms the exact source baseline;
3. performs the job actions in the defined order;
4. captures evidence;
5. returns its result to the coordinator;
6. reports blockers in simple English;
7. does not guess missing facts;
8. does not start a second job until the first is released.

## Parallelism Rules

Parallel execution is allowed only when jobs are independent.

A job may run when:

- every required job listed under `needs` is complete enough for the workflow;
- no required resource lock is already held;
- it does not depend on unfinished output from another active job;
- it does not make unsafe overlapping changes to the same controlled file set;
- the workflow allows it to run in parallel.

A free worker is not a reason to start a dependent job early.

## Ten Worker Lanes

| Lane | Capacity | Typical state | Purpose |
|---|---:|---|---|
| LANE-01 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-02 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-03 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-04 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-05 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-06 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-07 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-08 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-09 | 1 | IDLE / BUSY / STALE | General job execution |
| LANE-10 | 1 | IDLE / BUSY / STALE | General job execution |

## Queue-Based Fan-Out

When many independent components must be examined, the coordinator uses a queue.

Example for controller tracing:

```text
Controller queue
     |
     +--> LANE-01 -> Controller A
     +--> LANE-02 -> Controller B
     +--> LANE-03 -> Controller C
     ...
     +--> LANE-10 -> Controller J
```

When Lane 3 finishes, it may immediately receive the next READY controller. It does not have to wait for the other nine workers.

## Shared Files

Some files must not be changed by ten workers at the same time.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- `repository-catalogue.md`;
- consolidated reports.

Workers return findings to the coordinator. The coordinator serializes those writes.

## Resource Locks

Some operations remain serial even with ten workers.

### PRODUCTION_DATABASE_WRITE

Capacity: 1.

Only one job may perform a controlled production-database write at a time.

### MAIN_BRANCH_WRITE

Capacity: 1.

Source integration into `main` must be serialized and protected by quality gates.

### RELEASE_OPERATION

Capacity: 1.

Only one release or promotion operation may be active at a time.

### SAME_FILE_SET

Capacity: 1 for overlapping controlled files.

Two workers must not concurrently change the same file set unless a workflow explicitly defines a safe merge strategy.

### SHARED_CONTROL_FILES

Capacity: 1 and coordinator-owned.

Shared status, log and synchronization files are written by the coordinator.

## Priority Order

Jobs are scheduled in this order:

1. `P0_RECOVERY` - restore a failed or inconsistent automation state.
2. `P1_BLOCKER_CLEARING` - remove a problem stopping multiple later jobs.
3. `P2_CRITICAL_PATH` - move the current workflow milestone forward.
4. `P3_NORMAL` - ordinary READY work.

## Blocker Handling

A blocker means the worker cannot safely continue because something important is missing, unavailable, inconsistent or needs a decision.

The worker must not write only technical jargon.

It must explain:

- what it was trying to do;
- where it stopped;
- what prevented it from continuing;
- why guessing would be unsafe;
- what information or decision would remove the blocker;
- what alternatives can be considered.

The logging format is controlled by `governance/automation-log-policy.md`.

## Failure and Retry

A failure means the requested action was actually attempted but the expected result was not achieved.

The default policy allows up to two controlled automatic attempts when retry is safe.

After the configured retry limit, the job moves to `WAITING_FOR_DECISION` rather than repeating the same action indefinitely.

The worker may suggest alternatives but may not silently redesign the workflow.

## Stale Worker Recovery

Workers are expected to refresh their execution heartbeat while a job is active.

- Expected heartbeat: every 5 minutes.
- A worker is stale after 20 minutes without a heartbeat.
- The coordinator must not assume the job completed.
- The coordinator checks possible side effects before deciding whether the job is safely reassigned, failed or blocked.

## Completion Rule

A job is not verified simply because a worker says it is finished.

Verification requires:

1. all required actions were attempted;
2. the expected output exists;
3. evidence is recorded;
4. the completion check or quality gate passes;
5. unresolved items are clearly visible;
6. shared status/log files are updated by the coordinator.

## Source-to-Artifact Synchronization

After controlled artifacts exist, `WF-002-source-artifact-sync` compares the source version represented by the artifacts with later CylinderManagement source changes.

The synchronization process decides whether a change is:

- `INTERNAL_ONLY`;
- `TRACE_CHANGED`;
- `EXPOSED_API_CHANGED`;
- `COMPONENT_ADDED_OR_REMOVED`;
- `IMPACT_NOT_CONFIRMED`.

The rules are defined in `governance/source-artifact-sync-policy.md`.

## Overall Execution Shape

```text
Control Repository
       |
       v
Coordinator
       |
       v
Workflow
       |
       +--> Job --> Actions --> LANE-01
       +--> Job --> Actions --> LANE-02
       +--> Job --> Actions --> LANE-03
       ...
       +--> Job --> Actions --> LANE-10
       |
       v
Worker Results
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

The ten lanes provide capacity. Workflow dependencies, resource locks, blocker rules and quality gates determine how much of that capacity may safely be used at any moment.
