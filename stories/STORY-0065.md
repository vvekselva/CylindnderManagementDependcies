# STORY-0065 — Yard stock check - Form

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `GET /ingestYardStockCheck`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Display the yard stock-check ingestion form with source-proved cylinder-state reference data.

## Accepted backend chain

`YardStockCheckIngestionController.doGet` → `LookupDataCache` or `CylinderStateFetchByPageService` → `CylinderStateJpaDao` → `CylinderStateDo` → `public.tbl_cylinder_states` → `final-version-1/YardStockCheckIngestion`

## Data behavior

The cache-refresh branch reads `public.tbl_cylinder_states`. No persistence write is proved for this GET flow.

## Field-level contract status

The accepted trace does not prove the exact page components/model attributes, exact cylinder-state columns rendered or selectable, datatype/required/default rules for form inputs, or exact cache-hit versus refresh field behavior. These facts are not invented.

This Story remains **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-203431.md`

No approval is implied by this human-readable materialization.
