# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 30 August 2026 - Revision 2 (Scheduler Resilience Fix)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, execution engine, source analyst, validator and recovery coordinator. All orchestration/automation execution stays inside ChatGPT's available tooling/runtime. GitHub Actions/runners, external worker runtimes, local bridges, agents and user-operated per-run execution are forbidden.

This document is the human-readable source for the active architecture. It supersedes historical Neon, hosted-runner-bridge, bootstrap-first shared-write barriers, global-singleton-lock wording, and the temporary BL-008 user-local Flyway handoff wording.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89` |
| Primary execution host | ChatGPT only |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden |
| External worker runtime / local bridge / agent | Forbidden |
| User-operated per-run execution | Forbidden |
| Maximum safe-independent workers | Up to 10 |
| BL-008 target | Supabase project `xipkywwvzvrwcqnkifuv`, DB `postgres`, PostgreSQL 17.6 |
| BL-008 migration mechanism | Flyway 10.0.0 Java API only |
| BL-008 DB-write parallelism | Exactly 1 |
| Productive runtime | 30-minute target; platform-forced shorter runs allowed with evidence |

## 2. Current self-reliant execution lifecycle

`TRIGGER -> READ/RECONCILE -> PLAN DEPENDENCIES + READ/WRITE SETS -> CLAIM EXACT RESOURCE/UNIT -> EXECUTE -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> AGGREGATE/CHECKPOINT -> REPLAN/REFILL -> TERMINALIZE WHEN PLATFORM WINDOW ENDS OR NO ELIGIBLE WORK`

Unit-local durable evidence is persisted continuously. Aggregate state must not be deferred entirely until the end of the run.

## 3. Resource-scoped claims and lock hierarchy

There is no global backlog mutex. Serialization requires a proven dependency or actual write-set conflict. The legacy `.orchestrator/invocation-lease.yaml` is compatibility-only and cannot block unrelated work.

Claims are stored under `.orchestrator/claims/<backlog>/<claim-id>.yaml`. Up to 10 safe-independent claims may execute when write sets do not conflict. Shared aggregates are single-writer. BL-008 database mutation capacity is exactly 1.

## 4. Run scopes, concurrency and progress guarantee

- `TARGETED`: only explicitly requested backlog/work units.
- `CONTINUOUS`: replan across all eligible independent backlogs/units.
- `RECOVERY`: blocker, stale-state, parity, reconciliation or architecture recovery work in scope.

Thirty minutes is a productive target, not a correctness minimum. Never idle to satisfy the clock. While eligible in-scope work remains and execution is still available, voluntary termination is forbidden. After every completion or blocker: `REPLAN -> CLAIM -> DISPATCH`.

Platform-forced sub-30-minute runs use `RUNTIME_WINDOW_FORCED_STOP` with `voluntary_early_stop: false` and preserved durable evidence.

## 5. Three-level SSOT and unit-local evidence

- Level 1: authoritative backlog/scope.
- Level 2: item definition, SOW, dependencies and quality gates.
- Level 3: claims, unit evidence, blockers, checkpoints and results.

Unit-local evidence is authoritative for completed work. Physical repository state is authoritative for Story-file parity. Aggregate YAML is a projection/checkpoint and must be repaired when it lags physical/unit evidence. Fail-closed is local to the affected unit/dependency scope.

## 6. Source integrity and frozen baseline

All Story and trace assertions must be source-proved against the frozen `CylinderManagement` commit `3ae6e61442132d94a307275b08dd65fcef228d89`. Naming alone is not evidence. Missing behavior is recorded as an exact evidence gap and is never invented.

## 7. BL-001 current traceability state

BL-001 is complete at 134 unique HTTP method/path keys and remains read-only unless a source-integrity regression is proven.

## 8. BL-002 Story register and release priority

BL-002 contains exactly 134 registered Stories: 88 R1 and 46 R2. R1 has priority 1 and R2 priority 2. Auto-approval is forbidden. Canonical catalogue: `BL-002/story-register.csv`.

## 9. BL-002 physical Story parity and materialization queue

Mandatory parity gate: `134 registered Story IDs == 134 physical BL-002/stories/STORY-*.md files`.

Before BL-002 selection/replanning, diff the register against the live Story folder, reconcile `BL-002/materialization-task-queue.csv`, and repair aggregate count drift. Missing R1 files are priority 1; missing R2 files are priority 2. `NEEDS_CLARIFICATION` does not waive materialization: create a clarification-aware file recording the exact evidence gap without inventing behavior.

Physical materialization completes only at 134 validated Story files and zero pending materialization tasks. It is separate from strict field/UI completion, review state, approval, Use Case grouping and testing readiness.

## 10. BL-002 strict field/UI enrichment

Strict completion requires the deepest applicable source-proved contract:

`screen/user intent -> visible control/event -> exact request/identity/hidden state -> controller -> DTO/model -> service -> DAO/repository -> entity/view -> exact DB read/write identity -> validation/branch/side effects -> response/visible outcome`

`SOURCE_DETAIL_REVIEW_REQUIRED` or any recorded source-detail gap is not strict completion.

## 11. BL-002 review, approval and Use Case workflow

A Story becomes a complete review artifact only when its physical `.md` file exists and is synchronized with governed evidence. Auto-approval is forbidden. Explicit user approval is required before a Story becomes authoritative for downstream Use Case grouping/testing.

## 12. BL-003 / BL-004 dependency boundary

BL-003 unit tests and BL-004 integration/Use Case tests must not treat unapproved BL-002 Story meaning as authoritative.

## 13. BL-008 Supabase / Flyway architecture

BL-008 target is Supabase project `xipkywwvzvrwcqnkifuv`, database `postgres`, PostgreSQL 17.6. Governed source is V1-V17 at `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`, path `cylinder.datascripts/src/main/resources/db/migration`.

Execution is genuine Flyway 10.0.0 Java API only via `BL-008/java/FlywayJavaRunner.java`; schema `public`; `cleanDisabled(true)`; `baselineOnMigrate(false)`; `outOfOrder(false)`; exactly one target migration at a time; runtime-only credentials; no clean; no raw/manual SQL; no Supabase-native replay.

Required sequence when a compliant DB route/backend exists:

`prove target identity/history -> Flyway info() -> prove first pending -> validateWithResult() -> migrate exactly one target -> Flyway info() -> verify SUCCESS/history/schema/integrity -> persist evidence -> stop before selecting the next migration requirement`

## 14. BL-008 blocker isolation and retry policy

Current blocker fingerprints remain:

- `BL008_CHATGPT_EXECUTION_RUNTIME_OUTBOUND_POSTGRES_EGRESS_UNAVAILABLE`
- parent `BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`
- subreason `SANDBOX_DNS_AND_RAW_OUTBOUND_TCP_BLOCKED_NO_PROXY`
- `BL008_CHATGPT_EXECUTION_RUNTIME_TESTCONTAINERS_BACKEND_UNAVAILABLE`

Do not repeat identical network or Testcontainers probes while fingerprints are unchanged. Retry only after material execution-environment capability evidence changes. While unchanged, BL-008 migration/database writes are zero and capacity returns immediately to eligible BL-002 work.

## 15. Checkpointing, aggregation and recovery

Persist work-unit durable evidence, release its resource claim, refetch current aggregate blobs, use optimistic-concurrency SHA updates, recompute from unit evidence on conflict, then replan/refill.

Expired/stale claims are reconciled only from durable evidence and recorded as `RECOVERED_STALE_CLAIM`/`RECOVERED_STALE_INVOCATION`. Never invent the original completion time. Platform cutoffs preserve completed evidence and use `RUNTIME_WINDOW_FORCED_STOP`.

## 16. Scheduler and watchdog - resilience correction

The **Cylinder Orchestrator Production Fire** is the recurring hourly trigger around `:15` and performs real work. The **Cylinder Run Progress Watchdog** is read-only around `:50` and reports durable evidence only.

### Non-disabling scheduler policy

1. A blocker discovered by one Production Fire is **invocation-local**. It must not disable, pause, delete or permanently suppress the recurring Production Fire scheduler.
2. A transient GitHub durable-write failure blocks only mutations requiring durable persistence in that invocation. Do not claim unwritten progress. Release/recover claims when possible and let the next scheduled fire independently re-read SSOT and reevaluate the write path.
3. An unchanged BL-008 network/Testcontainers blocker, a source-detail gap, or a platform-forced runtime cutoff must not pause the recurring Production Fire.
4. **Automatic scheduler disablement is forbidden as blocker recovery.** The scheduler may be disabled only by explicit user instruction, deliberate replacement/supersession, a proven scheduler-level defect, or a duplicate-fire safety condition. The reason must be recorded.
5. Production Fire and watchdog lifecycles are independent. A production blocker must not disable the watchdog; a watchdog failure must not disable the Production Fire.
6. A scheduler firing is not proof of backlog progress. Progress requires durable unit/aggregate evidence.

This section corrects the prior behavior in which a run-local GitHub-write blocker caused the recurring production scheduler to be paused.

## 17. Quality gates

Quality gates include SSOT consistency, SOW executability, dependency satisfaction, exact frozen source, resource ownership, BL-002 parity, strict Story contract, explicit approval, BL-008 one-target apply/integrity, and scheduler resilience.

`QG-SCHEDULER`: run-local blockers remain local; recurring scheduler state is not automatically changed; any disablement is explicitly governed and evidenced.

## 18. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims, scheduler, checkpoint and runtime policy.
- `.orchestrator/architecture-current.md` - this human-readable consolidated architecture.
- `.orchestrator/last-run.yaml` - latest aggregate run checkpoint.
- `BL-002/story-register.csv` - canonical 134-row Story catalogue.
- `BL-002/STORY-DEFINITION.md` - Story rendering/acceptance contract.
- `BL-002/stories/` - physical Story review artifacts.
- `BL-002/materialization-task-queue.csv` - priority queue for missing physical Story files.
- `BL-002/enrichment-progress.yaml` - aggregate BL-002 projection.
- `BL-008/` - Flyway runner, target governance and blocker evidence.

The DOCX and PDF architecture documents must be rebuilt whenever `architecture-current.md`, `execution-architecture.yaml` or `lease-policy.yaml` changes materially.

## 19. Dynamic parity snapshot rule

Operational counts are not architecture constants. Every Production Fire must recompute physical Story parity dynamically from the live register, Story folder and durable unit evidence. The materialization queue is the work list; hard-coded Story pointers are forbidden.

## 20. Operating checklist and superseded rules

Before/during execution:

- Read current execution architecture, lease policy, runtime aggregates, BL-002 materialization queue and unit-local evidence.
- Reconcile Story register IDs against physical Story files before BL-002 selection/replanning.
- Build dependency graph/read-write sets and acquire only resource-scoped claims.
- Use up to 10 safe-independent units; do not globally serialize unrelated work.
- Persist unit-local evidence immediately after durable progress; checkpoint aggregates during the run.
- Continue `REPLAN -> CLAIM -> DISPATCH` while execution capacity remains.
- Never auto-approve Stories or invent missing source behavior.
- BL-008 uses Flyway Java API only and DB writes remain serialized at 1.
- **Never auto-disable the recurring Production Fire because one invocation encounters GitHub-write, BL-008, source-detail, or platform-runtime blockers.**

Superseded active wording includes: historical `chore/rename-dependency-files` control branch, hosted/local worker bridges, global singleton backlog mutex, end-only durable state synchronization, BL-001 in-progress wording, Neon as current target, user-local BL-008 apply handoff, and absence of an explicit 134/134 physical Story parity queue.

**Effective architecture:** resource-scoped, unit-local-first, dynamically reconciled, scheduler-resilient, physical-Story-parity aware, ChatGPT-executed, GitHub-persisted and fail-closed without global blocking.
