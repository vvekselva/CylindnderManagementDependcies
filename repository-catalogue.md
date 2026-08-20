# CylinderManagement Dependency Control Repository Catalogue

This is the authoritative catalogue for files tracked by `vvekselva/CylindnderManagementDependcies`.

The repository controls automation work executed against `vvekselva/CylinderManagement`.

## Catalogue

| File | Category | Purpose |
|---|---|---|
| `.github/workflows/catalogue-gate.yml` | Quality Gate | Verifies that the catalogue exactly matches tracked repository files. |
| `TaskStatus.md` | Status | Consolidated automation and task status dashboard. |
| `automation/automation-config.yaml` | Automation | Machine-readable coordinator, worker, scheduling, retry and lock configuration. |
| `automation/execution-model.md` | Automation | Defines the ten-lane execution and scheduling model. |
| `automation/task-contract.md` | Automation | Defines mandatory fields and lifecycle rules for executable tasks. |
| `database-dependency-neon.md` | Dependency | Neon/PostgreSQL/Flyway dependency and database change-control ledger. |
| `governance/automation-policy.md` | Governance | Governing rules for automated work against CylinderManagement. |
| `repository-catalogue.md` | Governance | Authoritative catalogue of all controlled repository files. |
| `usecases/Readme.md` | Use Cases | Use-case documentation entry point. |

## Catalogue Quality Gate

The machine-readable section below is compared with `git ls-files` by `.github/workflows/catalogue-gate.yml`.

The gate fails when:

- a tracked file exists but is not listed here;
- a catalogue entry references a file that does not exist;
- a file is renamed without updating this catalogue;
- the catalogue markers are removed.

A file addition, deletion or rename must update this catalogue in the same change.

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
TaskStatus.md
automation/automation-config.yaml
automation/execution-model.md
automation/task-contract.md
database-dependency-neon.md
governance/automation-policy.md
repository-catalogue.md
usecases/Readme.md
<!-- CATALOGUE-FILES:END -->
