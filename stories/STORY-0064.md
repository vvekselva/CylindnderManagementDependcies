# STORY-0064 — Supplier registration - Submit

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /ingestSupplier`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Validate and persist supplier registration data through the accepted BL-001 flow.

## Accepted behavior

`SupplierIngestionController.doPost` reads city/state/country reference data, persists supplier/address/phone data, and terminates in either a success redirect or the supplier-ingestion error view.

## Field-level contract status

The accepted trace does not prove each input field's datatype, required/optional status, normalization/default, accepted values, validation behavior, or exact entity-field → database-column mapping. Those facts are therefore not invented.

This Story remains **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-191248.md`

No approval is implied by this human-readable materialization.
