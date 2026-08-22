# Worker Operating Guide

## Purpose

This file tells the **orchestration workers** how they must work.

There are 10 orchestration worker lanes: `LANE-01` through `LANE-10`.

A separate independent Source Analysis Worker exists outside this pool. Its contract is `automation/source-analysis-worker-contract.md`.

The orchestration workers execute Workflow Jobs. The Source Analysis Worker only reads source files and returns proved source facts.

## Automation hierarchy

The orchestration hierarchy is similar to GitHub Actions:

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

## Source-analysis boundary

When an orchestration Job needs to understand Java source, it should request facts from the independent Source Analysis Worker rather than independently guessing or creating a separate interpretation of the source.

```text
Orchestration Job
      |
      | needs source facts
      v
Source Analysis Worker
      |
      | returns PROVED / UNRESOLVED facts
      v
Orchestration Job continues
```

The Source Analysis Worker:

- does not consume a lane;
- does not claim Workflow Jobs;
- does not choose priorities;
- does not update TaskStatus or the shared orchestration log;
- does not change source code;
- does not choose remediation or architecture;
- returns source evidence only.

## Worker Service Lifecycle

Every assigned orchestration Job attempt must use the lifecycle defined in `automation/worker-service-contract.md`:

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
      +--> request Source Analysis facts when needed
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
- Source Analysis facts/requests required by the Job;
- expected output;
- completion check;
- logging rules.

The worker then explains in simple English what it is about to do.

If required information is missing, `init()` returns `BLOCKED_BEFORE_SERVICE`. The worker must not guess. It skips `service()` and goes directly to `close()`.

## service() - perform the assigned work

`service()` is where the worker performs the actual Job Actions.

The worker performs the Actions in the order defined by the Job unless the Workflow explicitly permits another order.

When source understanding is required, the worker consumes Source Analysis facts. If deeper facts are needed, it requests deeper analysis through the defined request contract.

An orchestration worker must not use `service()` to:

- invent new work;
- independently reinterpret source when a Source Analysis fact is unresolved;
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
- Source Analysis Request/Fact IDs used when applicable;
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

There are exactly 10 orchestration worker lanes: `LANE-01` through `LANE-10`.

The coordinator is separate from the 10 workers.

The Source Analysis Worker is also separate and is not counted as lane 11.

Each orchestration lane may own only one active Job attempt at a time.

## Difference between BLOCKED and FAILED

`BLOCKED` means the worker cannot safely continue because something required is missing, unavailable, unclear or needs a decision.

Example:

> Source Analysis proved that the endpoint reaches `TripQueryBuilder`, but the next query input comes from configuration that is not available in the frozen source. The database object cannot be confirmed. I am stopping at the last proved component instead of guessing.

`FAILED` means the worker was able to perform the requested Action, but the Action produced an incorrect result.

These states must not be mixed together.

## How a worker reports a blocker

Workers must explain blockers in simple English.

Do not write only:

`Symbol resolution failed.`

Instead write:

> I was trying to complete the endpoint trace. The Source Analysis result proves the call reaches another component, but the source needed to prove the next dependency is not available. Because of that, I cannot confirm where the request finally goes. Continuing would require guessing, so I stopped here.

Technical detail may be added as evidence.

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

A `PROVED` Source Analysis fact may be used directly as evidence. An `UNRESOLVED` Source Analysis fact must remain unresolved until deeper analysis proves it.

## Shared-file rule

Orchestration workers do not directly edit shared control files while parallel workers are active.

The coordinator owns shared files such as:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability reports.

The Source Analysis Worker is also prohibited from editing those shared files.

## Completion rule

An orchestration worker may return `COMPLETED` only when every required Action was attempted, the expected result was produced, required Source Analysis facts are available, evidence exists, and the completion check passed.

If these conditions are not met, the result remains `PARTIAL`, `BLOCKED` or `FAILED` as appropriate.

The coordinator, not the worker and not the Source Analysis Worker, decides whether a completed result becomes `VERIFIED` and `CLOSED` at Workflow level.
