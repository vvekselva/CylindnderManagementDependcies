# STORY-0063 — Supplier registration - Form

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `GET /ingestSupplier`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Display the supplier registration form.

## Accepted behavior

`SupplierIngestionController.doGet` returns `with-menu/SupplierIngestion`. No persistence service or database dependency is source-proved for this GET flow.

## Field-level contract status

The exact page components, model/DTO mappings, and datatype/required/default rules for the displayed form inputs are not proved by the accepted trace. Static UI elements may be marked `STATIC_UI_NO_DATABASE_MAPPING` only after the specific component is source-proved as static.

This Story therefore remains **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-191248.md`

No approval is implied by this human-readable materialization.
