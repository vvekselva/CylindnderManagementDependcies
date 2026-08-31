# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 31 August 2026 - Revision 7 (User-Approved Drift & Code Change Manifest)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, validator, approved-code-rework executor, migration author and recovery coordinator. BL-008 retains its explicit user-apply handoff according to the live `BL-008/README.md`; BL-008 current state must always be resolved dynamically from that file rather than from stale architecture prose.

Revision 7 changes the Story/code-drift governance rule. Detection and analysis of drift remain automatic, but **code mutation is forbidden until the user explicitly approves the drift and its exact proposed code-change manifest**. Every drift review packet must show what differs, why it matters, exactly which source files/classes/methods/templates/database objects would change, what tests would change or be added, and whether the change materially alters the approved Story contract. The Orchestrator may prepare evidence and proposals while waiting, but it must not create or execute BL-010 code-rework work outside the user-approved scope.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | Current governed/frozen Cylinder source and evidence |
| Primary orchestration/source-analysis/approved-code-rework host | ChatGPT |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden |
| External worker runtime / local bridge / agent | Forbidden |
| BL-008 state source | `BL-008/README.md` |
| Maximum safe-independent workers | Up to 10 |
| Productive runtime | About 30-45 productive minutes when platform capacity and eligible work permit; never idle merely to consume time |
| Runtime reliability policy | `.orchestrator/runtime-reliability-policy.yaml` |
| Post-approval conformance/drift policy | `.orchestrator/post-approval-code-conformance-policy.yaml` |

## 2. Core execution lifecycle

`TRIGGER -> CREATE LIVE-RUN/EVENT -> READ/RECONCILE -> PLAN -> CLAIM -> DISPATCH -> VALIDATE -> PERSIST UNIT EVIDENCE -> RELEASE CLAIM -> CHECKPOINT -> HEARTBEAT -> REPLAN/REFILL -> GOVERNED TERMINATION GATE`

There is no global backlog mutex. Work serializes only for proven dependencies, write-set conflicts, aggregate single-writer operations, or a true shared mutation boundary. `CHECKPOINT_RECONCILED` is a progress state and is never, by itself, a terminal condition.

## 3. Resource-scoped claims

Claims are stored under `.orchestrator/claims/<backlog>/<claim-id>.yaml`. The legacy `.orchestrator/invocation-lease.yaml` is compatibility-only and must not globally block unrelated work.

## 4. Run scopes

- `TARGETED`: only explicitly requested backlog/work units.
- `CONTINUOUS`: replan across all eligible independent units.
- `RECOVERY`: blocker, stale-state, parity, reconciliation, architecture-recovery or previous-run termination-recovery work in scope.

## 5. Unit-local evidence first

Completed work is persisted as unit-local evidence before aggregate projections. Aggregate YAML is a projection/checkpoint and must be repaired when it disagrees with verified unit evidence or physical repository state. This aggregate-projection repair is an evidence synchronization operation, not application code drift and does not authorize code mutation.

## 6. Productive runtime and worker-pool policy

The governed productive window is about 30-45 minutes when execution capacity exists. This is not a correctness minimum, and the orchestrator must never idle merely to satisfy the clock. While eligible ChatGPT-executable work remains and runtime is available, continue `REPLAN -> CLAIM -> DISPATCH`. Safe-independent worker capacity is continuously replenished up to 10.

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

Mandatory parity gate: `134 registered Story IDs == 134 physical BL-002/stories/STORY-*.md files`. Missing R1 physical files are priority 1; missing R2 physical files are priority 2. `NEEDS_CLARIFICATION` does not waive physical materialization.

## 11. BL-002 strict Story enrichment

Strict completion requires the deepest applicable source-proved contract:

`screen/user intent -> visible control/event -> exact request/identity -> controller -> DTO/model -> service -> DAO/repository -> entity/view -> exact DB read/write identity -> validation/branch/side effects -> response/visible outcome`

`SOURCE_DETAIL_REVIEW_REQUIRED` or another unresolved evidence gap is not strict completion.

## 12. BL-002 review, approval and mandatory post-approval code conformance

A Story is a complete review artifact only when its physical `.md` exists and is synchronized with governed evidence. Explicit user approval/reapproval is required and auto-approval is forbidden.

Because BL-002 Stories are reverse engineered from application source, approval is followed by mandatory post-approval Story-to-code conformance. The orchestrator idempotently enqueues the approved Story in `BL-002/post-approval-code-conformance-task-queue.csv` and verifies the current approved Story against exact governed source for endpoint/controller, request/response, service and concrete implementation, DAO/repository, entity/view, DB identity, validation, transaction/persistence behavior, visible outcomes, related operations and selector UX where applicable.

