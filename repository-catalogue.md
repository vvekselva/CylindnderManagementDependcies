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
| `architecture/execution-engine-architecture.md` | Architecture | Defines GitHub as VCS/persistence and the Automation Tool/local process pool as execution engine. |
| `automation/automation-config.yaml` | Automation | Machine-readable Orchestrator configuration. |
| `automation/backlog-contract.md` | Backlog Contract | Defines mandatory Level 1/2/3 SSOT and backlog lifecycle. |
| `automation/execution-model.md` | Architecture Document | End-to-end execution model. |
| `automation/fire-local-lanes.ps1` | Local Lane Fire | Windows entry point that fires up to ten local OS lane workers. |
| `automation/local-lane-executor.py` | Local Lane Executor | Creates frozen-baseline worktree, starts/monitors local workers, measures concurrency, aggregates evidence and cleans lane logs. |
| `automation/local-lane-worker.py` | Local Lane Worker | Read-only source-evidence collector with INIT/SERVICE/CLOSE lifecycle evidence and heartbeat. |
| `automation/generate-automation-story.py` | Automation | Generates the human-readable automation story. |
| `automation/validate-ssot.py` | SSOT Validator | Validates Level 1/2/3 and SOW prerequisites. |
| `automation/task-contract.md` | Automation | Defines Task/Job execution fields and lifecycle rules. |
| `automation/worker-component-contract.md` | Worker | Generic Worker and result handoff rules. |
| `automation/worker-service-contract.md` | Automation | Mandatory worker lifecycle logging. |
| `automation/workflow-contract.md` | Automation | Workflow -> Job -> Action contract. |
| `backlog/README.md` | Backlog | Backlog workspace and SSOT overview. |
| `backlog/backlog.yaml` | Level 1 SSOT | Authoritative Backlog Master register. |
| `backlog/backlog-item-template.yaml` | Backlog | Standard backlog registration shape. |
| `backlog/item-definition-template.yaml` | Level 2 SSOT | Standard per-backlog definition shape. |
| `backlog/statement-of-work-template.yaml` | Level 2 SOW | Mandatory Statement of Work contract. |
| `backlog/runtime-contract.yaml` | Level 3 SSOT | Defines every runtime file required before PLAN/REPLAN, including lane dispatch, local execution and statistics. |
| `backlog/orchestrator-run-config.yaml` | Orchestrator Run Control | Execution switchboard. |
| `backlog/gates/BL-001-traceability.yaml` | Backlog Quality Gate | BL-001 traceability gates. |
| `backlog/paths/BL-001-traceability.yaml` | Completion Path | Controller Traceability route. |
| `backlog/paths/BL-002-unit-test.yaml` | Completion Path | Unit Test route constrained by project inventory. |
| `backlog/paths/BL-003-integration-test.yaml` | Completion Path | Integration Test route. |
| `backlog/paths/BL-004-code-coverage.yaml` | Completion Path | Code Coverage route. |
| `backlog/paths/BL-005-archunit.yaml` | Completion Path | ArchUnit route. |
| `backlog/paths/BL-006-requirements.yaml` | Completion Path | Requirements route. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency ledger. |
| `governance/ssot-levels.yaml` | SSOT Governance | Defines SSOT-L1/L2/L3 and QG-SSOT-001. |
| `governance/quality-gates.yaml` | Quality Gate Governance | Defines QG-SSOT-001, QG-SOW-001, QG-DEP-001, QG-LOG-001, QG-LANE-001 and item gates. |
| `governance/execution-lifecycle-logging.yaml` | Execution Logging | Invocation and lane lifecycle logging contract. |
| `governance/lane-execution.yaml` | Lane Governance | Local process-pool backend, GitHub VCS separation, concurrency metrics and QG-LANE-001. |
| `governance/automation-log-policy.md` | Governance | Plain-English audit logging. |
| `governance/automation-policy.md` | Governance | Governing automation rules. |
| `governance/source-artifact-sync-policy.md` | Governance | Source-to-artifact synchronization rules. |
| `governance/worker-operating-guide.md` | Governance | Lane and Generic Worker operating rules. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned consolidated audit history. |
| `logs/automation-story.md` | Story | Human-readable automation story. |
| `repository/project-inventory.yaml` | Level 1 SSOT | Authoritative source project/module inventory. |
| `repository-catalogue.md` | Governance | This catalogue. |
| `support/github-actions-startup-investigation.md` | Support Evidence | Historical GitHub Actions startup issue template; non-blocking for current execution architecture. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Source-to-artifact synchronization list. |
| `traceability/README.md` | Traceability | Traceability output-area guide. |
| `traceability/controller-traceability-design.md` | Traceability Design | Source Check Output -> Matrix flow. |
| `traceability/controller-trace-template.md` | Traceability Template | Per-controller trace artifact template. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |
| `worker/README.md` | Worker | Worker input/run/result workspace. |
| `worker/worker-input-template.yaml` | Worker | Generic Worker input/result format. |
| `workflows/WF-001-controller-traceability/source-check-output-contract.yaml` | Workflow Contract | Canonical Source Check Output contract. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | BL-001 implementation workflow. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Source-to-artifact synchronization workflow. |

