# Cylinder Automation Execution Engine Architecture

> Canonical detailed architecture: `architecture/self-reliant-e2e-execution.md`  
> Validation evidence: `tests/self-reliant-e2e-validation-2026-08-23.md`

## Architecture principle

GitHub is the **Version Control System and durable persistence layer**. It stores application source and the control/SSOT history, but it is not the worker execution engine. GitHub Actions and GitHub runners are not required for normal Cylinder orchestration.

The **Primary Automation Tool / Orchestrator** owns planning, source staging, real local execution, recovery/idempotency, evidence validation and synchronization.

## End-to-end execution engine

```text
                        USER / SCHEDULER
                              |
                              v
                    PRIMARY ORCHESTRATOR
                              |
                    Level 1 / 2 / 3 SSOT
                              |
            QG-SSOT-001 / QG-SOW-001 / QG-DEP-001
                              |
                              v
                        lane-dispatch
                              |
                              v
                    SOURCE PROVIDER MANAGER
                       /                 \
                      /                   \
       ORCHESTRATOR_STAGED_SNAPSHOT     LOCAL_GIT_CHECKOUT
            DEFAULT / SELF-RELIANT       OPTIONAL FALLBACK
                      \                   /
                       \                 /
                        v               v
                 VERIFIED source_root + manifest
                              |
                       QG-SOURCE-001
                              |
               unresolved source/binding requests?
                    /                 \
                  YES                  NO
                   |                    |
            bounded restage/rebind      v
                   |             LOCAL_PROCESS_POOL <= 10
                   +------->     LANE-01 ... LANE-10
                                      |
                         lifecycle + heartbeat + evidence
                                      |
                                      v
                                  AGGREGATOR
                                      |
                           QG-LOG-001 / QG-LANE-001
                                      |
                                      v
                         PRIMARY ORCHESTRATOR VALIDATION
                                      |
                                      v
                          PERSISTENCE SYNCHRONIZER
                             /                 \
                         SYNCED              PENDING_SYNC
                            |                    |
                            v                    v
                          GitHub          retry sync only later
```

## Responsibility boundary

| Component | Responsibility |
|---|---|
| `vvekselva/CylinderManagement` | Version-controlled source and frozen baseline |
| `vvekselva/CylindnderManagementDependcies` | Version-controlled backlog, SOW, gates, runtime SSOT, durable evidence/history |
| Primary Automation Tool | Orchestration, staging, execution control, recovery, validation, synchronization |
| Source Provider Manager | Produce immutable worker-readable source at the frozen baseline |
| `LOCAL_PROCESS_POOL` | Start up to 10 independent OS worker processes |
| Lane Worker | Verify/read one source scope and emit evidence only |
| Aggregator | Aggregate lifecycle/evidence, cleanup transient logs and calculate measured concurrency |
| Persistence Synchronizer | Persist validated state to GitHub; retain PENDING_SYNC on transient write failure |

Workers never receive the connected GitHub credential.

## Source providers

### ORCHESTRATOR_STAGED_SNAPSHOT — default

The Orchestrator resolves exact source paths using `repository/source-layout.yaml`, fetches private files at the frozen commit, records path + Git blob SHA + byte length in the snapshot manifest and materializes them for local workers. Workers recompute the blob SHA before reading.

Interface injection is followed only through a manifest binding that has been validated from implementation source. `@Qualifier` or variable naming may locate a candidate but never proves the dependency.

Workers return explicit `missing_source_requests` and `missing_binding_requests`. The Orchestrator restages/rebinds for at most eight progressing iterations. An unchanged unresolved request set becomes `SOURCE_RESOLUTION_STALLED` and fails closed.

### LOCAL_GIT_CHECKOUT — optional fallback

A local Git checkout may still be used as an optimization. The executor verifies the frozen commit and creates a temporary detached worktree without switching the active user/Eclipse checkout. It is not mandatory in the default architecture.

## Recovery and idempotency

Every execution has an execution journal and dispatch fingerprint.

- Same fingerprint + `PENDING_SYNC` -> retry GitHub synchronization only.
- Same fingerprint + closed evidence awaiting validation -> validate existing evidence, do not rerun workers.
- Interrupted `RUNNING` state with no live workers -> recovery, reject partial output, clean boundary, then rerun if required.
- Changed fingerprint -> new execution generation.
- Already `CLOSED_SYNCED` -> no-op.

## Validated implementation

Authoritative staged production scripts:

- `automation/staged-lane-executor-v3.py`
- `automation/staged-lane-worker-v3.py`

Related governance:

- `governance/self-reliant-execution.yaml`
- `governance/source-provider.yaml`
- `governance/lane-execution.yaml`
- `governance/quality-gates.yaml`
- `repository/source-layout.yaml`

Validation against frozen source `3ae6e61442132d94a307275b08dd65fcef228d89` proved:

- private-source staging without a local application checkout;
- Git blob tamper detection before SERVICE;
- baseline/duplicate-lane/stale-log fail-closed preflight;
- JPA canary `SOURCE_CLOSURE_COMPLETE`;
- positive source-validated Spring interface binding;
- incorrect binding rejection with implementation-signature mismatch;
- 10 real discovery workers with zero worker failures and zero residual lane logs;
- recovery/idempotency state decisions 5/5 PASS;
- process-pool capacity probe peak 10/10 workers.

The latest natural ten-task source-discovery execution `E2E-STAGED-20260823-151810` closed as `CLOSED_RESTAGE_REQUIRED`, with 21 explicit source requests, zero worker failures, peak natural SERVICE concurrency 4/10 and zero residual lane logs. Therefore `QG-SOURCE-001` is currently `PASS_ROOTS_VERIFIED_SOURCE_CLOSURE_PARTIAL` and `QG-LANE-001` is `UNDERUTILIZED`. Correct source evidence is preserved, but no endpoint trace is auto-accepted.

## Current rule

The system is **self-reliant for execution infrastructure**: it does not require GitHub Actions or a mounted application source checkout. It remains deliberately fail-closed for source integrity, source/binding closure, lifecycle logging, trace validation and final user acceptance.
