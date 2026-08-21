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

Every Job is executed through the mandatory Worker Service Lifecycle:

```text
JOB
 |
 +-- init()
 |
 +-- service()
 |      +-- ACTION
 |      +-- ACTION
 |      +-- ACTION
 |
 +-- close()
```

The lifecycle is defined in `automation/worker-service-contract.md`.

## Workflow

A Workflow describes one complete objective.

Every Workflow must define:

- Workflow ID;
- Workflow name;
- purpose;
- target repository;
- source baseline rule;
- trigger;
- Jobs;
- dependencies between Jobs;
- maximum parallel workers;
- completion gates;
- expected artifacts;
- failure and blocker handling;
- final status update.

## Job

A Job is one independently assignable unit inside the Workflow.

One worker owns one Job attempt at a time.

Every Job must define:

- Job ID;
- Job name;
- purpose;
- `needs` - Jobs that must finish first;
- whether it may run in parallel;
- inputs;
- Actions;
- expected output;
- completion check;
- evidence required;
- blocker rule;
- status.

A Job must not start until every Job listed under `needs` has satisfied its required completion state.

### Worker lifecycle inheritance

A Job does not need to repeat the full `init()`, `service()` and `close()` definitions.

Unless a Workflow explicitly defines a stricter rule, every Job automatically inherits:

```text
worker_service_lifecycle:
  contract: automation/worker-service-contract.md
  phases:
    - INIT
    - SERVICE
    - CLOSE
```

`service()` is the phase that executes the Job Actions.

## Action

An Action is one clear step inside a Job.

Every Action must define:

- Action ID;
- instruction;
- expected result;
- what evidence should be captured;
- what condition means the Action cannot continue safely.

Actions should be written in simple English.

Bad:

> Resolve downstream graph and infer persistence target.

Good:

> Follow the method call to the next application component. Continue until the final database, external service, file or other dependency can be proved from the source.

## Standard Job attempt sequence

```text
Coordinator assigns READY Job
          |
          v
        init()
          |
          +-- confirm Job and baseline
          +-- explain planned work
          +-- open human-readable log
          |
          v
       service()
          |
          +-- execute Actions
          +-- collect evidence
          +-- stop safely if blocked
          |
          v
        close()
          |
          +-- state completed/not completed
          +-- explain blocker/failure if present
          +-- record outputs/evidence
          +-- state next action
          +-- close log
          |
          v
Coordinator evaluates result/gate
```

If `init()` cannot safely initialize the Job, it returns `BLOCKED_BEFORE_SERVICE`. `service()` is skipped and `close()` records the blocker and closes the log.

Once `init()` opens a run, `close()` must execute exactly once.

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

Worker lifecycle states such as `INITIALIZED`, `BLOCKED_BEFORE_SERVICE`, log `OPEN`, and log `CLOSED` belong to one Job attempt and do not replace the Workflow states above.

## Parallel work

A Workflow may use up to 10 worker lanes.

Parallel work is allowed only when Jobs are independent.

After controller discovery is complete, up to 10 different controller-tracing Job items may run at the same time because each worker owns a different controller.

The following work should normally be serialized:

- updating `TaskStatus.md`;
- updating the shared automation log;
- updating the source-artifact sync register;
- consolidating multiple worker outputs into one report;
- production database writes;
- final integration into a shared branch.

## Fan-out Job

A Workflow may define a queue-based fan-out Job.

```text
Discovered Controllers
       |
       v
Controller Work Queue
       |
       +--> LANE-01 -> init -> service -> close
       +--> LANE-02 -> init -> service -> close
       +--> LANE-03 -> init -> service -> close
       ...
       +--> LANE-10 -> init -> service -> close
```

When a lane finishes and its close() record has been accepted by the coordinator, the lane may receive the next READY item.

## Blocker handling

When a worker becomes blocked during `service()`:

1. stop at the last point that can be proved;
2. do not guess;
3. explain the blocker in simple English;
4. identify the information or decision needed;
5. list reasonable alternatives;
6. call `close()`;
7. return the blocker to the coordinator;
8. let the coordinator or designated decision owner decide what happens next.

If a Workflow already defines an approved fallback, the worker may use it and must record that choice.

## Evidence rule

A Job result is not considered verified only because a worker says it is complete.

The Job must provide the evidence required by the Workflow.

For source traceability this can include:

- source file and method;
- annotation showing the exposed endpoint;
- next component invoked;
- repository or adapter used;
- entity, query or configuration proving the final dependency;
- exact source commit used for the analysis.

## Shared outputs

Worker-owned outputs may be generated in parallel.

Coordinator-owned outputs are written only after worker results and CLOSE records have been collected.

```text
Workers run init/service/close independently
             |
             v
Coordinator collects closed worker results
             |
             +--> updates shared log
             +--> updates TaskStatus
             +--> updates sync register
             +--> creates consolidated artifact
             +--> runs final gate
```

## Machine-readable Workflow files

Concrete Workflows are defined under `workflows/<workflow-id>/workflow.yaml`.

The Markdown files explain the rules to humans. The YAML files provide the structured instructions used by automation.
