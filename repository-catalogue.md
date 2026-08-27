# CylinderManagement Dependency Control Repository Catalogue

This repository is the authoritative control plane for backlog-driven automation against `vvekselva/CylinderManagement`.

GitHub is the Version Control System and durable persistence layer. The Primary Automation Tool owns planning and semantic analysis; hosted execution may be used as the real process runtime for deterministic Python/Maven/Flyway work when the chat scheduler cannot provide a persistent process host.

Static framework files must be explicitly catalogued. Generated runtime, execution, traceability, Story, Use Case and quality evidence is controlled through declared dynamic paths.

## Static catalogue

<!-- CATALOGUE-FILES:START -->
.github/workflows/catalogue-gate.yml
.github/workflows/cylinder-orchestrator.yml
.github/workflows/ssot-gate.yml
TaskStatus.md
architecture/bl001-canonical-projection-engine.md
architecture/execution-engine-architecture.md
architecture/invocation-health-and-recovery.md
architecture/orchestrator-bootstrap-transaction.md
architecture/self-reliant-e2e-execution.md
architecture/traceability-explorer.md
automation/automation-config.yaml
automation/backlog-contract.md
automation/bl001-canonical-projection-engine.py
automation/consolidate-traceability-explorer.py
automation/execution-model.md
automation/fire-local-lanes.ps1
automation/generate-automation-story.py
automation/github-runner-orchestrator.py
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
backlog/paths/BL-008-database-ownership-migration.yaml
backlog/runtime-contract.yaml
backlog/statement-of-work-template.yaml
database-dependency-neon.md
governance/automation-log-policy.md
governance/automation-policy.md
governance/execution-lifecycle-logging.yaml
governance/execution-source-mode.yaml
governance/invocation-concurrency.yaml
governance/invocation-health.yaml
governance/lane-execution.yaml
governance/orchestrator-bootstrap-gate.yaml
governance/production-fire-progress-guarantee.yaml
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
traceability/controller-inventory.md
traceability/controller-story-usecase-map.yaml
traceability/controller-trace-template.md
traceability/controller-traceability-design.md
traceability/controller-traceability.md
traceability/endpoint-inventory.md
traceability/matrix-progress.yaml
traceability/release-classification.yaml
traceability/source-repository-check.md
traceability/unresolved-traceability.md
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
workflows/WF-004-database-ownership-migration.yaml
<!-- CATALOGUE-FILES:END -->

## Controlled dynamic paths

<!-- CATALOGUE-DYNAMIC-PATHS:START -->
backlog/items/BL-*.yaml
backlog/sow/BL-*.yaml
backlog/gates/BL-*.yaml
backlog/runtime/*.yaml
backlog/runtime/*/*.yaml
backlog/runtime/*/*/*.yaml
worker/inputs/WI-*.yaml
worker/runs/WI-*.md
worker/results/WI-*.md
worker/results/WI-*.yaml
worker/evidence/LOCAL-BL*/*.yaml
worker/evidence/LOCAL-BL*/*.md
workflows/WF-001-controller-traceability/runtime/*.yaml
workflows/WF-001-controller-traceability/evidence/*.yaml
traceability/controllers/*.md
traceability/explorer/*
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

## Gate rule

`.github/workflows/catalogue-gate.yml` compares `git ls-files` with this catalogue. Any unlisted static framework file fails the gate. Runtime evidence is permitted only under the dynamic paths above.
