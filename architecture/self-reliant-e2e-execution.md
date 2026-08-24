# Cylinder Automation Self-Reliant End-to-End Execution Architecture

## Objective

The Cylinder Automation Tool must be able to plan, stage source, execute independent workers, recover, validate evidence, maintain the Traceability Matrix continuously, drive later workflow from that matrix, and persist accepted state without depending on GitHub Actions, a pre-existing Eclipse checkout, or manual worker startup.

GitHub remains the Version Control System and durable persistence layer. The Automation Tool remains the Orchestrator and execution owner.

A scheduler trigger is an **execution window**, not a request to run one worker batch. When runnable backlog work exists, the Primary Orchestrator repeatedly dispatches, aggregates, validates, synchronizes and replans during the same invocation so that the 10-lane process pool is productively reused across multiple generations.

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
- a successful worker generation does not terminate a scheduler invocation while additional eligible runnable backlog tasks exist;
- final Orchestrator validation and explicit user acceptance remain authoritative.

## Responsibility boundary

| Component | Responsibility |
|---|---|
| GitHub `vvekselva/CylinderManagement` | Version-controlled application source and frozen source baseline |
| GitHub `vvekselva/CylindnderManagementDependcies` | Version-controlled backlog, SOW, gates, runtime SSOT, traceability matrix, durable logs/evidence and history |
| Primary Automation Tool / Orchestrator | Planning, source staging, binding resolution, dispatch, execution control, evidence validation, matrix projection, recovery, utilization-window control and synchronization |
| Source Provider Manager | Produce a verified worker-readable source root from an approved provider |
| Local Execution Engine | Start and measure up to 10 independent OS workers for each generation |
| Lane Worker | Read one immutable source scope, emit lifecycle/heartbeat/evidence, never update shared SSOT or the matrix directly |
| Aggregator | Consolidate worker evidence and lifecycle logs, verify cleanup and calculate measured concurrency |
| Evidence Validator | Decide source-proved COMPLETE/UNRESOLVED/BLOCKED/FAILED endpoint states; worker candidates are not final decisions |
| Matrix Projector | Upsert each accepted endpoint into the incremental Traceability Matrix and keep unresolved accounting synchronized |
| Matrix-Driven Workflow | Reconcile, validate and register the matrix; provide governed downstream handoff only after final validation |
| Persistence Synchronizer | Persist validated runtime/evidence/matrix changes to GitHub; preserve PENDING_SYNC locally on transient write failure |
| Scheduler | Starts one governed backlog-drain invocation; it does not directly own a worker generation |

## Scheduler invocation and backlog-drain utilization window

### Problem corrected

The previous lifecycle allowed a scheduler invocation to run one `LOCAL_PROCESS_POOL <= 10` generation and then close after only a few minutes. With an hourly scheduler this could limit throughput to roughly ten worker tasks per hour even when a large task pool remained. That behavior is not acceptable utilization.

### Governing rule

A scheduler invocation operates as a **45-minute backlog-drain window**.

- `target_invocation_window_minutes = 45`
- `minimum_productive_window_minutes = 30`
- `hard_stop_window_minutes = 45`
- early termination before 30 minutes is allowed only when the **eligible runnable backlog task count is zero**;
- a completed worker generation is only a checkpoint inside the invocation, not the invocation terminal state;
- when runnable work remains, the Orchestrator continues until the 45-minute hard stop;
- at the hard stop it synchronizes a clean checkpoint and exits with remaining backlog still open for the next scheduler invocation;
- only one scheduler invocation may hold the singleton execution lease at a time.

`eligible runnable backlog task count` means tasks from backlog items that are enabled and have passed their governing SSOT/SOW/dependency/item gates. Disabled or non-plannable later backlog items are never pulled merely to keep workers busy.

### Backlog-drain loop

