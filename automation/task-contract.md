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
      |    +-- ACTION
      |    +-- ACTION
      |
      +-- JOB
           |
           +-- ACTION
```

Workers are assigned **Jobs**, not raw Tasks.

This distinction prevents workers from interpreting a large request differently.

## Task Fields

A planning task should define:

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
Purpose: Understand every exposed controller and its final dependencies.
Related Workflow: WF-001-controller-traceability
Completion Meaning: Every exposed endpoint has a traceability result and coverage is 100%.
```

The task itself is not assigned to Lane 1 or Lane 2.

The workflow breaks the task into Jobs, and the coordinator assigns those Jobs to workers.

## Task Status Values

Use:

- `YET_TO_DO` - defined but not scheduled;
- `PLANNED` - workflow exists but execution has not started;
- `IN_PROGRESS` - at least one related workflow is running;
- `BLOCKED` - the task cannot progress because a workflow-level blocker requires a decision;
- `PARTIAL` - useful outcome exists but the completion meaning has not been fully met;
- `VERIFIED` - all required workflows and gates produced the expected outcome;
- `CLOSED` - the verified outcome has been accepted and no planned work remains.

## Job Contract

The detailed executable structure is defined in `automation/workflow-contract.md`.

Every Job must define:

- Job ID;
- `needs` dependencies;
- whether it can run in parallel;
- input;
- Actions;
- expected output;
- completion check;
- evidence required;
- blocker behaviour.

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
```

A worker must not claim another Job until the current Job is released back to the coordinator.

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

A Job can become VERIFIED only when the workflow's required evidence exists.

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

Automatic retry is controlled by `automation/automation-config.yaml` and the workflow.

Repeating the same failed action indefinitely is not allowed.

When the safe retry limit is exhausted, the Job must move to `WAITING_FOR_DECISION` and explain the real problem and available alternatives in simple English.
