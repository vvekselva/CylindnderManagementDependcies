# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 30 August 2026 - Revision 3 (BL-008 Existing-Database Handoff)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, migration author, validator and recovery coordinator. BL-008 has one explicit execution handoff: ChatGPT authors additive Flyway migrations, while the user applies the normal Flyway migration process to the **existing database** and returns the result.

This revision supersedes any earlier wording that described BL-008 as targeting a new/fresh database or requiring ChatGPT-side Testcontainers/Supabase execution.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | Current uploaded Cylinder backup plus governed Git source/evidence |
| Primary orchestration/source-analysis host | ChatGPT |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden |
| External worker runtime / local bridge / agent | Forbidden |
| BL-008 user handoff | Normal Flyway apply on the existing database is explicitly allowed |
| Maximum safe-independent workers | Up to 10 |
| BL-008 database apply target | Existing database; preserve data/schema/history |
| Productive runtime | 30-minute target; platform-forced shorter runs allowed with evidence |

## 2. Core execution lifecycle

`TRIGGER -> READ/RECONCILE -> PLAN -> CLAIM EXACT RESOURCE/UNIT -> EXECUTE/ANALYZE -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> AGGREGATE/CHECKPOINT -> REPLAN/REFILL`

There is no global backlog mutex. Work serializes only for proven dependencies, write-set conflicts, aggregate single-writer operations, or a true shared mutation boundary.

## 3. Resource-scoped claims

Claims are stored under `.orchestrator/claims/<backlog>/<claim-id>.yaml`. The legacy `.orchestrator/invocation-lease.yaml` is compatibility-only and must not globally block unrelated work.

## 4. Run scopes

- `TARGETED`: only explicitly requested backlog/work units.
- `CONTINUOUS`: replan across all eligible independent units.
- `RECOVERY`: blocker, stale-state, parity, reconciliation or architecture-recovery work in scope.

## 5. Unit-local evidence first

Completed work is persisted as unit-local evidence before aggregate projections. Aggregate YAML is a projection/checkpoint and must be repaired when it disagrees with verified unit evidence or physical repository state.

## 6. Productive runtime policy

Thirty minutes is a productive target, not a correctness minimum. Never idle merely to satisfy the clock. While eligible ChatGPT-executable work remains and runtime is available, continue `REPLAN -> CLAIM -> DISPATCH`.

## 7. Three-level SSOT

- Level 1: backlog/master scope.
- Level 2: item definition, SOW, dependencies and completion path.
- Level 3: runtime claims, work units, evidence, blockers and results.

Fail-closed is local to the affected unit/dependency and must not globally block unrelated work.

## 8. BL-001

BL-001 is complete at 134 unique HTTP method/path keys and remains read-only unless a source-integrity regression is proven.

## 9. BL-002 Story register and priority

BL-002 contains 134 registered Stories: 88 R1 and 46 R2. R1 is priority 1; R2 is priority 2. Auto-approval is forbidden. Canonical catalogue: `BL-002/story-register.csv`.

## 10. BL-002 physical Story parity

Mandatory parity gate: `134 registered Story IDs == 134 physical BL-002/stories/STORY-*.md files`.

Missing R1 physical files are priority 1; missing R2 physical files are priority 2. `NEEDS_CLARIFICATION` does not waive physical materialization.

## 11. BL-002 strict Story enrichment

Strict completion requires the deepest applicable source-proved contract:

`screen/user intent -> visible control/event -> exact request/identity -> controller -> DTO/model -> service -> DAO/repository -> entity/view -> exact DB read/write identity -> validation/branch/side effects -> response/visible outcome`

`SOURCE_DETAIL_REVIEW_REQUIRED` or another unresolved evidence gap is not strict completion.

## 12. BL-002 review and approval

A Story is a complete review artifact only when its physical `.md` exists and is synchronized with governed evidence. Explicit user approval is required before downstream Use Case/test authority.

## 13. BL-003 / BL-004 dependency boundary

BL-003 unit tests and BL-004 integration/Use Case tests must not treat unapproved BL-002 Story meaning as authoritative.

## 14. BL-008 current architecture - existing database

BL-008 now uses a **migration-authoring / existing-database apply handoff**:

1. ChatGPT inspects the current application/schema expectations and existing migration chain.
2. ChatGPT adds additive Flyway migrations (`V171`, `V172`, ...), leaving historical migrations unchanged by default.
3. The user runs the normal Flyway-enabled migration process against the **existing PostgreSQL database**.
4. Flyway reads the existing `flyway_schema_history`, validates it, and applies only migrations that are pending for that database.
5. The user returns the Flyway success/error result.
6. ChatGPT analyzes the returned result and adds the next corrective migration where an additive repair is possible.

### Existing-database preservation rules

- Preserve existing application data.
- Preserve existing schema objects unless a governed migration intentionally changes them.
- Preserve `flyway_schema_history`.
- Do not rerun already-applied migrations.
- Do not use `flyway clean`.
- Do not drop/recreate the database merely for BL-008.
- Do not clear Flyway history.
- Do not re-baseline merely to force the handoff.
- Do not substitute raw/manual SQL for the Flyway migration chain.

If an earlier pending migration fails before a later corrective migration can execute, a later migration cannot repair that uncompleted earlier migration. Any historical migration rewrite requires explicit user approval.

## 15. Current BL-008 additive correction

Current authored migration:

`V171__Customer_Order_Request_View_Compatibility.sql`

It addresses the mismatch between application references to:

- `vw_customer_order_request_dashboard`
- `vw_customer_order_request_daily_product_metrics`

and the older migration-created `vw_customer_demand_*` relations by adding compatibility views without modifying V1-V170.

Current BL-008 state: `WAITING_FOR_USER_EXISTING_DATABASE_FLYWAY_RESULT`.

## 16. BL-008 isolation

While BL-008 waits for the user's Flyway result, it has no executable database-write unit inside ChatGPT. That wait must not block BL-002 or other independently eligible ChatGPT work.

## 17. Scheduler and watchdog

The Production Fire is the recurring work trigger; the watchdog is read-only. Run-local blockers must not automatically disable recurring scheduler tasks. A scheduler firing alone is not proof of progress.

## 18. Quality gates

Quality gates include SSOT consistency, exact source evidence, dependency safety, Story parity, strict Story enrichment, explicit approval, additive migration correctness, preservation of existing Flyway history/data, and evidence-backed Flyway outcomes.

## 19. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims and execution-policy rules.
- `.orchestrator/architecture-current.md` - this consolidated human-readable architecture.
- `BL-002/story-register.csv` - canonical Story catalogue.
- `BL-002/materialization-task-queue.csv` - missing Story-file priority queue.
- `BL-002/enrichment-progress.yaml` - aggregate Story progress.
- `BL-008/README.md` - current BL-008 authoring/apply workflow and status.
- `cylinder.datascripts/src/main/resources/db/migration` - application Flyway migration directory.

## 20. Document synchronization rule

Generated architecture PDF/DOCX artifacts must be rebuilt when this architecture changes materially. Historical wording may be retained only as clearly superseded history and must not contradict active operating instructions.

**Effective BL-008 rule:** ChatGPT authors additive migrations; the user applies Flyway to the **existing database**; existing data/schema history are preserved; the returned Flyway result drives the next correction.
