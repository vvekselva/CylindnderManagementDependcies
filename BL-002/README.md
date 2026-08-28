# BL-002 — Reconstructed Controller Flow Stories

## Status

BL-002 has been **redone from authoritative sources** in run `CYLINDER-MANUAL-FIRE-20260829-025819IST`.

This is a reconstruction, not a recovery of the missing historical story files. Historical approvals or dispositions are **not** inferred or copied.

## Authoritative inputs

- BL-001 traceability: `Releases/bl001-traceability-20260828-134/traceability-matrix.json`
- BL-001 expected rows: **134**
- Release classification: `release-classification.csv`
- Release classification policy: `release-classification.yaml`
- Classification counts: **88 R1 + 46 R2 = 134**
- Source baseline: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Reconstruction rules

1. Story numbering is regenerated one-to-one from the classification `No` field:
   `1 -> STORY-0001` through `134 -> STORY-0134`.
2. The exact HTTP method + path is the traceability key.
3. R1 is review priority 1; R2 is review priority 2.
4. Story auto-approval is forbidden.
5. Every reconstructed story starts with `PENDING_USER_APPROVAL`.
6. Stories with a complete BL-001 chain are `READY_FOR_USER_REVIEW`.
7. Stories whose BL-001 chain is `PARTIAL_INTERMEDIATE_HOPS` are `NEEDS_CLARIFICATION`.
8. Use-case grouping is blocked until the corresponding stories are explicitly approved by the user.

## Reconstruction result

- Total reconstructed drafts: **134**
- R1 drafts: **88**
- R2 drafts: **46**
- `READY_FOR_USER_REVIEW`: **131**
- `NEEDS_CLARIFICATION`: **3**
- Approved: **0**

The three clarification-required stories are:

- `STORY-0011` — `POST /complete-trip`
- `STORY-0035` — `GET /customer-spot-cylinder-check/fetch`
- `STORY-0036` — `GET /yard-audit-dashboard`

Each is flagged because BL-001 records `PARTIAL_INTERMEDIATE_HOPS`; no missing dependency behavior is fabricated.

## Artifacts

- `story-register.csv` — canonical 134-row story register and review state.
- `STORIES-R1.md` — Release 1 human-readable story drafts (review first).
- `STORIES-R2.md` — Release 2 human-readable story drafts.