Possible conformance outcomes are:

- `CODE_CONFORMANCE_VERIFIED_PASS` - approved Story corresponds to governed source for the verified scope.
- `STORY_CODE_DRIFT_DETECTED` - one or more Story assertions do not correspond to governed source; exact drift evidence is required.

Approval alone never releases revised BL-004/BL-005/BL-009 fan-out.

## 13. Mandatory user approval of Story/code drift before code changes

The active policy is `.orchestrator/post-approval-code-conformance-policy.yaml`.

When `STORY_CODE_DRIFT_DETECTED` is produced, the Orchestrator must **stop before application-code mutation** and create a durable drift review packet. The default state is `DRIFT_REVIEW_REQUIRED`. The user must explicitly approve the proposed change scope before the Orchestrator may create or execute the corresponding BL-010 development change.

Every drift review packet must contain:

1. Story ID, drift ID, source fingerprint and defect fingerprint.
2. Current source-proved behavior.
3. Approved Story behavior.
4. The exact difference between current code and the approved behavior.
5. Business/user impact of leaving the drift unresolved.
6. Proposed change summary.
7. **Code-change manifest** containing, for every proposed source change: repository, governed branch/ref, file path, class/component, method/function/template block, approximate line or stable source anchor, change type, current code behavior, proposed code behavior, reason, and the related Story assertion.
8. **Test-change manifest** containing test layer, test file/planned path, scenario and expected result.
9. **Database-change manifest when applicable** containing migration/schema object, table/view/column/constraint/function, proposed change, data-integrity impact and rollback/recovery note.
10. Risk/rollback notes and an assessment of whether the change materially changes the approved Story contract.

Allowed user decisions are:

- `DRIFT_APPROVED_FOR_CODE_CHANGE` - the exact presented scope may proceed.
- `DRIFT_REJECTED_OR_REWORK_REQUESTED` - no code change is permitted; revise the proposal or Story as instructed.

No implicit approval, auto-approval or approval inferred from the original Story approval is permitted. Original Story approval authorizes conformance analysis only; it does **not** authorize later code changes discovered during conformance.

## 14. User-approved BL-010 code rework

BL-010 code rework is executable only after durable `DRIFT_APPROVED_FOR_CODE_CHANGE` evidence exists and the approved code-change manifest is present.

After approval, ChatGPT performs the code rework through resource-scoped claims: resolve current governed source, verify that the approved manifest still matches current source, determine read/write sets, acquire the claim, implement only the approved scope, validate exact changed source, execute available tests, persist changed-file/test evidence, release the claim and rerun Story-to-code conformance.

If implementation reveals that additional files, methods, database objects or business behavior must change outside the approved manifest, the Orchestrator must stop that expansion and return to `DRIFT_REVIEW_REQUIRED` with a revised change manifest. It must not silently broaden the implementation.

If runtime execution is unavailable, the maximum allowed result is `SOURCE_VALIDATED_RUNTIME_NOT_EXECUTED`, never PASS. If the approved implementation materially changes business purpose, fields, validation, persistence/transaction semantics, visible behavior, selector contract or downstream business impact, the Story becomes `REAPPROVAL_REQUIRED`. Auto-reapproval is forbidden. Non-material implementation fixes still require a fresh conformance PASS.

## 15. Approved Story testing fan-out

Testing authority requires both:

1. explicit approval/reapproval of the current Story contract; and
2. current `CODE_CONFORMANCE_VERIFIED_PASS` evidence.

Only then is the Story `FANOUT_ELIGIBLE` under `.orchestrator/approved-story-testing-policy.yaml`.

- BL-004: JUnit 5 unit-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-005: JUnit 5 + PostgreSQL Testcontainers integration-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-009: human-readable test catalogue, dual-format test data, executable test-code mapping and authorized live validation.

Generated Java source is never equivalent to execution or PASS.

## 16. BL-009 test-data architecture

BL-009 test data uses a mandatory dual-format representation for each fanout-eligible Story:

1. `BL-009/test-data/<story-id>.csv` - machine-readable test-data source.
2. `BL-009/test-data/<story-id>.md` - human-readable companion.

The human-readable companion is mandatory and must contain a plain-language purpose/scope statement, explanation of how the data is used, and a Markdown table containing actual applicable test-data values. A reference-only or ID-only table is incomplete. CSV and human-readable representations must maintain semantic row/data parity. Real credentials/secrets must never be persisted.

## 17. BL-008 current-state authority

