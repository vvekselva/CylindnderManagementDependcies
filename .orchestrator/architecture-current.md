# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 31 August 2026 - Revision 5 (Runtime Reliability & Termination Diagnostics)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, migration author, validator and recovery coordinator. BL-008 retains its explicit user-apply handoff according to the live `BL-008/README.md`; BL-008 current state must always be resolved dynamically from that file rather than from stale architecture prose.

This revision preserves the BL-009 dual-format test-data contract and adds application-level runtime reliability: a live invocation heartbeat, append-only run events, continuous worker-pool refill, governed terminalization, mandatory root-cause evidence, abnormal-disappearance detection and recovery-first handling after incomplete termination.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | Current governed/frozen Cylinder source and evidence |
| Primary orchestration/source-analysis host | ChatGPT |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden |
| External worker runtime / local bridge / agent | Forbidden |
| BL-008 state source | `BL-008/README.md` |
| Maximum safe-independent workers | Up to 10 |
| Productive runtime | About 30-45 productive minutes when platform capacity and eligible work permit; never idle merely to consume time |
| Runtime reliability policy | `.orchestrator/runtime-reliability-policy.yaml` |

## 2. Core execution lifecycle

`TRIGGER -> CREATE LIVE-RUN/EVENT -> READ/RECONCILE -> PLAN -> CLAIM -> DISPATCH -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> CHECKPOINT -> HEARTBEAT -> REPLAN/REFILL -> GOVERNED TERMINATION GATE`

There is no global backlog mutex. Work serializes only for proven dependencies, write-set conflicts, aggregate single-writer operations, or a true shared mutation boundary.

`CHECKPOINT_RECONCILED` is a progress state and is never, by itself, a terminal condition.

## 3. Resource-scoped claims

Claims are stored under `.orchestrator/claims/<backlog>/<claim-id>.yaml`. The legacy `.orchestrator/invocation-lease.yaml` is compatibility-only and must not globally block unrelated work.

## 4. Run scopes

- `TARGETED`: only explicitly requested backlog/work units.
- `CONTINUOUS`: replan across all eligible independent units.
- `RECOVERY`: blocker, stale-state, parity, reconciliation, architecture-recovery or previous-run termination-recovery work in scope.

## 5. Unit-local evidence first

Completed work is persisted as unit-local evidence before aggregate projections. Aggregate YAML is a projection/checkpoint and must be repaired when it disagrees with verified unit evidence or physical repository state.

## 6. Productive runtime and worker-pool policy

The governed productive window is about 30-45 minutes when execution capacity exists. This is not a correctness minimum, and the orchestrator must never idle merely to satisfy the clock.

While eligible ChatGPT-executable work remains and runtime is available, continue `REPLAN -> CLAIM -> DISPATCH`. Safe-independent worker capacity is continuously replenished up to 10. A worker completion, blocker, claim release or aggregate checkpoint returns capacity immediately to replanning/refill.

A short run with eligible work remaining is not automatically a platform-forced stop. `PLATFORM_RUNTIME_FORCED_STOP` requires positive durable platform/cancellation evidence.

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

A Story is a complete review artifact only when its physical `.md` exists and is synchronized with governed evidence. Explicit user approval is required before downstream test authority. Auto-approval is forbidden.

## 13. Approved Story testing fan-out

Every explicitly approved BL-002 Story is reconciled into the governed downstream testing lifecycle according to `.orchestrator/approved-story-testing-policy.yaml`.

- BL-004: JUnit 5 unit-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-005: JUnit 5 + PostgreSQL Testcontainers integration-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-009: human-readable test catalogue, test data and authorized live validation.

Generated Java source is never equivalent to execution or PASS.

## 14. BL-009 test-data architecture

BL-009 test data uses a mandatory dual-format representation for each approved Story:

1. `BL-009/test-data/<story-id>.csv` - machine-readable test-data source.
2. `BL-009/test-data/<story-id>.md` - human-readable companion.

The human-readable companion is mandatory and must contain a plain-language purpose/scope statement, an explanation of how the data should be used, and a Markdown table containing the actual applicable test-data values. A reference-only or ID-only table is incomplete.

CSV and human-readable representations must maintain semantic parity for row count, `data_id`, test-case association, inputs, preconditions/flags, expected results and data classification. Real credentials/secrets must never be persisted; governed runtime placeholders are allowed.

## 15. BL-008 current-state authority

`BL-008/README.md` is the live current-state source for BL-008. Production orchestration, aggregate checkpoints and watchdog reporting must resolve the current validated migration/state/mode from that file at startup and checkpoint. Waiting BL-008 work must not block independently eligible BL-002/004/005/009 work.

## 16. Scheduler and watchdog

The Production Fire is the recurring work trigger; the watchdog is read-only. Run-local blockers must not automatically disable recurring scheduler tasks. A scheduler firing alone is not proof of progress.

