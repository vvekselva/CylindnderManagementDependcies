# STORY-0070 — Logistics / In Transit Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/logistics`
- Controller: `OwnershipDashboardController.showLogisticsOwnership`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator reviewing cylinder ownership, I can open Logistics / In Transit Ownership to see current ownership-location rows classified as `LOGISTICS`. The discriminator is fixed by the server.

`showLogisticsOwnership()` handles `GET /ownership-dashboard/logistics`, accepts no request parameters or path variables, creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Logistics / In Transit Ownership"`, and exposes `rows = ownershipDashboardFetchService.fetchByLocation("LOGISTICS")`.

The shared detail table renders cylinder serial, product, state, customer, supplier, yard, vehicle trip, vehicle load and entered/since values. `Back to Dashboard` targets `/ownership-dashboard`. No edit form, submit action, hidden identity, dependent browser call, pagination, debounce or local validation applies.

The read chain is `OwnershipDashboardFetchService.fetchByLocation("LOGISTICS")` → current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → Thymeleaf table. No database mutation or endpoint-specific error mapping is asserted.

## Completion and approval gate

The recovered ZIP confirms the exact controller literal, title/model contract, terminal template and read-only data identity. STORY-0070 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application code or BL-010 mutation occurred.
