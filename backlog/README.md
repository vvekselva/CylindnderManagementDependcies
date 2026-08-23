# Automation Backlog

The Backlog is the top-level work queue for the automation framework.

Planning is **fail-closed**. A Backlog Item may be catalogued before it is ready, but the Orchestrator must not PLAN or REPLAN it until Level 1, Level 2 and Level 3 are all complete and `QG-SSOT-001` passes.

## Level 1 - Backlog Master SSOT

Authoritative file: `backlog/backlog.yaml`.

Level 1 answers **what work exists**. A plannable Backlog Item must have a complete master entry including ID, name, type, purpose, priority, state, Level 2 definition, Statement of Work, Completion Path, Quality Gate, dependencies, expected outputs and Level 3 runtime reference.

## Level 2 - Backlog Definition SSOT

Per-item definition:

```text
backlog/items/BL-*.yaml
```

Level 2 answers **what the work means and what must be delivered**. It includes/references:

- Statement of Work under `backlog/sow/`;
- target and scope;
- dependencies;
- deliverables;
- acceptance criteria;
- Completion Path;
- item-specific Quality Gate;
- Level 3 runtime location.

`QG-SOW-001` is a mandatory Level 2 component. Missing, malformed, incomplete or placeholder SOW content fails closed.

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
- `result.yaml`.

The execution-plan file may exist in an initialized/empty state before first planning, but the full Level 3 structure must exist first.

## Three-Level Planning Gate

`QG-SSOT-001 Three-Level SSOT Planning Gate` is defined by `governance/ssot-levels.yaml` and is fail-closed.

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
LEVEL 3 COMPLETE?
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
- `backlog-item-template.yaml` - standard register entry shape.
- `item-definition-template.yaml` - Level 2 backlog-definition template.
- `statement-of-work-template.yaml` - mandatory Level 2 SOW contract.
- `runtime-contract.yaml` - Level 3 runtime SSOT contract.
- `orchestrator-run-config.yaml` - run selection and fail-closed eligibility rules.
- `paths/*.yaml` - per-backlog Completion Paths.
- `gates/*.yaml` - item-specific Quality Gates.
- `governance/ssot-levels.yaml` - Level 1/2/3 validation and `QG-SSOT-001`.

## Current BL-001 conformance

BL-001 currently has:

- Level 1 master entry in `backlog/backlog.yaml`;
- Level 2 definition in `backlog/items/BL-001-controller-traceability.yaml`;
- valid SOW in `backlog/sow/BL-001-controller-traceability.yaml`;
- Completion Path and approved Quality Gate;
- complete Level 3 runtime structure, including `blockers.yaml`.

Therefore BL-001 may retain/revise its plan only while `QG-SSOT-001` remains PASS. BL-002 through BL-020 remain non-plannable while their required Level 1/2/3 planning references are incomplete.

Worker execution files remain under `worker/` and do not replace the Level 3 runtime SSOT.
