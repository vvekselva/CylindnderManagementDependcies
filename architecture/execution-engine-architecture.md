# Cylinder Automation Execution Engine Architecture

## Architecture principle

GitHub is the Version Control System and durable persistence layer. GitHub is not the execution engine for Cylinder orchestration.

The Automation Tool is responsible for orchestration and execution. Its execution implementation is the local process-pool backend controlled by the primary Orchestrator.

## Responsibility separation

| Component | Role | Responsibilities | Must not do |
|---|---|---|---|
| GitHub - `vvekselva/CylinderManagement` | Version Control System | Store application source, commits, branches and the frozen source baseline. | Must not be required to start or host orchestration workers. |
| GitHub - `vvekselva/CylindnderManagementDependcies` | Version Control + durable SSOT persistence | Store backlog, SOW, gates, runtime SSOT, logs, aggregate evidence and status history. | Must not be treated as the worker runtime. |
| Primary Automation Tool / Orchestrator | Coordinator + execution owner | Read SSOT, validate planning gates, select eligible work, create dispatch, enforce logs/gates, validate evidence and synchronize results. | Must not guess dependencies or bypass gates. |
| Execution Host | Worker filesystem/runtime host | Provide a local or mounted `CylinderManagement` Git checkout, Git, Python 3 and the control checkout used by the local executor. | Must not rely on connector-only access as a substitute for a worker-readable filesystem. |
| Local Execution Engine | Executor | Verify the frozen source commit, create a temporary detached worktree, start up to 10 OS worker processes, maintain PID/heartbeat state, measure concurrency, aggregate logs/results and close cleanly. | Must not redefine backlog scope or auto-accept trace results. |
| Lane Worker | Isolated evidence worker | Execute one safe independent task, write INIT/SERVICE/CLOSE lifecycle evidence and return source evidence. | Must not write shared SSOT directly or declare final COMPLETE. |

## Control plane versus execution plane

The connected GitHub interface belongs to the **control plane**. It can read and update the private repositories on behalf of the Automation Tool.

The local OS worker processes belong to the **execution plane**. They do not inherit the GitHub connector credential. Therefore production workers require a worker-readable source checkout on the execution host.

```text
CONTROL PLANE

Automation Tool / Orchestrator
          |
          +---- connected GitHub interface ----> GitHub VCS / SSOT persistence
          |
          +---- validated dispatch / execution request
                          |
                          v
EXECUTION PLANE

Execution Host filesystem
  +-- CylindnderManagementDependcies checkout
  +-- CylinderManagement checkout containing frozen commit
  +-- Git
  +-- Python 3
          |
          v
LOCAL_PROCESS_POOL <= 10
          |
   LANE-01 ... LANE-10
          |
          v
local aggregate + lifecycle evidence
          |
          v
Primary Orchestrator validation
          |
          v
GitHub synchronization/persistence
```

## Production execution architecture

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
            PRODUCTION HOST PREFLIGHT
                          |
       +------------------+------------------+
       |                                     |
       | source checkout exists?             |
       | frozen commit available locally?    |
       | Git + Python 3 available?            |
       | zero leftover lane logs?             |
       +------------------+------------------+
                          |
                PASS -----+----- FAIL
                 |                    |
                 v                    v
      TEMP DETACHED WORKTREE      START ZERO LANES
       AT FROZEN COMMIT           record exact blocker
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

## Production-fire preflight contract

Before any production lane is assigned or started, the Orchestrator/executor must prove all of the following:

1. a local or mounted `vvekselva/CylinderManagement` Git checkout exists on the execution host;
2. the frozen source commit is present in that local Git object database;
3. Git is available;
4. Python 3 is available;
5. the control checkout contains the approved dispatch and local executor/worker scripts;
6. there are zero leftover transient `*-LANE-*.md` logs from a previous invocation.

The source checkout does **not** need to be switched to the frozen commit. The executor creates a temporary detached Git worktree at the exact baseline.

If any preflight check fails, the behavior is fail-closed:

- zero lanes start;
- no traceability progress is claimed;
- BL-001 remains PARTIAL;
- QG-LANE-001 remains READY_FOR_MEASUREMENT rather than falsely PASS/FAIL;
- the exact missing production-host prerequisite is recorded;
- the condition is not misclassified as a GitHub Actions blocker.

## Production-fire attempt observed on 23 August 2026

The Automation Tool attempted the production preflight in the current ChatGPT execution host. Git and Python were available, but there was no mounted `CylinderManagement` checkout.

Observed preflight error:

```text
fatal: cannot change to '/mnt/data/CylinderManagement': No such file or directory
```

A connected-GitHub archive fallback was also tested, but the GitHub connector does not expose an approved full-repository tarball/mount endpoint to the local worker runtime. Therefore no production lane was started and no BL-001 evidence was accepted from this attempt.

This is an **execution-host source-staging prerequisite**, not a GitHub Actions dependency and not an application-source blocker.

## GitHub interaction rule

GitHub is used before and after execution:

1. Before execution, the Automation Tool reads authoritative source/control state and frozen commit identity from GitHub and/or verifies an in-sync local checkout.
2. The source checkout required by local OS workers must exist on the execution host; connector access alone does not mount that checkout.
3. Execution occurs in the Automation Tool's local process-pool engine; no GitHub Actions workflow or runner is required.
4. After execution, the Automation Tool validates the result and synchronizes durable SSOT/log/evidence changes back to GitHub.

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
- GitHub Actions dependency: `NONE`
- Production host requirement: worker-readable local/mounted `CylinderManagement` Git checkout containing the frozen commit
- Current ChatGPT execution host: production preflight blocked because the source checkout is not mounted
- Production readiness on a valid execution host: `READY_FOR_LOCAL_FIRE`
