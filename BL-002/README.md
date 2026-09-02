# BL-002 - Reconstructed Controller Flow Stories

## Status

BL-002 was reconstructed from authoritative sources beginning with run `CYLINDER-MANUAL-FIRE-20260829-025819IST`.

This is a reconstruction, not a recovery of missing historical Story wording. Historical approvals or dispositions are not inferred or copied.

## Authoritative inputs

- BL-001 traceability: `Releases/bl001-traceability-20260828-134/traceability-matrix.json`
- BL-001 expected rows: **134**
- Release classification: `release-classification.csv`
- Release classification policy: `release-classification.yaml`
- Classification counts: **88 R1 + 46 R2 = 134**
- Source baseline: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Reconstruction rules

1. Story numbering is one-to-one from classification `No`: `1 -> STORY-0001` through `134 -> STORY-0134`.
2. Exact HTTP method + path is the traceability key.
3. R1 is review/materialization priority 1; R2 is priority 2.
4. Story auto-approval is forbidden.
5. Every reconstructed Story starts with `PENDING_USER_APPROVAL` unless an explicit user decision is durably recorded.
6. Stories with a complete BL-001 chain are `READY_FOR_USER_REVIEW`.
7. Stories whose BL-001 chain is `PARTIAL_INTERMEDIATE_HOPS` are `NEEDS_CLARIFICATION`.
8. Use-case grouping is allowed as a review/navigation projection before all Stories are approved. Grouping never grants approval. Story-level approval remains independently governed and is repeated in every Use Case where the Story appears.

## Canonical register and physical Story parity

`story-register.csv` is the canonical 134-row Story register. Registration alone is not sufficient for the human review folder.

The governed parity rule is:

`134 registered Story IDs == 134 physical BL-002/stories/STORY-*.md files`

Every registered Story must have exactly one physical Story document. A `NEEDS_CLARIFICATION` Story must still have a physical document that records the exact evidence gap without inventing missing behavior.

Physical materialization is a separate metric from strict field/UI enrichment, review state, approval status, Use Case grouping and testing readiness.

## Materialization work queue

`materialization-task-queue.csv` is the durable prioritized queue for any registered Story whose physical `.md` file is absent.

Queue policy:

- R1 gap -> priority `1`
- R2 gap -> priority `2`
- Queue statuses: `PENDING`, `CLAIMED`, `MATERIALIZED`, `VALIDATED`, `BLOCKED`
- Before BL-002 work selection/replanning, the Orchestrator must compare `story-register.csv` with `BL-002/stories/STORY-*.md`, reconcile this queue, and repair aggregate count drift.
- BL-002 physical materialization is complete only when there are **134 validated physical Story files and zero pending materialization tasks**.

## Review and strict enrichment

A Story is not a complete review artifact until its physical `.md` file exists and is synchronized with governed evidence.

Strict field/UI completion additionally requires the full applicable source-proved contract: screen/user intent, browser event, exact request/identity, controller, service/DAO/repository/entity/view/database path, validation/branches, persistence/read effects, response and visible outcome. A source-detail gap is not strict completion.

For human Use Case review, use `screen-usecase-register.md` rather than the CSV preview. The Markdown register is intentionally narrow and links each Use Case to its detailed section in `usecase-review.md`. Each detailed section lists every mapped Story, its role, release and current Story-level approval status. This avoids relying on the horizontally scrolling GitHub CSV preview for review.

## Current approval projection

Current durable approval projection is maintained in `enrichment-progress.yaml`.

- Total Stories: **134**
- Approved after rework: **2** (`STORY-0001`, `STORY-0013`)
- Awaiting user review: **132**
- Use Case grouping does not change these Story approval decisions.

## Artifacts

- `screen-usecase-register.md` - primary human review entry point; compact Use Case register with clickable Use Case links, release and rolled-up approval state.
- `usecase-review.md` - detailed Use Case review page; every mapped Story is clickable and carries its Story-level approval status in every Use Case where it appears.
- `screen-usecase-register.csv` - machine-readable Use Case grouping register; retained for automation/data processing, not the preferred human review view.
- `story-register.csv` - canonical 134-row Story catalogue with release priority, review state, approval state and traceability state.
- `STORY-DEFINITION.md` - deterministic Story rendering and common acceptance contract.
- `stories/` - physical human-readable Story review artifacts.
- `materialization-task-queue.csv` - durable priority queue for registered Story files missing from `stories/`.
- `enrichment-progress.yaml` - aggregate BL-002 progress projection; unit-local/physical evidence wins if the aggregate lags.

The register, rendering contract, physical Story files, Use Case review projection and materialization queue together form the current BL-002 Story SSOT for review readiness and materialization completeness.
