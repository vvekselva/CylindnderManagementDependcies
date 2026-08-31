# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 31 August 2026 - Revision 6 (Post-Approval Code Conformance & Automated Code Rework)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, code-rework executor, migration author, validator and recovery coordinator. BL-008 retains its explicit user-apply handoff according to the live `BL-008/README.md`; BL-008 current state must always be resolved dynamically from that file rather than from stale architecture prose.

Revision 6 preserves runtime reliability and the BL-009 dual-format test-data contract, and adds a mandatory post-approval Story-to-code conformance gate for reverse-engineered BL-002 Stories. Explicit approval authorizes source conformance verification; it does not directly release testing fan-out. Story/code drift that is an automatable code gap is routed to BL-010 and executed by ChatGPT through resource-scoped claims, then conformance is rerun. Material Story-contract changes require explicit reapproval.

## 1. Authoritative boundary

| Area | Current governed state |
|---|---|
| Control repository | `vvekselva/CylindnderManagementDependcies` on `main` |
| Application source | Current governed/frozen Cylinder source and evidence |
| Primary orchestration/source-analysis/code-rework host | ChatGPT |
| GitHub role | Durable control/audit persistence and version control only |
| GitHub Actions/runners | Forbidden |
| External worker runtime / local bridge / agent | Forbidden |
| BL-008 state source | `BL-008/README.md` |
| Maximum safe-independent workers | Up to 10 |
| Productive runtime | About 30-45 productive minutes when platform capacity and eligible work permit; never idle merely to consume time |
| Runtime reliability policy | `.orchestrator/runtime-reliability-policy.yaml` |
| Post-approval conformance/code-rework policy | `.orchestrator/post-approval-code-conformance-policy.yaml` |

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

Completed work is persisted as unit-local evidence before aggregate projections. Aggregate YAML is a projection/checkpoint and must be repaired when it disagrees with verified unit evidence or physical repository state.

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

## 13. Automated code rework for Story/code drift

The active policy is `.orchestrator/post-approval-code-conformance-policy.yaml`.

When conformance drift is an automatable code defect or approved target-behavior gap, the Production Fire automatically creates or reuses an idempotent BL-010 development task keyed by Story ID + source fingerprint + defect fingerprint. ChatGPT then performs the code rework as normal executable backlog work: resolve source binding, determine read/write sets, acquire a resource claim, implement the minimal safe change, validate exact changed source, execute available tests, persist evidence, release the claim and automatically rerun Story-to-code conformance.

GitHub Actions/runners and external worker runtimes remain forbidden; GitHub stores durable source/control/audit evidence only.

If runtime execution is unavailable, the maximum allowed result is `SOURCE_VALIDATED_RUNTIME_NOT_EXECUTED`, never PASS. If code rework materially changes business purpose, fields, validation, persistence/transaction semantics, visible behavior, selector contract or downstream business impact, the Story becomes `REAPPROVAL_REQUIRED`. Auto-reapproval is forbidden. Non-material implementation fixes still require a fresh conformance PASS.

## 14. Approved Story testing fan-out

Testing authority requires both:

1. explicit approval/reapproval of the current Story contract; and
2. current `CODE_CONFORMANCE_VERIFIED_PASS` evidence.

Only then is the Story `FANOUT_ELIGIBLE` under `.orchestrator/approved-story-testing-policy.yaml`.

- BL-004: JUnit 5 unit-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-005: JUnit 5 + PostgreSQL Testcontainers integration-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-009: human-readable test catalogue, dual-format test data, executable test-code mapping and authorized live validation.

Generated Java source is never equivalent to execution or PASS.

## 15. BL-009 test-data architecture

BL-009 test data uses a mandatory dual-format representation for each fanout-eligible Story:

1. `BL-009/test-data/<story-id>.csv` - machine-readable test-data source.
2. `BL-009/test-data/<story-id>.md` - human-readable companion.