## Catalogue Quality Gate

Static framework files must exist exactly as listed. Per-backlog definitions/SOWs, Level-3 runtime files, generated traceability artifacts and local run evidence are allowed only under declared dynamic paths.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
.github/workflows/ssot-gate.yml
TaskStatus.md
architecture/execution-engine-architecture.md
automation/automation-config.yaml
automation/backlog-contract.md
automation/execution-model.md
automation/fire-local-lanes.ps1
automation/local-lane-executor.py
automation/local-lane-worker.py
automation/generate-automation-story.py
automation/validate-ssot.py
automation/task-contract.md
automation/worker-component-contract.md
automation/worker-service-contract.md
automation/workflow-contract.md
backlog/README.md
backlog/backlog.yaml
backlog/backlog-item-template.yaml
backlog/item-definition-template.yaml
backlog/statement-of-work-template.yaml
backlog/runtime-contract.yaml
backlog/orchestrator-run-config.yaml
backlog/gates/BL-001-traceability.yaml
backlog/paths/BL-001-traceability.yaml
backlog/paths/BL-002-unit-test.yaml
backlog/paths/BL-003-integration-test.yaml
backlog/paths/BL-004-code-coverage.yaml
backlog/paths/BL-005-archunit.yaml
backlog/paths/BL-006-requirements.yaml
database-dependency-neon.md
governance/ssot-levels.yaml
governance/quality-gates.yaml
governance/execution-lifecycle-logging.yaml
governance/lane-execution.yaml
governance/automation-log-policy.md
governance/automation-policy.md
governance/source-artifact-sync-policy.md
governance/worker-operating-guide.md
logs/automation-log.md
logs/automation-story.md
repository/project-inventory.yaml
repository-catalogue.md
support/github-actions-startup-investigation.md
sync/source-artifact-sync-register.yaml
traceability/README.md
traceability/controller-traceability-design.md
traceability/controller-trace-template.md
usecases/Readme.md
worker/README.md
worker/worker-input-template.yaml
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
workflows/WF-001-controller-traceability/workflow.yaml
workflows/WF-002-source-artifact-sync/workflow.yaml
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
worker/evidence/LOCAL-BL001-*/*.yaml
worker/evidence/LOCAL-BL001-*/*.md
workflows/WF-001-controller-traceability/runtime/*.yaml
workflows/WF-001-controller-traceability/evidence/*.yaml
traceability/source-repository-check.md
traceability/controllers/*.md
traceability/controller-inventory.md
traceability/endpoint-inventory.md
traceability/controller-traceability.md
traceability/unresolved-traceability.md
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
