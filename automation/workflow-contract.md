# Automation Workflow Contract

## Purpose

This file defines how all automation work must be described.

The hierarchy is intentionally similar to GitHub Actions so that the automation is predictable and easy to read.

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

## Workflow

A workflow describes one complete objective.

Every workflow must define:

- workflow ID;
- workflow name;
- purpose;
- target repository;
- source baseline rule;
- trigger;
- jobs;
- dependencies between jobs;
- maximum parallel workers;
- completion gates;
- expected artifacts;
- failure and blocker handling;
- final status update.

## Job

A job is one independently assignable unit inside the workflow.

One worker owns one job at a time.

Every job must define:

- job ID;
- job name;
- purpose;
- `needs` - jobs that must finish first;
- whether it may run in parallel;
- inputs;
- actions;
- expected output;
- completion check;
- evidence required;
- blocker rule;
- status.

A job must not start until every job listed under `needs` has satisfied its required completion state.

## Action

An action is one clear step inside a job.

Every action must define:

- action ID;
- instruction;
- expected result;
- what evidence should be captured;
- what condition means the action cannot continue safely.

Actions should be written in simple English.

Bad:

> Resolve downstream graph and infer persistence target.

Good:

> Follow the method call to the next application component. Continue until the final database, external service, file or other dependency can be proved from the source.

## Standard workflow states

```text
YET_TO_DO
   |
   v
READY
   |
   v
IN_PROGRESS
   |
   +--> BLOCKED --------> WAITING_FOR_DECISION
   |
   +--> FAILED ---------> RETRY, REPLAN or STOP
   |
   +--> PARTIAL --------> FOLLOW-UP JOB
   |
   v
COMPLETED
   |
   v
VERIFIED
   |
   v
CLOSED
```

## Parallel work

A workflow may use up to 10 worker lanes.

Parallel work is allowed only when the jobs are independent.

Example:

After controller discovery is complete, 10 different controller-tracing jobs may run at the same time because each worker owns a different controller.

The following work should normally be serialized:

- updating `TaskStatus.md`;
- updating the shared automation log;
- updating the source-artifact sync register;
- consolidating multiple worker outputs into one report;
- production database writes;
- final integration into a shared branch.

## Fan-out job

A workflow may define a queue-based fan-out job.

Example:

```text
Discovered Controllers
       |
       v
Controller Work Queue
       |
       +--> LANE-01
       +--> LANE-02
       +--> LANE-03
       ...
       +--> LANE-10
```

When a lane finishes, the coordinator gives it the next READY item from the queue. The system does not need to wait for all ten lanes before assigning the next item.

## Blocker handling

When a worker becomes blocked:

1. stop at the last point that can be proved;
2. do not guess;
3. explain the blocker in simple English;
4. identify the information or decision needed;
5. list reasonable alternatives;
6. return the blocker to the coordinator;
7. let the coordinator or designated decision owner decide what happens next.

If a workflow already defines an approved fallback, the worker may use it and must record that choice in the automation log.

## Evidence rule

A job result is not considered verified only because a worker says it is complete.

The job must provide the evidence required by the workflow.

For source traceability this can include:

- source file and method;
- annotation showing the exposed endpoint;
- next component invoked;
- repository or adapter used;
- entity, query or configuration proving the final dependency;
- exact source commit used for the analysis.

## Shared outputs

Worker-owned outputs may be generated in parallel.

Coordinator-owned outputs are written only after worker results have been collected.

This is the standard pattern:

```text
Workers produce independent findings
             |
             v
Coordinator collects findings
             |
             +--> updates shared log
             +--> updates TaskStatus
             +--> updates sync register
             +--> creates consolidated artifact
             +--> runs final gate
```

## Machine-readable workflow files

Concrete workflows should be defined under `workflows/<workflow-id>/workflow.yaml`.

The Markdown files explain the rules to humans. The YAML files provide the structured instructions used by automation.
