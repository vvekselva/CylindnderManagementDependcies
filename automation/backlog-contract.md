# Backlog-Driven Orchestration Contract

## Purpose

The automation framework is driven by a **Backlog**.

A Backlog Item represents one outcome that the automation must complete, for example:

- Controller Traceability;
- Unit Tests;
- Integration Tests;
- Code Coverage Report;
- ArchUnit Tests;
- Requirements Analysis;
- future quality, documentation, migration or release work.

The Orchestrator owns both the analysis of a Backlog Item and the execution process required to complete it.

The Generic Worker remains task-agnostic. It executes only Worker Input files created by the Orchestrator.

## Top-level hierarchy

```text
BACKLOG
   |
   +-- BACKLOG ITEM
          |
          +-- COMPLETION PATH
                 |
                 +-- ANALYZE
                 +-- PLAN
                 +-- GENERATE WORKER INPUTS
                 +-- EXECUTE
                 +-- VALIDATE
                 +-- CLOSE
```

The hierarchy below the execution-plan level remains:

```text
WORKFLOW / RUN PLAN
   |
   +-- JOB
         |
         +-- ACTION
```

## Core responsibility split

### Orchestrator

The Orchestrator owns:

- selecting the next eligible Backlog Item;
- reading its Completion Path;
- analysing the repository/current state for that Backlog Item;
- deciding the concrete work units required by the Completion Path;
- generating Worker Input files;
- placing generated Worker Inputs into the execution queue;
- consuming Worker results;
- deciding whether follow-up Worker Inputs are required;
- validating completion gates;
- producing the Backlog Item artifacts;
- updating Backlog status;
- closing the Backlog Item only after all gates pass.

### Generic Worker

The Generic Worker owns only:

```text
read input -> init -> service -> close -> return result
```

It does not choose the Backlog Item, Completion Path, work priority, next Worker Input, or completion decision.

## Backlog Item lifecycle

Use these Backlog Item states:

```text
YET_TO_DO
   |
   v
READY
   |
   v
ANALYZING
   |
   v
PLANNED
   |
   v
EXECUTING
   |
   +--> PARTIAL
   +--> BLOCKED
   +--> FAILED
   |
   v
VALIDATING
   |
   v
VERIFIED
   |
   v
CLOSED
```

`WAITING_FOR_DEPENDENCY` and `WAITING_FOR_DECISION` may be used when appropriate.

## Completion Path

Every Backlog Item must reference one **Completion Path** file.

The Completion Path defines the ordered route by which that specific item becomes complete.

A Completion Path must define:

- path ID and version;
- Backlog Item type;
- purpose;
- prerequisites;
- analysis requirements;
- analysis outputs;
- planning rules;
- Worker Input generation rules;
- execution phases;
- expected artifacts;
- validation gates;
- blocker rules;
- completion conditions.

The Orchestrator may not replace a Completion Path with an improvised route unless the path explicitly allows it or a user decision authorizes a change.

## Analysis phase

The analysis phase is an **Orchestrator responsibility**.

During analysis, the Orchestrator determines the current state required by the Completion Path.

Examples:

- Traceability: inspect source structure and determine the complete source-check task that must run;
- Unit Tests: identify production classes, existing tests, testable units and missing test areas;
- Integration Tests: identify integration boundaries, existing integration tests, infrastructure requirements and uncovered flows;
- Code Coverage: identify modules, test commands, coverage tooling and report aggregation rules;
- ArchUnit: identify architectural packages/layers and rules that should be validated;
- Requirements: identify requirement sources, implemented features and requirement-to-code evidence.

The Orchestrator writes the analysis result under the Backlog Item runtime area.

## Planning phase

After analysis, the Orchestrator creates an **Execution Plan**.

The plan breaks the Completion Path into concrete work units.

Each work unit must state:

- Work Unit ID;
- Backlog Item ID;
- Completion Path step;
- purpose;
- dependency/ordering rule;
- whether it can run in parallel;
- requested permissions;
- expected result;
- validation rule;
- Worker Input ID to generate.

The plan is the bridge between analysis and Worker Input generation.

## Worker Input generation

The Orchestrator converts approved Work Units into `worker/inputs/WI-####.yaml` files.

```text
Backlog Item
    |
Completion Path
    |
Orchestrator Analysis
    |
Execution Plan
    |
Work Units
    |
GENERATE WI FILES
    |
worker/inputs/WI-####.yaml
```

The Generic Worker does not generate its own next task.

When Worker result evidence proves that additional work is required, the Orchestrator analyses the result and may add another Work Unit and generate another Worker Input.

## Execution phase

The Orchestrator owns execution scheduling.

It:

1. validates the generated Worker Input;
2. submits it to the Generic Worker;
3. tracks its run/result;
4. validates the returned result contract;
5. attaches the result to the Work Unit;
6. decides whether the Work Unit is complete;
7. updates the execution plan;
8. schedules the next eligible Work Unit.

Independent Work Units may use up to ten orchestration lanes when the Completion Path allows parallel execution.

## Validation phase

A Backlog Item cannot be closed merely because all Worker Inputs have run.

The Orchestrator must evaluate the Completion Path gates.

Examples:

- Traceability: every exposed endpoint has a trace row and coverage is 100%;
- Unit Tests: required unit-test scope is covered and tests pass;
- Integration Tests: required integration scenarios exist and pass;
- Code Coverage: the coverage report is successfully generated and required thresholds are evaluated;
- ArchUnit: required architecture rules exist and the ArchUnit suite passes;
- Requirements: every requirement is mapped to implementation/evidence or explicitly unresolved.

## Backlog dependencies

A Backlog Item may depend on other Backlog Items.

Example:

```text
BL-002 Unit Tests --------+
                          +--> BL-004 Code Coverage Report
BL-003 Integration Tests -+
```

A dependent item remains `WAITING_FOR_DEPENDENCY` until its dependency rule is satisfied.

## Runtime files

Each Backlog Item run uses:

```text
backlog/runtime/<BL-ID>/
  analysis.yaml
  execution-plan.yaml
  work-unit-status.yaml
  worker-input-register.yaml
  gate-status.yaml
  decisions.yaml
  result.yaml
```

These are Orchestrator-owned files.

Worker files remain separate:

```text
worker/inputs/WI-####.yaml
worker/runs/WI-####.md
worker/results/WI-####.yaml|md
```

## Closing rule

A Backlog Item may move to `CLOSED` only when:

- all mandatory Completion Path steps are complete;
- every mandatory Work Unit has an accepted result;
- all required outputs exist;
- all completion gates pass;
- unresolved items are recorded where the path permits them;
- analysis/execution/validation state is persisted;
- no required Worker or orchestration run remains open.