Each Production Fire must maintain `.orchestrator/live-run.yaml` and append lifecycle events under `.orchestrator/runs/<run-id>/events.ndjson`. The watchdog determines liveness from live-run plus event/termination evidence; `.orchestrator/last-run.yaml` alone does not prove that an invocation is currently running.

If the heartbeat is stale and no valid terminal event exists, classify the prior invocation as `ABNORMAL_PROCESS_DISAPPEARANCE`. The next Production Fire performs recovery-first root-cause reconciliation before normal dispatch.

## 17. Runtime reliability and terminalization

All exits/returns from the Production Fire must pass through one governed terminalization path such as `terminateRun(reason, evidence)` or equivalent. Direct silent return is forbidden.

Allowed machine-readable terminal reasons are:

- `ALL_ELIGIBLE_WORK_COMPLETED`
- `ALL_REMAINING_WORK_BLOCKED`
- `TARGET_RUNTIME_REACHED`
- `PLATFORM_RUNTIME_FORCED_STOP`
- `UNHANDLED_EXCEPTION`
- `RESOURCE_CLAIM_FAILURE`
- `AGGREGATE_RECONCILIATION_FAILURE`
- `DEPENDENCY_DEADLOCK`
- `SCHEDULER_CANCELLED`
- `USER_REQUESTED_STOP`
- `DUPLICATE_FIRE_SUPPRESSED`
- `APPLICATION_SHUTDOWN`
- `ABNORMAL_PROCESS_DISAPPEARANCE`
- `UNKNOWN_TERMINATION`

`UNKNOWN_TERMINATION` is a temporary defect classification only and requires recovery/root-cause investigation.

The terminal record is stored at `.orchestrator/runs/<run-id>/termination.yaml` and must capture run/scheduler IDs, started/heartbeat/termination times when observable, termination reason/classification, productive runtime when measurable, worker counts/IDs, eligible/dispatchable work counts, last durable event/checkpoint, exception/platform evidence when applicable, and recovery action.

## 18. Quality gates

Quality gates include SSOT consistency, exact source evidence, dependency safety, Story parity, strict Story enrichment, explicit approval, BL-004/BL-005 source binding and execution evidence, BL-009 dual-format test-data parity, populated human-readable test-data tables, BL-008 live-state reconciliation and durable checkpoint readback.

Additional runtime gates:

- `QG-RUNTIME`: while eligible work and execution capacity remain, the coordinator must continue productive replan/claim/dispatch rather than returning after a checkpoint.
- `QG-HEARTBEAT`: live heartbeat must remain current and consistent with worker/event evidence.
- `QG-TERMINATION`: every terminalization must record one allowed reason and complete diagnostic evidence. Ending with `eligible_work_remaining=true` and no governed explanation fails this gate.

## 19. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims and execution-policy rules.
- `.orchestrator/runtime-reliability-policy.yaml` - productive runtime, heartbeat, worker refill, termination and recovery contract.
- `.orchestrator/approved-story-testing-policy.yaml` - approved Story downstream testing and BL-009 test-data rules.
- `.orchestrator/architecture-current.md` - this consolidated human-readable architecture.
- `.orchestrator/live-run.yaml` - current invocation liveness/heartbeat/worker snapshot.
- `.orchestrator/runs/<run-id>/events.ndjson` - append-only invocation lifecycle events.
- `.orchestrator/runs/<run-id>/termination.yaml` - governed terminal reason and root-cause evidence.
- `BL-002/story-register.csv` - canonical Story catalogue.
- `BL-002/materialization-task-queue.csv` - missing Story-file priority queue.
- `BL-002/enrichment-progress.yaml` - aggregate Story progress.
- `BL-009/stories/<story-id>.md` - human-readable test catalogue.
- `BL-009/test-data/<story-id>.csv` - machine-readable test data.
- `BL-009/test-data/<story-id>.md` - mandatory human-readable test data with populated table.
- `BL-008/README.md` - live BL-008 workflow and current state.

## 20. Application control-loop acceptance rule

A worker completion, blocker or successful aggregate checkpoint must return to replanning, not return from the Production Fire invocation. The coordinator keeps dispatching while eligible work and execution capacity remain, subject to dependency/write-set safety and the productive runtime window.

A Production Fire must not finish with `eligible_work_remaining=true` and no governed explanation. If eligible work remains, terminal evidence must positively prove `TARGET_RUNTIME_REACHED`, `PLATFORM_RUNTIME_FORCED_STOP`, a complete blocker/deadlock condition, explicit user/scheduler shutdown, or another allowed reason. Otherwise `QG-TERMINATION` fails and the next Production Fire enters recovery-first mode.

## 21. Document synchronization rule

Generated architecture PDF/DOCX artifacts must be rebuilt when this architecture, `.orchestrator/runtime-reliability-policy.yaml`, execution-architecture.yaml or lease-policy.yaml changes materially. Historical wording may be retained only as clearly superseded history and must not contradict active operating instructions.

**Effective runtime rule:** checkpoint success is not completion. Keep the safe-independent worker pool productively refilled, preserve a live heartbeat/event trail, and make every termination explainable and recoverable.
