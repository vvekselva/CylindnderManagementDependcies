# Automation Log Policy

## Purpose

The automation log is the human-readable history of what the automation did.

It is not a low-level technical trace. A person should be able to read the log and understand the work without needing to understand tool calls, stack traces, shell commands or internal automation details.

## Worker lifecycle and log lifecycle

Every worker Job attempt follows:

```text
init() -> service() -> close()
```

The human-readable log follows the same lifecycle:

```text
NOT_OPENED
    |
    v
OPEN      <- init() opens the event
    |
    v
CLOSED    <- close() closes the event
```

Once an INIT event is opened, it must eventually receive a CLOSE record.

If the worker stops unexpectedly before close(), the coordinator creates a recovery close entry. That recovery entry must clearly say that the final result is not confirmed.

## Main rule

Every meaningful automation activity must explain:

- what the worker is about to do;
- why the work is needed;
- what the worker actually did;
- what it found;
- what changed, if anything;
- what is blocking progress, if anything;
- what alternatives are available;
- what evidence supports the result;
- whether the work completed or not;
- what should happen next.

## Who writes the shared log

Workers do not directly edit the shared log while they are running in parallel.

Each worker returns lifecycle records to the coordinator:

- INIT record;
- meaningful SERVICE progress/result records when needed;
- CLOSE record.

The coordinator writes those results into `logs/automation-log.md` in a controlled order.

This prevents 10 workers from trying to edit the same file at the same time.

## INIT log record

When `init()` begins, the log event is opened.

The INIT part must include:

```markdown
## EVENT <event-id>

Log State: OPEN
Time Started:
Workflow:
Job:
Worker:
Run ID:
Attempt:
Source baseline:

### What is about to start

Plain-English description of the Job.

### Why this work is needed

Plain-English reason.

### What the worker plans to do

List the main assigned Actions in simple English.

### Expected result

State what should exist when the Job is successfully completed.
```

Example:

> LANE-04 is starting the VehicleTripController trace. The worker will identify its exposed endpoints, follow each endpoint through the application, and record the final dependencies that can be proved from the approved source baseline.

## SERVICE log content

`service()` performs the actual assigned Actions.

The human-readable log should record meaningful findings or major progress, not every technical operation.

Example:

> Four exposed endpoints were found. Three have been traced to their final database dependencies. One path currently ends at `TripQueryBuilder` and needs further examination.

If the service becomes blocked, the worker must explain the real problem in simple English.

## CLOSE log record

Every opened event must end with a CLOSE section.

The CLOSE part must include:

```markdown
### Work completed

Explain what was completed.

### Work not completed

Write `Nothing` when everything completed.

### What is blocking progress

Write `Nothing` when there is no blocker.

### Why the worker could not safely continue

Write `Not applicable` when there is no blocker.

### Alternatives that can be considered

Write `None required` when no decision is needed.

### Evidence

List source files, artifacts, tests, commit IDs or other proof.

### Final worker result

Use COMPLETED, PARTIAL, BLOCKED or FAILED.

### What happens next

State the next expected action.

Time Ended:
Log State: CLOSED
```

The CLOSE record must make it obvious whether the worker completed the Job or did not complete it.

## Example complete lifecycle entry

```markdown
## EVENT EVT-014

Log State: OPEN
Time Started: 2026-08-22T05:20:00+05:30
Workflow: WF-001 Controller Traceability
Job: Trace VehicleTripController
Worker: LANE-04
Run ID: RUN-014
Attempt: 1
Source baseline: abc123

### What is about to start

LANE-04 is starting the VehicleTripController trace.

### Why this work is needed

The controller traceability artifact must show where every exposed request finally goes.

### What the worker plans to do

The worker will list the exposed endpoints, follow their real application calls, and record the final dependencies that can be proved.

### Expected result

One complete VehicleTripController traceability artifact.

### Service progress

Four endpoints were found. Three traces completed. The fourth reached another query component.

### Work completed

Three endpoint traces were completed and recorded.

### Work not completed

One endpoint has not yet reached a confirmed final database dependency.

### What is blocking progress

The final query is built by another component whose required configuration is not available in the current source baseline.

### Why the worker could not safely continue

Naming a database table now would require guessing.

### Alternatives that can be considered

1. Supply or locate the missing configuration.
2. Use approved Flyway/database evidence to continue the trace.
3. Keep this path unresolved and schedule a follow-up Job.

### Evidence

VehicleTripController, the downstream Service/Repository path, and source baseline abc123.

### Final worker result

PARTIAL

### What happens next

The coordinator should record the unresolved path and obtain a decision on the next investigation method.

Time Ended: 2026-08-22T05:28:00+05:30
Log State: CLOSED
```

## Allowed status values

Use these values consistently:

- `READY` - the work can start;
- `IN_PROGRESS` - the worker is currently performing it;
- `COMPLETED` - the requested work was produced;
- `VERIFIED` - the result was checked and accepted by its gate;
- `PARTIAL` - useful work was produced but something remains incomplete;
- `BLOCKED` - the worker cannot safely continue because something required is missing or a decision is needed;
- `FAILED` - the work was attempted but the expected result was not achieved;
- `WAITING_FOR_DECISION` - alternatives have been identified and a decision owner must choose.

Worker lifecycle-only states may also appear inside one Job attempt:

- `INITIALIZED`;
- `BLOCKED_BEFORE_SERVICE`;
- `OPEN`;
- `CLOSED`;
- `RESULT_NOT_CONFIRMED` for coordinator recovery of a stale worker.

## Plain-English blocker rule

The blocker section must describe the real problem, not only the technical symptom.

Bad:

> SQLState 42P01.

Better:

> The worker tried to verify the database query, but the table named by the query does not exist in the database version currently being checked. Because the source and database do not agree, the worker cannot confirm the trace until the expected table name or migration state is clarified.

The technical code may be added under Evidence, but it must not be the main explanation.

## Blocker decision rule

When a blocker is found, the worker must not silently choose a new design.

The worker should explain reasonable alternatives in simple English. The coordinator or designated decision owner decides what happens next unless the Workflow already contains an approved fallback.

## What must not appear as the main log content

Do not fill the human-readable log with:

- tool invocation JSON;
- internal agent messages;
- token counts;
- raw stack traces;
- long shell output;
- raw Git protocol output;
- secrets, passwords, tokens or connection strings.

Technical evidence may be referenced briefly under Evidence or stored in a separate evidence artifact when required.

## Immutability rule

A completed CLOSED event should not be silently rewritten to make history look cleaner.

If a previous event needs correction, add a new event explaining the correction and point to the earlier event.

## Story generation

`automation/generate-automation-story.py` reads `logs/automation-log.md` and produces `logs/automation-story.md`.

The story generator must not invent missing facts. If the log says a Job was partial, blocked, failed or not confirmed, the story must preserve that meaning.
