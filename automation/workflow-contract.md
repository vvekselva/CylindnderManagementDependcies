# Automation Workflow Contract

## Purpose

This file defines how automation Workflows, Jobs, Actions and producer/consumer data handoffs must be described.

The hierarchy is intentionally similar to GitHub Actions:

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

Every orchestration Job uses the mandatory Worker Service Lifecycle:

```text
JOB
 |
 +-- init()
 +-- service()
 |      +-- ACTION
 |      +-- ACTION
 +-- close()
```

The lifecycle is defined in `automation/worker-service-contract.md`.

## Workflow

A Workflow describes one complete objective.

Every Workflow must define:

- Workflow ID and name;
- purpose;
- target repository/resource;
- source baseline rule when applicable;
- trigger;
- Jobs;
- dependencies between Jobs;
- maximum parallel workers;
- completion gates;
- expected artifacts;
- failure/blocker handling;
- final status update.

## Job

A Job is one independently assignable unit inside the Workflow.

Every Job must define:

- Job ID and name;
- purpose;
- `needs` dependencies;
- whether it may run in parallel;
- formal inputs;
- Actions;
- outputs;
- completion check;
- evidence required;
- blocker rule;
- status.

A Job must not start until every `needs` dependency has satisfied its required completion state **and every required formal input has been accepted**.

## Formal Job inputs

A Job input is not merely a file path. When the input is produced by another Job or Worker, the consumer must declare the producer/contract relationship.

Example:

```yaml
inputs:
  - name: SOURCE_CHECK_OUTPUT
    path: worker/results/WI-0004.yaml
    producer_job: JOB-002
    contract: workflows/WF-001-controller-traceability/source-check-output-contract.yaml
    required_worker_result: COMPLETED
    required_worker_run_state: CLOSED
```

The coordinator must validate the input before moving the consumer Job to `READY`.

## Producer -> consumer handoff

When one Job's output becomes another Job's input, the data flow must be explicit:

```text
PRODUCER JOB
     |
     v
CANONICAL OUTPUT
     |
     | contract validation
     v
ORCHESTRATOR INPUT HANDOFF
     |
     v
CONSUMER JOB
```

The handoff must define:

- producer Job/Worker Input;
- canonical output path;
- output format;
- output contract/schema when structured;
- required producer result state;
- required run-close state;
- consumer Job;
- consumer input name;
- acceptance conditions;
- rejection behaviour.

A consumer Job must remain `WAITING` when the producer file is missing, incomplete, contract-invalid, from the wrong baseline, or otherwise not accepted.

The consumer must not bypass the handoff by recreating missing facts unless the Workflow explicitly defines an approved fallback.

## Canonical machine output

When output is consumed programmatically by a later Job, prefer a structured canonical result such as YAML.

The human-readable Worker run remains separate:

```text
worker/runs/WI-####.md        # human lifecycle record
worker/results/WI-####.yaml   # machine-consumed canonical result
```

The downstream Orchestrator must consume the canonical result, not infer machine state from the human log.

## Worker lifecycle inheritance

Unless a Workflow defines a stricter rule, every orchestration Job inherits:

```text
worker_service_lifecycle:
  contract: automation/worker-service-contract.md
  phases:
    - INIT
    - SERVICE
    - CLOSE
```

`service()` executes the Job Actions.

## Action

An Action is one clear step inside a Job.

Every Action must define:

- Action ID;
- instruction;
- expected result;
- evidence to capture;
- condition that means the Action cannot continue safely.

Actions should be written in simple English.

## Standard Job attempt sequence

```text
Coordinator validates dependencies + formal inputs
          |
          v
Coordinator assigns READY Job
          |
          v
        init()
          |
          v
       service()
          |
          v
        close()
          |
          v
Coordinator validates outputs/gates
```

If `init()` cannot safely initialize the Job, it returns `BLOCKED_BEFORE_SERVICE`; `service()` is skipped and `close()` records the blocker.

Once `init()` opens a run, `close()` must execute exactly once.

## Standard states

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
   +--> FAILED ---------> RETRY, REPLAN or STOP
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

A producer Job may be `COMPLETED` but its output handoff may still be unaccepted. A dependent consumer must not become READY until the required input acceptance checks pass.

## Parallel work

A Workflow may use up to 10 orchestration lanes. Parallel work is allowed only when Jobs are independent and do not contend for protected resources/shared files.

## Fan-out Job

A Workflow may define queue-based fan-out for independent work items. A lane may receive its next item only after the previous attempt has closed and the coordinator has accepted its result.

## Blocker handling

When a worker becomes blocked:

1. stop at the last provable point;
2. do not guess;
3. explain the blocker in simple English;
4. identify required information/decision;
5. list reasonable alternatives;
6. call `close()`;
7. return the blocker to the coordinator.

If a formal input is rejected, the consumer Job stays `WAITING`; the reason is recorded in runtime handoff state.

## Evidence rule

A Job result is not verified merely because a worker says it is complete.

The coordinator checks required evidence, result contract, source baseline where relevant, completion check, handoff acceptance and quality gate.

## Shared outputs

Worker-owned outputs may be generated independently. Coordinator-owned outputs are written after accepted results are collected.

```text
Worker produces closed canonical result
             |
             v
Coordinator validates result + handoff
             |
             +--> updates runtime input state
             +--> updates shared log/status/evidence
             +--> moves consumer Job to READY
             +--> later creates consolidated artifacts
```

## Machine-readable Workflow files

Concrete Workflows are defined under `workflows/<workflow-id>/workflow.yaml`.

Workflow-specific producer/consumer contracts may live beside the Workflow, for example:

```text
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
```

Runtime handoff state may live under:

```text
workflows/<workflow-id>/runtime/
```
