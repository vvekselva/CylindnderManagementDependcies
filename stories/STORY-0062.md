# STORY-0062 — Customer activation - Set active

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /setCustomerActive`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Mark a customer active through the accepted BL-001 flow.

## Accepted behavior

`ToggleCustomerActiveStatusController.setCustomerActive` writes to `public.tbl_customer` and redirects to the customer-listing flow.

## Field-level contract status

The source-proved trace does not yet prove the complete input contract required for an authoritative Story. The request parameter datatype/requiredness, normalization/defaults, exact validation and invalid-value behavior, exact entity field/database column changed, and exact redirect-message contract remain unresolved.

Accordingly this Story is **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-190650.md`

No approval is implied by this human-readable materialization.
