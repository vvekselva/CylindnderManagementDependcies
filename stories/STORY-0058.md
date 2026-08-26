# STORY-0058 — Ownership dashboard - Customer

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `GET /ownership-dashboard/customer`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

Display customer ownership-location detail using the accepted BL-001 source chain.

## Accepted backend chain

`OwnershipDashboardController.showCustomerOwnership` → `OwnershipDashboardFetchService` → `public.vw_ownership_current_cylinder_location` → `OwnershipLocationDetail`

## Data behavior

The accepted trace proves a read from `public.vw_ownership_current_cylinder_location`. No persistence write is proved for this endpoint.

## Field-level contract status

The current frozen-source evidence does **not** prove the complete field-level Story contract. The following remain unresolved and therefore must not be invented:

- exact page field/component → DTO/model field mappings;
- exact view columns rendered on the page;
- exact filter, default and null-handling semantics.

Until those mappings are source-proved, this Story remains **NEEDS_CLARIFICATION** and is **not ready for user approval**.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-181810.md`

No approval is implied by this human-readable materialization.
