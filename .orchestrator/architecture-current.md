# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 30 August 2026**

GitHub = durable version control / control-state persistence. ChatGPT = Primary Orchestrator, execution engine, validator and recovery coordinator.

This document is the human-readable source for the current architecture. It supersedes historical bootstrap-first, hosted-runner-bridge, Neon-target and global-singleton-lock wording. The generated PDF must be rebuilt from this source whenever this architecture changes.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89` |
| Execution host | ChatGPT |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden for orchestration execution |
| External worker runtime | Forbidden unless governance is explicitly changed |
| User manual execution | Forbidden as an orchestration dependency |
| Maximum safe-independent workers | Up to 10 |
| BL-008 DB-write parallelism | Exactly 1 |

## 2. Core execution lifecycle

`TRIGGER -> READ/RECONCILE -> PLAN -> BUILD DEPENDENCY + READ/WRITE SETS -> CLAIM RESOURCE -> EXECUTE -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> AGGREGATE/CHECKPOINT -> REPLAN/REFILL -> TERMINALIZE`

There is no global backlog mutex. Work serializes only for a proven dependency, a write-set collision, an immutable-read invalidation risk, shared aggregate writing, or the BL-008 DB-write semaphore.

## 3. Resource-scoped claims

Claims are stored as one file per claim under `.orchestrator/claims/<backlog>/<claim-id>.yaml`.

Each claim identifies the exact backlog unit and read/write set. Two active claims may coexist when their write sets do not conflict and neither depends on incomplete output owned by the other.

The legacy `.orchestrator/invocation-lease.yaml` is compatibility-only and must not be interpreted as a global mutex.

## 4. Run scopes

- `TARGETED`: execute only the explicitly requested backlog/work units.
- `CONTINUOUS`: replan across all eligible independent backlogs/units.
- `RECOVERY`: execute only blocker, stale-state, parity, reconciliation or architecture recovery work in scope.

## 5. Unit-local evidence first

Workers do not directly own aggregate truth. They persist unit-local evidence first, release their resource claim, and then allow the dedicated aggregator/checkpointer to update shared projections.

Aggregate checkpoints are made after completed/blocked units and after dispatch waves when execution time allows. Durable state must not be deferred entirely until terminalization.

Primary aggregate projections include `.orchestrator/last-run.yaml` and `BL-002/enrichment-progress.yaml`. If an aggregate cursor lags, verified unit-local evidence and physical repository state win.

## 6. Productive runtime policy

Thirty minutes is a productive target, not a correctness minimum. The Orchestrator must use as much productive time as the platform supplies, up to the target, and must never idle merely to satisfy the clock.

While eligible in-scope work remains and execution is still available, voluntary terminalization is forbidden. The loop is `REPLAN -> CLAIM -> DISPATCH` after every completed or blocked unit.

When the platform cuts execution short, use `RUNTIME_WINDOW_FORCED_STOP`, preserve all durable progress, and keep `voluntary_early_stop: false`.

## 7. Three-level SSOT

- Level 1: backlog/master scope and authoritative source bindings.
- Level 2: item definition, SOW, dependencies, completion path and quality gates.
- Level 3: runtime work units, claims, evidence, blockers, decisions, checkpoints and results.

Fail-closed is local to the affected dependency or mutation scope. A blocked lane must not stop safe-independent eligible work elsewhere.

## 8. BL-001 Controller Traceability

BL-001 is canonically complete at 134 unique HTTP method/path keys and remains read-only unless a source-integrity regression is proven.

The exact frozen application source baseline remains `3ae6e61442132d94a307275b08dd65fcef228d89`.

## 9. BL-002 Story register, physical files and priority

BL-002 contains exactly 134 registered Stories: 88 R1 and 46 R2. R1 is priority 1; R2 is priority 2. R1 work gates R2 work where the release gate applies.

Canonical catalogue: `BL-002/story-register.csv`.

Every registered Story must also have exactly one physical review artifact at `BL-002/stories/<story-id>.md`.

The mandatory parity gate is:

`registered Story IDs == physical Story file IDs == 134`

Registration alone is not physical materialization.

## 10. BL-002 materialization task queue

Any registered Story whose physical `.md` file is absent becomes an explicit work unit in `BL-002/materialization-task-queue.csv`.

Queue fields include Story ID, release, priority, task type, status, reason and next action.

Materialization priority:

- R1 -> priority 1
- R2 -> priority 2

Queue statuses: `PENDING`, `CLAIMED`, `MATERIALIZED`, `VALIDATED`, `BLOCKED`.

Before selecting/replanning BL-002 work, reconcile the register against `BL-002/stories/STORY-*.md`, update the queue, and repair any aggregate materialization-count drift.

A `NEEDS_CLARIFICATION` Story still requires a physical Story file. The file must record the exact missing evidence and must not invent behavior.

BL-002 physical materialization is complete only at 134 validated physical Story files and zero pending materialization tasks.

Physical materialization is a separate metric from strict field/UI enrichment, review state, approval state, Use Case grouping and testing readiness.

## 11. BL-002 strict Story enrichment

A Story is strict-complete only when every applicable source-proved layer is covered:

`screen/user intent -> visible control -> browser event -> exact request/identity -> controller -> DTO/model -> service -> DAO/repository -> entity/view -> database read/write identity -> validation/branch/side effects -> response -> visible outcome`

`SOURCE_DETAIL_REVIEW_REQUIRED` or any recorded source-detail gap is not strict completion.

Story numbering alone is not a dependency. Safe-independent Story units may run concurrently when their dependencies and write sets do not conflict.

## 12. BL-002 review and approval

Auto-approval is forbidden. Explicit user approval is required.

`READY_FOR_USER_REVIEW` means the source trace is sufficiently complete for review. `NEEDS_CLARIFICATION` means missing source-proved behavior must be resolved before approval.

A Story is not a complete review artifact until its physical `.md` file exists and is synchronized with governed evidence.

Approved Stories may be grouped into Use Cases. Use Cases also require explicit user approval before authoritative downstream testing.

## 13. BL-003 / BL-004 dependency boundary

BL-003 starts from approved BL-002 Story assertions for unit testing.

BL-004 starts from approved Stories/Use Cases/scenarios for integration and Use Case testing.

Neither backlog may treat unapproved Story meaning as authoritative.

## 14. BL-008 current database architecture

Current persistent test target: Supabase project `xipkywwvzvrwcqnkifuv`, database `postgres`, PostgreSQL 17.6.

Migration mode is genuine Flyway 10.0.0 Java API only. Exactly one target migration is selected/applied at a time. `clean`, raw/manual SQL and Supabase-native replay are forbidden.

DB-write parallelism is exactly 1 through claim `BL-008|DB-WRITE-SLOT|SUPABASE:xipkywwvzvrwcqnkifuv:postgres`.

The current ChatGPT execution runtime has no compliant outbound PostgreSQL route and no Docker/Testcontainers backend. Identical network/Testcontainers probes must not be repeated while the blocker fingerprint is unchanged. Capacity returns immediately to other eligible work.

## 15. Lock hierarchy

| Ownership/lock | Capacity | Scope |
|---|---:|---|
| Primary invocation ownership | 1 primary | Competing primary invocation only; not a global backlog mutex |
| Resource/work-unit claims | Up to 10 | Exact unit/write-set only |
| Aggregate writer | 1 | Shared aggregate checkpoint/update only |
| BL-008 DB-write semaphore | 1 | Genuine Flyway DB mutation through verification |

## 16. Scheduler and watchdog

The Production Fire is a trigger for real work, not proof of progress. It runs hourly around `:15` under the active task configuration.

The read-only watchdog runs around `:50`, reads durable evidence and reports actual deltas. It must not execute backlog work or mutate state.

Runtime reporting distinguishes strict enrichment, physical materialization, approvals, Use Case grouping, testing readiness and BL-008 migration progress.

## 17. Current BL-002 physical parity correction

At the 30-Aug architecture reconciliation that introduced the materialization queue, the live `BL-002/stories/` tree contained 111 physical Story files while the register contained 134 Story IDs. Therefore 23 physical Story files were missing.

The durable queue was created with 22 R1 priority-1 tasks and 1 R2 priority-2 task. This snapshot is operational status, not a permanent architecture constant; future invocations must recompute parity dynamically.

## 18. Quality gates

Key gates include SSOT consistency, SOW executability, dependency satisfaction, exact source integrity, lifecycle evidence, traceability, Story physical parity, strict Story enrichment, explicit user approval, and BL-008 one-requirement Flyway/integrity verification.

Fail-closed means do not invent, skip, auto-approve or substitute unsafe execution. It does not authorize a blocked unit to globally stop independent eligible work.

## 19. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims, locking, checkpoint and runtime policy.
- `.orchestrator/architecture-current.md` - this human-readable consolidated source.
- `.orchestrator/last-run.yaml` - aggregate/latest run checkpoint.
- `BL-002/story-register.csv` - canonical 134-row Story catalogue.
- `BL-002/STORY-DEFINITION.md` - Story rendering/acceptance contract.
- `BL-002/stories/` - physical Story review artifacts.
- `BL-002/materialization-task-queue.csv` - explicit priority queue for missing physical Story files.
- `BL-002/enrichment-progress.yaml` - aggregate BL-002 projection.
- `BL-008/` - Flyway runner, target governance and blocker evidence.

## 20. Document synchronization rule

The PDF architecture document must be generated from this consolidated architecture and must not carry active rules that conflict with `.orchestrator/execution-architecture.yaml` or `.orchestrator/lease-policy.yaml`.

Historical models may be mentioned only as superseded history. They must not appear in active architecture tables or operating checklists.
