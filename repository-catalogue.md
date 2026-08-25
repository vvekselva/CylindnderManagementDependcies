# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls backlog-driven automation executed against `vvekselva/CylinderManagement`.

**Architecture rule:** GitHub is the Version Control System and durable persistence layer. The Automation Tool is the Orchestrator and Execution Engine. Normal Cylinder execution does not depend on GitHub Actions.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies exact static control files and declared dynamic runtime/artifact paths. |
| `.github/workflows/ssot-gate.yml` | Planning Gate | Runs the three-level SSOT validator. |
| `TaskStatus.md` | Status | Human-readable derived dashboard; never overrides canonical SSOT. |
| `architecture/execution-engine-architecture.md` | Architecture | Defines the execution engine. |
| `architecture/self-reliant-e2e-execution.md` | Architecture | Defines self-reliant production execution and recovery. |
| `architecture/traceability-explorer.md` | Architecture | Defines the traceability explorer. |
| `automation/automation-config.yaml` | Automation | Machine-readable Orchestrator configuration. |
| `automation/backlog-contract.md` | Backlog Contract | Defines mandatory Level 1/2/3 SSOT and backlog lifecycle. |
| `automation/consolidate-traceability-explorer.py` | Automation | Consolidates accepted trace evidence into explorer artifacts. |
| `automation/execution-model.md` | Architecture Document | End-to-end execution model. |
| `automation/fire-local-lanes.ps1` | Local Lane Fire | Windows entry point for local lanes. |
| `automation/local-lane-executor.py` | Local Lane Executor | Local frozen-source lane executor. |
| `automation/local-lane-worker.py` | Local Lane Worker | Read-only source-evidence worker. |
| `automation/staged-lane-executor.py` | Staged Executor | Staged source executor. |
| `automation/staged-lane-executor-v3.py` | Staged Executor | Current staged source executor. |
| `automation/staged-lane-worker.py` | Staged Worker | Staged source worker. |
| `automation/staged-lane-worker-v3.py` | Staged Worker | Current staged source worker. |
| `automation/generate-automation-story.py` | Automation | Generates the human-readable automation execution story. |
| `automation/validate-ssot.py` | SSOT Validator | Validates Level 1/2/3 and SOW prerequisites. |
| `automation/task-contract.md` | Automation | Task/Job lifecycle contract. |
| `automation/worker-component-contract.md` | Worker | Generic Worker/result handoff rules. |
| `automation/worker-service-contract.md` | Automation | Worker lifecycle logging contract. |
| `automation/workflow-contract.md` | Automation | Workflow -> Job -> Action contract. |
| `backlog/README.md` | Backlog | Backlog and SSOT overview, including BL-001 -> BL-002 -> testing chain. |
| `backlog/backlog.yaml` | Level 1 SSOT | Authoritative 21-item Backlog Master register. |
| `backlog/backlog-item-template.yaml` | Backlog | Standard backlog registration shape. |
| `backlog/item-definition-template.yaml` | Level 2 SSOT | Standard per-backlog definition shape. |
| `backlog/statement-of-work-template.yaml` | Level 2 SOW | Mandatory Statement of Work contract. |
| `backlog/runtime-contract.yaml` | Level 3 SSOT | Runtime file contract. |
| `backlog/orchestrator-run-config.yaml` | Orchestrator Run Control | Backlog-aware execution switchboard. |
| `backlog/paths/BL-001-traceability.yaml` | Completion Path | Controller Traceability route. |
| `backlog/paths/BL-002-controller-story-usecase.yaml` | Completion Path | Matrix -> Story -> Use Case -> Test Scenario route. |
| `backlog/paths/BL-003-unit-test.yaml` | Completion Path | Unit Test route using approved Stories. |
| `backlog/paths/BL-004-integration-test.yaml` | Completion Path | Integration + Use Case Test route. |
| `backlog/paths/BL-005-code-coverage.yaml` | Completion Path | Code Coverage route. |
| `backlog/paths/BL-006-archunit.yaml` | Completion Path | ArchUnit route. |
| `backlog/paths/BL-007-requirements.yaml` | Completion Path | Requirements route. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency ledger. |
| `governance/ssot-levels.yaml` | SSOT Governance | Defines SSOT-L1/L2/L3 and BL-002 domain SSOT. |
| `governance/quality-gates.yaml` | Quality Gate Governance | Common and item gates, including Story/Use Case approval. |
| `governance/execution-lifecycle-logging.yaml` | Execution Logging | Invocation/lane lifecycle logging. |
| `governance/lane-execution.yaml` | Lane Governance | Local process pool and concurrency rules. |
| `governance/self-reliant-execution.yaml` | Execution Governance | Idempotency/recovery governance. |
| `governance/source-provider.yaml` | Source Governance | Exact source staging/provider governance. |
| `governance/automation-log-policy.md` | Governance | Plain-English audit logging. |
| `governance/automation-policy.md` | Governance | Governing automation rules. |
| `governance/source-artifact-sync-policy.md` | Governance | Source-to-artifact synchronization. |
| `governance/worker-operating-guide.md` | Governance | Lane and Worker operating rules. |
| `logs/automation-log.md` | Audit Log | Consolidated audit history. |
| `logs/automation-story.md` | Story | Human-readable automation execution story. |
| `repository/project-inventory.yaml` | Level 1 SSOT | Source project/module inventory. |
| `repository/source-layout.yaml` | Source SSOT | Source repository layout contract. |
| `repository-catalogue.md` | Governance | This catalogue. |
| `stories/README.md` | BL-002 Story | Story SSOT/approval guide. |
| `stories/story-schema.yaml` | BL-002 Story | Machine-readable Story contract. |
| `stories/story-template.md` | BL-002 Story | Human Story review template. |
| `support/github-actions-startup-investigation.md` | Support Evidence | Historical GitHub Actions investigation. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Source-to-artifact synchronization list. |
| `tests/self-reliant-e2e-validation-2026-08-23.md` | Validation Evidence | Self-reliant execution validation evidence. |
| `traceability/README.md` | Traceability | Traceability output-area guide. |
| `traceability/controller-traceability-design.md` | Traceability Design | Source Check Output -> Matrix flow. |
| `traceability/controller-trace-template.md` | Traceability Template | Per-controller trace artifact template. |
| `usecases/Readme.md` | Use Cases | Use Case SSOT/testing handoff guide. |
| `usecases/usecase-schema.yaml` | Use Cases | Machine-readable Use Case contract. |
| `usecases/usecase-test-scenario-schema.yaml` | Use Cases | Machine-readable Use Case test scenario contract. |
| `worker/README.md` | Worker | Worker input/run/result workspace. |
| `worker/worker-input-template.yaml` | Worker | Generic Worker input/result format. |
| `workflows/WF-001-controller-traceability/source-check-output-contract.yaml` | Workflow Contract | Canonical Source Check Output contract. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | BL-001 implementation workflow. |
| `workflows/WF-002-incremental-traceability-matrix.yaml` | Workflow | Incremental canonical matrix projection/reconciliation workflow. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Source-to-artifact synchronization workflow. |
| `workflows/WF-003-controller-story-usecase.yaml` | Workflow | BL-002 Matrix -> Story -> Use Case workflow. |

