# Backlog-Driven Orchestration Contract

## Purpose

The automation framework is driven by a **Backlog**. A Backlog Item represents one outcome the automation must complete. The Orchestrator owns selection, analysis, planning, execution coordination, validation and closure; the Generic Worker remains task-agnostic and executes only approved Worker Inputs.

## Mandatory three-level Single Source of Truth

No Backlog Item may be planned or replanned until **Level 1, Level 2 and Level 3 are complete for that item and `QG-SSOT-001` passes**.

### Level 1 - Backlog Master SSOT

Authoritative file: `backlog/backlog.yaml`.

It answers **what work exists**. For a plannable item it must provide the authoritative ID, name, type, purpose, priority, state, Level 2 definition reference, Statement of Work reference, Completion Path, Quality Gate, dependencies, expected outputs and Level 3 runtime reference.

### Level 2 - Backlog Definition SSOT

Authoritative item files: `backlog/items/BL-*.yaml` together with the referenced `backlog/sow/BL-*.yaml`, Completion Path and item-specific Quality Gate.

It answers **what this Backlog Item means and what must be delivered**. It contains/references the Statement of Work, target, scope, dependencies, deliverables, acceptance criteria, Completion Path, Quality Gates and runtime location.

`QG-SOW-001` is a mandatory Level 2 component. Missing or incomplete SOW fails closed.

### Level 3 - Runtime SSOT

Authoritative directory: `backlog/runtime/<BL-ID>/`.

It answers **what is happening now**. Before PLAN/REPLAN the directory must contain all files required by `backlog/runtime-contract.yaml`:

```text
analysis.yaml
execution-plan.yaml
work-unit-status.yaml
gate-status.yaml
blockers.yaml
decisions.yaml
worker-input-register.yaml
result.yaml
```

The execution-plan file may be initialized/empty before first planning, but it must exist. A missing runtime file blocks planning.

## Fail-closed planning rule

```text
SELECT BACKLOG ITEM
       |
       v
SSOT-L1 COMPLETE?
       | NO -> REPAIR LEVEL 1 ONLY / NO PLAN
      YES
       |
       v
SSOT-L2 COMPLETE + QG-SOW-001 PASS?
       | NO -> COMPLETE DEFINITION/SOW ONLY / NO PLAN
      YES
       |
       v
SSOT-L3 COMPLETE?
       | NO -> INITIALIZE/REPAIR RUNTIME ONLY / NO PLAN
      YES
       |
       v
QG-SSOT-001 PASS
       |
       v
REQUIRED ANALYSIS
       |
       v
PLAN / REPLAN MAY BEGIN
```

`QG-SSOT-001` passing does not by itself authorize execution. Dependency and item-specific Quality Gates still apply.

## Top-level hierarchy

```text
BACKLOG MASTER (LEVEL 1)
   |
   +-- BACKLOG DEFINITION + SOW (LEVEL 2)
          |
          +-- RUNTIME SSOT (LEVEL 3)
                 |
                 +-- COMPLETION PATH
                        |
                        +-- ANALYZE
                        +-- PLAN
                        +-- GENERATE WORKER INPUTS
                        +-- EXECUTE
                        +-- VALIDATE
                        +-- USER ACCEPTANCE
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

## Orchestrator responsibilities

The Orchestrator owns:

- selecting the next run-enabled Backlog Item;
- validating/repairing the three SSOT levels;
- enforcing `QG-SSOT-001` before PLAN/REPLAN;
- enforcing `QG-SOW-001`, dependency gates and item-specific Quality Gates;
- reading the Level 2 definition, SOW and Completion Path;
- analysing repository/current state inside the Level 3 runtime area;
- creating/changing an Execution Plan only after the planning gate passes;
- deciding concrete Work Units;
- generating Worker Inputs from approved Work Units;
- scheduling Worker execution;
- consuming and validating Worker results;
- updating Level 3 analysis, gates, blockers, work-unit status, decisions and result;
- producing required artifacts;
- closing only after all automatic gates and required user acceptance pass.

## Generic Worker responsibility

The Generic Worker owns only:

```text
read input -> init -> service -> close -> return result
```

It does not choose Backlog Items, define Statements of Work, create Completion Paths, alter Quality Gates, decide priorities or authorize closure.

## Backlog lifecycle

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
WAITING_FOR_USER_VERIFICATION
   |
   v
VERIFIED
   |
   v
CLOSED
```

`WAITING_FOR_DEPENDENCY` and `WAITING_FOR_DECISION` may be used when appropriate.

A catalogued item whose Level 1/2/3 prerequisites are incomplete remains non-plannable even if it is run-enabled accidentally.

## Statement of Work

Every executable Backlog Item must reference a structurally valid SOW under `backlog/sow/`. The SOW defines objective, problem statement, scope, target, deliverables, execution requirements, dependencies, acceptance criteria, Quality Gate requirements and completion definition. The Orchestrator may not invent missing scope.

## Completion Path

Every executable Backlog Item must reference a Completion Path. The path defines ordered execution phases, prerequisites, analysis requirements, planning rules, Worker Input rules, expected artifacts, validation gates, blocker handling and completion conditions.

## Analysis and planning

Analysis is an Orchestrator responsibility and is persisted in Level 3 `analysis.yaml`.

After required analysis, the Orchestrator may create or modify `execution-plan.yaml` only when `QG-SSOT-001` is PASS. Every Work Unit must define ID, Backlog Item, Completion Path step, purpose, dependencies/ordering, parallelism, permissions, expected result, validation rule and Worker Input.

## Worker Input and execution

The Orchestrator converts approved Work Units into `worker/inputs/WI-####.yaml`, submits them to the Generic Worker, tracks runs/results, validates result contracts and updates Level 3 runtime state. Independent Work Units may use available lanes only when the Completion Path permits it.

## Validation and closure

Worker completion does not imply Backlog completion. Required Quality Gates must pass, outputs must exist, blockers/unresolved items must be accounted for, all required runs must be closed, and user acceptance must be obtained where configured.

A Backlog Item may move to `CLOSED` only when all mandatory Completion Path steps, automatic gates, artifact requirements, runtime consistency checks and required user acceptance are complete.
