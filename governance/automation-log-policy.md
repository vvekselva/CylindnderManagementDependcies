# Automation Log Policy

## Purpose

The automation log is the human-readable history of what the automation did.

It is not a low-level technical trace. A person should be able to read the log and understand the work without needing to understand tool calls, stack traces, shell commands or internal automation details.

## Main rule

Every meaningful automation activity must explain:

- what the worker was asked to do;
- why the work was needed;
- what the worker actually did;
- what it found;
- what changed, if anything;
- what is blocking progress, if anything;
- what alternatives are available;
- what evidence supports the result;
- what should happen next.

## Who writes the shared log

Workers do not directly edit the shared log while they are running in parallel.

Each worker returns a structured human-readable result to the coordinator.

The coordinator writes those results into `logs/automation-log.md` in a controlled order.

This prevents 10 workers from trying to edit the same file at the same time.

## Required event format

Every log event must use this structure:

```markdown
## EVENT <event-id>

Time:
Workflow:
Job:
Worker:
Status:
Source baseline:

### What I was asked to do

Plain-English description.

### Why this work was needed

Plain-English reason.

### What I did

Short explanation of the work actually performed.

### What I found

Clear findings.

### What is blocking progress

Write `Nothing` when there is no blocker.

### Why I cannot safely continue

Write `Not applicable` when there is no blocker.

### Alternatives that can be considered

Write `None required` when no decision is needed.

### Evidence

List the files, components, test results, commit IDs or other proof used.

### Result

State the result in simple English.

### What happens next

State the next expected action.
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
- `WAITING_FOR_DECISION` - alternatives have been identified and the workflow needs a human or designated decision owner to choose.

## Plain-English blocker rule

The blocker section must describe the real problem, not only the technical symptom.

Bad example:

> SQLState 42P01.

Better example:

> The worker tried to verify the database query, but the table named by the query does not exist in the database version currently being checked. Because the source and database do not agree, the worker cannot confirm the trace until the expected table name or migration state is clarified.

The technical code `SQLState 42P01` may be added under Evidence, but it must not be the main explanation.

## Blocker decision rule

When a blocker is found, the worker must not silently choose a new design.

The worker should explain possible alternatives in simple English.

Example:

> Alternative 1: inspect the missing configuration from the deployment environment.
>
> Alternative 2: trace the repository using the current Flyway scripts.
>
> Alternative 3: stop this trace as unresolved until the missing component is supplied.

The decision owner can then choose the appropriate alternative.

If the workflow already contains an approved fallback, the worker may use that fallback and must record that it did so.

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

A completed event should not be silently rewritten to make history look cleaner.

If a previous event needs correction, add a new event that explains the correction and points to the earlier event.

## Story generation

`automation/generate-automation-story.py` reads `logs/automation-log.md` and produces `logs/automation-story.md`.

The story generator must not invent missing facts. If the log says an item is unresolved, the story must also say it remains unresolved.