## Catalogue Quality Gate

Static framework files must exist exactly as listed below. Per-backlog definitions/SOWs/gates/runtime, generated traceability, Story/Use Case instances and execution evidence are controlled dynamic artifacts.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
.github/workflows/ssot-gate.yml
TaskStatus.md
architecture/execution-engine-architecture.md
architecture/self-reliant-e2e-execution.md
architecture/traceability-explorer.md
automation/automation-config.yaml
automation/backlog-contract.md
automation/consolidate-traceability-explorer.py
automation/execution-model.md
automation/fire-local-lanes.ps1
automation/generate-automation-story.py
automation/local-lane-executor.py
automation/local-lane-worker.py
automation/staged-lane-executor-v3.py
automation/staged-lane-executor.py
automation/staged-lane-worker-v3.py
automation/staged-lane-worker.py
automation/task-contract.md
automation/validate-ssot.py
automation/worker-component-contract.md
automation/worker-service-contract.md
automation/workflow-contract.md
backlog/README.md
backlog/backlog-item-template.yaml
backlog/backlog.yaml
backlog/item-definition-template.yaml
backlog/orchestrator-run-config.yaml
backlog/paths/BL-001-traceability.yaml
backlog/paths/BL-002-controller-story-usecase.yaml
backlog/paths/BL-003-unit-test.yaml
backlog/paths/BL-004-integration-test.yaml
backlog/paths/BL-005-code-coverage.yaml
backlog/paths/BL-006-archunit.yaml
backlog/paths/BL-007-requirements.yaml
backlog/runtime-contract.yaml
backlog/statement-of-work-template.yaml
database-dependency-neon.md
governance/automation-log-policy.md
governance/automation-policy.md
governance/execution-lifecycle-logging.yaml
governance/lane-execution.yaml
governance/quality-gates.yaml
governance/self-reliant-execution.yaml
governance/source-artifact-sync-policy.md
governance/source-provider.yaml
governance/ssot-levels.yaml
governance/worker-operating-guide.md
logs/automation-log.md
logs/automation-story.md
repository/project-inventory.yaml
repository/source-layout.yaml
repository-catalogue.md
stories/README.md
stories/story-schema.yaml
stories/story-template.md
support/github-actions-startup-investigation.md
sync/source-artifact-sync-register.yaml
tests/self-reliant-e2e-validation-2026-08-23.md
traceability/README.md
traceability/controller-trace-template.md
traceability/controller-traceability-design.md
usecases/Readme.md
usecases/usecase-schema.yaml
usecases/usecase-test-scenario-schema.yaml
worker/README.md
worker/worker-input-template.yaml
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
workflows/WF-001-controller-traceability/workflow.yaml
workflows/WF-002-incremental-traceability-matrix.yaml
workflows/WF-002-source-artifact-sync/workflow.yaml
workflows/WF-003-controller-story-usecase.yaml
<!-- CATALOGUE-FILES:END -->

