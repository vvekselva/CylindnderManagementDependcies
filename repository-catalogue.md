# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls backlog-driven automation executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies exact static control files and declared dynamic runtime/artifact paths. |
| `.github/workflows/ssot-gate.yml` | Planning Gate | Runs the three-level SSOT validator; PLAN/REPLAN prerequisites must be valid for run-enabled backlog items. |
| `TaskStatus.md` | Status | Human-readable consolidated dashboard; generated/derived status must not override canonical Level 1/2/3 SSOT. |
| `automation/automation-config.yaml` | Automation | Machine-readable Backlog-driven Orchestrator, SSOT planning gates, lane, lifecycle logging, Worker, scheduling and lock configuration. |
| `automation/backlog-contract.md` | Backlog Contract | Defines mandatory Level 1/2/3 SSOT, planning gate, Backlog lifecycle and execution/closure contract. |
| `automation/execution-model.md` | Architecture Document | Main framework document showing Level 1/2/3, lane execution, logging and end-to-end execution flow. |
| `automation/generate-automation-story.py` | Automation | Converts the human-readable automation log into the overall story. |
| `automation/validate-ssot.py` | SSOT Validator | Machine-validates Level 1, Level 2, Level 3 and QG-SOW-001 prerequisites for every run-enabled backlog item. |
| `automation/task-contract.md` | Automation | Defines Task/Job execution fields and lifecycle rules. |
| `automation/worker-component-contract.md` | Worker | Defines the task-agnostic Generic Worker and result handoff rules. |
| `automation/worker-service-contract.md` | Automation | Defines mandatory lane lifecycle plus INIT/SERVICE/CLOSE boundary logging. |
| `automation/workflow-contract.md` | Automation | Defines Workflow -> Job -> Action execution representation and producer/consumer Job handoff. |
| `backlog/README.md` | Backlog | Explains Backlog workspace, mandatory SOW, three-level SSOT and runtime files. |
| `backlog/backlog.yaml` | Level 1 SSOT | Authoritative Backlog Master register. |
| `backlog/backlog-item-template.yaml` | Backlog | Standard Backlog registration shape. |
| `backlog/item-definition-template.yaml` | Level 2 SSOT | Standard per-backlog definition shape used before planning. |
| `backlog/statement-of-work-template.yaml` | Level 2 SOW | Standard mandatory Statement of Work contract. |
| `backlog/runtime-contract.yaml` | Level 3 SSOT | Defines every runtime file required before PLAN/REPLAN. |
| `backlog/orchestrator-run-config.yaml` | Orchestrator Run Control | Execution switchboard; QG-SSOT-001 and SOW validation are fail-closed. |
| `backlog/gates/BL-001-traceability.yaml` | Backlog Quality Gate | User-approved Controller Traceability Quality Gate set QG-TRC-001 through QG-TRC-015. |
| `backlog/paths/BL-001-traceability.yaml` | Completion Path | Controller Traceability route bound to SOW, SSOT/dependency prerequisites and approved Traceability gates. |
| `backlog/paths/BL-002-unit-test.yaml` | Completion Path | Unit Test completion route constrained by repository/project-inventory.yaml. |
| `backlog/paths/BL-003-integration-test.yaml` | Completion Path | Integration Test route; non-plannable until required Level 1/2/3 and gates are complete. |
| `backlog/paths/BL-004-code-coverage.yaml` | Completion Path | Code Coverage route; non-plannable until required dependencies/gates are complete. |
| `backlog/paths/BL-005-archunit.yaml` | Completion Path | ArchUnit route; non-plannable until required Level 1/2/3 and gates are complete. |
| `backlog/paths/BL-006-requirements.yaml` | Completion Path | Requirements route; non-plannable until required Level 1/2/3 and gates are complete. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/ssot-levels.yaml` | SSOT Governance | Defines SSOT-L1, SSOT-L2, SSOT-L3 and fail-closed QG-SSOT-001 planning gate. |
| `governance/quality-gates.yaml` | Quality Gate Governance | Defines QG-SSOT-001, QG-SOW-001, QG-DEP-001, QG-LOG-001 and item-specific Quality Gate registry. |
| `governance/execution-lifecycle-logging.yaml` | Execution Logging | Mandatory Orchestrator invocation and lane INIT/SERVICE/CLOSE boundary logging contract and QG-LOG-001. |
| `governance/automation-log-policy.md` | Governance | Defines plain-English invocation/lane lifecycle audit logging. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work. |
| `governance/source-artifact-sync-policy.md` | Governance | Defines change classification, artifact refresh and notification rules. |
| `governance/worker-operating-guide.md` | Governance | Defines orchestration-lane behaviour and input-driven Generic Worker model. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned consolidated human-readable orchestration history. |
| `logs/automation-story.md` | Story | Human-readable overall automation story. |
| `repository/project-inventory.yaml` | Level 1 SSOT | Authoritative CylinderManagement project/module inventory and backlog scope classifications. |
| `repository-catalogue.md` | Governance | Authoritative catalogue of static control files and allowed dynamic paths. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Machine-readable source-component to artifact synchronization list. |
| `traceability/README.md` | Traceability | Explains Controller Traceability output area. |
| `traceability/controller-traceability-design.md` | Traceability Design | Defines Source Check Output -> Orchestrator -> Traceability Matrix flow used by BL-001. |
| `traceability/controller-trace-template.md` | Traceability Template | Standard per-controller trace artifact referencing evidence. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |
| `worker/README.md` | Worker | Explains Worker input/run/result workspace and machine-readable handoff. |
| `worker/worker-input-template.yaml` | Worker | Standard generated task input and result-contract format for the Generic Worker. |
| `workflows/WF-001-controller-traceability/source-check-output-contract.yaml` | Workflow Contract | Canonical Source Check Output contract used by BL-001. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | Existing Traceability execution workflow retained as BL-001 implementation detail. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Ongoing source-to-artifact synchronization workflow. |

## Catalogue Quality Gate

Static framework, SSOT governance, logging governance, validators, run-control, approved Quality Gate and Completion-Path files must exist exactly as listed.

Per-backlog Level 2 definitions/SOWs, Level 3 runtime files, future approved Backlog gate files and generated artifacts are permitted only when they match declared dynamic patterns.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
.github/workflows/ssot-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/backlog-contract.md
automation/execution-model.md
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
governance/automation-log-policy.md
governance/automation-policy.md
governance/source-artifact-sync-policy.md
governance/worker-operating-guide.md
logs/automation-log.md
logs/automation-story.md
repository/project-inventory.yaml
repository-catalogue.md
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
