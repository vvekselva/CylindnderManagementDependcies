# Cylinder Automation Self-Reliant End-to-End Execution Architecture

## Objective

The Cylinder Automation Tool must be able to plan, stage source, execute independent workers, recover, validate evidence and persist accepted state without depending on GitHub Actions, a pre-existing Eclipse checkout, or manual worker startup.

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
- the final Orchestrator validation and the existing explicit user acceptance gate remain authoritative.

## Responsibility boundary

| Component | Responsibility |
|---|---|
| GitHub `vvekselva/CylinderManagement` | Version-controlled application source and frozen source baseline |
| GitHub `vvekselva/CylindnderManagementDependcies` | Version-controlled backlog, SOW, gates, runtime SSOT, durable logs/evidence and history |
| Primary Automation Tool / Orchestrator | Planning, source staging, binding resolution, dispatch, execution control, validation, recovery and synchronization |
| Source Provider Manager | Produce a verified worker-readable source root from an approved provider |
| Local Execution Engine | Start and measure up to 10 independent OS workers |
| Lane Worker | Read one immutable source scope, emit lifecycle/heartbeat/evidence, never update shared SSOT directly |
| Aggregator | Consolidate worker evidence and lifecycle logs, verify cleanup and calculate measured concurrency |
| Evidence Validator | Decide source-proved COMPLETE/UNRESOLVED states; worker candidates are not final decisions |
| Persistence Synchronizer | Persist validated runtime/evidence to GitHub; preserve PENDING_SYNC locally on transient write failure |

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
     missing source/binding?                   | closure complete
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
                                   accepted runtime/evidence
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

## Source provider design

### Provider 1 - ORCHESTRATOR_STAGED_SNAPSHOT

This is the default for tool-hosted execution.

The Primary Orchestrator reads exact files through the connected private GitHub control plane using the frozen commit as the ref. Each file is written into an execution-host snapshot and registered with:

- repository;
- frozen commit;
- path;
- Git blob SHA;
- byte length.

Workers calculate the Git blob SHA from local bytes before reading the file. Missing manifest entries, missing files, baseline mismatch or blob mismatch block the worker before SERVICE.

### Provider 2 - LOCAL_GIT_CHECKOUT

This is an optional optimization/fallback. The local executor verifies the frozen commit exists and creates a temporary detached worktree. It must never switch the user's active Eclipse checkout.

### Source resolution

The staged provider resolves source by exact imported FQCN plus the governed package-to-module layout. Candidate generation may use an injection variable name or `@Qualifier` only to locate a candidate file. A dependency is not accepted from naming.

For Spring interface injection the snapshot manifest contains an explicit binding record. A binding is accepted only when the implementation source at the frozen commit proves the required interface/generic signature and, when present, qualifier/bean identity. An incorrect binding remains unresolved.

## Recursive source closure loop

The worker may return either `missing_source_requests` or `missing_binding_requests`.

The Orchestrator performs this bounded loop:

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

A discovery fire can produce useful evidence, but evidence that depends on unstaged/unbound source cannot be accepted as final.

## Execution journal and idempotency

Every local execution has a durable journal containing at least:

- execution ID;
- dispatch fingerprint;
- source baseline;
- source snapshot identity;
- phase;
- worker PIDs/state;
- aggregate path/fingerprint;
- source-closure state;
- validation state;
- GitHub synchronization state.

The dispatch fingerprint is calculated from frozen baseline plus the ordered approved task definitions.

Recovery rules:

- same fingerprint + `PENDING_SYNC` -> retry synchronization only; do not rerun workers;
- same fingerprint + closed evidence awaiting validation -> validate existing evidence; do not rerun workers;
- `RUNNING` journal with no live worker processes -> enter recovery, reject partial output, then rerun only after cleanup;
- changed fingerprint -> start a new execution generation;
- already synchronized closed execution -> NOOP rather than duplicate execution.

## Worker failure policy

- integrity/baseline/binding failure: no automatic retry; fix source input first;
- transient worker-process failure: at most one isolated retry for that lane after lifecycle recovery;
- shared-state or duplicate-lane failure: abort the batch before SERVICE;
- no partial worker result can auto-advance canonical trace state.

## GitHub synchronization failure policy

Execution and validation do not depend on GitHub Actions, but durable persistence still uses the GitHub connector.

If a post-validation GitHub write fails:

1. preserve the closed aggregate and result fingerprint locally;
2. set synchronization state to `PENDING_SYNC`;
3. do not rerun workers for the same dispatch fingerprint;
4. retry only the missing GitHub synchronization during the next invocation;
5. close the execution as `CLOSED_SYNCED` only after the persisted state is read back or otherwise verified.

## Quality gates

- `QG-SSOT-001`: Level 1/2/3 consistency before plan/replan.
- `QG-SOW-001`: valid Statement of Work.
- `QG-DEP-001`: backlog dependency gate.
- `QG-SOURCE-001`: source root integrity and recursive source/binding closure.
- `QG-LOG-001`: lifecycle ordering, aggregation and zero transient logs.
- `QG-LANE-001`: measured natural workload SERVICE concurrency; performance governance only and never a substitute for source correctness.
- `QG-TRC-*`: BL-001 trace correctness and completeness.
- `QG-TRC-015`: explicit user acceptance before backlog close.

## Validation performed on 23 August 2026

The architecture was tested against the real private `CylinderManagement` frozen baseline `3ae6e61442132d94a307275b08dd65fcef228d89`.

Validated behaviors include:

- real controller roots staged from the private repository without a local source checkout;
- Git blob verification before source read;
- deliberate controller tamper blocked by blob mismatch;
- baseline mismatch blocked in executor preflight;
- duplicate lane dispatch blocked;
- stale transient lane log blocked before fire;
- real JPA canary source closure reached zero missing source/binding requests and proved `ChallanPagePhotoController -> ChallanPagePhotoJpaDao -> ChallanPagePhotoDo -> public.tbl_challan_page_photo`, with related ledger/book entities also manifest verified;
- correct Spring interface binding accepted only after source signature/qualifier verification;
- deliberately wrong interface binding rejected with `IMPLEMENTATION_SIGNATURE_MISMATCH`;
- ten real source workers started with zero worker failures and zero residual lane logs; the full batch correctly remained `RESTAGE_REQUIRED` when source closure was incomplete;
- recovery/idempotency decisions passed for PENDING_SYNC, interrupted RUNNING state, validation reuse, changed dispatch and already-synchronized execution;
- a separate local engine capacity test previously demonstrated 10/10 process SERVICE overlap; natural short production evidence work can measure below 10 and remains an operational utilization metric rather than a correctness shortcut.

## Current production conclusion

The architecture no longer requires GitHub Actions or a user-mounted source checkout. The remaining BL-001 work is normal recursive source staging/binding plus endpoint evidence validation, not an infrastructure dependency.

The system must remain fail-closed: `self-reliant` means it can make progress and recover without manual infrastructure intervention; it does not mean it may guess missing source, skip quality gates, auto-accept traces or bypass final user acceptance.
