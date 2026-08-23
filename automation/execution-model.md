# Automation Execution Model

## Purpose

The automation framework is **Backlog-driven** and uses a mandatory **three-level Single Source of Truth (SSOT)** model. The Orchestrator may not PLAN or REPLAN a Backlog Item until Level 1, Level 2 and Level 3 are complete for that item and `QG-SSOT-001` passes.

The Generic Worker remains task-agnostic. It executes only approved Worker Inputs generated from an authorized Execution Plan.

---

# 1. Three-Level SSOT Architecture

```text
LEVEL 1 - BACKLOG MASTER / REPOSITORY SCOPE
backlog/backlog.yaml + repository/project-inventory.yaml
        |
        v
LEVEL 2 - BACKLOG DEFINITION SSOT
backlog/items/BL-*.yaml + SOW + Completion Path + Quality Gate
        |
        v
LEVEL 3 - RUNTIME SSOT
backlog/runtime/<BL-ID>/
        |
        +-- analysis / plan / work-unit / gates / blockers
        +-- worker-input register / decisions / result
        +-- lane-status.yaml  <-- current lane-to-task truth
        |
        v
QG-SSOT-001
        |
        +-- FAIL -> REPAIR LEVEL 1/2/3 ONLY; NO PLAN
        |
        v
REQUIRED ANALYSIS -> EXECUTION PLAN -> WORK UNITS
        |
        +------------------------------+
        |                              |
        v                              v
ORCHESTRATION LANES              GENERIC WORKER
LANE-01 ... LANE-10             approved WI only
        |                              |
        +---------------+--------------+
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

# 2. Level 1 - Backlog Master and Repository Scope

Authoritative files:

```text
backlog/backlog.yaml
repository/project-inventory.yaml
```

Level 1 answers **what work exists and what repository/module scope is authoritative**. Missing module scope needed by a backlog may not be guessed.

---

# 3. Level 2 - Backlog Definition SSOT

A complete Level 2 definition is composed of:

```text
Backlog Definition
    +-- Statement of Work
    +-- Completion Path
    +-- Item-Specific Quality Gate
```

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
lane-status.yaml
result.yaml
```

Level 3 answers **what is happening now**. `lane-status.yaml` specifically answers **what is each lane doing now?** It is not a historical log; it is live current state.

---

# 5. Authoritative Lane Runtime

The orchestration pool has ten lanes and one separate primary coordinator.

```text
PRIMARY COORDINATOR
      |
      +-- LANE-01
      +-- LANE-02
      +-- ...
      +-- LANE-10
```

Canonical lane file:

```text
backlog/runtime/<BL-ID>/lane-status.yaml
```

Every lane record contains:

- current state;
- current Work Unit;
- current task/assignment;
- Worker Input when applicable;
- Run ID / attempt;
- start time;
- last heartbeat;
- plain-English blocker when blocked.

Valid states are:

```text
IDLE
ASSIGNED
INITIALIZING
WORKING
BLOCKED
WAITING
CLOSING
STALE
```

Rules:

1. One lane has at most one active job.
2. A non-IDLE lane must identify its current Work Unit/task.
3. A WORKING lane must identify its current run and heartbeat.
4. A BLOCKED lane must explain the blocker in plain English.
5. A CLOSED run releases the lane unless a newer assignment replaced it.
6. Summary counts must reconcile exactly to all ten lane records.
7. Historical Worker logs never override `lane-status.yaml` for current lane state.

---

# 6. Planning Gate

`QG-SSOT-001 Three-Level SSOT Planning Gate` is fail-closed. Level 3 is not COMPLETE when `lane-status.yaml` is missing or inconsistent.

Passing QG-SSOT-001 does not authorize execution by itself. `QG-DEP-001`, item-specific Quality Gates, Work Unit dependencies, result contracts and user acceptance still apply.

---

# 7. Orchestrator Responsibilities

The Orchestrator:

1. selects a run-enabled item;
2. validates/repairs Level 1;
3. validates/repairs Level 2 and enforces QG-SOW-001;
4. initializes/repairs Level 3, including lane-status;
5. evaluates QG-SSOT-001;
6. performs required analysis inside Level 3;
7. creates/changes the Execution Plan only after QG-SSOT-001 PASS;
8. evaluates dependencies and item-specific Quality Gates;
9. creates Work Units;
10. generates Worker Inputs for approved Work Units;
11. assigns only eligible independent work to available lanes;
12. records assignment in lane-status before work begins;
13. updates lane lifecycle/heartbeat/blocker state while work runs;
14. consumes/validates Worker results;
15. releases lanes after run close;
16. synchronizes analysis, plan, work-unit state, gates, blockers, decisions, lane status and result;
17. produces required artifacts and obtains required user acceptance.

The Orchestrator is separate from execution lanes and remains the single primary coordinator.

---

# 8. Generic Worker

The Generic Worker performs only:

```text
read input -> init() -> service() -> close() -> result
```

It does not select Backlog Items, define SOWs, create Completion Paths, alter Quality Gates, create its own next task or decide closure. It is a separate component and does not consume one of the ten orchestration lanes.

---

# 9. Work Units and Parallelism

An Execution Plan decomposes work into Work Units. Independent Work Units or independent endpoint/controller-family tasks inside an approved Work Unit may use available lanes when dependencies and Completion Path rules allow it. Dependent work remains locked.

Lane assignment sequence:

```text
Eligible work
   |
   v
Coordinator selects available lane
   |
   v
Write ASSIGNED to lane-status.yaml
   |
   v
INIT -> WORKING (+ heartbeat)
   |
   +--> BLOCKED / WAITING / STALE when needed
   |
   v
CLOSING -> run CLOSED
   |
   v
Release lane -> IDLE
```

---

# 10. Current BL-001 Example

Current Level 3 includes `lane-status.yaml`. At the checkpoint after WI-0004 Attempt 25, all ten lanes are IDLE because the run is CLOSED/PARTIAL, while BL-001 / WU-BL001-001 remains active for the next scheduled assignment cycle.

Traceability checkpoint:

- 134 total endpoints;
- 22 examined;
- 22 COMPLETE;
- 0 UNRESOLVED;
- 112 not yet examined;
- Matrix construction remains locked until 100% trace-result coverage and a valid canonical WI-0004 result.

---

# 11. Source of Truth Precedence

```text
Level 1 Backlog/Repository Scope -> what work/scope exists
Level 2 Definition/SOW          -> what the work means
Level 3 Runtime                 -> what is happening now
lane-status.yaml                -> what every lane is doing now
TaskStatus/story                -> derived human-readable views only
```

A stale dashboard, historical run log or story never overrides canonical Level 1/2/3 runtime data.
