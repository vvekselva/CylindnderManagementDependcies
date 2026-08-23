# Cylinder Automation Self-Reliant End-to-End Execution Architecture

## Objective

The Cylinder Automation Tool must be able to plan, stage source, execute independent workers, recover, validate evidence, maintain the Traceability Matrix continuously, drive later workflow from that matrix, and persist accepted state without depending on GitHub Actions, a pre-existing Eclipse checkout, or manual worker startup.

GitHub remains the Version Control System and durable persistence layer. The Automation Tool remains the Orchestrator and execution owner.

## Definition of self-reliant

A production invocation is self-reliant when all of the following are true:

- no GitHub Actions workflow or GitHub runner is required;
- no pre-existing local `CylinderManagement` checkout is required when the default staged source provider is available;
- the Orchestrator can materialize exact source from the private repository at the frozen commit;
- local workers never require GitHub credentials;
- missing downstream source causes an automatic restage request, never silent inference;
- interface-to-implementation bindings are source-validated and recorded in the snapshot manifest;
- lane execution is local `LOCAL_PROCESS_POOL` with up to 10 independent OS processes;
- every worker is integrity-checked before SERVICE and emits INIT/SERVICE/CLOSE lifecycle state plus heartbeat evidence;
- interrupted execution, pending GitHub synchronization and repeated invocations are idempotently recoverable;
- transient lane logs are aggregated, verified, deleted and rescanned to zero;
- worker evidence is never automatically promoted to a final endpoint trace;
- each endpoint trace accepted by the Primary Orchestrator is immediately projected into the live Traceability Matrix;
- the live matrix can remain `INCREMENTAL_PARTIAL` while Source Check continues and becomes final only after 100 percent coverage and gate validation;
- final Orchestrator validation and explicit user acceptance remain authoritative.

## Responsibility boundary

| Component | Responsibility |
|---|---|
| GitHub `vvekselva/CylinderManagement` | Version-controlled application source and frozen source baseline |
| GitHub `vvekselva/CylindnderManagementDependcies` | Version-controlled backlog, SOW, gates, runtime SSOT, traceability matrix, durable logs/evidence and history |
| Primary Automation Tool / Orchestrator | Planning, source staging, binding resolution, dispatch, execution control, evidence validation, matrix projection, recovery and synchronization |
| Source Provider Manager | Produce a verified worker-readable source root from an approved provider |
| Local Execution Engine | Start and measure up to 10 independent OS workers |
| Lane Worker | Read one immutable source scope, emit lifecycle/heartbeat/evidence, never update shared SSOT or the matrix directly |
| Aggregator | Consolidate worker evidence and lifecycle logs, verify cleanup and calculate measured concurrency |
| Evidence Validator | Decide source-proved COMPLETE/UNRESOLVED/BLOCKED/FAILED endpoint states; worker candidates are not final decisions |
| Matrix Projector | Upsert each accepted endpoint into the incremental Traceability Matrix and keep unresolved accounting synchronized |
| Matrix-Driven Workflow | Reconcile, validate and register the matrix; provide governed downstream handoff only after final validation |
| Persistence Synchronizer | Persist validated runtime/evidence/matrix changes to GitHub; preserve PENDING_SYNC locally on transient write failure |

## End-to-end architecture

```text
                        USER / SCHEDULER
                              |
                              v
                  PRIMARY AUTOMATION TOOL
                      / ORCHESTRATOR
                              |
                  read Level 1/2/3 SSOT
                              |
                      QG-SSOT-001
                      QG-SOW-001
                      QG-DEP-001
                              |
                              v
                       EXECUTION PLAN
                              |
                              v
                      LANE DISPATCH SSOT
                              |
                              v
                    SOURCE PROVIDER MANAGER
                       /                 \
                      /                   \
       ORCHESTRATOR_STAGED_SNAPSHOT     LOCAL_GIT_CHECKOUT
             default / self-reliant       optional fallback
                      \                   /
                       \                 /
                        v               v
                     VERIFIED source_root
                             +
                     snapshot manifest
                             +
                  source binding manifest
                              |
                      QG-SOURCE-001
                              |
             +----------------+----------------+
             |                                 |
     missing source/binding?                   | roots ready
             |                                 |
             v                                 v
     RESTAGE / REBIND LOOP              LOCAL_PROCESS_POOL
     bounded + no-progress check              <= 10
                                               |
                          +--------------------+--------------------+
                          |      |      |      |      |            |
                         L01    L02    L03    ...    L09          L10
                          |      |      |             |            |
                          +--------------------+--------------------+
                                               |
                                lifecycle + heartbeat + evidence
                                               |
                                               v
                                         AGGREGATOR
                                               |
                                QG-LOG-001 + QG-LANE-001
                                               |
                                               v
                                   ORCHESTRATOR VALIDATION
                                               |
                               accepted endpoint trace state
                                               |
                                               v
                                      MATRIX PROJECTOR
                                               |
                        +----------------------+---------------------+
                        |                                            |
       traceability/controller-traceability.md      unresolved-traceability.md
                        |                                            |
                        +----------------------+---------------------+
                                               |
                                  matrix-progress.yaml
                                               |
                                               v
                                  MATRIX-DRIVEN CONTINUATION
                                /              |              \
                     continue source      final reconcile     gate validation
                        analysis            at 100%             + registration
                                               |
                                               v
                                    PERSISTENCE SYNCHRONIZER
                                               |
                                  +------------+------------+
                                  |                         |
                               SYNCED                  PENDING_SYNC
                                  |                         |
                                  v                         v
                                GitHub              retry next invocation
                                  |
                                  v
                           invocation CLOSED
```

