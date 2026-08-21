# Worker Service Contract

## Purpose

Every automation worker must execute every assigned Job using the same three-stage lifecycle:

```text
init()
   |
   v
service()
   |
   v
close()
```

This is intentionally similar to a Servlet lifecycle. The names describe the worker lifecycle only; they are not Spring application Service classes.

The purpose is to make every worker predictable. Before work begins, the worker says what it is going to do. While work is running, it performs only the assigned Job Actions. When work stops for any reason, it clearly says what happened and closes the activity record.

## Mandatory rule

Every Job attempt must use all three lifecycle stages.

Once `init()` has opened a worker run, `close()` must execute exactly once.

`close()` is required even when:

- the Job completes successfully;
- the Job is only partly completed;
- the worker becomes BLOCKED;
- an Action fails;
- a dependency becomes unavailable after work starts;
- the worker is stopped by the coordinator;
- the safe retry limit is reached.

A run must never be left with an open human-readable log entry.

## 1. init()

`init()` prepares one worker to perform one assigned Job.

It does not perform the actual business or engineering work.

### init() must confirm

- Worker Lane;
- Workflow ID and name;
- Job ID and name;
- Run ID and attempt number;
- target repository;
- source baseline or source commit;
- required dependencies;
- required resource locks;
- expected output;
- completion check;
- Job Actions that will be performed.

### init() must open the human-readable activity log

The worker returns an INIT record to the coordinator. The coordinator opens the shared log event.

The INIT message must answer these questions in simple English:

1. Which worker is starting?
2. What Job is it starting?
3. Why is this Job being done?
4. What source version will be examined or changed?
5. What Actions will the worker perform?
6. What result is expected?

Example:

> LANE-04 is starting the Job `Trace VehicleTripController` as part of the Controller Traceability workflow. The worker will examine the approved CylinderManagement source baseline `abc123`. It will identify every exposed endpoint in this Controller, follow each endpoint through the application, and record the final dependency that can be proved. The expected result is one verified controller traceability artifact.

### init() result

`init()` finishes with one of these results:

- `INITIALIZED` - all required information is available and `service()` may start;
- `BLOCKED_BEFORE_SERVICE` - the worker cannot safely start actual work.

If `init()` returns `BLOCKED_BEFORE_SERVICE`, the worker must skip `service()` and go directly to `close()`.

## 2. service()

`service()` performs the actual assigned Job.

Only the Actions defined by the Workflow/Job may be performed.

The worker must not use `service()` to invent a new Job, redesign the application, change the public API, choose a new database strategy, or perform unrelated cleanup.

### service() sequence

```text
Read next assigned Action
        |
        v
Perform the Action
        |
        v
Capture meaningful evidence
        |
        v
Can next Action safely continue?
      /   \
    YES    NO
     |      |
     v      v
Next Action  Stop service() and report blocker/failure
```

### service() progress reporting

The worker does not write low-level technical noise into the human-readable log.

It reports meaningful progress such as:

> The Controller contains four exposed endpoints. Three traces have reached their final database dependencies. The fourth trace has reached `TripQueryBuilder` and is being examined further.

If the worker becomes blocked, it must report:

- what it was trying to do;
- where the work stopped;
- what is missing or preventing progress;
- why continuing would require guessing or unsafe action;
- reasonable alternatives;
- what decision or information is needed.

### service() result

`service()` returns one of:

- `COMPLETED`;
- `PARTIAL`;
- `BLOCKED`;
- `FAILED`.

The worker then always calls `close()`.

## 3. close()

`close()` ends the worker Job attempt and closes its human-readable activity record.

It must run even when `service()` did not start.

### close() must record

- Worker Lane;
- Workflow and Job;
- Run ID and attempt;
- start time and end time;
- whether `init()` succeeded;
- whether `service()` ran;
- Actions completed;
- Actions not completed;
- outputs produced;
- evidence produced;
- blocker or failure explanation, if any;
- alternatives requiring a decision, if any;
- final worker result;
- next expected action;
- log state `CLOSED`.

### Simple-English completion examples

Successful close:

> LANE-04 completed the assigned Controller trace. All four exposed endpoints were followed to their final dependencies and the required evidence was recorded. The worker has finished this Job attempt and the activity log is now closed. The result is ready for the coordinator's verification gate.

Partial close:

> LANE-04 completed three of four endpoint traces. The fourth reached a query component whose final database dependency cannot yet be proved. The completed findings have been saved, the remaining path has been recorded as unresolved, and the activity log is now closed. A follow-up decision is required before this Controller can be fully verified.

Blocked-before-service close:

> LANE-04 could not start the Controller trace because the source baseline required by the Workflow was not available. No application analysis was performed. The blocker and the information required to continue have been recorded, and the activity log is now closed.

## Log state

Each worker run has a simple log state:

```text
NOT_OPENED
    |
    v
OPEN        <- init() opened the event
    |
    v
CLOSED      <- close() completed the event
```

A normal coordinator cycle must never leave a finished worker attempt in `OPEN` state.

If a worker becomes stale or disappears before `close()`, the coordinator must create a recovery close entry explaining that the worker ended unexpectedly and that the final result is not confirmed.

## Worker ownership

A worker owns only its currently assigned Job attempt.

The coordinator owns:

- Job assignment;
- shared log writing;
- final status changes;
- shared artifact consolidation;
- source-artifact sync register updates;
- verification gates;
- retry or replan decisions.

## Relationship to Workflow -> Job -> Action

The lifecycle wraps every Job:

```text
WORKFLOW
   |
   +-- JOB assigned to LANE-04
          |
          +-- init()
          |     +-- identify Job
          |     +-- confirm prerequisites
          |     +-- open log
          |
          +-- service()
          |     +-- ACTION-01
          |     +-- ACTION-02
          |     +-- ACTION-03
          |
          +-- close()
                +-- record result
                +-- explain blockers if any
                +-- record next action
                +-- close log
```

The Workflow defines **what** must be done. The Worker Service Contract defines **how every worker must execute it**.