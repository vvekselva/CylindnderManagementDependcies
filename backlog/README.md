# Automation Backlog

The Backlog is the top-level work queue for the CylinderManagement automation framework. `backlog/backlog.yaml` is the authoritative master register. Scheduler invocations read the register and `backlog/orchestrator-run-config.yaml`, then select the highest-priority **eligible run-enabled** Backlog Item. The scheduler is not permanently tied to BL-001.

Planning is **fail-closed**. A Backlog Item may be catalogued before it is ready, but the Orchestrator must not PLAN or REPLAN it until Level 1, Level 2 and Level 3 are complete and `QG-SSOT-001` passes. Execution additionally requires the SOW, dependency and item-specific gates.

## Level 1 - Backlog Master SSOT

Authoritative files: `backlog/backlog.yaml` and `repository/project-inventory.yaml`.

Level 1 answers **what work exists and what repository/module scope is authoritative**. A plannable Backlog Item must have a complete master entry including ID, name, type, purpose, priority, state, Level 2 definition, Statement of Work, Completion Path, Quality Gate, dependencies, expected outputs and Level 3 runtime reference.

The current register contains **21 Backlog Items**. BL-002 was inserted as the Controller Dependency Matrix to Human-Readable Stories item; the former BL-002 through BL-020 were shifted to BL-003 through BL-021.

## Level 2 - Backlog Definition SSOT

Per-item definition:

```text
backlog/items/BL-*.yaml
```

Level 2 answers **what the work means and what must be delivered**. It includes/references the Statement of Work, target/scope, dependencies, deliverables, acceptance criteria, Completion Path, item-specific Quality Gate and Level 3 runtime location.

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
- `lane-status.yaml`;
- `lane-dispatch.yaml`;
- `local-execution.yaml`;
- `execution-statistics.yaml`;
- `result.yaml`.

`lane-status.yaml` contains LANE-01 through LANE-10 exactly once. The execution plan and lane dispatch may initialize empty before first planning/execution, but the full Level 3 structure must exist first.

## Three-Level Planning Gate

```text
SELECT HIGHEST-PRIORITY ELIGIBLE RUN-ENABLED BACKLOG ITEM
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
QG-DEP-001 + ITEM GATES
        |
        v
ANALYZE / PLAN / EXECUTE AS AUTHORIZED
```

## BL-001 -> BL-002 -> testing chain

The critical functional-quality chain is now:

```text
BL-001 Controller Traceability
        |
        | FINAL_VALIDATED matrix + BL-001 VERIFIED/CLOSED
        v
BL-002 Human-Readable Stories
        |
        | technical validation
        v
User-approved Stories
        |
        +--------------------------+
        |                          |
        v                          v
BL-003 Unit Testing        Approved Use Cases
                                   |
                                   | user approval for testing
                                   v
                         BL-004 Integration + Use Case Testing
                                   |
                                   v
                         BL-005 Code Coverage Report
```

BL-002 converts each final Controller Dependency Matrix flow into a detailed Story that explains, where source evidence proves it, the request/trigger, input values, validations, business rules, ordered component calls, database/file/API reads and writes, state/audit side effects, success output and alternate/error paths. The Orchestrator may technically validate a Story, but **only the user may approve it**.

One or more approved Stories may then be combined into a candidate Use Case. Only a user-approved `APPROVED_FOR_TESTING` Use Case may become authoritative input for Use Case/integration testing. Matrix -> Story -> Use Case -> Test Scenario traceability is maintained in `traceability/controller-story-usecase-map.yaml`.

## Current eligibility

- **BL-001 Controller Traceability** - current execution item, still PARTIAL until final traceability reconciliation/validation and closure gates complete.
- **BL-002 Controller Dependency Matrix to Human-Readable Stories** - run-enabled with complete Level 1/2/3 framework, but `WAITING_FOR_DEPENDENCY`; it cannot execute until BL-001 is VERIFIED or CLOSED and the final matrix is validated.
- **BL-003 Unit Test Completion** - waits for approved BL-002 Stories and its own future Level 2/3/gates.
- **BL-004 Integration Test Completion** - waits for approved BL-002 Use Cases/scenarios and its own future Level 2/3/gates; it owns Use Case test execution.
- **BL-005 Code Coverage Report** - waits for BL-003 and BL-004.
- **BL-006 through BL-021** - remain registered but are not run-enabled/plannable until their required SSOT/SOW/gates are completed.

Passing `QG-SSOT-001` never bypasses dependency, source, recovery, lifecycle, item-specific or user-approval gates.
