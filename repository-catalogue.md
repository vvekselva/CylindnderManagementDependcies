# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls automation work executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies exact static control files and permits only declared dynamic runtime/artifact paths. |
| `TaskStatus.md` | Status | Consolidated automation, Workflow, lane and Worker status dashboard. |
| `automation/automation-config.yaml` | Automation | Machine-readable coordinator, ten orchestration lanes, generic Worker, lifecycle, scheduling and lock configuration. |
| `automation/execution-model.md` | Automation | Defines orchestration plus the independent input-driven Generic Worker. |
| `automation/generate-automation-story.py` | Automation | Converts the human-readable automation log into the overall story. |
| `automation/task-contract.md` | Automation | Defines Task/Job execution fields and lifecycle rules. |
| `automation/worker-component-contract.md` | Worker | Defines the independent Generic Worker whose actual task comes from an input file. |
| `automation/worker-service-contract.md` | Automation | Defines the mandatory orchestration lane `init() -> service() -> close()` lifecycle. |
| `automation/workflow-contract.md` | Automation | Defines the Workflow -> Job -> Action hierarchy. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/automation-log-policy.md` | Governance | Defines plain-English lifecycle, blocker, evidence and decision logging. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work. |
| `governance/source-artifact-sync-policy.md` | Governance | Defines change classification, artifact refresh and notification rules. |
| `governance/worker-operating-guide.md` | Governance | Defines orchestration lane behaviour and the input-driven Generic Worker model. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned human-readable orchestration history. |
| `logs/automation-story.md` | Story | Human-readable overall story generated from the automation log. |
| `repository-catalogue.md` | Governance | Authoritative catalogue of static control files and allowed dynamic paths. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Machine-readable source-component to artifact synchronization list. |
| `traceability/README.md` | Traceability | Explains the Controller Traceability output area. |
| `traceability/controller-traceability-design.md` | Traceability Design | Defines Controller Traceability using input-driven Worker tasks. |
| `traceability/controller-trace-template.md` | Traceability Template | Standard per-controller trace artifact referencing Worker evidence. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |
| `worker/README.md` | Worker | Explains Worker input/run/result workspace. |
| `worker/worker-input-template.yaml` | Worker | Standard task input format for the Generic Worker. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | Controller/endpoint traceability workflow using Worker Input files. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Ongoing source-to-artifact synchronization workflow using Worker Input files. |

## Catalogue Quality Gate

Static control files must exist exactly as listed.

Runtime files are permitted only when they match declared dynamic patterns.

The gate fails when a static tracked file is not listed, a listed static file does not exist, a tracked file matches neither a static entry nor an allowed dynamic path, or catalogue markers are removed.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/execution-model.md
automation/generate-automation-story.py
automation/task-contract.md
automation/worker-component-contract.md
automation/worker-service-contract.md
automation/workflow-contract.md
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
workflows/WF-001-controller-traceability/workflow.yaml
workflows/WF-002-source-artifact-sync/workflow.yaml
<!-- CATALOGUE-FILES:END -->

<!-- CATALOGUE-DYNAMIC-PATHS:START -->
worker/inputs/WI-*.yaml
worker/runs/WI-*.md
worker/results/WI-*.md
traceability/controllers/*.md
traceability/controller-inventory.md
traceability/endpoint-inventory.md
traceability/controller-traceability.md
traceability/unresolved-traceability.md
logs/runs/*.md
<!-- CATALOGUE-DYNAMIC-PATHS:END -->
