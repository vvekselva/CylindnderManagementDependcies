# Automation Execution Model

## Purpose

This document defines how automation workers execute activities against `vvekselva/CylinderManagement` under the control of `vvekselva/CylindnderManagementDependcies`.

## Control Plane and Worker Pool

The automation uses one logical coordinator and ten worker lanes.

- The coordinator is the scheduler/control plane.
- The coordinator does not consume one of the ten worker slots.
- Ten worker lanes are available: `LANE-01` through `LANE-10`.
- Each worker may own at most one active task at a time.
- Therefore the maximum normal task parallelism is ten independent tasks.

## Scheduling Cycle

For every scheduling cycle, the coordinator performs the following sequence:

1. Read `repository-catalogue.md`.
2. Read `governance/automation-policy.md`.
3. Read `automation/automation-config.yaml`.
4. Read `TaskStatus.md` and workflow/task status files.
5. Build the runnable task queue.
6. Exclude tasks whose dependencies are not satisfied.
7. Exclude tasks whose required resource lock is unavailable.
8. Sort the remaining tasks by priority.
9. Assign ready tasks to free worker lanes.
10. Mark each claimed task `IN_PROGRESS` and record worker lane, run ID, start time and attempt number.
11. Execute the task against the target repository using an automation task branch.
12. Collect evidence.
13. Run the task quality gate.
14. Mark the task `VERIFIED` or `FAILED`/`BLOCKED`.
15. Mark a task `CLOSED` only after its completion evidence and required gate are accepted.
16. Recalculate downstream task readiness.

## Parallelism Rules

Parallel execution is allowed only when tasks are independent.

A task may run in parallel when all of the following are true:

- all prerequisite tasks are `VERIFIED` or `CLOSED`;
- no required resource lock is held by another worker;
- the task does not modify the same controlled file set as another active task;
- the task does not require an unfinished output from another active task;
- the workflow-specific concurrency limit is not exceeded, unless unused global worker capacity is available and no safety rule is violated.

Dependent tasks must never be started early merely because a worker lane is free.

## Ten Worker Lanes

| Lane | Capacity | State values | Purpose |
|---|---:|---|---|
| LANE-01 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-02 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-03 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-04 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-05 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-06 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-07 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-08 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-09 | 1 | IDLE / BUSY / STALE | General task execution |
| LANE-10 | 1 | IDLE / BUSY / STALE | General task execution |

## Task Claiming

A task claim must record:

- workflow ID;
- task ID;
- worker lane;
- run ID;
- attempt number;
- source branch;
- start timestamp;
- expected evidence;
- required resource locks.

A worker must not claim a second task until the current task is released back to the coordinator.

## Resource Locks

Some operations remain serial even with ten workers.

### PRODUCTION_DATABASE_WRITE

Capacity: 1.

Only one worker may perform a write operation against the controlled production database at a time.

### MAIN_BRANCH_WRITE

Capacity: 1.

Automation workers work on task branches. Integration into `main` must be serialized and protected by the configured source-repository quality gates.

### RELEASE_OPERATION

Capacity: 1.

Only one release/promotion operation may be active at a time.

### SAME_FILE_SET

Capacity: 1 for overlapping controlled files.

Two workers must not concurrently change the same file set unless the workflow explicitly defines a safe merge strategy.

## Priority Order

Tasks are scheduled in this order:

1. `P0_RECOVERY` — restore a failed or inconsistent automation state.
2. `P1_BLOCKER_CLEARING` — remove a blocker preventing multiple downstream tasks.
3. `P2_CRITICAL_PATH` — advance the shortest path to the current workflow milestone.
4. `P3_NORMAL` — ordinary ready work.

Within the same priority, older ready tasks should be scheduled first unless a workflow declares a different ordering rule.

## Failure and Retry

- First failure: record evidence and return the task for one controlled retry.
- Second failure: record evidence and return the task for the second and final automatic retry when the failure is considered recoverable.
- After the configured automatic-attempt limit is exhausted, move the task to `BLOCKED`.
- A blocked task must include a blocker ID, failure evidence and recovery requirement.
- Downstream dependent tasks remain non-runnable while the blocker exists.

## Stale Worker Recovery

Workers must refresh their execution heartbeat while a task is active.

- Expected heartbeat: every 5 minutes.
- A worker is stale after 20 minutes without a heartbeat.
- The coordinator must not assume the task completed.
- The task is returned to coordinator review and may be marked `BLOCKED`, `FAILED`, or safely reassigned after checking side effects.

## Completion Rule

Task completion requires all of the following:

1. execution finished;
2. expected output exists;
3. evidence is recorded;
4. required quality gate passes;
5. no unresolved side effect remains;
6. status is updated in the control repository.

Only then may the coordinator move the task to `VERIFIED` and eventually `CLOSED`.

## Overall Execution Shape

```text
Control Repository
       |
       v
Coordinator / Scheduler
       |
       +--> LANE-01 --> Task
       +--> LANE-02 --> Task
       +--> LANE-03 --> Task
       +--> LANE-04 --> Task
       +--> LANE-05 --> Task
       +--> LANE-06 --> Task
       +--> LANE-07 --> Task
       +--> LANE-08 --> Task
       +--> LANE-09 --> Task
       +--> LANE-10 --> Task
       |
       v
Quality Gates + Evidence
       |
       v
TaskStatus.md / workflow status
```

The ten lanes provide capacity. Dependency rules, resource locks and quality gates determine how much of that capacity may safely be used at any given moment.
