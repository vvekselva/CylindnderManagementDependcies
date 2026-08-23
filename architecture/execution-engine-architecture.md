# Cylinder Automation Execution Engine Architecture

## Architecture principle

GitHub is the **Version Control System and durable persistence layer**. GitHub is not the Cylinder execution engine and GitHub Actions is not required for normal orchestration.

The **Automation Tool** owns orchestration and execution. It now also owns a Source Staging Layer so production execution does not require a pre-existing Eclipse/local `CylinderManagement` checkout.

## Responsibility separation

| Component | Role | Responsibilities |
|---|---|---|
| GitHub - `vvekselva/CylinderManagement` | Version Control System | Store application source, commits, branches, exact Git blobs and frozen baseline. |
| GitHub - `vvekselva/CylindnderManagementDependcies` | Version Control + durable SSOT | Store backlog, SOW, gates, runtime, architecture, logs, aggregate evidence and accepted status history. |
| Primary Automation Tool / Orchestrator | Coordinator + source stager + execution owner | Read/validate SSOT, fetch exact source at the pinned commit, build/verify source snapshot, dispatch workers, aggregate and validate evidence, synchronize accepted state. |
| Source Provider Layer | Execution-input bridge | Supply worker-readable immutable source through an Orchestrator-staged snapshot or an optional local Git checkout. |
| Local Process Pool | Parallel executor | Start up to 10 independent OS workers and measure real SERVICE overlap. |
| Lane Worker | Read-only evidence collector | Verify its source input, execute one safe independent task, emit INIT/SERVICE/CLOSE evidence and return candidates for Orchestrator validation. |

## Control plane and execution plane

The connected GitHub interface is a **control-plane capability**. Local workers do not inherit its credential. The solution is therefore not to give GitHub credentials to workers; the Orchestrator materializes immutable source before worker fire.

```text
CONTROL PLANE

GitHub private VCS
      |
      | exact file read @ frozen commit
      v
PRIMARY AUTOMATION TOOL / ORCHESTRATOR
      |
      +--> SSOT / gates / dispatch
      |
      +--> SOURCE STAGER
              |
              | Git blob SHA + baseline manifest
              v
       VERIFIED SOURCE SNAPSHOT

EXECUTION PLANE

Verified source_root
      |
      v
LOCAL_PROCESS_POOL <= 10
      |
 +----+----+---- ... ----+
 |    |    |             |
L01  L02  L03           L10
 |    |    |             |
 +----+----+-------------+
      |
      v
aggregate + lifecycle evidence
      |
      v
PRIMARY ORCHESTRATOR VALIDATION
      |
      v
GitHub durable persistence
```

Workers never need direct GitHub access.

## Approved source providers

### 1. ORCHESTRATOR_STAGED_SNAPSHOT - default

This is the self-reliant Tool-hosted execution mode.

1. The Orchestrator reads each dispatched controller from `vvekselva/CylinderManagement` at the exact frozen commit.
2. It writes the source into a worker-readable snapshot.
3. It records each materialized file in `source-snapshot-manifest.json` with repository, frozen baseline and exact Git blob SHA.
4. Before SERVICE, every worker recomputes the local Git blob hash and compares it with the manifest.
5. A missing manifest entry or blob mismatch blocks SERVICE.
6. Worker-discovered missing downstream components are returned to the Orchestrator as explicit `missing_component_references`.
7. The Orchestrator stages those exact components from the same frozen commit and repeats until the evidence needed by the task is source-closed.

This mode does **not** require a pre-existing local Git checkout.

### 2. LOCAL_GIT_CHECKOUT - optional fast path

When a local `CylinderManagement` Git repository is available, the existing local executor may verify the frozen commit and create a temporary detached worktree. The active Eclipse/Git checkout is never switched.

The execution engine may use either provider; lack of a local checkout is no longer a production blocker when the staged provider is available.

## QG-SOURCE-001 - Execution Source Availability And Integrity

`governance/source-provider.yaml` is authoritative.

For staged-source evidence collection, QG-SOURCE-001 passes to `PASS_ROOTS_VERIFIED` only when every dispatched controller root:

