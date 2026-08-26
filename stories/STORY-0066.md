# STORY-0066 — Yard stock check - Submit

**State:** NEEDS_CLARIFICATION  
**Release:** RELEASE_1  
**Endpoint:** `POST /ingestYardStockCheck`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Validate and persist a yard stock-check submission. The accepted canonical trace proves a cylinder-state validation/read path, persistence of the stock-check header and submitted cylinder lines, and either a success redirect or the yard-stock-check error view.

## Accepted backend chain

`YardStockCheckIngestionController.doPost` → validator/state lookup → `public.tbl_cylinder_states` → yard stock-check persistence chain → `public.tbl_yard_stock_check` + `public.tbl_yard_stock_check_line` → success redirect or `final-version-1/YardStockCheckIngestion` error view/cache refresh.

## Data behavior

The flow reads `public.tbl_cylinder_states` and writes the accepted stock-check header to `public.tbl_yard_stock_check` and its accepted cylinder lines to `public.tbl_yard_stock_check_line`.

## Field-level contract status

The accepted BL-001 trace does **not** prove the mandatory field-by-field input contract: exact submitted page/request fields, datatype, required/optional status, normalization/default behavior, per-field validation and accepted rules, per-field invalid-value behavior, exact persistence column, and exact state/side effect for every input.

Those details are not inferred. Therefore this Story remains **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-203431.md`

No approval is implied by this human-readable materialization.
