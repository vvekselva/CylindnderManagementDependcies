# Worker Operating Guide

## Purpose

This file tells every automation worker how it must work.

Every worker follows the same hierarchy, the same lifecycle, the same status meanings, and the same plain-English blocker rules. Workers must never guess when they cannot prove something.

The workers perform work against `vvekselva/CylinderManagement` only when a registered Workflow and Job tell them to do so.

## Automation hierarchy

The automation hierarchy is similar to GitHub Actions:

```text
AUTOMATION PROGRAM
    |
    +-- WORKFLOW
          |
          +-- JOB
                |
                +-- ACTION
                +-- ACTION
                +-- ACTION
```

A Workflow is the complete objective. A Job is one independently assignable unit of work. An Action is one clear step inside the Job.

A worker receives one Job at a time. It must not invent another Job for itself.

## Worker Service Lifecycle

Every assigned Job attempt must use the lifecycle defined in `automation/worker-service-contract.md`:

```text
Receive READY Job
      |
      v
init()
      |
      +--> identify the Job
      +--> confirm source baseline and prerequisites
      +--> explain what work is about to start
      +--> open the human-readable activity log
      |
      v
service()
      |
      +--> perform ACTION-01
      +--> perform ACTION-02
      +--> perform ACTION-03 ...
      +--> collect meaningful evidence
      |
      v
close()
      |
      +--> state whether work completed or not
      +--> explain blockers/failures in simple English
      +--> record outputs and evidence
      +--> state what happens next
      +--> close the activity log
      |
      v
Return result to Coordinator
```

Once `init()` opens a run, `close()` is mandatory exactly once. A worker must call `close()` even when it is blocked, fails, completes only part of the work, or is stopped.

## init() - before actual work starts

`init()` is preparation. It does not perform the actual Job.

Before starting `service()`, the worker must confirm:

- Workflow ID and Job ID;
- Worker Lane;
- Run ID and attempt number;
- exact source repository;
- exact source commit or baseline;
- dependencies required by the Job;
- required resource locks;
- Actions that will be performed;
- expected output;
- completion check;
- logging rules.

The worker must then explain in simple English what it is about to do.

Example:

> LANE-04 is starting `Trace VehicleTripController`. It will examine the approved CylinderManagement source baseline, identify every exposed endpoint in this Controller, follow each endpoint through the application, and record the final dependency that can be proved. The expected output is one controller traceability artifact.

If any required information is missing, `init()` must return `BLOCKED_BEFORE_SERVICE`. The worker must not guess. It skips `service()` and goes directly to `close()`.

## service() - perform the assigned work

`service()` is where the worker performs the actual Job Actions.

The worker performs the Actions in the order defined by the Job unless the Workflow explicitly permits another order.

A worker must not use `service()` to:

- invent new work;
- change the architecture without approval;
- change a public API without approval;
- choose a new database strategy without approval;
- perform unrelated refactoring or cleanup;
- hide unresolved findings.

During `service()`, meaningful progress may be reported in plain English. Low-level technical noise is evidence, not the main human-readable explanation.

If the worker cannot continue safely, it stops at the last proven point and returns `BLOCKED` or `PARTIAL`. If an attempted Action produces the wrong result, it returns `FAILED`.

## close() - finish the attempt and close the log

`close()` always runs after `init()`.

It must record:

- whether `init()` succeeded;
- whether `service()` ran;
- Actions completed;
- Actions not completed;
- outputs produced;
- evidence produced;
- blocker/failure explanation, if any;
- alternatives requiring a decision, if any;
- final worker result;
- next expected action;
- end time;
- log state `CLOSED`.

A worker is not released to another Job until its current Job attempt has been closed.

## Worker pool

There are 10 worker lanes: `LANE-01` through `LANE-10`.

The coordinator is separate from the 10 workers. The coordinator chooses which READY Job is given to which free worker.

Each lane may own only one active Job attempt at a time.

## Difference between BLOCKED and FAILED

`BLOCKED` means the worker cannot safely continue because something required is missing, unavailable, unclear or needs a decision.

Example:

> The worker reached `TripQueryBuilder`, but the final query is created from configuration that is not present in the repository. The database object cannot be confirmed from the available source. A decision is needed on where that configuration should come from.

`FAILED` means the worker was able to perform the requested Action, but the Action produced an incorrect result.

Example:

> The build was started with the required source and configuration, but compilation failed because `VehicleTripService` refers to a method that does not exist.

These states must not be mixed together.

## How a worker reports a blocker

Workers must explain blockers in simple English.

Do not write only:

`NullPointerException in X.java:214`

Instead write:

> I was trying to trace the endpoint from the Controller to the database. The Service calls another component, but the source code for that component is not available in the current repository. Because of that, I cannot confirm where the request finally goes. Continuing would require guessing, so I stopped here.

The technical error or file name may be added as evidence.

Every blocker report must answer:

1. What was I trying to do?
2. Where did I stop?
3. What exactly prevented me from continuing?
4. Why is it unsafe to continue without a decision?
5. What information or decision would remove the blocker?
6. What alternatives can be considered?

The worker may suggest alternatives, but it must not change the Workflow, architecture, database strategy or public API on its own unless that alternative was already approved in the Workflow.

## No guessing rule

When the worker cannot prove a fact, it must say `NOT YET CONFIRMED` or `UNRESOLVED`.

Bad:

> The repository probably uses `tbl_vehicle_trip`, so I recorded that table.

Good:

> The repository name suggests vehicle-trip data, but the final query is created elsewhere. The table is not yet confirmed. The trace is recorded up to the last component that could be proved.

## Shared-file rule

Workers do not directly edit shared control files while parallel workers are active.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability reports.

Workers return their INIT record, SERVICE result and CLOSE record to the coordinator. The coordinator serializes shared-file updates.

## Completion rule

A worker may return `COMPLETED` only when every required Action was attempted, the expected result was produced, evidence exists, and the completion check passed.

If these conditions are not met, the result remains `PARTIAL`, `BLOCKED` or `FAILED` as appropriate.

The coordinator, not the worker, decides whether a completed result becomes `VERIFIED` and `CLOSED` at the Workflow level.
