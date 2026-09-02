# STORY-0069 — Supplier Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/supplier`
- Controller: `OwnershipDashboardController.showSupplierOwnership`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator reviewing cylinder ownership, I can open Supplier Ownership to see current ownership-location rows classified as `SUPPLIER`. The location selector is fixed server-side.

`showSupplierOwnership()` handles `GET /ownership-dashboard/supplier`, accepts no browser fields or path variables, creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Supplier Ownership"`, and exposes `rows = ownershipDashboardFetchService.fetchByLocation("SUPPLIER")`.

The shared table renders cylinder serial, product, state, customer, supplier, yard, vehicle trip, vehicle load and entered/since values. `Back to Dashboard` targets `/ownership-dashboard`. No editable controls, submit actions, hidden IDs, client lookups, pagination, debounce or local validation are applicable.

The read chain is `OwnershipDashboardFetchService.fetchByLocation("SUPPLIER")` → current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → Thymeleaf table. No database mutation or endpoint-specific error mapping is asserted.

## Completion and approval gate

The recovered ZIP confirms the controller literal, title/model contract, terminal template and read-only data identity. STORY-0069 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application code or BL-010 mutation occurred.
