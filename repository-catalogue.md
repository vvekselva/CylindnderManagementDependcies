# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls automation work executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies exact static control files and permits only declared dynamic artifact paths. |
| `TaskStatus.md` | Status | Consolidated automation, workflow and worker status dashboard. |
| `automation/automation-config.yaml` | Automation | Machine-readable coordinator, ten-lane orchestration worker, independent Source Analysis Worker, lifecycle, scheduling, retry and lock configuration. |
| `automation/execution-model.md` | Automation | Defines the orchestration plane, independent source-analysis plane and mandatory lifecycles. |
| `automation/generate-automation-story.py` | Automation | Converts the human-readable automation log into an overall plain-English story. |
| `automation/source-analysis-worker-contract.md` | Source Analysis | Defines the independent read-only Source Analysis Worker and its request/fact contract. |
| `automation/task-contract.md` | Automation | Defines Task/Job execution fields and lifecycle rules. |
| `automation/worker-service-contract.md` | Automation | Defines the mandatory orchestration worker `init() -> service() -> close()` lifecycle. |
| `automation/workflow-contract.md` | Automation | Defines the standard Workflow -> Job -> Action hierarchy used by orchestration. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/automation-log-policy.md` | Governance | Defines plain-English INIT, SERVICE, CLOSE, blocker, evidence and decision logging rules. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work against CylinderManagement. |
| `governance/source-artifact-sync-policy.md` | Governance | Defines how source changes are classified and when artifacts or user notifications are required. |
| `governance/worker-operating-guide.md` | Governance | Tells orchestration workers how to accept, initialize, execute, close, report and complete work. |
| `logs/automation-log.md` | Audit Log | Coordinator-owned human-readable orchestration event history. |
| `logs/automation-story.md` | Story | Human-readable overall story generated from the automation log. |
| `repository-catalogue.md` | Governance | Authoritative catalogue of static control files and allowed dynamic artifact paths. |
| `source-analysis/README.md` | Source Analysis | Workspace and purpose of the independent source-analysis plane. |
| `source-analysis/source-analysis-request-result-template.md` | Source Analysis | Standard Analysis Request, Source Fact and close-result format. |
| `sync/source-artifact-sync-register.yaml` | Synchronization | Machine-readable source-component to artifact synchronization list. |
| `traceability/README.md` | Traceability | Explains the controller traceability artifacts produced by WF-001. |
| `traceability/controller-traceability-design.md` | Traceability Design | Defines discovery scope, source-analysis usage, endpoint identity, hop evidence, final-dependency rules and gates. |
| `traceability/controller-trace-template.md` | Traceability Template | Standard `init -> service -> close` format for every per-controller artifact. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |
| `workflows/WF-001-controller-traceability/workflow.yaml` | Workflow | Defines the lifecycle-aware controller traceability workflow using the independent Source Analysis Worker. |
| `workflows/WF-002-source-artifact-sync/workflow.yaml` | Workflow | Defines ongoing source change detection, impact classification, artifact refresh and notification. |

## Catalogue Quality Gate

The catalogue has two machine-readable sections.

Static control files must exist exactly as listed. A static file addition, deletion or rename must update the static catalogue in the same controlled change.

Some automation outputs are created as runtime work progresses. Those files are allowed only when their paths match a declared dynamic pattern. Dynamic paths remain governed by their contracts and templates.

The gate fails when a static tracked file is not listed, a static catalogue entry does not exist, a tracked file matches neither a static entry nor an allowed dynamic path, or the catalogue markers are removed.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/execution-model.md
automation/generate-automation-story.py
automation/source-analysis-worker-contract.md
automation/task-contract.md
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
source-analysis/README.md
source-analysis/source-analysis-request-result-template.md
sync/source-artifact-sync-register.yaml
traceability/README.md
traceability/controller-traceability-design.md
traceability/controller-trace-template.md
usecases/Readme.md
workflows/WF-001-controller-traceability/workflow.yaml
workflows/WF-002-source-artifact-sync/workflow.yaml
<!-- CATALOGUE-FILES:END -->

<!-- CATALOGUE-DYNAMIC-PATHS:START -->
source-analysis/runs/SAR-*.md
source-analysis/results/SAR-*.md
traceability/controllers/*.md
traceability/controller-inventory.md
traceability/endpoint-inventory.md
traceability/controller-traceability.md
traceability/unresolved-traceability.md
logs/runs/*.md
<!-- CATALOGUE-DYNAMIC-PATHS:END -->
