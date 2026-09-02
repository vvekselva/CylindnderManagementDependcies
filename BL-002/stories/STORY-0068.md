# STORY-0068 — Customer Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/customer`
- Controller: `OwnershipDashboardController.showCustomerOwnership`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator reviewing cylinder ownership, I can open Customer Ownership to see current ownership-location rows classified as `CUSTOMER`. The browser supplies no selector or identity; the location discriminator is fixed by the server.

`showCustomerOwnership()` handles ordinary `GET /ownership-dashboard/customer` navigation, takes no request parameter/path variable/form input, creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Customer Ownership"`, and sets `rows = ownershipDashboardFetchService.fetchByLocation("CUSTOMER")`.

The shared template renders cylinder serial, product, state, customer, supplier, yard, vehicle trip, vehicle load and entered/since values. `Back to Dashboard` targets `/ownership-dashboard`. There are no editable controls, submit actions, dependent browser calls, hidden IDs, pagination controls, debounce/minimum-length rules or local validation.

The read chain is `OwnershipDashboardFetchService.fetchByLocation("CUSTOMER")` → current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → Thymeleaf table. No database write is asserted and there is no endpoint-specific error mapping.

## Completion and approval gate

The recovered ZIP confirms the exact controller literal, title/model attributes, terminal template and read-only source identity. STORY-0068 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application code or BL-010 mutation occurred.
