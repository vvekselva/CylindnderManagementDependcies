# Automation Execution Model

## Purpose

The automation framework is **Backlog-driven** and uses a mandatory **three-level Single Source of Truth (SSOT)** model. The Orchestrator may not PLAN or REPLAN a Backlog Item until Level 1, Level 2 and Level 3 are complete for that item and `QG-SSOT-001` passes.

The Generic Worker remains task-agnostic. It executes only approved Worker Inputs generated from an authorized Execution Plan.

---

# 1. Three-Level SSOT Architecture

```text
LEVEL 1 - BACKLOG MASTER SSOT
backlog/backlog.yaml
        |
        v
LEVEL 2 - BACKLOG DEFINITION SSOT
backlog/items/BL-*.yaml
backlog/sow/BL-*.yaml
backlog/paths/BL-*.yaml
backlog/gates/BL-*.yaml
        |
        v
LEVEL 3 - RUNTIME SSOT
backlog/runtime/<BL-ID>/
        |
        v
QG-SSOT-001
        |
        +-- FAIL -> REPAIR LEVEL 1/2/3 ONLY; NO PLAN
        |
        v
REQUIRED ANALYSIS
        |
        v
EXECUTION PLAN / REPLAN
        |
        v
WORK UNITS
        |
        +-------------------------+
        |                         |
        v                         v
GENERIC WORKER             ORCHESTRATION LANE
        |                         |
        +------------+------------+
                     |
                     v
             ORCHESTRATOR VALIDATION
                     |
                     v
              USER ACCEPTANCE
                     |
                     v
               VERIFIED/CLOSED
```

---

# 2. Level 1 - Backlog Master SSOT

Authoritative file:

```text
backlog/backlog.yaml
```

Level 1 answers **what work exists**. For an item to be plannable, its master entry must provide:

- ID;
- name;
- type;
- purpose;
- priority;
- lifecycle state;
- Level 2 item-definition reference;
- Statement of Work reference;
- Completion Path reference;
- item-specific Quality Gate reference;
- dependencies;
- expected outputs;
- Level 3 runtime reference.

A backlog may be catalogued with null planning references, but such an item is intentionally non-plannable.

---

# 3. Level 2 - Backlog Definition SSOT

Authoritative definition pattern:

```text
backlog/items/BL-*.yaml
```

A complete Level 2 definition is composed of:

```text
Backlog Definition
    +-- Statement of Work
    +-- Completion Path
    +-- Item-Specific Quality Gate
```

The definition/SOW establishes:

- purpose and problem statement;
- target repository/baseline;
- in-scope and out-of-scope work;
- dependencies;
- deliverables;
- execution requirements;
- acceptance criteria;
- completion definition;
- Quality Gate requirements;
- runtime location.

`QG-SOW-001` is mandatory. The Orchestrator cannot invent missing scope or requirements.

---

# 4. Level 3 - Runtime SSOT

Authoritative location:

```text
backlog/runtime/<BL-ID>/
```

Required files are defined by `backlog/runtime-contract.yaml`:

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

Level 3 answers **what is happening now**.

The Execution Plan file must exist before first planning, but may be initialized/empty. Missing runtime files block PLAN/REPLAN. `blockers.yaml` must explicitly record active blockers/evidence gaps or an empty set.

---

# 5. Planning Gate

`QG-SSOT-001 Three-Level SSOT Planning Gate` is fail-closed.

```text
SSOT-L1 COMPLETE
   AND
SSOT-L2 COMPLETE + QG-SOW-001 PASS
   AND
SSOT-L3 COMPLETE
   =
QG-SSOT-001 PASS
```

Only after that may required analysis feed a new or materially changed `execution-plan.yaml`.

Passing QG-SSOT-001 does not authorize execution by itself. `QG-DEP-001`, item-specific Quality Gates, Work Unit dependencies, result contracts and user acceptance still apply.

---

# 6. Backlog Lifecycle

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

`WAITING_FOR_DEPENDENCY` and `WAITING_FOR_DECISION` may be used as needed.

An item that fails QG-SSOT-001 may remain catalogued but must not enter PLAN/REPLAN.

---

# 7. Orchestrator Responsibilities

The Orchestrator:

1. selects a run-enabled item;
2. validates/repairs Level 1;
3. validates/repairs Level 2 and enforces QG-SOW-001;
4. initializes/repairs Level 3;
5. evaluates QG-SSOT-001;
6. performs required analysis inside Level 3;
7. creates/changes the Execution Plan only after QG-SSOT-001 PASS;
8. evaluates dependencies and item-specific Quality Gates;
9. creates Work Units;
10. generates Worker Inputs for approved Work Units;
11. schedules only eligible execution;
12. consumes/validates Worker results;
13. synchronizes analysis, plan, work-unit state, gates, blockers, decisions and result;
14. produces required artifacts;
15. obtains required user acceptance before closure.

The Orchestrator is separate from execution lanes and remains the single primary coordinator.

---

# 8. Generic Worker

The Generic Worker performs only:

```text
read input -> init() -> service() -> close() -> result
```

It does not select Backlog Items, define SOWs, create Completion Paths, alter Quality Gates, create its own next task or decide closure.

---

# 9. Work Units and Parallelism

An Execution Plan decomposes work into Work Units. Each Work Unit defines purpose, dependencies, parallelism, expected result, validation rule and execution mechanism.

Independent Work Units may use available orchestration lanes only when the Completion Path and dependencies permit it. Dependent Work Units remain locked.

---

# 10. Current BL-001 Example

```text
Level 1
backlog/backlog.yaml
   -> BL-001 complete master entry

Level 2
backlog/items/BL-001-controller-traceability.yaml
backlog/sow/BL-001-controller-traceability.yaml
backlog/paths/BL-001-traceability.yaml
backlog/gates/BL-001-traceability.yaml

Level 3
backlog/runtime/BL-001/
   analysis.yaml
   execution-plan.yaml
   work-unit-status.yaml
   gate-status.yaml
   blockers.yaml
   decisions.yaml
   worker-input-register.yaml
   result.yaml

QG-SSOT-001 = PASS
QG-SOW-001 = PASS
QG-DEP-001 = PASS
```

Therefore BL-001 may retain or revise its plan only while those SSOT conditions remain valid. Its downstream work still remains governed by the Traceability Quality Gates and Work Unit dependencies.

BL-002 through BL-020 remain non-plannable until their own Level 1/2/3 requirements are complete.

---

# 11. Source of Truth Precedence

```text
Level 1 Backlog Master -> authoritative for what work exists
Level 2 Definition/SOW -> authoritative for what the work means
Level 3 Runtime -> authoritative for what is happening now
Generated TaskStatus/story -> human-readable derived view only
```

A stale dashboard or story never overrides canonical Level 1/2/3 data.
