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
8. Use-case grouping is allowed as a review/navigation projection before all Stories are approved. Grouping never grants approval.

## Canonical register and physical Story parity

`story-register.csv` is the canonical 134-row Story register. The governed parity rule is:

`134 registered Story IDs == 134 physical BL-002/stories/STORY-*.md files`

Physical materialization is separate from strict field/UI enrichment, review state, approval status, Use Case grouping and testing readiness.

## Current approval and conformance projection

Current projection reconciled from durable approval evidence and the post-approval conformance queue; latest explicit approval update: **2026-09-05 (STORY-0045)**:

- Total Stories: **134**
- Explicitly approved after rework: **56**
- Awaiting user review: **72**
- Superseded / not needed: **6** (`STORY-0037`, `STORY-0038`, `STORY-0039`, `STORY-0040`, `STORY-0133`, `STORY-0134`). STORY-0037/0038 are replaced by the Add Stop customer-delivery flow (`STORY-0051` + `STORY-0085` and governed dependencies); STORY-0039/0040/0133/0134 are replaced by the Vehicle Trip Load Wizard (`STORY-0043` / `STORY-0044`).
- Post-approval code-conformance pass / fan-out eligible: **21**
- Generated current-contract test scopes: **18**; newly eligible/fan-out queued: **3** (`STORY-0096`, `STORY-0102`, `STORY-0107`)
- Exact drift approval holds: **2** (`STORY-0101`, `STORY-0103`)
- Auto-approval remains forbidden.

`STORY-0103` has a durable exact review packet at `BL-002/review-packets/STORY-0103-VEHICLE-SEARCH-SERVICE-CODE-DRIFT-20260903.md`; no application-code change is authorized until the exact manifest is explicitly approved.

## Artifacts

- `screen-usecase-register.md` — primary human review entry point.
- `usecase-review.md` — detailed Use Case review page.
- `screen-usecase-register.csv` — machine-readable Use Case grouping register.
- `story-register.csv` — canonical Story catalogue.
- `supersession-register.yaml` — durable Story/use-case supersession map; superseded Stories are excluded from approval, conformance, testing fan-out and BL-011 eligibility.
- `STORY-DEFINITION.md` — deterministic Story rendering contract.
- `stories/` — physical Story review artifacts.
- `materialization-task-queue.csv` — physical materialization queue.
- `post-approval-code-conformance-task-queue.csv` — current post-approval conformance SSOT.
- `enrichment-progress.yaml` — aggregate progress projection; unit-local evidence and queues win if this aggregate lags.