```text
SCHEDULER TRIGGER
      |
      v
ACQUIRE SINGLETON INVOCATION LEASE
      |
      v
START 45-MINUTE WINDOW
      |
      v
+--------------------------------------------------------------+
| 1. Apply execution-journal idempotency                       |
| 2. Re-read Level 1 / 2 / 3 SSOT                              |
| 3. Replan eligible safe-independent backlog tasks            |
| 4. Resolve exact missing source / Spring bindings as needed  |
| 5. QG-SOURCE-001                                             |
| 6. Dispatch up to 10 workers                                 |
| 7. Aggregate + QG-LOG-001 + QG-LANE-001                     |
| 8. Primary Orchestrator validates evidence                   |
| 9. Project accepted trace/matrix changes                     |
|10. Synchronize validated durable state                       |
|11. Rescan transient lane logs to zero                        |
|12. Re-read backlog and immediately refill next generation    |
+--------------------------------------------------------------+
      |
      +--> runnable task pool = 0 ? ---- YES ---> CLEAN EXIT
      |                                  (may be before 30 min)
      |
      NO
      |
      +--> elapsed < 45 min ? ----------- YES ---> LOOP
      |
      NO
      |
      v
CHECKPOINT + SYNC + WINDOW_EXPIRED
      |
      v
NEXT HOURLY INVOCATION RESUMES IDEMPOTENTLY
```

### Empty dispatch while backlog remains

An empty worker dispatch does not automatically mean the invocation is complete. If backlog work remains but no lane is currently fireable, the Orchestrator uses the remaining window for legitimate prerequisite work only:

- exact missing-source staging;
- exact Spring binding resolution;
- validation of already closed evidence;
- `PENDING_SYNC` retry only;
- fail-closed interrupted-execution recovery;
- rebuilding the next safe-independent dispatch.

Artificial sleep, fake tasks, duplicate worker generations or invented parallel work are forbidden. If the runnable task pool truly reaches zero, early clean exit is allowed.

## End-to-end architecture

```text
                        USER / SCHEDULER
                              |
                              v
                  PRIMARY AUTOMATION TOOL
                      / ORCHESTRATOR
                              |
                    invocation lease
                    + 45-min window
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
                         L01 ... L10 evidence/lifecycle
                                               |
                                               v
                                         AGGREGATOR
                                               |
                                QG-LOG-001 + QG-LANE-001
                                               |
                                               v
                                   ORCHESTRATOR VALIDATION
                                               |
                                      MATRIX PROJECTOR
                                               |
                                    PERSISTENCE SYNC
                                               |
                                     CLEAN CHECKPOINT
                                               |
                                      REPLAN / REFILL
                                               |
                        +----------------------+----------------+
                        |                                       |
              runnable tasks remain                     task pool zero
              and elapsed < 45 min                            |
                        |                                     v
                        +------------ LOOP             INVOCATION EXIT
                        |
                  elapsed >= 45 min
                        |
                        v
              WINDOW_EXPIRED CHECKPOINT
                        |
                        v
                 INVOCATION EXIT
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

Default maximum staging iterations: 8 per bounded source-closure sequence. A new generation is permitted only when its dispatch/source fingerprint materially changes or idempotency rules specifically permit recovery/synchronization work.

## Incremental Traceability Matrix creation

The Traceability Matrix is created continuously during Source Check under `workflows/WF-002-incremental-traceability-matrix.yaml`.

Artifacts:

- `traceability/controller-traceability.md` - live endpoint matrix;
- `traceability/unresolved-traceability.md` - synchronized unresolved/blocked/failed ledger;
- `traceability/matrix-progress.yaml` - matrix materialization and coverage status;
- `traceability/explorer/traceability-matrix.json` - structured viewer data;
- `traceability/explorer/matrix-data.js` - browser-friendly generated copy.

For every endpoint whose evidence is accepted by the Primary Orchestrator, the Orchestrator assigns the canonical state, upserts the `(HTTP method,path)` row, preserves every proved intermediate hop and branching path, synchronizes unresolved accounting, updates progress and regenerates viewer data from the same accepted structured model.

Raw worker evidence never writes matrix truth.

Matrix states remain:

- `INCREMENTAL_PARTIAL`
- `READY_FOR_FINAL_RECONCILIATION`
- `FINAL_VALIDATED`

## Matrix-driven downstream workflow

During `WU-BL001-001`, accepted traces are continuously projected while source analysis continues. At 100 percent trace-result coverage, `WU-BL001-002` reconciles the existing matrix rather than rebuilding it from nothing. `WU-BL001-003` validates traceability gates from the reconciled structured model. `WU-BL001-004` registers the final validated matrix and source baseline. Explicit user acceptance is still required before BL-001 closes.

A `FINAL_VALIDATED` BL-001 matrix may become a governed dependency for later backlog items, but it never automatically enables them.

## Execution journal and idempotency

Every scheduler invocation and every worker generation within it is journaled. The journal records invocation ID, generation ID, dispatch fingerprint, source baseline, source snapshot identity, phase, worker PIDs/state, aggregate path/fingerprint, source-closure state, validation state, synchronization state, invocation elapsed time and exit reason.

Recovery rules are evaluated **before every generation**:

- same fingerprint + `PENDING_SYNC` -> retry synchronization only; do not rerun workers;
- same fingerprint + closed evidence awaiting validation -> validate existing evidence; do not rerun workers;
- `RUNNING` journal with no live workers -> recover fail-closed, reject partial output and clean the generation boundary;
- changed fingerprint -> start a new execution generation;
- already synchronized closed generation -> no-op that generation and immediately replan for different eligible work;
- no-op of one generation never terminates the containing invocation while runnable backlog work remains.

Matrix idempotency remains an upsert/no-op on an already accepted `(method,path,evidence fingerprint)` record.

## Worker-generation lifecycle

Each generation may contain up to ten safe-independent worker tasks. Workers remain ephemeral; the **scheduler invocation** is the longer-lived unit.

```text
GENERATION_N
  INIT -> SERVICE -> CLOSE
  aggregate
  validate
  sync
  transient logs -> 0
  replan
