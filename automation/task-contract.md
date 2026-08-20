# Automation Task Contract

Every executable automation task must follow this contract so the coordinator can schedule it without guessing.

## Required Task Fields

```text
Task ID:
Task Name:
Workflow ID:
Priority:
Status:
Target Repository:
Target Branch Strategy:
Dependencies:
Required Resource Locks:
Inputs:
Execution Instructions:
Expected Outputs:
Quality Gate:
Evidence Required:
Retry Policy:
Failure Action:
Last Run ID:
Assigned Lane:
Attempt:
Started At:
Completed At:
Result:
```

## Allowed Status Values

- `YET_TO_DO` — defined but not yet eligible to run.
- `READY` — all dependencies are satisfied and the task may be scheduled.
- `IN_PROGRESS` — currently owned by one worker lane.
- `FAILED` — latest execution failed; retry decision pending or permitted.
- `BLOCKED` — cannot proceed without an external or recovery action.
- `VERIFIED` — execution and quality gate passed.
- `CLOSED` — verified result accepted and no further work remains.

## Dependency Rules

Dependencies must reference explicit IDs. Examples:

```text
DEP-DB-001
T-DB-003
GATE-BUILD-001
```

A task with unresolved dependencies may not be marked `READY`.

## Worker Claim Fields

When a worker claims a task, the coordinator must fill:

```text
Assigned Lane: LANE-01 .. LANE-10
Last Run ID: RUN-<timestamp-or-sequence>
Attempt: <number>
Started At: <ISO-8601 timestamp>
Status: IN_PROGRESS
```

## Completion Evidence

A task may not become `VERIFIED` unless evidence is supplied. Evidence may include:

- commit SHA;
- source branch;
- build log/reference;
- unit-test result;
- integration-test result;
- Flyway result;
- database validation result;
- generated artifact path;
- deployment verification result;
- quality-gate result.

## Task Branch Rule

Source changes should use:

```text
automation/{run_id}/{task_id}
```

Workers must not write directly to `main` unless a specifically approved governance exception exists.

## Parallel Safety Declaration

Each task must identify required resource locks. Use `NONE` only when the task is demonstrably independent.

Common locks:

```text
PRODUCTION_DATABASE_WRITE
MAIN_BRANCH_WRITE
RELEASE_OPERATION
SAME_FILE_SET:<logical-file-set>
```

The coordinator must reject a task assignment when its required lock is already held.

## Retry Rule

The default automatic retry limit is two attempts. A workflow may define a lower limit for unsafe or non-idempotent operations. A third execution must not be started automatically after the configured limit; the task becomes `BLOCKED` and requires an explicit recovery decision.
