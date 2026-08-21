# Automation Task Contract

## Purpose

A **Task** is a planning or requested outcome. It is not the unit that a worker directly executes.

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

Workers are assigned **Jobs**, not raw Tasks.

Every Job attempt automatically uses the Worker Service Lifecycle from `automation/worker-service-contract.md`.

## Task Fields

A planning Task should define:

```text
Task ID:
Task Name:
Purpose:
Priority:
Status:
Target Repository:
Expected Outcome:
Related Workflow IDs:
Dependencies:
Decision Owner:
Completion Meaning:
Created At:
Closed At:
```

## Example

```text
Task ID: T-001
Task Name: Build Controller Traceability
Purpose: Understand every exposed Controller and its final dependencies.
Related Workflow: WF-001-controller-traceability
Completion Meaning: Every exposed endpoint has a traceability result and coverage is 100%.
```

The Task itself is not assigned to a lane. The Workflow breaks the Task into Jobs, and the coordinator assigns those Jobs to workers.

## Task Status Values

Use:

- `YET_TO_DO` - defined but not scheduled;
- `PLANNED` - Workflow exists but execution has not started;
- `IN_PROGRESS` - at least one related Workflow is running;
- `BLOCKED` - the Task cannot progress because a Workflow-level blocker requires a decision;
- `PARTIAL` - useful outcome exists but the completion meaning has not been fully met;
- `VERIFIED` - all required Workflows and gates produced the expected outcome;
- `CLOSED` - the verified outcome has been accepted and no planned work remains.

## Job Contract

The detailed executable structure is defined in `automation/workflow-contract.md`.

Every Job must define:

- Job ID;
- `needs` dependencies;
- whether it can run in parallel;
- inputs;
- Actions;
- expected output;
- completion check;
- evidence required;
- blocker behaviour.

Every Job also inherits this lifecycle:

```text
init() -> service() -> close()
```

`init()` confirms the Job and opens the log. `service()` executes the Job Actions. `close()` records the final worker result and closes the log.

## Worker Assignment

The coordinator assigns a worker lane to a Job.

The Job claim records:

```text
Workflow ID:
Job ID:
Assigned Lane: LANE-01 .. LANE-10
Run ID:
Attempt:
Source Baseline:
Started At:
Required Locks:
Expected Evidence:
Worker Lifecycle: INIT -> SERVICE -> CLOSE
Log State: NOT_OPENED
```

When `init()` succeeds:

```text
Worker Lifecycle: INIT
Log State: OPEN
Init Result: INITIALIZED
```

While actual Actions run:

```text
Worker Lifecycle: SERVICE
Job Status: IN_PROGRESS
```

When the attempt ends:

```text
Worker Lifecycle: CLOSE
Final Worker Result: COMPLETED | PARTIAL | BLOCKED | FAILED
Log State: CLOSED
Completed At: <timestamp>
```

A worker must not claim another Job until the current Job has executed `close()` and has been released by the coordinator.

## Blocked before service

If `init()` finds that required information is missing, the Job attempt becomes:

```text
Init Result: BLOCKED_BEFORE_SERVICE
Service Executed: NO
Final Worker Result: BLOCKED
Log State: CLOSED
```

The worker must still call `close()` and explain the missing requirement in simple English.

## Dependencies

Dependencies must use explicit IDs.

Examples:

```text
TASK: T-001
WORKFLOW: WF-001-controller-traceability
JOB: JOB-003
GATE: GATE-TRC-001
DEPENDENCY: DEP-DB-001
```

The coordinator must not mark a Job READY while its required dependencies are unresolved.

## Evidence

A Job can become VERIFIED only when the Workflow's required evidence exists.

Evidence can include:

- source commit SHA;
- source file and method;
- generated artifact path;
- build result;
- unit-test result;
- integration-test result;
- Flyway result;
- database validation result;
- deployment verification result;
- quality-gate result.

## Source Branch Rule

When a Job changes source code, its normal source branch pattern is:

```text
automation/{run_id}/{job_id}
```

Workers must not write directly to `main` unless a specifically approved governance exception exists.

## Retry Rule

Automatic retry is controlled by `automation/automation-config.yaml` and the Workflow.

Every retry is a new Job attempt and therefore receives a new lifecycle:

```text
Attempt 1: init -> service -> close
Attempt 2: init -> service -> close
```

Repeating the same failed Action indefinitely is not allowed.

When the safe retry limit is exhausted, the Job moves to `WAITING_FOR_DECISION` and explains the real problem and available alternatives in simple English.