Workers never write the Traceability Matrix directly. Only Orchestrator-accepted evidence can update it.

## Source provider design

### Provider 1 - ORCHESTRATOR_STAGED_SNAPSHOT

This is the default for tool-hosted execution.

The Primary Orchestrator reads exact files through the connected private GitHub control plane using the frozen commit as the ref. Each file is written into an execution-host snapshot and registered with repository, frozen commit, path, Git blob SHA and byte length.

Workers calculate the Git blob SHA from local bytes before reading the file. Missing manifest entries, missing files, baseline mismatch or blob mismatch block the worker before SERVICE.

### Provider 2 - LOCAL_GIT_CHECKOUT

This is an optional optimization/fallback. The local executor verifies the frozen commit exists and creates a temporary detached worktree. It must never switch the user's active Eclipse checkout.

### Source resolution

The staged provider resolves source by exact imported FQCN plus the governed package-to-module layout. Candidate generation may use an injection variable name or `@Qualifier` only to locate a candidate file. A dependency is not accepted from naming.

For Spring interface injection the snapshot manifest contains an explicit binding record. A binding is accepted only when implementation source at the frozen commit proves the required interface/generic signature and, when present, qualifier/bean identity. An incorrect binding remains unresolved.

## Recursive source closure loop

The worker may return either `missing_source_requests` or `missing_binding_requests`.

```text
STAGE ROOTS
   -> VERIFY ROOTS
   -> DISCOVERY FIRE
   -> aggregate missing source/binding requests
   -> if zero: SOURCE_CLOSURE_COMPLETE
   -> if request set changed: stage/validate next sources and repeat
   -> if request set does not change: SOURCE_RESOLUTION_STALLED, fail closed
   -> if maximum iterations reached: SOURCE_RESOLUTION_LIMIT_REACHED, fail closed
```

Default maximum staging iterations: 8.

A discovery fire can produce useful evidence, but evidence depending on unstaged or unbound source cannot be accepted as final.

## Incremental Traceability Matrix creation

The Traceability Matrix is no longer postponed until the end of Source Check.

Authoritative workflow: `workflows/WF-002-incremental-traceability-matrix.yaml`.

Artifacts:

- `traceability/controller-traceability.md` - live endpoint matrix;
- `traceability/unresolved-traceability.md` - synchronized unresolved/blocked/failed ledger;
- `traceability/matrix-progress.yaml` - matrix materialization and coverage status.

### Update rule

For every endpoint whose evidence is accepted by the Primary Orchestrator:

1. assign the canonical state `COMPLETE`, `UNRESOLVED`, `BLOCKED`, or `FAILED`;
2. immediately upsert one row keyed by `(HTTP method, path)` into `controller-traceability.md`;
3. attach the frozen baseline and durable evidence reference;
4. synchronize unresolved/blocked/failed rows into `unresolved-traceability.md`;
5. update `matrix-progress.yaml` counts and materialization state;
6. continue source analysis for remaining endpoints.

Raw worker evidence never writes matrix truth. A row is created only after Orchestrator validation.

### Matrix states

- `INCREMENTAL_PARTIAL`: validated rows are being accumulated while Source Check coverage is below 100 percent.
- `READY_FOR_FINAL_RECONCILIATION`: every caller-visible endpoint has one accepted trace-result state.
- `FINAL_VALIDATED`: matrix reconciliation and all required traceability gates pass.

The accepted canonical checkpoint may be ahead of rows physically materialized when historical evidence has not yet been backfilled. Such rows must be backfilled only from durable accepted evidence, never reconstructed from counts or naming.

## Matrix-driven downstream workflow

Matrix creation and downstream workflow are separated into two responsibilities:

### During WU-BL001-001

The Orchestrator continuously projects accepted traces into the incremental matrix. COMPLETE rows become stable validated trace facts; UNRESOLVED/BLOCKED/FAILED rows feed the evidence-resolution queue. Source analysis continues in parallel with matrix growth.

