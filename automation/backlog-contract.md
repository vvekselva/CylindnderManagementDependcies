# Backlog-Driven Orchestration Contract

## Purpose

The automation framework is driven by a Backlog. The Orchestrator owns selection, analysis, planning, lane assignment/utilization, lifecycle logging, validation and closure. The Generic Worker remains task-agnostic and executes only approved Worker Inputs.

## Mandatory three-level Single Source of Truth

No Backlog Item may be planned or replanned until Level 1, Level 2 and Level 3 are complete and `QG-SSOT-001` passes.

### Level 1 - Backlog Master and Repository Scope SSOT

Authoritative files: `backlog/backlog.yaml` and `repository/project-inventory.yaml`.

### Level 2 - Backlog Definition SSOT

Authoritative item files: `backlog/items/BL-*.yaml` plus the referenced SOW, Completion Path and item-specific Quality Gate. `QG-SOW-001` is mandatory.

### Level 3 - Runtime SSOT

Required files include `analysis.yaml`, `execution-plan.yaml`, `work-unit-status.yaml`, `gate-status.yaml`, `blockers.yaml`, `decisions.yaml`, `worker-input-register.yaml`, `lane-status.yaml` and `result.yaml`.

`lane-status.yaml` is the single point of truth for what every orchestration lane is doing now.

## Fail-closed planning rule

```text
SSOT-L1 COMPLETE?
  NO -> repair Level 1 only / NO PLAN
  YES
SSOT-L2 COMPLETE + QG-SOW-001 PASS?
  NO -> complete definition/SOW/path/gate only / NO PLAN
  YES
SSOT-L3 COMPLETE?
  NO -> initialize/repair runtime only / NO PLAN
  YES
QG-SSOT-001 PASS -> required analysis -> PLAN/REPLAN may begin
```

## Mandatory execution lifecycle logging

All new executions are governed by `governance/execution-lifecycle-logging.yaml` and `QG-LOG-001`.

### Orchestrator invocation boundaries

The coordinator must persist:

```text
ORCHESTRATOR_INVOCATION_START
```

before repository analysis, planning, lane assignment or execution, and:

```text
ORCHESTRATOR_INVOCATION_END
```

after every started lane is CLOSED/recovery-closed and runtime/status has been synchronized.

The END record is mandatory even when no eligible work ran or the invocation failed/blocked.

### Lane execution boundaries

Every lane run must follow:

```text
LANE_INIT_START -> init() -> LANE_INIT_END
LANE_SERVICE_START -> service() -> LANE_SERVICE_END
close() -> LANE_CLOSE_END
```

If init ends `BLOCKED_BEFORE_SERVICE`, SERVICE events are skipped but close and `LANE_CLOSE_END` remain mandatory.

A required pre-phase log failure blocks that phase. A lane is not reusable until its close/recovery-close log is persisted. An execution result is not accepted until `QG-LOG-001` reconciles the required lifecycle records.

Parallel lanes use independent log artifacts under `logs/runs/*.md`; the coordinator alone serializes meaningful events into `logs/automation-log.md`.

## Orchestrator responsibilities

The Orchestrator owns:

- invocation START/END logging;
- Level 1/2/3 validation/repair;
- QG-SSOT-001, QG-SOW-001, QG-DEP-001 and QG-LOG-001 enforcement;
- analysis and authorized planning;
- Work Unit creation and Worker Input generation;
- lane assignment and lane-status maintenance;
- lane lifecycle log-boundary enforcement;
- safe lane utilization/refill;
- result/evidence validation;
- runtime/blocker/gate synchronization;
- shared audit-log consolidation;
- artifact production and user acceptance/closure.

## Lane lifecycle and utilization

Every orchestration lane has exactly one current state:

```text
IDLE -> ASSIGNED -> INITIALIZING -> WORKING -> CLOSING -> IDLE
                                  |          |
                                  +-> BLOCKED
                                  +-> WAITING
                                  +-> STALE
```

The hourly scheduler creates one finite coordinator invocation, not persistent background lane processes. IDLE between invocations is valid. During an active invocation, safe independent work should fill available lanes up to configured capacity, and released lanes should be refilled while additional eligible independent work remains.

The coordinator must not intentionally stop at a fixed small batch when more safe independent work is eligible. Dependent work, shared-file conflicts and resource-lock conflicts remain serialized. Previously proved relationships may be reused only when the frozen source confirms the same path.

## Generic Worker responsibility

The Generic Worker executes only:

```text
read input -> init -> service -> close -> return result
```

It does not choose Backlog Items, define SOWs, alter Quality Gates, broaden scope or decide closure.

## Validation and closure

Worker completion does not imply Backlog completion. Required Quality Gates, including lifecycle logging for in-scope execution, must pass; outputs must exist; blockers/unresolved items must be accounted for; all required runs/logs must be closed; lane status must reconcile; and user acceptance must be obtained where configured.

A Backlog Item may move to CLOSED only after all Completion Path steps, automatic gates, artifact requirements, runtime consistency checks and required user acceptance are complete.