The human-readable companion is mandatory and must contain a plain-language purpose/scope statement, explanation of how the data is used, and a Markdown table containing actual applicable test-data values. A reference-only or ID-only table is incomplete. CSV and human-readable representations must maintain semantic row/data parity. Real credentials/secrets must never be persisted.

## 16. BL-008 current-state authority

`BL-008/README.md` is the live current-state source for BL-008. Production orchestration, aggregate checkpoints and watchdog reporting must resolve current state dynamically. Waiting BL-008 work must not block independently eligible BL-002/004/005/009/010 work.

## 17. Scheduler and watchdog

The Production Fire is the recurring work trigger; the watchdog is read-only. Pending post-approval conformance, automatable Story/code drift, BL-010 code rework and post-rework conformance reruns are normal Production Fire candidate units and are selected dynamically through dependency/read-write-set planning and resource-scoped claims.

Each Production Fire maintains `.orchestrator/live-run.yaml` and append-only lifecycle events. Run-local blockers must not automatically disable recurring scheduler tasks.

The watchdog must report approval separately from code conformance, code drift, automated code-rework state, reapproval-required state and fanout eligibility.

## 18. Runtime reliability and terminalization

All exits/returns from the Production Fire must pass through one governed terminalization path. Direct silent return is forbidden. `UNKNOWN_TERMINATION` is a temporary defect classification requiring recovery/root-cause investigation.

## 19. Quality gates

Quality gates include:

- `QG-SSOT`, source/dependency/claim/parity/strict Story gates.
- `QG-BL002-APPROVAL`: explicit approval/reapproval is durable.
- `QG-BL002-CONFORMANCE`: post-approval Story-to-code verification is durably PASS or DRIFT against exact governed source.
- `QG-CODE-REWORK`: automatable approved Story/code drift is routed to idempotent BL-010 work and executed/validated by ChatGPT without auto-approval.
- `QG-FANOUT`: BL-004/BL-005/BL-009 are released only after approval + current conformance PASS.
- BL-004/BL-005 source binding and execution evidence.
- BL-009 dual-format data parity and executable mapping.
- runtime heartbeat and terminalization quality gates.

## 20. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims and execution-policy rules.
- `.orchestrator/runtime-reliability-policy.yaml` - productive runtime, heartbeat, worker refill, termination and recovery contract.
- `.orchestrator/post-approval-code-conformance-policy.yaml` - mandatory approved Story/code verification and automated code-rework contract.
- `.orchestrator/approved-story-testing-policy.yaml` - testing fan-out rules after approval + conformance PASS.
- `.orchestrator/architecture-current.md` - this consolidated architecture.
- `BL-002/post-approval-code-conformance-task-queue.csv` - approved Story code-conformance work queue.
- `BL-002/code-conformance-evidence/<story-id>/*.yaml` - durable source-bound PASS/DRIFT evidence.
- `BL-010/development-change-task-queue.csv` - automated development/code-rework queue.
- `BL-010/evidence/` - source binding, implementation, validation and test evidence.
- BL-004/BL-005/BL-009 queues and evidence - downstream testing only after fanout eligibility.

## 21. Application control-loop acceptance rule

A worker completion, blocker or successful aggregate checkpoint must return to replanning, not return from the Production Fire invocation. The coordinator keeps dispatching while eligible work and execution capacity remain, subject to dependency/write-set safety and the productive runtime window.

## 22. Document synchronization rule

Generated architecture PDF/DOCX artifacts must be rebuilt when this architecture, post-approval conformance policy, approved testing policy, runtime reliability policy, execution architecture or lease policy changes materially. Historical wording may be retained only as clearly superseded history and must not contradict active operating instructions.

**Effective Story lifecycle:** `reverse engineer -> Story rework -> explicit approval/reapproval -> mandatory Story/code conformance -> automated BL-010 code rework when required -> reapproval if material -> conformance PASS -> BL-004/BL-005/BL-009 fan-out -> execution -> JaCoCo/coverage evidence`.
