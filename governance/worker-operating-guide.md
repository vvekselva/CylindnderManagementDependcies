# Worker Operating Guide

## Purpose

This file tells every automation worker how it must work.

The goal is simple: every worker must follow the same order, use the same meanings for status, explain problems in simple English, and never guess when it cannot prove something.

This repository is the control repository. The workers perform work against `vvekselva/CylinderManagement` only when a registered workflow and job tell them to do so.

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

### Workflow

A workflow is a complete business or engineering objective.

Example:

`WF-001 Controller Traceability`

Its purpose is to understand every exposed controller and follow each exposed endpoint through the application to its final dependency.

### Job

A job is one independent unit of work inside a workflow.

A job may depend on another job.

Example:

- Discover all exposed controllers.
- Trace one controller.
- Consolidate all controller traces.

A worker receives one job at a time.

### Action

An action is one clear step inside a job.

Example actions for a controller-tracing job:

1. Read the controller.
2. List its exposed endpoints.
3. Follow each endpoint to the next application component.
4. Continue until the final dependency is found.
5. Record evidence.
6. Report the result.

A worker must perform the actions in the order defined by the job unless the workflow explicitly says that actions may run in parallel.

## Worker pool

There are 10 worker lanes:

`LANE-01` through `LANE-10`.

The coordinator is separate from the 10 workers.

The coordinator chooses which READY job is given to which free worker.

A worker must not invent a new job for itself.

## What a worker must do before starting

Before starting a job, the worker must confirm:

- the workflow ID;
- the job ID;
- the exact source repository;
- the exact source commit or baseline being examined;
- the dependencies required by the job;
- whether another job must finish first;
- the expected output;
- the completion check;
- the logging rules.

If any required item is missing, the worker must not guess. It must report the missing information as a blocker.

## Normal worker sequence

```text
Receive READY job
      |
      v
Read workflow
      |
      v
Read job and actions
      |
      v
Check dependencies and source baseline
      |
      v
Execute actions in order
      |
      v
Record findings and evidence
      |
      v
Run completion checks
      |
      +---- PASS ----> COMPLETED / VERIFIED
      |
      +---- CANNOT CONTINUE ----> BLOCKED
      |
      +---- WORK EXECUTED BUT RESULT WRONG ----> FAILED
```

## Difference between BLOCKED and FAILED

`BLOCKED` means the worker cannot safely continue because something required is missing, unavailable, unclear or needs a decision.

Example:

> The worker reached `TripQueryBuilder`, but the final query is created from configuration that is not present in the repository. The database object cannot be confirmed from the available source. A decision is needed on where that configuration should come from.

`FAILED` means the worker was able to perform the requested action, but the action produced an incorrect result.

Example:

> The build was started with the required source and configuration, but compilation failed because `VehicleTripService` refers to a method that does not exist.

These states must not be mixed together.

## How a worker reports a blocker

Workers must explain blockers in simple English.

Do not write only technical messages such as:

`NullPointerException in X.java:214`

Instead write:

> I was trying to trace the endpoint from the controller to the database. The service calls another component, but the source code for that component is not available in the current repository. Because of that, I cannot confirm where the request finally goes. Continuing would require guessing, so I stopped here.

The worker may include the technical error or file name as evidence, but the main explanation must be understandable without reading a stack trace.

Every blocker report must answer:

1. What was I trying to do?
2. Where did I stop?
3. What exactly prevented me from continuing?
4. Why is it unsafe to continue without a decision?
5. What information or decision would remove the blocker?
6. What alternatives can be considered?

The worker may suggest alternatives, but it must not change the workflow, architecture, database strategy or public API on its own unless that alternative was already approved in the workflow.

## No guessing rule

When the worker cannot prove a fact, it must say `NOT YET CONFIRMED` or `UNRESOLVED`.

It must never convert a likely answer into a confirmed answer.

Example:

Bad:

> The repository probably uses `tbl_vehicle_trip`, so I recorded that table.

Good:

> The repository name suggests vehicle-trip data, but the final query is created elsewhere. The table is therefore not yet confirmed. The trace is recorded up to the last component that could be proved.

## Shared-file rule

Workers should avoid editing shared control files directly while other workers are active.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability reports.

Workers return their findings to the coordinator. The coordinator serializes shared-file updates so that 10 workers do not overwrite each other.

## Completion rule

A worker may mark a job complete only when:

- every required action was attempted;
- the required result was produced;
- the result can be supported by evidence;
- unresolved items are clearly recorded;
- the completion check defined by the job has passed.

If these conditions are not met, the job remains PARTIAL, BLOCKED or FAILED as appropriate.
