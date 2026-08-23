# Cylinder Automation Execution Engine Architecture

## Architecture principle

GitHub is the Version Control System and durable persistence layer. GitHub is not the execution engine for Cylinder orchestration.

The Automation Tool is responsible for orchestration and execution. Its execution implementation is the local process-pool backend controlled by the primary Orchestrator.

## Responsibility separation

| Component | Role | Responsibilities | Must not do |
|---|---|---|---|
| GitHub - `vvekselva/CylinderManagement` | Version Control System | Store application source, commits, branches and the frozen source baseline. | Must not be required to start or host orchestration workers. |
| GitHub - `vvekselva/CylindnderManagementDependcies` | Version Control + durable SSOT persistence | Store backlog, SOW, gates, runtime SSOT, logs, aggregate evidence and status history. | Must not be treated as the worker runtime. |
| Primary Automation Tool / Orchestrator | Coordinator | Read SSOT, validate planning gates, select eligible work, create dispatch, enforce logs/gates, validate evidence and synchronize results. | Must not guess dependencies or bypass gates. |
| Local Execution Engine | Executor | Materialize the frozen source baseline, start up to 10 OS worker processes, maintain PID/heartbeat state, measure concurrency, aggregate logs/results and close cleanly. | Must not redefine backlog scope or auto-accept trace results. |
| Lane Worker | Isolated evidence worker | Execute one safe independent task, write INIT/SERVICE/CLOSE lifecycle evidence and return source evidence. | Must not write shared SSOT directly or declare final COMPLETE. |

## Execution architecture

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
             (persisted in GitHub)
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
             lifecycle logs + evidence
                          |
                          v
                 LOCAL AGGREGATOR
                          |
       QG-LOG-001 + QG-LANE-001 measurement
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

## GitHub interaction rule

GitHub is used before and after execution:

1. Before execution, the Automation Tool reads the authoritative source/control state and frozen commit identity from GitHub or an in-sync local checkout.
2. Execution occurs in the Automation Tool's local process-pool engine; no GitHub Actions workflow or runner is required.
3. After execution, the Automation Tool validates the result and synchronizes durable SSOT/log/evidence changes back to GitHub.

Therefore a GitHub Actions outage, trigger restriction or runner availability problem must not block local Cylinder orchestration execution.

## Current BL-001 implementation

- Backend: `LOCAL_PROCESS_POOL`
- Executor: `automation/local-lane-executor.py`
- Worker: `automation/local-lane-worker.py`
- Windows entry point: `automation/fire-local-lanes.ps1`
- Dispatch SSOT: `backlog/runtime/BL-001/lane-dispatch.yaml`
- Lane SSOT: `backlog/runtime/BL-001/lane-status.yaml`
- Execution SSOT: `backlog/runtime/BL-001/local-execution.yaml`
- Configured lanes: 10
- Current state: `READY_FOR_LOCAL_FIRE`
- GitHub Actions dependency: `NONE`
