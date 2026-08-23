# Backlog-Driven Orchestration Contract

## Purpose

The automation framework is driven by a **Backlog**. A Backlog Item represents one outcome the automation must complete. The Orchestrator owns selection, analysis, planning, execution coordination, lane assignment, validation and closure; the Generic Worker remains task-agnostic and executes only approved Worker Inputs.

## Mandatory three-level Single Source of Truth

No Backlog Item may be planned or replanned until **Level 1, Level 2 and Level 3 are complete for that item and `QG-SSOT-001` passes**.

### Level 1 - Backlog Master and Repository Scope SSOT

Authoritative files: `backlog/backlog.yaml` and `repository/project-inventory.yaml`.

It answers **what work exists and what repository/module scope is authoritative**. For a plannable item it provides the Backlog master entry and any cross-backlog module classifications required for safe scope definition.

### Level 2 - Backlog Definition SSOT

Authoritative item files: `backlog/items/BL-*.yaml` together with the referenced `backlog/sow/BL-*.yaml`, Completion Path and item-specific Quality Gate.

It answers **what this Backlog Item means and what must be delivered**. `QG-SOW-001` is mandatory; missing or incomplete SOW fails closed.

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
lane-status.yaml
result.yaml
```

`lane-status.yaml` is the single point of truth for **what every orchestration lane is working on now**. It records LANE-01 through LANE-10, each lane's lifecycle state, current Work Unit/task, Worker Input/run, heartbeat, blocker and release state. The file may initialize with all lanes IDLE. Missing or inconsistent lane state makes Level 3 incomplete.

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
SSOT-L3 COMPLETE INCLUDING LANE STATUS?
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

## Orchestrator responsibilities

The Orchestrator owns:

- selecting the next run-enabled Backlog Item;
- validating/repairing the three SSOT levels;
- enforcing `QG-SSOT-001` before PLAN/REPLAN;
- enforcing `QG-SOW-001`, dependency gates and item-specific Quality Gates;
- analysing repository/current state inside the Level 3 runtime area;
- creating/changing an Execution Plan only after the planning gate passes;
- deciding concrete Work Units;
- generating Worker Inputs from approved Work Units;
- assigning eligible independent orchestration work to available lanes;
- writing the assignment to `lane-status.yaml` before execution starts;
- updating lane state/heartbeat/blocker during execution;
- releasing the lane in `lane-status.yaml` when the run closes;
- consuming and validating Worker results;
- updating Level 3 analysis, gates, blockers, work-unit status, decisions and result;
- producing required artifacts;
- closing only after all automatic gates and required user acceptance pass.

## Lane lifecycle

Every orchestration lane has exactly one current state:

```text
IDLE -> ASSIGNED -> INITIALIZING -> WORKING -> CLOSING -> IDLE
                                  |          |
                                  +-> BLOCKED
                                  +-> WAITING
                                  +-> STALE
```

A non-IDLE lane must identify its current Work Unit/task. A WORKING lane must identify its current run and heartbeat. A BLOCKED lane must explain the blocker in plain English. A CLOSED run releases the lane unless a newer assignment has already replaced it.

The coordinator is not a lane. The separate Generic Worker also does not consume an orchestration lane.

## Generic Worker responsibility

The Generic Worker owns only:

```text
read input -> init -> service -> close -> return result
```

It does not choose Backlog Items, define Statements of Work, create Completion Paths, alter Quality Gates, decide priorities or authorize closure.

## Backlog lifecycle

```text
YET_TO_DO -> READY -> ANALYZING -> PLANNED -> EXECUTING
                                      |          |
                                      |          +-> PARTIAL / BLOCKED / FAILED
                                      v
                                  VALIDATING -> WAITING_FOR_USER_VERIFICATION -> VERIFIED -> CLOSED
```

`WAITING_FOR_DEPENDENCY` and `WAITING_FOR_DECISION` may be used when appropriate.

## Statement of Work and Completion Path

Every executable Backlog Item must reference a structurally valid SOW under `backlog/sow/` and a Completion Path. The Orchestrator may not invent missing scope. The path defines ordered execution phases, prerequisites, analysis requirements, planning rules, Worker Input rules, expected artifacts, validation gates, blocker handling and completion conditions.

## Analysis, planning and execution

Analysis is persisted in Level 3 `analysis.yaml`. After required analysis, the Orchestrator may create or modify `execution-plan.yaml` only when `QG-SSOT-001` is PASS. Independent Work Units may use available lanes only when the Completion Path permits it, and every live assignment must be reflected in `lane-status.yaml`.

The Orchestrator converts approved Work Units into `worker/inputs/WI-####.yaml`, submits them to the Generic Worker when appropriate, tracks runs/results, validates result contracts and synchronizes Level 3 runtime state.

## Validation and closure

Worker completion does not imply Backlog completion. Required Quality Gates must pass, outputs must exist, blockers/unresolved items must be accounted for, all required runs must be closed, all lanes must reconcile to their current assignments, and user acceptance must be obtained where configured.

A Backlog Item may move to `CLOSED` only when all mandatory Completion Path steps, automatic gates, artifact requirements, runtime consistency checks and required user acceptance are complete.
