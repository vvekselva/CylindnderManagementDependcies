# Automation Execution Model

## Purpose

The automation framework is **Backlog-driven**.

The Backlog is the top-level source of work. Traceability, Unit Tests, Integration Tests, Code Coverage, ArchUnit Tests, Requirements, and future project-quality activities are separate Backlog Items.

Each Backlog Item has its own **Completion Path** describing how that type of work becomes complete.

The Orchestrator owns both:

1. **analysis** — understanding the current state and deciding what work is required;
2. **execution** — generating Worker Input files, scheduling execution, consuming Worker results, validating gates, and closing the Backlog Item.

The Generic Worker remains task-agnostic. It executes only the input file it receives.

---

# 1. Top-Level Architecture

```text
                         BACKLOG
                            |
                            v
                    SELECT BACKLOG ITEM
                            |
                            v
                    COMPLETION PATH
                            |
                            v
                 ORCHESTRATOR ANALYSIS
                            |
                            v
                    EXECUTION PLAN
                            |
                    +-------+-------+
                    |               |
                    v               v
                WORK UNIT       WORK UNIT
                    |               |
                    v               v
             GENERATE WI FILES / ORCHESTRATION ACTIONS
                    |
                    v
                  EXECUTION
                    |
          +---------+----------+
          |                    |
          v                    v
   GENERIC WORKER        ORCHESTRATION LANE
 init -> service -> close   LANE-01 ... LANE-10
          |                    |
          v                    v
     WORKER RESULT        ORCHESTRATOR RESULT
          +---------+----------+
                    |
                    v
             ORCHESTRATOR VALIDATION
                    |
                    v
            BACKLOG ITEM VERIFIED
                    |
                    v
                  CLOSED
```

The Orchestrator therefore controls the complete lifecycle. The Worker does not decide what Backlog Item to run or what should happen next.

---

# 2. Core Hierarchy

The framework hierarchy is:

```text
BACKLOG
   |
   +-- BACKLOG ITEM
          |
          +-- COMPLETION PATH
                 |
                 +-- ANALYZE
                 |
                 +-- PLAN
                 |
                 +-- WORK UNIT
                 |      |
                 |      +-- WORKER INPUT when external execution is required
                 |      +-- ORCHESTRATION ACTION when the Orchestrator can perform it directly
                 |
                 +-- EXECUTE
                 |
                 +-- VALIDATE
                 |
                 +-- CLOSE
```

Workflow / Job / Action remains an execution representation where useful, but **Backlog Item + Completion Path** is now the primary planning model.

---

# 3. Main Components

## 3.1 Backlog

The Backlog contains all project work known to the automation framework.

Authoritative file:

```text
backlog/backlog.yaml
```

Initial items include:

| Backlog ID | Item | Type |
|---|---|---|
| BL-001 | Controller Traceability | TRACEABILITY |
| BL-002 | Unit Test Completion | UNIT_TEST |
| BL-003 | Integration Test Completion | INTEGRATION_TEST |
| BL-004 | Code Coverage Report | CODE_COVERAGE |
| BL-005 | ArchUnit Architecture Test | ARCHUNIT |
| BL-006 | Requirements Traceability and Gap Analysis | REQUIREMENTS |

The Backlog register contains priority, state, dependencies, Completion Path and expected outputs.

## 3.2 Completion Path

Each Backlog Item has a specific path to completion.

Files:

```text
backlog/paths/BL-001-traceability.yaml
backlog/paths/BL-002-unit-test.yaml
backlog/paths/BL-003-integration-test.yaml
backlog/paths/BL-004-code-coverage.yaml
backlog/paths/BL-005-archunit.yaml
backlog/paths/BL-006-requirements.yaml
```

A Completion Path defines:

- prerequisites;
- what the Orchestrator must analyse;
- analysis outputs;
- how Work Units are generated;
- Worker Input generation rules;
- execution sequencing/parallelism;
- expected artifacts;
- quality gates;
- blocker rules;
- closure conditions.

The path belongs to the Backlog Item type. It is not hard-coded in the Worker.

## 3.3 Orchestrator

The Orchestrator is the control component.

It is responsible for both analysis and execution.

### Analysis responsibilities

The Orchestrator:

1. selects the next eligible Backlog Item;
2. reads its Completion Path;
3. reads the repository/current artifacts required by that path;
4. determines current state and gaps;
5. writes `analysis.yaml`;
6. converts the analysis into an Execution Plan;
7. creates Work Units;
8. generates Worker Input files for Work Units requiring Generic Worker execution.

### Execution responsibilities

The Orchestrator:

1. evaluates Work Unit dependencies;
2. places eligible work into the queue;
3. validates Worker Inputs;
4. submits Worker Inputs to the Generic Worker;
5. assigns Orchestration Jobs/Actions to LANE-01 ... LANE-10 where appropriate;
6. consumes Worker results;
7. validates result contracts;
8. creates follow-up Work Units when evidence proves they are required;
9. produces shared artifacts;
10. evaluates gates;
11. updates Backlog state;
12. closes the item only after Completion Path conditions pass.

The Orchestrator is separate from the ten lanes and does not consume a lane itself.

## 3.4 Work Unit

A Work Unit is the concrete work produced from Orchestrator analysis.

Example:

```text
BL-001 Traceability
   |
   +-- WU-BL001-001 Complete Source Repository Check
   +-- WU-BL001-002 Build Traceability Matrix
   +-- WU-BL001-003 Validate Traceability Gates
   +-- WU-BL001-004 Register Baseline and Close
```

A Work Unit may be:

- executed by the Generic Worker using a Worker Input;
- executed by an orchestration lane;
- executed directly by the Orchestrator for coordinator-owned validation/status work.

## 3.5 Generic Worker

The Generic Worker is an execution service, not a planning component.

Contract:

```text
automation/worker-component-contract.md
```

It performs:

```text
read Worker Input
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
return result
```

The Worker does not:

- select Backlog Items;
- analyse which work should exist;
- choose a Completion Path;
- create its own next Worker Input;
- decide whether a Backlog Item is complete.

## 3.6 Orchestration Lanes

There are ten orchestration lanes:

```text
LANE-01 ... LANE-10
```

They execute independent orchestration Work Units/Jobs when the Completion Path allows parallelism.

The Generic Worker remains independent and is not `LANE-11`.

---

# 4. Main File Structure

```text
repository root
|
+-- backlog/
|   |
|   +-- README.md
|   +-- backlog.yaml
|   +-- backlog-item-template.yaml
|   |
|   +-- paths/
|   |   +-- BL-001-traceability.yaml
|   |   +-- BL-002-unit-test.yaml
|   |   +-- BL-003-integration-test.yaml
|   |   +-- BL-004-code-coverage.yaml
|   |   +-- BL-005-archunit.yaml
|   |   +-- BL-006-requirements.yaml
|   |
|   +-- runtime/
|       +-- <BL-ID>/
|           +-- analysis.yaml
|           +-- execution-plan.yaml
|           +-- work-unit-status.yaml
|           +-- worker-input-register.yaml
|           +-- gate-status.yaml
|           +-- decisions.yaml
|           +-- result.yaml
|
+-- automation/
|   +-- automation-config.yaml
|   +-- backlog-contract.md
|   +-- execution-model.md
|   +-- workflow-contract.md
|   +-- task-contract.md
|   +-- worker-component-contract.md
|   +-- worker-service-contract.md
|
+-- worker/
|   +-- worker-input-template.yaml
|   +-- inputs/WI-####.yaml
|   +-- runs/WI-####.md
|   +-- results/WI-####.yaml|md
|
+-- workflows/
|   +-- WF-001-controller-traceability/
|   |   +-- workflow.yaml
|   |   +-- source-check-output-contract.yaml
|   |   +-- runtime/*.yaml
|   |   +-- evidence/*.yaml
|   |
|   +-- WF-002-source-artifact-sync/
|       +-- workflow.yaml
|
+-- traceability/
|   +-- source-repository-check.md
|   +-- controller-inventory.md
|   +-- endpoint-inventory.md
|   +-- controller-traceability.md
|   +-- unresolved-traceability.md
|
+-- quality/
|   +-- unit-test/
|   +-- integration-test/
|   +-- code-coverage/
|   +-- archunit/
|
+-- requirements/
|   +-- requirements-inventory.md
|   +-- requirements-traceability.md
|   +-- requirements-gaps.md
|
+-- sync/
|   +-- source-artifact-sync-register.yaml
|
+-- logs/
|   +-- automation-log.md
|   +-- automation-story.md
|
+-- TaskStatus.md
+-- repository-catalogue.md
```

---

# 5. Backlog Runtime Files

For each active Backlog Item the Orchestrator uses:

## `analysis.yaml`

Contains what the Orchestrator found before execution.

Example questions:

```text
What already exists?
What is missing?
What source/artifacts were inspected?
What dependencies exist?
What Work Units are required?
```

## `execution-plan.yaml`

Contains the concrete Work Units created from analysis.

It maps:

```text
analysis finding
     -> Work Unit
     -> Worker Input / Orchestration Action
     -> expected result
     -> validation rule
```

## `work-unit-status.yaml`

Live state of every Work Unit.

## `worker-input-register.yaml`

Maps Backlog Work Units to generated `WI-####` files and returned results.

## `gate-status.yaml`

Tracks the Completion Path gates.

## `decisions.yaml`

