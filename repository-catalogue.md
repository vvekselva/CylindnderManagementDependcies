# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls automation work executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies that the catalogue exactly matches tracked repository files. |
| `TaskStatus.md` | Status | Consolidated automation, workflow and worker status dashboard. |
| `automation/automation-config.yaml` | Automation | Machine-readable coordinator, worker, scheduling, retry and lock configuration. |
| `automation/execution-model.md` | Automation | Defines the ten-lane execution and scheduling model. |
| `automation/generate-automation-story.py` | Automation | Converts the human-readable automation log into an overall plain-English story. |
| `automation/task-contract.md` | Automation | Defines mandatory fields and lifecycle rules for executable tasks. |
| `automation/workflow-contract.md` | Automation | Defines the standard Workflow -> Job -> Action hierarchy used by automation. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/automation-log-policy.md` | Governance | Defines plain-English activity, blocker, evidence and decision logging rules. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work against CylinderManagement. |
| `governance/source-artifact-sync-policy.md` | Governance | Defines how source changes are classified and when artifacts or user notifications are required. |
| `governance/worker-operating-guide.md` | Governance | Tells every worker how to accept, execute, stop, report and complete work. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned human-readable automation event history. |
| `logs/automation-story.md` | Story | Human-readable overall story generated from the automation log. |
| `repository-catalogue.md` | Governance | Authoritative catalogue of all controlled repository files. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Machine-readable source-component to artifact synchronization list. |
| `traceability/README.md` | Traceability | Explains the controller traceability artifacts produced by WF-001. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | Defines the initial controller/endpoint-to-final-dependency discovery workflow. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Defines ongoing source change detection, impact classification, artifact refresh and notification. |

## Catalogue Quality Gate

The machine-readable section below is compared with `git ls-files` by `.github/workflows/catalogue-gate.yml`.

The gate fails when:

- a tracked file exists but is not listed here;
- a catalogue entry references a file that does not exist;
- a file is renamed without updating this catalogue;
- the catalogue markers are removed.

A file addition, deletion or rename must update this catalogue in the same controlled change.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/execution-model.md
automation/generate-automation-story.py
automation/task-contract.md
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
usecases/Readme.md
workflows/WF-001-controller-traceability/workflow.yaml
workflows/WF-002-source-artifact-sync/workflow.yaml
<!-- CATALOGUE-FILES:END -->
