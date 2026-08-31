# CylinderManagement Automation Framework - Self-Reliant E2E

**Consolidated current architecture - 31 August 2026 - Revision 4 (BL-009 Human-Readable Test Data Contract)**

GitHub is durable version control/control-state persistence. ChatGPT is the Primary Orchestrator, source analyst, migration author, validator and recovery coordinator. BL-008 retains its explicit user-apply handoff according to the live `BL-008/README.md`; BL-008 current state must always be resolved dynamically from that file rather than from stale architecture prose.

This revision adds the mandatory BL-009 dual-format test-data contract: machine-readable CSV plus a human-readable companion containing an explanatory section and a table populated with the actual applicable test-data values.

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

A Story is a complete review artifact only when its physical `.md` exists and is synchronized with governed evidence. Explicit user approval is required before downstream test authority. Auto-approval is forbidden.

## 13. Approved Story testing fan-out

Every explicitly approved BL-002 Story is reconciled into the governed downstream testing lifecycle according to `.orchestrator/approved-story-testing-policy.yaml`.

- BL-004: JUnit 5 unit-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-005: JUnit 5 + PostgreSQL Testcontainers integration-test generation, exact source binding, execution and durable PASS/FAIL evidence.
- BL-009: human-readable test catalogue, test data and authorized live validation.

Generated Java source is never equivalent to execution or PASS.

## 14. BL-009 test-data architecture

BL-009 test data uses a mandatory **dual-format representation** for each approved Story:

1. `BL-009/test-data/<story-id>.csv` — machine-readable test-data source.
2. `BL-009/test-data/<story-id>.md` — human-readable companion.

The human-readable companion is not optional. It must contain:

- a plain-language purpose/scope statement;
- a human-readable explanation of how the data should be used; and
- a Markdown table containing the **actual applicable test-data values**.

A table containing only test-data IDs, references, links or descriptions without the corresponding test values is not acceptable.

### BL-009 test-data parity gate

The human-readable test-data table must maintain one-to-one parity with the CSV for:

- row count;
- `data_id` values;
- applicable test-case association;
- input values;
- preconditions/flags represented by the CSV;
- expected results/outcomes; and
- data classification.

The human-readable representation may improve labels and explanations, but it must not silently change the semantics of the CSV test data.

### Secrets rule

Real credentials/secrets must never be persisted in either representation. Where an authorized runtime secret is required, the human-readable table must show the same governed placeholder used by the CSV, such as `<RUNTIME_AUTHORIZED_TEST_SECRET>`.

### BL-009 completion rule

Test-data generation for a Story is incomplete until all of the following are true:

- the CSV exists;
- the human-readable companion exists;
- the human-readable explanation exists;
- the Markdown table contains the applicable test values; and
- CSV-to-human-readable parity passes.

Missing human-readable test data, a missing populated table, or parity failure is eligible BL-009 backlog work. A read-only watchdog may report the gap but must not repair it.

## 15. BL-008 current-state authority

`BL-008/README.md` is the live current-state source for BL-008. Production orchestration, aggregate checkpoints and watchdog reporting must resolve the current validated migration/state/mode from that file at startup and checkpoint. Waiting BL-008 work must not block independently eligible BL-002/004/005/009 work.

## 16. Scheduler and watchdog

The Production Fire is the recurring work trigger; the watchdog is read-only. Run-local blockers must not automatically disable recurring scheduler tasks. A scheduler firing alone is not proof of progress.

## 17. Quality gates

Quality gates include SSOT consistency, exact source evidence, dependency safety, Story parity, strict Story enrichment, explicit approval, BL-004/BL-005 source binding and execution evidence, BL-009 dual-format test-data parity, populated human-readable test-data tables, BL-008 live-state reconciliation and durable checkpoint readback.

## 18. Repository control files

- `.orchestrator/execution-architecture.yaml` - machine-readable active architecture.
- `.orchestrator/lease-policy.yaml` - resource claims and execution-policy rules.
- `.orchestrator/approved-story-testing-policy.yaml` - approved Story downstream testing and BL-009 test-data rules.
- `.orchestrator/architecture-current.md` - this consolidated human-readable architecture.
- `BL-002/story-register.csv` - canonical Story catalogue.
- `BL-002/materialization-task-queue.csv` - missing Story-file priority queue.
- `BL-002/enrichment-progress.yaml` - aggregate Story progress.
- `BL-009/stories/<story-id>.md` - human-readable test catalogue.
- `BL-009/test-data/<story-id>.csv` - machine-readable test data.
- `BL-009/test-data/<story-id>.md` - mandatory human-readable test data with populated table.
- `BL-008/README.md` - live BL-008 workflow and current state.

## 19. Document synchronization rule

Generated architecture PDF/DOCX artifacts must be rebuilt when this architecture changes materially. Historical wording may be retained only as clearly superseded history and must not contradict active operating instructions.

**Effective BL-009 rule:** every approved Story's test data must exist in both CSV and human-readable Markdown; the Markdown must explain the data and include a table populated with the actual applicable test values, maintaining semantic parity with the CSV.
