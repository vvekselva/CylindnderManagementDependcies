# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls backlog-driven automation executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies exact static control files and declared dynamic runtime/artifact paths. |
| `TaskStatus.md` | Status | Consolidated Backlog, Orchestrator, lane and Worker status dashboard. |
| `automation/automation-config.yaml` | Automation | Machine-readable Backlog-driven Orchestrator, lane, Worker, scheduling and lock configuration. |
| `automation/backlog-contract.md` | Backlog Contract | Defines Backlog Item lifecycle, Completion Paths, Orchestrator analysis/planning/execution and closure. |
| `automation/execution-model.md` | Architecture Document | Main framework document showing components, files and end-to-end Backlog data flow. |
| `automation/generate-automation-story.py` | Automation | Converts the human-readable automation log into the overall story. |
| `automation/task-contract.md` | Automation | Defines Task/Job execution fields and lifecycle rules. |
| `automation/worker-component-contract.md` | Worker | Defines the task-agnostic Generic Worker and result handoff rules. |
| `automation/worker-service-contract.md` | Automation | Defines mandatory orchestration-lane `init() -> service() -> close()` lifecycle. |
| `automation/workflow-contract.md` | Automation | Defines Workflow -> Job -> Action execution representation and producer/consumer Job handoff. |
| `backlog/README.md` | Backlog | Explains Backlog workspace and runtime files. |
| `backlog/backlog.yaml` | Backlog | Authoritative Backlog register, priorities, dependencies, state and Completion Paths. |
| `backlog/backlog-item-template.yaml` | Backlog | Template for future Backlog Items. |
| `backlog/paths/BL-001-traceability.yaml` | Completion Path | Controller Traceability completion route. |
| `backlog/paths/BL-002-unit-test.yaml` | Completion Path | Unit Test completion route. |
| `backlog/paths/BL-003-integration-test.yaml` | Completion Path | Integration Test completion route. |
| `backlog/paths/BL-004-code-coverage.yaml` | Completion Path | Code Coverage Report completion route. |
| `backlog/paths/BL-005-archunit.yaml` | Completion Path | ArchUnit architecture-test completion route. |
| `backlog/paths/BL-006-requirements.yaml` | Completion Path | Requirements traceability/gap-analysis completion route. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/automation-log-policy.md` | Governance | Defines plain-English lifecycle, blocker, evidence and decision logging. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work. |
| `governance/source-artifact-sync-policy.md` | Governance | Defines change classification, artifact refresh and notification rules. |
| `governance/worker-operating-guide.md` | Governance | Defines orchestration-lane behaviour and input-driven Generic Worker model. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned human-readable orchestration history. |
| `logs/automation-story.md` | Story | Human-readable overall automation story. |
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

Static framework and Completion-Path files must exist exactly as listed.

Runtime files and generated artifacts are permitted only when they match declared dynamic patterns.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/backlog-contract.md
automation/execution-model.md
automation/generate-automation-story.py
automation/task-contract.md
automation/worker-component-contract.md
automation/worker-service-contract.md
automation/workflow-contract.md
backlog/README.md
backlog/backlog.yaml
backlog/backlog-item-template.yaml
backlog/paths/BL-001-traceability.yaml
backlog/paths/BL-002-unit-test.yaml
backlog/paths/BL-003-integration-test.yaml
backlog/paths/BL-004-code-coverage.yaml
backlog/paths/BL-005-archunit.yaml
backlog/paths/BL-006-requirements.yaml
database-dependency-neon.md
governance/automation-log-policy.md
governance/automation-policy.md
governance/source-artifact-sync-policy.md
governance/worker-operating-guide.md
logs/automation-log.md
logs/automation-story.md
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