- came from `vvekselva/CylinderManagement`;
- is pinned to the dispatch baseline;
- exists in the snapshot manifest; and
- matches its recorded Git blob SHA before SERVICE.

`source_closure_complete` is separate. Missing downstream components do not disappear or become guessed dependencies. They remain explicit and trigger another Orchestrator staging iteration. Partial closure can produce evidence candidates, but it cannot automatically make an endpoint trace COMPLETE.

## Production validation performed on 23 August 2026

The staged-source proposal was tested against the **real private repository and frozen BL-001 source**, not synthetic Java files.

### Integrity validation

- 10/10 dispatched controller roots were fetched at `3ae6e61442132d94a307275b08dd65fcef228d89` and verified by Git blob SHA.
- A deliberate controller modification changed the computed blob hash; the worker rejected the snapshot and did not start SERVICE. This validated fail-closed tamper detection.

### Real staged production fires

The source-staging loop reduced missing worker filesystem components:

```text
First staged production fire:  9 missing component references
Second staging iteration:       4 missing component references
Latest staging iteration:       2 missing component references
```

Latest validation execution: `PROD-STAGED-BL001-20260823-145139`

| Metric | Result |
|---|---:|
| Controller roots verified | 10 / 10 |
| Materialized verified source files | 25 |
| Workers started | 10 |
| Worker results received | 10 |
| Worker failures | 0 |
| Peak real SERVICE concurrency | 9 / 10 |
| Individual lane logs after aggregation | 0 |
| Remaining staged component references | 2 |
| Source evidence auto-accepted | NO |

The remaining source references are `TripReturnWorkflowService` and `CustomerAddressLocationOfflineMapService`. They are **staging continuation work**, not a dependency on an external checkout and not a GitHub Actions blocker.

QG-LANE-001 is therefore **UNDERUTILIZED for the latest real-source validation run (9/10)**. This does not invalidate correctly verified source evidence. It only prevents a claim that 10/10 real SERVICE utilization is solved for that run.

## Production execution sequence

```text
SSOT + SOW + dependency gates PASS
        |
        v
select safe independent tasks
        |
        v
QG-SOURCE-001
        |
        +--> preferred: ORCHESTRATOR_STAGED_SNAPSHOT
        |       GitHub read @ frozen commit
        |       -> manifest + Git blob verification
        |       -> worker-readable source_root
        |
        +--> fallback: LOCAL_GIT_CHECKOUT
                -> detached worktree @ frozen commit
        |
        v
preflight zero transient lane logs
        |
        v
LOCAL_PROCESS_POOL <= 10
        |
        v
INIT -> SERVICE -> CLOSE per lane
        |
        v
aggregate / delete lane logs / rescan zero
        |
        v
QG-LOG-001 + QG-LANE-001
        |
        v
Orchestrator endpoint-by-endpoint validation
        |
        v
synchronize accepted durable state to GitHub
```

## Current BL-001 implementation

- Parallel backend: `LOCAL_PROCESS_POOL`
- Default source provider: `ORCHESTRATOR_STAGED_SNAPSHOT`
- Optional source provider: `LOCAL_GIT_CHECKOUT`
- Source-provider governance: `governance/source-provider.yaml`
- Staged executor: `automation/staged-lane-executor.py`
- Staged worker: `automation/staged-lane-worker.py`
- Local-Git executor: `automation/local-lane-executor.py`
- Local-Git worker: `automation/local-lane-worker.py`
- Windows local-Git entry point: `automation/fire-local-lanes.ps1`
- Dispatch SSOT: `backlog/runtime/BL-001/lane-dispatch.yaml`
- Lane SSOT: `backlog/runtime/BL-001/lane-status.yaml`
- Execution SSOT: `backlog/runtime/BL-001/local-execution.yaml`
- Configured lanes: 10
- GitHub Actions dependency: `NONE`
- Pre-existing local source checkout required in default mode: `NO`
- Final trace-decision owner: `PRIMARY_ORCHESTRATOR`