Records Orchestrator decisions, such as creating a follow-up Work Unit after a Worker returns an unresolved result.

## `result.yaml`

Final machine-readable result of the Backlog Item.

---

# 6. Complete Data Flow

```text
backlog/backlog.yaml
       |
       v
ORCHESTRATOR selects BL-###
       |
       v
backlog/paths/BL-###-*.yaml
       |
       v
ORCHESTRATOR ANALYSES CURRENT STATE
       |
       v
backlog/runtime/BL-###/analysis.yaml
       |
       v
ORCHESTRATOR BUILDS EXECUTION PLAN
       |
       v
backlog/runtime/BL-###/execution-plan.yaml
       |
       v
CREATE WORK UNITS
       |
       +---------------------------------+
       |                                 |
       v                                 v
needs Generic Worker             orchestration-only work
       |                                 |
       v                                 v
worker/inputs/WI-####.yaml        LANE-01 ... LANE-10
       |
       v
GENERIC WORKER
init -> service -> close
       |
       v
worker/results/WI-####.yaml
       |
       v
ORCHESTRATOR VALIDATES RESULT
       |
       +--> accepted -> update Work Unit
       |
       +--> unresolved -> analyse result -> create follow-up Work Unit/Input
       |
       +--> rejected -> block/fail Work Unit
       |
       v
ALL WORK UNITS COMPLETE
       |
       v
COMPLETION PATH GATES
       |
       v
BACKLOG ITEM VALIDATING
       |
       v
VERIFIED
       |
       v
CLOSED
```

Both analysis and execution are therefore controlled by the Orchestrator framework.

---

# 7. Example — BL-001 Controller Traceability

Completion Path:

```text
backlog/paths/BL-001-traceability.yaml
```

Current Orchestrator analysis:

```text
backlog/runtime/BL-001/analysis.yaml
```

Current execution plan:

```text
backlog/runtime/BL-001/execution-plan.yaml
```

The planned route is:

```text
WU-BL001-001
Complete Source Repository Check
       |
       +--> WI-0004
       +--> Generic Worker
       +--> worker/results/WI-0004.yaml
       |
       v
WU-BL001-002
Build Traceability Matrix
       |
       v
WU-BL001-003
Validate traceability gates
       |
       v
WU-BL001-004
Register source-artifact baseline and close BL-001
```

The canonical Source Check Output is the input to the matrix work. Matrix construction does not independently reinvent source facts.

---

# 8. Example — BL-002 Unit Tests

The Orchestrator first analyses:

- production classes;
- existing unit tests;
- test framework/tooling;
- test gaps;
- components requiring mocks/stubs;
- failing/obsolete tests.

It produces:

```text
backlog/runtime/BL-002/analysis.yaml
```

Then creates Work Units such as:

```text
WU-BL002-001 Add tests for Service A
WU-BL002-002 Add tests for Service B
WU-BL002-003 Repair failing Repository helper test
...
```

For independent Work Units it generates separate Worker Inputs and may execute them in parallel.

The Unit Test Backlog Item closes only after the Unit Test Completion Path validates the required suite and outputs.

---

# 9. Example — BL-004 Code Coverage

`BL-004` depends on Unit Tests and Integration Tests.

```text
BL-002 Unit Tests --------+
                          +--> BL-004 Code Coverage
BL-003 Integration Tests -+
```

The Orchestrator cannot simply run coverage because the item is in the Backlog. It first evaluates the dependency rule and Completion Path.

When eligible, it analyses the actual configured coverage tool, modules and threshold policy, generates coverage Work Units, executes them and validates the generated report.

No coverage threshold is invented when the project has not declared one.

---

# 10. Backlog Selection

The default Backlog selection policy is:

```text
highest-priority eligible item
```

An item is eligible only when:

- its dependencies are satisfied;
- it is not blocked by a required user decision;
- required Completion Path exists;
- required source/input resources are available.

For the initial framework rollout, only one Backlog Item is active at a time. Up to ten Work Units within that item may execute in parallel where safe.

---

# 11. Important Separation

```text
BACKLOG ITEM
    defines WHAT outcome is required

COMPLETION PATH
    defines HOW that kind of item becomes complete

ORCHESTRATOR ANALYSIS
    determines WHAT work is actually missing now

EXECUTION PLAN
    converts the analysis into concrete WORK UNITS

WORKER INPUT
    tells the Generic Worker exactly WHAT to execute

GENERIC WORKER
    executes only the input

WORKER RESULT
    returns evidence/output

ORCHESTRATOR VALIDATION
    determines whether the result satisfies the Work Unit and Completion Path

BACKLOG STATUS
    tells whether the outcome is YET_TO_DO / ANALYZING / EXECUTING / VERIFIED / CLOSED
```

This separation is the core of the redesigned framework.
