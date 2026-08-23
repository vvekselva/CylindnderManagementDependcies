# Automation Execution Model

## Purpose

The framework is Backlog-driven, uses mandatory Level 1/2/3 Single Sources of Truth, one primary Orchestrator, up to ten safe orchestration lanes, and fail-closed lifecycle logging.

## 1. Three-Level SSOT

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
worker-input register / lane-status / result
        |
        v
QG-SSOT-001
        |
        +-- FAIL -> repair truth only; NO PLAN/REPLAN
        |
        v
ANALYZE -> PLAN -> EXECUTE -> VALIDATE -> ACCEPT -> CLOSE
```

## 2. Invocation-level logging comes first

Every scheduled/manual coordinator invocation begins with a persisted `ORCHESTRATOR_INVOCATION_START` before repository analysis, planning, lane assignment or application execution.

```text
SCHEDULE TRIGGER
   |
   v
WRITE ORCHESTRATOR_INVOCATION_START
   | fail -> do not start execution
   v
READ LIVE CONTROL REPOSITORY
```

At the end, after every started lane is CLOSED or recovery-closed and runtime/status is synchronized, the coordinator persists `ORCHESTRATOR_INVOCATION_END`. The END record is mandatory even when no eligible work ran or the invocation failed/blocked.

Invocation log pattern:

```text
logs/runs/INV-<invocation-id>-ORCHESTRATOR.md
```

## 3. Level 1 - Backlog Master and Repository Scope

Authoritative files:

```text
backlog/backlog.yaml
repository/project-inventory.yaml
```

Level 1 answers what work exists and which source/module scope may be used. Missing scope is not guessed.

## 4. Level 2 - Backlog Definition and Statement of Work

A complete Level 2 contains/references:

```text
Backlog Definition
  +-- Statement of Work
  +-- Completion Path
  +-- Item Quality Gate
```

`QG-SOW-001` is mandatory.

## 5. Level 3 - Runtime SSOT

Required runtime files:

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

`lane-status.yaml` is the single point of truth for what every lane is doing now.

## 6. Lane lifecycle with mandatory logs

The lifecycle contract is `governance/execution-lifecycle-logging.yaml` and the acceptance gate is `QG-LOG-001`.

```text
LANE_INIT_START     (persist before init)
   |
   v
init()
   |
   v
LANE_INIT_END       (persist after init)
   |
   +-- BLOCKED_BEFORE_SERVICE -> close() -> LANE_CLOSE_END
   |
   v
LANE_SERVICE_START  (persist before service)
   |
   v
service()
   |
   v
LANE_SERVICE_END    (persist after service)
   |
   v
close()
   |
   v
LANE_CLOSE_END      (persist after close; Log State CLOSED)
   |
   v
lane may be released/reused
```

Fail-closed rules:

1. no INIT_START -> init does not run;
2. service runs only after persisted INIT_END = INITIALIZED;
3. no SERVICE_START -> service does not run;
4. SERVICE_END records actual result/evidence/blocker;
5. close always runs for a started attempt;
6. lane is not reusable until CLOSE_END/recovery-close is persisted;
7. result is not accepted unless QG-LOG-001 reconciles required logs.

Lane log pattern:

```text
logs/runs/INV-<invocation-id>-<lane-id>-<run-id>.md
```

The shared `logs/automation-log.md` remains coordinator-owned so ten lanes do not edit one file concurrently.

## 7. Safe lane utilization

The primary coordinator is separate from the ten lane slots. Inside an active invocation, independent controller/endpoint families may use available lanes up to ten.

```text
Find eligible independent families
        |
        v
Fill safe lanes up to 10
        |
        v
Logged INIT -> SERVICE -> CLOSE
        |
        v
Lane released
        |
        v
More safe eligible work?
  YES -> refill same invocation
  NO  -> synchronize checkpoint and end invocation
```

Do not stop at a fixed small batch while more safe independent work remains. Dependent Work Units, shared-file conflicts and resource-lock conflicts remain serialized. Reuse only source-confirmed relationships; no guessing.

## 8. Orchestrator responsibilities

The Orchestrator:

1. persists invocation START;
2. validates/repairs Level 1/2/3 and required gates;
3. performs required analysis;
4. creates/changes plans only when QG-SSOT-001 passes;
5. assigns eligible independent work;
6. records lane assignment in lane-status;
7. enforces lifecycle boundary logging;
8. refills released lanes while eligible work remains;
9. validates results/contracts/QG-LOG-001;
10. synchronizes runtime, blockers, gates, outputs and shared audit log;
11. persists invocation END;
12. obtains required user acceptance before closure.

## 9. Current BL-001 example

BL-001 / WU-BL001-001 remains active. Current trace checkpoint: 134 total endpoints; 22 examined; 22 COMPLETE; 0 UNRESOLVED; 112 not yet examined. The Matrix is locked until 100% trace-result coverage and canonical result validation.

`WU-BL001-001` is lane-parallel for independent controller/endpoint families, and the next invocation must provide execution evidence under the mandatory lifecycle logging contract.

## 10. Source-of-truth precedence

```text
Level 1 -> what work/scope exists
Level 2 -> what the work means
Level 3 -> what is happening now
lane-status.yaml -> current Lane -> Task truth
logs/runs/*.md -> lifecycle execution evidence
logs/automation-log.md -> coordinator-consolidated audit history
TaskStatus/story -> derived human-readable views
```
