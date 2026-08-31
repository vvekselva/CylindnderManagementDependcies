# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 31 August 2026 - Revision 8 (Scheduler & Control-Plane Resilience)**

GitHub is durable version-control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, validator, approved-code-rework executor and recovery coordinator. GitHub Actions/runners and external worker runtimes are forbidden. BL-008 current state is always resolved dynamically from `BL-008/README.md`.

Revision 8 incorporates Revision 7 user-approved Story/code-drift governance and adds the reliability corrections learned from scheduler handoff failures, overlapping fires, stale-heartbeat recovery and aggregate-write conflicts. The delivery model is **at-least-once scheduler delivery + idempotent orchestrator execution + single-primary mutation ownership + eventually consistent aggregate projections**.

## 1. Authoritative boundary

- Control repository: `vvekselva/CylindnderManagementDependcies` on `main`.
- Application source: governed/frozen Cylinder source and exact source evidence.
- Execution host: ChatGPT only.
- GitHub role: durable control/audit persistence and version control only.
- Maximum safe-independent workers: 10.
- No global backlog mutex; serialize only proven dependencies/write conflicts/shared mutation boundaries.
- Productive runtime: about 30-45 minutes when capacity and eligible work permit; never idle to consume time.

## 2. Mandatory scheduler handoff

The FIRST orchestrator action for every Production Fire is to persist `.orchestrator/scheduler-fire-receipts/<scheduler-task>/<fire-id>.yaml` with scheduler task, fire ID, observed/scheduled fire time, receipt time, `TRIGGER_RECEIVED`, and intended run scope. Backlog read/mutation is forbidden before this receipt exists.

After run-ID allocation, the same receipt is updated to `ORCHESTRATOR_STARTED` / `RUN_LINKED` with run ID, live-run path and event-stream path. Scheduler `last_run_time` alone is never execution proof. Terminalization updates the same receipt with terminal classification and termination time.

The idempotency key is `scheduler_task + fire_id`. Re-delivery of the same fire reconciles the existing receipt and must not create a second logical run.

## 3. Scheduler resilience - invocation failure does not disable recurrence

A run-local failure is not authorization to disable a recurring Production Fire. Automatic scheduler disablement is forbidden for transient GitHub write failures, handoff failures, runtime boundaries, BL-008 blockers, source-detail gaps, aggregate conflicts, Story/code drift review waits, or ordinary backlog blockers.

A recurring schedule may be disabled only by: (1) explicit user instruction, (2) deliberate schedule replacement/supersession, or (3) a proven scheduler-level duplicate-fire safety defect. The reason must be durably recorded. Otherwise the next scheduled fire retries/reconciles automatically.

## 4. Control-plane write reliability

Mutable control files use optimistic concurrency with current blob SHA. Retryable conflicts use bounded retry with jitter:

`REFETCH CURRENT BLOB -> RECONCILE AUTHORITATIVE UNIT EVIDENCE -> RECOMPUTE UPDATE -> RETRY`

`SHA_CONFLICT`, transient GitHub write failure and `RETRYABLE_CONTROL_PLANE_CONFLICT` are retryable control-plane conditions. Completed unit-local work must never be rerun merely because an aggregate/control projection conflicted.

## 5. Primary ownership and duplicate fires

Only one primary mutator may own the active Production Fire mutation boundary. Overlapping fires are safe: one primary continues and the other terminalizes as `DUPLICATE_FIRE_SUPPRESSED`. Duplicate suppression never disables the recurring scheduler.

A stale heartbeat alone is insufficient to declare an active run disappeared. Before `ABNORMAL_PROCESS_DISAPPEARANCE`, re-read `live-run`, newest heartbeat/event evidence, termination record and scheduler receipt. Newer durable heartbeat evidence supersedes stale inference.

## 6. Core execution lifecycle

`TRIGGER -> RECEIPT -> RUN LINK -> RECOVERY-FIRST RECONCILIATION -> PRIMARY OWNERSHIP -> PLAN -> CLAIM -> DISPATCH -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> CHECKPOINT -> HEARTBEAT -> REPLAN/REFILL -> GOVERNED TERMINATION`

A checkpoint is progress, never by itself a terminal condition. While eligible work and execution capacity remain, continue `REPLAN -> CLAIM -> DISPATCH` and refill up to 10 safe-independent workers.

## 7. Three-level SSOT and aggregate consistency

- Level 1: backlog/master scope.
- Level 2: item definition, SOW, dependencies and gates.
- Level 3: runtime claims, unit evidence, blockers, checkpoints and results.

Unit-local evidence is authoritative for completed unit work. Aggregate YAML/CSV is a projection/checkpoint. Shared aggregate writes are single-writer and optimistic-SHA protected. On conflict, preserve unit evidence and repair the projection later. Aggregate projection drift is synchronization drift, not Story/code drift.

Fail-closed is local: missing evidence blocks only the affected unit/dependency, not unrelated safe-independent work.

## 8. Recovery-first contract

Before new dispatch, reconcile unresolved scheduler handoff/start/termination gaps, live-run liveness, newest heartbeat, terminal records, stale claims, authoritative unit evidence and aggregate projection drift. Recover a stale claim only after current liveness is revalidated.

Runtime cutoff preserves completed evidence, releases/reconciles claims when possible, checkpoints resumable state and terminalizes with positive evidence. The next fire resumes from the latest durable checkpoint.

## 9. BL-002 Story governance

BL-002 has 134 registered Stories (88 R1, 46 R2). R1 precedes R2 where the release gate applies. Auto-approval and auto-reapproval are forbidden. Physical Story parity remains `134 registered IDs == 134 physical BL-002/stories/STORY-*.md files`.