<!-- CATALOGUE-DYNAMIC-PATHS:START -->
backlog/items/BL-*.yaml
backlog/sow/BL-*.yaml
backlog/gates/BL-*.yaml
backlog/runtime/*/*.yaml
worker/inputs/WI-*.yaml
worker/runs/WI-*.md
worker/results/WI-*.md
worker/results/WI-*.yaml
worker/evidence/LOCAL-BL*/*.yaml
worker/evidence/LOCAL-BL*/*.md
workflows/WF-001-controller-traceability/runtime/*.yaml
workflows/WF-001-controller-traceability/evidence/*.yaml
traceability/source-repository-check.md
traceability/controllers/*.md
traceability/controller-inventory.md
traceability/endpoint-inventory.md
traceability/controller-traceability.md
traceability/unresolved-traceability.md
traceability/matrix-progress.yaml
traceability/explorer/*
traceability/controller-story-usecase-map.yaml
stories/story-register.yaml
stories/STORY-*.yaml
stories/STORY-*.md
usecases/usecase-register.yaml
usecases/UC-*.yaml
usecases/UC-*.md
usecases/usecase-test-scenarios.yaml
quality/unit-test/*.md
quality/unit-test/*.yaml
quality/integration-test/*.md
quality/integration-test/*.yaml
quality/code-coverage/*.md
quality/code-coverage/*.yaml
quality/archunit/*.md
quality/archunit/*.yaml
requirements/*.md
requirements/*.yaml
logs/runs/*.md
<!-- CATALOGUE-DYNAMIC-PATHS:END -->
