# BL-001 Incremental Unresolved Traceability

Status: **RECONCILIATION BLOCKED ON UNIQUE-KEY INTEGRITY — ZERO CURRENT UNRESOLVED ROWS**  
Backlog Item: BL-001 Controller Traceability  
Work Unit: WU-BL001-002 Final Matrix Reconciliation  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact contains only source-proved facts and explicit evidence gaps; it is not a place for speculative dependencies.

## Current canonical checkpoint

- Total caller-visible endpoint target: **134**
- Raw accumulated source-check COMPLETE counter: **134** — not yet accepted as unique-key proof
- UNRESOLVED: **0**
- BLOCKED: **0**
- FAILED: **0**
- Current physical Markdown rows after reconciliation backfill: **123**
- Confirmed canonical keys still absent from the matrix: **11**

## Current unresolved paths

**None.**

The remaining 11 rows are not unresolved endpoint traces. They are canonical endpoint keys whose already-accepted historical full-chain evidence still has to be located and reconciled under WU-BL001-002. The Primary Orchestrator must not read application source or invent a chain merely to fill them.

## Latest accepted state

The second WU-BL001-002 reconciliation backfill promoted five durable source-proved `DeliveryPlanningStopManagementController` rows:

- `GET /delivery-planning/stops/manage`
- `GET /delivery-planning/stops/manage/`
- `POST /delivery-planning/stops/manage/save`
- `POST /delivery-planning/stops/manage/save-selected`
- `POST /delivery-planning/stops/manage/remove`

Their compact Markdown rows and ordered structured/browser Explorer deltas are synchronized at checkpoint `RECONCILIATION-FIRE-20260825-020007Z`. Together with the first four-row reconciliation backfill, the corrected pre-backfill physical count of 114 has advanced to **123/134**, leaving **11** confirmed missing canonical keys.

## Reconciliation rule

1. Keep every `(HTTP method, path)` unique.
2. Backfill historical rows only from durable accepted evidence.
3. Preserve the complete ordered/branching component chain for every COMPLETE row.
4. Keep this ledger synchronized if reconciliation discovers an evidence gap.
5. Do not mark the matrix `FINAL_VALIDATED` until WU-BL001-002 and WU-BL001-003 pass their required gates.

BL-001 remains open and explicit user acceptance is still required before closure.