GENERATION_N+1
```

The same lane number may be reused in a later generation only after the previous lane lifecycle has closed, its evidence has been aggregated, and transient logs have been deleted and rescanned to zero.

## Worker failure policy

- integrity/baseline/binding failure: no blind retry; fix source input first;
- transient worker-process failure: at most one isolated retry for that lane after lifecycle recovery;
- shared-state or duplicate-lane failure: abort that generation before SERVICE;
- no partial worker result can auto-advance canonical trace or matrix state;
- a failed generation does not permit guessed replacement work simply to occupy the remaining invocation window.

## GitHub synchronization failure policy

If a post-validation GitHub write fails, preserve the validated result as `PENDING_SYNC`. Within the same invocation, retry only synchronization according to idempotency policy; never rerun the same worker generation. A clean synchronized checkpoint is required before the generation becomes `CLOSED_SYNCED`.

## Quality gates

- `QG-SSOT-001`: Level 1/2/3 consistency before plan/replan.
- `QG-SOW-001`: valid Statement of Work.
- `QG-DEP-001`: backlog dependency gate.
- `QG-SOURCE-001`: source root integrity and recursive source/binding closure.
- `QG-LOG-001`: lifecycle ordering, aggregation and zero transient logs at every generation boundary.
- `QG-LANE-001`: measured natural workload SERVICE concurrency; performance governance only.
- `QG-TRC-*`: incremental/final matrix and BL-001 trace correctness/completeness.
- `QG-TRC-015`: explicit user acceptance before backlog close.

## Invocation exit states

| Exit state | Meaning |
|---|---|
| `BACKLOG_DRAINED` | Eligible runnable backlog task count reached zero. Clean early exit is allowed. |
| `WINDOW_EXPIRED` | 45-minute hard stop reached while backlog remains. Clean checkpoint is synchronized for the next invocation. |
| `PENDING_SYNC` | Durable write incomplete; no worker replay for the same generation. |
| `FAIL_CLOSED_BLOCKED` | Truth/source/recovery gate prevents safe progress. Evidence and blocker are persisted; no fabricated work. |

`SUCCESS` is a generation result, not by itself an invocation exit reason.

## Validation history and production conclusion

The self-reliant source-staging, Git-blob integrity, Spring binding, local-process-pool, log hygiene and execution-journal behaviors validated on 23 August 2026 remain in force.

The 24 August 2026 utilization revision changes scheduler semantics: the hourly scheduler starts a sustained backlog-drain invocation, not a single ten-worker batch. The Primary Orchestrator should normally reuse the worker pool across successive validated generations for up to 45 minutes and may terminate earlier only when no eligible runnable backlog tasks remain.

The system remains fail-closed. Better utilization does not permit bypassing SSOT/SOW/dependency gates, guessing missing source, opening disabled later backlog items, duplicating synchronized work, auto-accepting worker candidates or closing BL-001 without explicit user acceptance.
