# Automation Backlog

The Backlog is the top-level work queue for the automation framework.

Planning is **fail-closed**. A Backlog Item may be catalogued before it is ready, but the Orchestrator must not PLAN or REPLAN it until Level 1, Level 2 and Level 3 are all complete and `QG-SSOT-001` passes.

## Level 1 - Backlog Master SSOT

Authoritative files: `backlog/backlog.yaml` and `repository/project-inventory.yaml`.

Level 1 answers **what work exists and what repository/module scope is authoritative**. A plannable Backlog Item must have a complete master entry including ID, name, type, purpose, priority, state, Level 2 definition, Statement of Work, Completion Path, Quality Gate, dependencies, expected outputs and Level 3 runtime reference. Any project/module classification required by the selected backlog must also be explicit.

## Level 2 - Backlog Definition SSOT

Per-item definition:

```text
backlog/items/BL-*.yaml
```

Level 2 answers **what the work means and what must be delivered**. It includes/references Statement of Work, target/scope, dependencies, deliverables, acceptance criteria, Completion Path, item-specific Quality Gate and Level 3 runtime location.

`QG-SOW-001` is mandatory. Missing, malformed, incomplete or placeholder SOW content fails closed.

## Level 3 - Runtime SSOT

Runtime location:

```text
backlog/runtime/<BL-ID>/
```

Level 3 answers **what is happening now**. Before PLAN/REPLAN it must contain every file required by `backlog/runtime-contract.yaml`:

- `analysis.yaml`;
- `execution-plan.yaml`;
- `work-unit-status.yaml`;
- `gate-status.yaml`;
- `blockers.yaml`;
- `decisions.yaml`;
- `worker-input-register.yaml`;
- `lane-status.yaml` - single point of truth for current lane-to-task assignments;
- `result.yaml`.

`lane-status.yaml` must contain LANE-01 through LANE-10 exactly once. It records each lane's current state, Work Unit/task, Worker Input/run, heartbeat, blocker and release state. A non-IDLE lane must reconcile with current execution. A CLOSED run releases its lane unless a newer assignment replaced it.

The execution-plan file may exist in an initialized/empty state before first planning, and lane-status may initialize with all ten lanes IDLE, but the full Level 3 structure must exist first.

## Three-Level Planning Gate

`QG-SSOT-001 Three-Level SSOT Planning Gate` is fail-closed.

```text
SELECT RUN-ENABLED BACKLOG
        |
        v
LEVEL 1 COMPLETE?
        | NO -> REPAIR LEVEL 1 ONLY / NO PLAN
       YES
        |
        v
LEVEL 2 COMPLETE + QG-SOW-001 PASS?
        | NO -> COMPLETE DEFINITION/SOW ONLY / NO PLAN
       YES
        |
        v
LEVEL 3 COMPLETE INCLUDING LANE STATUS?
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

Passing QG-SSOT-001 does not authorize execution by itself. Dependency gates, item-specific Quality Gates, Work Unit dependencies, result contracts and user acceptance rules still apply.

## Framework files

- `backlog.yaml` - Level 1 authoritative Backlog Master register.
- `repository/project-inventory.yaml` - Level 1 project/module inventory and backlog scope classifications.
- `backlog-item-template.yaml` - standard register entry shape.
- `item-definition-template.yaml` - Level 2 backlog-definition template.
- `statement-of-work-template.yaml` - mandatory Level 2 SOW contract.
- `runtime-contract.yaml` - Level 3 runtime SSOT contract, including lane-status.
- `orchestrator-run-config.yaml` - run selection and fail-closed eligibility rules.
- `paths/*.yaml` - per-backlog Completion Paths.
- `gates/*.yaml` - item-specific Quality Gates.
- `governance/ssot-levels.yaml` - Level 1/2/3 validation and `QG-SSOT-001`.

## Current BL-001 conformance

BL-001 currently has complete Level 1, Level 2 and Level 3 structures. Its Level 3 runtime includes `blockers.yaml` and the new authoritative `lane-status.yaml`. At the current checkpoint all ten lanes are IDLE because WI-0004 Attempt 25 is CLOSED/PARTIAL; WU-BL001-001 remains the active Work Unit for the next scheduled assignment cycle.

Therefore BL-001 may retain/revise its plan only while `QG-SSOT-001` remains PASS. BL-002 through BL-020 remain non-plannable while their required Level 1/2/3 planning references are incomplete.

Worker execution files remain under `worker/` and do not replace the Level 3 runtime SSOT.