`BL-008/README.md` is the live current-state source for BL-008. Production orchestration, aggregate checkpoints and watchdog reporting must resolve current state dynamically. Waiting BL-008 work must not block independently eligible BL-002/004/005/009/010 work.

## 18. Scheduler and watchdog

The Production Fire is the recurring work trigger; the watchdog is read-only. Pending post-approval conformance, drift-packet preparation, approved BL-010 rework and post-rework conformance reruns are normal Production Fire candidate units selected dynamically through dependency/read-write-set planning and resource-scoped claims.

`DRIFT_REVIEW_REQUIRED` is a non-mutating wait state. While waiting for the user's decision, the Production Fire may continue safe-independent work but must not mutate the affected application code or create an executable BL-010 change for that drift.

Each Production Fire maintains `.orchestrator/live-run.yaml` and append-only lifecycle events. Run-local blockers or pending user drift approval must not automatically disable recurring scheduler tasks.

The watchdog must report approval separately from code conformance, code drift, drift-review-required state, user-approved drift state, BL-010 implementation state, reapproval-required state and fanout eligibility. For each pending drift, it must surface the exact proposed code-change locations.

## 19. Runtime reliability and terminalization

All exits/returns from the Production Fire must pass through one governed terminalization path. Direct silent return is forbidden. `UNKNOWN_TERMINATION` is a temporary defect classification requiring recovery/root-cause investigation.

## 20. Quality gates

Quality gates include:

- `QG-SSOT`, source/dependency/claim/parity/strict Story gates.
- `QG-BL002-APPROVAL`: explicit approval/reapproval is durable.
- `QG-BL002-CONFORMANCE`: post-approval Story-to-code verification is durably PASS or DRIFT against exact governed source.
- `QG-DRIFT-REVIEW-PACKET`: every detected drift has the required current-vs-approved behavior analysis plus exact code/test/database change locations.
- `QG-DRIFT-APPROVAL`: application code mutation is forbidden until the user has explicitly approved the exact drift change manifest.
- `QG-CODE-REWORK-SCOPE`: implementation changes only the user-approved files/components/methods/schema objects; scope expansion requires a new approval cycle.
- `QG-FANOUT`: BL-004/BL-005/BL-009 are released only after approval + current conformance PASS.
- BL-004/BL-005 source binding and execution evidence.
- BL-009 dual-format data parity and executable mapping.
- runtime heartbeat and terminalization quality gates.

## 21. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims and execution-policy rules.
- `.orchestrator/runtime-reliability-policy.yaml` - productive runtime, heartbeat, worker refill, termination and recovery contract.
- `.orchestrator/post-approval-code-conformance-policy.yaml` - mandatory approved Story/code verification, drift review packet and explicit user code-change approval contract.
- `.orchestrator/approved-story-testing-policy.yaml` - testing fan-out rules after approval + conformance PASS.
- `.orchestrator/architecture-current.md` - this consolidated architecture.
- `BL-002/post-approval-code-conformance-task-queue.csv` - approved Story code-conformance work queue.
- `BL-002/code-conformance-evidence/<story-id>/*.yaml` - durable source-bound PASS/DRIFT evidence.
- `BL-002/drift-approval-evidence/<story-id>/*.yaml` - durable user decision plus approved/rejected code-change manifest.
- `BL-010/development-change-task-queue.csv` - development/code-rework queue populated only after drift approval.
- `BL-010/evidence/` - source binding, approved scope, implementation, validation and test evidence.
- BL-004/BL-005/BL-009 queues and evidence - downstream testing only after fanout eligibility.

## 22. Application control-loop acceptance rule

A worker completion, blocker or successful aggregate checkpoint must return to replanning, not return from the Production Fire invocation. The coordinator keeps dispatching while eligible work and execution capacity remain, subject to dependency/write-set safety and the productive runtime window. A pending user drift decision removes only the affected code mutation from the executable pool; it does not globally block unrelated work.

## 23. Document synchronization rule

Generated architecture PDF/DOCX artifacts must be rebuilt when this architecture, post-approval conformance/drift policy, approved testing policy, runtime reliability policy, execution architecture or lease policy changes materially. Historical wording may be retained only as clearly superseded history and must not contradict active operating instructions.

**Effective Story lifecycle:** `reverse engineer -> Story rework -> explicit Story approval/reapproval -> mandatory Story/code conformance -> if drift: build exact change-location manifest -> explicit user drift/code-change approval -> BL-010 implementation within approved scope -> Story reapproval if material -> conformance PASS -> BL-004/BL-005/BL-009 fan-out -> execution -> JaCoCo/coverage evidence`.