### WU-BL001-002 - Finalize/Reconcile Traceability Matrix

WU-BL001-002 no longer creates the matrix from nothing. Once Source Check reaches 100 percent it:

- reconciles matrix keys against controller and endpoint inventories;
- reconciles the incremental matrix against canonical Source Check output;
- verifies exactly one row per caller-visible `(HTTP method, path)`;
- verifies all evidence references and unresolved accounting;
- produces the final matrix artifact set.

### WU-BL001-003 - Validate Traceability Gates

The final/reconciled matrix becomes the principal structured input for coverage, call-path evidence, final-dependency evidence, no-guessing, resolution-accounting and artifact-consistency gates.

### WU-BL001-004 - Register Baseline and Prepare Closure

The final validated matrix and source baseline are registered together. Explicit user acceptance remains required before BL-001 closes.

### Handoff to later backlogs

A `FINAL_VALIDATED` BL-001 matrix may be registered as a governed input to later backlog definitions and SOWs. It does **not** automatically enable BL-002 or later work. Each later backlog still requires complete Level 1/2/3 SSOT, its own SOW, dependency gates and approved item gate.

## Execution journal and idempotency

Every local execution has a durable journal containing at least execution ID, dispatch fingerprint, source baseline, source snapshot identity, phase, worker PIDs/state, aggregate path/fingerprint, source-closure state, validation state and GitHub synchronization state.

Recovery rules:

- same fingerprint + `PENDING_SYNC` -> retry synchronization only; do not rerun workers;
- same fingerprint + closed evidence awaiting validation -> validate existing evidence; do not rerun workers;
- `RUNNING` journal with no live worker processes -> enter recovery, reject partial output, then rerun only after cleanup;
- changed fingerprint -> start a new execution generation;
- already synchronized closed execution -> NOOP rather than duplicate execution.

Matrix idempotency follows the same dispatch/evidence discipline: an already accepted `(method,path,evidence fingerprint)` row is an upsert/no-op, never a duplicate row.

## Worker failure policy

- integrity/baseline/binding failure: no automatic retry; fix source input first;
- transient worker-process failure: at most one isolated retry for that lane after lifecycle recovery;
- shared-state or duplicate-lane failure: abort the batch before SERVICE;
- no partial worker result can auto-advance canonical trace or matrix state.

## GitHub synchronization failure policy

Execution and validation do not depend on GitHub Actions, but durable persistence still uses the GitHub connector.

If a post-validation GitHub write fails:

1. preserve the closed aggregate, accepted trace updates and matrix changes locally;
2. set synchronization state to `PENDING_SYNC`;
3. do not rerun workers for the same dispatch fingerprint;
4. retry only missing GitHub synchronization during the next invocation;
5. close execution as `CLOSED_SYNCED` only after persisted runtime/evidence/matrix state is verified.

## Quality gates

- `QG-SSOT-001`: Level 1/2/3 consistency before plan/replan.
- `QG-SOW-001`: valid Statement of Work.
- `QG-DEP-001`: backlog dependency gate.
- `QG-SOURCE-001`: source root integrity and recursive source/binding closure.
- `QG-LOG-001`: lifecycle ordering, aggregation and zero transient logs.
- `QG-LANE-001`: measured natural workload SERVICE concurrency; performance governance only.
- `QG-TRC-*`: incremental/final matrix and BL-001 trace correctness/completeness.
- `QG-TRC-015`: explicit user acceptance before backlog close.

## Validation performed on 23 August 2026

The architecture was tested against the real private `CylinderManagement` frozen baseline `3ae6e61442132d94a307275b08dd65fcef228d89`.

Validated behaviors include private source staging without a local checkout, Git blob verification, fail-closed tamper/baseline/duplicate-lane/stale-log handling, recursive JPA source closure, positive and negative Spring binding validation, ten-worker process execution, log aggregation to zero residual lane logs, and recovery/idempotency handling.

The separate process-pool capacity test demonstrated 10/10 worker overlap. Natural source-discovery workloads may measure lower and remain an operational performance metric rather than a correctness shortcut.

The incremental matrix policy is now production governance: accepted endpoint evidence is materialized immediately, while final matrix validation still waits for complete source-check coverage.

## Current production conclusion

The architecture no longer requires GitHub Actions or a user-mounted source checkout. The remaining BL-001 work is normal recursive source staging/binding, endpoint evidence validation, incremental matrix projection and final matrix reconciliation.

The system remains fail-closed: self-reliant means it can make progress and recover without manual infrastructure intervention; it does not mean it may guess missing source, skip quality gates, auto-accept traces, create matrix rows from raw worker candidates, or bypass final user acceptance.
