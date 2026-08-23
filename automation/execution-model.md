# Automation Execution Model

## Purpose

The framework is Backlog-driven, uses mandatory Level 1/2/3 Single Sources of Truth, one primary Orchestrator, up to ten safe execution lanes, fail-closed lifecycle logging and a local real-parallel execution backend.

## 1. Architecture responsibility boundary

GitHub is the Version Control System and durable persistence layer. The Automation Tool is the Orchestrator and Execution Engine.

```text
                         USER
                          |
                          v
              PRIMARY AUTOMATION TOOL
                  / ORCHESTRATOR
                          |
          read / validate / plan / dispatch
                          |
                          v
             Level 1 / 2 / 3 SSOT
             persisted/versioned in GitHub
                          |
                          v
                  lane-dispatch.yaml
                          |
                          v
              LOCAL EXECUTION ENGINE
              LOCAL_PROCESS_POOL <= 10
                          |
          +---------------+---------------+
          |       |       |       |       |
          v       v       v       v       v
       LANE-01  LANE-02  LANE-03 ...   LANE-10
       worker   worker   worker         worker
          |       |       |              |
          +-------+-------+--------------+
                          |
              logs + source evidence
                          |
                          v
                 LOCAL AGGREGATOR
                          |
             QG-LOG-001 + QG-LANE-001
                          |
                          v
               PRIMARY ORCHESTRATOR
                 validates evidence
                          |
                          v
                  synchronized SSOT
                          |
                          v
                        GitHub
                 VCS + persistence
```

GitHub Actions is not required for normal orchestration execution. GitHub participates before execution as the versioned source/SSOT and after execution as durable persistence for synchronized results.

## 2. Three-Level SSOT

```text
LEVEL 1 - BACKLOG MASTER / REPOSITORY SCOPE
backlog/backlog.yaml + repository/project-inventory.yaml
        |
        v
LEVEL 2 - BACKLOG DEFINITION
item + SOW + Completion Path + Quality Gate
        |
        v
LEVEL 3 - RUNTIME
analysis / plan / work units / gates / blockers / decisions
worker-input register / lane-status / lane-dispatch / local-execution / statistics / result
        |
        v
QG-SSOT-001
        |
        +-- FAIL -> repair truth only; NO PLAN/REPLAN
        |
        v
ANALYZE -> PLAN -> EXECUTE -> VALIDATE -> ACCEPT -> CLOSE
```

## 3. Invocation-level logging comes first

Every scheduled/manual coordinator invocation begins with a persisted `ORCHESTRATOR_INVOCATION_START` before analysis, planning, lane assignment or application execution. At the end, after every started lane is CLOSED or recovery-closed and runtime/status is synchronized, the coordinator persists `ORCHESTRATOR_INVOCATION_END`.

## 4. Level 1 - Backlog Master and Repository Scope

Authoritative files are `backlog/backlog.yaml` and `repository/project-inventory.yaml`. Level 1 answers what work exists and which source/module scope may be used. Missing scope is not guessed.

## 5. Level 2 - Backlog Definition and Statement of Work

A complete Level 2 contains the Backlog Definition, Statement of Work, Completion Path and Item Quality Gate. `QG-SOW-001` is mandatory.

## 6. Level 3 - Runtime SSOT

Required runtime includes `analysis.yaml`, `execution-plan.yaml`, `work-unit-status.yaml`, `gate-status.yaml`, `blockers.yaml`, `decisions.yaml`, `worker-input-register.yaml`, `lane-status.yaml`, `lane-dispatch.yaml`, `local-execution.yaml`, `execution-statistics.yaml` and `result.yaml`.

`lane-status.yaml` is the single point of truth for what every lane is doing now. `local-execution.yaml` is the current execution-engine truth for process IDs, measured concurrency, aggregate evidence and closure.

## 7. Local lane lifecycle with mandatory logs

The lifecycle contract is `governance/execution-lifecycle-logging.yaml` and the acceptance gate is `QG-LOG-001`.

```text
LANE_INIT_START -> init() -> LANE_INIT_END
                         |
                         +-- BLOCKED_BEFORE_SERVICE -> close() -> LANE_CLOSE_END
                         |
                         v
LANE_SERVICE_START -> service() -> LANE_SERVICE_END -> close() -> LANE_CLOSE_END
```

A lane is not reusable until CLOSE/recovery-close evidence is persisted. Individual lane logs are transient and must be aggregated, verified, deleted and rescanned to zero before execution closure.

## 8. Safe lane utilization

The primary coordinator is separate from the ten lane slots. Independent controller/endpoint families may use available workers up to ten. `QG-LANE-001` measures actual overlapping SERVICE intervals; distinct lane IDs or process creation alone do not prove concurrency.

## 9. Orchestrator responsibilities

The Automation Tool / Orchestrator:

1. reads versioned SSOT/source state from GitHub or an in-sync local checkout;
2. validates Level 1/2/3 and required gates;
3. performs required analysis and planning;
4. creates the authoritative `lane-dispatch.yaml`;
5. fires the local execution engine when the execution host is available;
6. starts up to ten independent OS workers through `LOCAL_PROCESS_POOL`;
7. enforces lifecycle logging and lane state;
8. measures concurrency and aggregates results;
9. validates source evidence and result contracts;
10. synchronizes canonical runtime/log/evidence changes back to GitHub;
11. obtains required user acceptance before backlog closure.

## 10. GitHub responsibilities

GitHub:

1. stores `vvekselva/CylinderManagement` source code and the frozen source commit;
2. stores `vvekselva/CylindnderManagementDependcies` automation control/SSOT files;
3. versions changes and provides durable history;
4. receives synchronized runtime, logs and accepted evidence after execution.

GitHub is not required to host workers, start a workflow, provide a runner or generate a workflow run ID for normal Cylinder orchestration.

## 11. Current BL-001 example

BL-001 / WU-BL001-001 remains active. Current accepted trace checkpoint: 134 total endpoints; 37 examined; 35 COMPLETE; 2 UNRESOLVED; 97 not yet examined. The Traceability Matrix remains locked until Source Check reaches 100% trace-result coverage and canonical result validation.

Current real-parallel state: `LOCAL_PROCESS_POOL`, 10 safe tasks ready, `local-execution.yaml = READY_FOR_LOCAL_FIRE`, and `QG-LANE-001 = READY_FOR_MEASUREMENT`.

## 12. Source-of-truth precedence

```text
Level 1 -> what work/scope exists
Level 2 -> what the work means
Level 3 -> what is happening now
lane-status.yaml -> current Lane -> Task truth
local-execution.yaml -> real executor/process/concurrency truth
logs/runs/*.md -> lifecycle execution evidence
logs/automation-log.md -> coordinator-consolidated audit history
TaskStatus/story -> derived human-readable views
GitHub -> versioning and durable persistence of the above
```