Strict Story completion requires the deepest applicable source-proved chain: screen/user intent -> visible control/event -> request/identity -> controller -> DTO/model -> service/concrete implementation -> DAO/repository -> entity/view -> exact DB read/write identity -> validation/transaction/side effects -> visible outcome. Unresolved source-detail gaps are not strict completion.

## 10. Revision 7 Story/code drift governance retained

After explicit Story approval/reapproval, mandatory Story-to-code conformance compares the approved Story with exact governed source. Outcomes are `CODE_CONFORMANCE_VERIFIED_PASS` or `STORY_CODE_DRIFT_DETECTED`.

When drift is detected, analysis and durable review-packet preparation are automatic, but application-code mutation and BL-010 creation/execution are forbidden until the user explicitly approves the exact drift/code-change manifest.

The packet must state current vs approved behavior, business impact, repository/ref, file path, class/component, method/function/template/database object, approximate line or stable source anchor, proposed change, reason, tests, DB impact, risk/rollback and materiality/reapproval assessment.

If implementation needs files/methods/schema objects/business behavior beyond the approved manifest, stop that expansion and request new approval. Material Story-contract changes require explicit Story reapproval. Fanout requires current approval/reapproval plus current conformance PASS.

## 11. Testing fanout

Only fanout-eligible Stories proceed:
- BL-004: JUnit 5 unit tests with exact source binding and execution evidence.
- BL-005: JUnit 5 + PostgreSQL Testcontainers integration tests with execution evidence.
- BL-009: human-readable test catalogue/data plus executable data-driven test mapping and execution evidence.

Generated source is not PASS. Coverage is derived only from actually executed tests.

## 12. BL-008

`BL-008/README.md` is the sole live state authority. Do not hard-code a stale provider/migration state into the architecture. Waiting BL-008 work must not block independent BL-002/004/005/009/010 work. PostgreSQL-specific behavior must not be substituted with H2, manual SQL, or mocked integration behavior.

## 13. Runtime liveness and terminalization

`.orchestrator/live-run.yaml` is refreshed at invocation start, dispatch waves, worker completion/blocker, aggregate checkpoints and terminalization start, with a target heartbeat interval no greater than two minutes while execution is active.

Run lifecycle evidence is persisted under `.orchestrator/runs/<run-id>/`. Every exit uses one governed terminalization path. Direct silent return is forbidden. The original scheduler receipt and run termination record must agree on the terminal classification.

`UNKNOWN_TERMINATION` is a temporary defect classification requiring recovery. `PLATFORM_RUNTIME_FORCED_STOP` requires positive evidence; it must not be inferred merely because a run was short.

## 14. Quality gates added/strengthened in Revision 8

- `QG-TRIGGER`: counted execution requires durable receipt + run link.
- `QG-IDEMPOTENCY`: one logical run per scheduler-task + fire-id.
- `QG-CONTROL-PLANE-RETRY`: retryable write conflicts are refetched/reconciled/retried before terminal failure.
- `QG-PRIMARY`: at most one primary mutator; duplicate fire is suppressed without disabling recurrence.
- `QG-LIVENESS-REVALIDATION`: stale heartbeat cannot cause recovery until newest durable evidence is rechecked.
- `QG-AGGREGATE`: projection conflicts cannot discard completed unit evidence.
- `QG-SCHEDULER-RESILIENCE`: invocation-local failure cannot disable recurring Production Fire.
- `QG-DRIFT-APPROVAL`: no application-code mutation or BL-010 execution before exact user-approved manifest.
- `QG-CODE-REWORK-SCOPE`: scope expansion requires new user approval.
- `QG-FANOUT`: approval/reapproval + current conformance PASS required.
- `QG-TERMINATION`: run record and original scheduler receipt terminalize consistently.

## 15. Repository control files

- `.orchestrator/architecture-current.md` - this active architecture.
- `.orchestrator/execution-architecture.yaml` - machine-readable execution architecture.
- `.orchestrator/lease-policy.yaml` - resource claims/locking.
- `.orchestrator/runtime-reliability-policy.yaml` - Revision 8 runtime/handoff/retry/scheduler resilience contract.
- `.orchestrator/post-approval-code-conformance-policy.yaml` - Story/code conformance and user-approved drift manifest contract.
- `.orchestrator/approved-story-testing-policy.yaml` - downstream testing fanout gates.
- `.orchestrator/scheduler-fire-receipts/` - durable scheduler delivery/run-link/terminal evidence.
- `.orchestrator/live-run.yaml`, `.orchestrator/runs/<run-id>/events.ndjson`, `.orchestrator/runs/<run-id>/termination.yaml` - runtime liveness and terminal evidence.
- `.orchestrator/claims/` - resource-scoped claims.
- BL-002 unit evidence and aggregate projections - unit-local-first SSOT/projections.

## 16. Operating rule

The framework is designed so ordinary failures become recoverable states rather than system shutdowns. A failed invocation is durable recovery evidence, not authorization to pause recurrence. The next fire performs recovery-first reconciliation and resumes eligible work.

**Effective lifecycle:** `at-least-once scheduler fire -> idempotent receipt/run link -> single-primary recovery-first execution -> unit-local durable work -> optimistic aggregate projection -> governed terminalization -> next-fire resume`, with explicit user approval gating all Story/code drift mutations.

## 17. Document synchronization

DOCX/PDF architecture artifacts must be rebuilt whenever this architecture or its runtime/conformance/testing policies change materially. Revision 8 supersedes Revision 7 only for scheduler/control-plane reliability; Revision 7 drift/code-change approval governance remains fully active.
