# STORY-0067 — Yard Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/yard`
- Controller: `OwnershipDashboardController.showYardOwnership`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator reviewing cylinder ownership, I can open the Yard Ownership detail page to see cylinders whose current ownership-location projection is classified as `YARD`. The flow is read-only and the location discriminator is fixed by the server.

`showYardOwnership()` handles ordinary `GET /ownership-dashboard/yard` navigation, takes no request parameter/path variable/form input, creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Yard Ownership"`, and sets `rows = ownershipDashboardFetchService.fetchByLocation("YARD")`.

The visible detail table renders cylinder serial, product, state, customer, supplier, yard, vehicle trip, vehicle load and entered/since values from each row. `Back to Dashboard` returns to `/ownership-dashboard`. There are no editable controls, submit actions, hidden identifiers, dependent browser calls, pagination controls, debounce/minimum-length rules or local validation branches.

The read chain is `OwnershipDashboardFetchService.fetchByLocation("YARD")` → current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → Thymeleaf table. No database mutation is asserted. The controller defines no endpoint-specific error mapping; normal framework handling applies to service failures.

## Completion and approval gate

The recovered ZIP directly confirms the controller literal `YARD`, title/model contract and shared location-detail template. The user purpose, exact interaction, read identity and visible outcome satisfy the business-behavior standard.

STORY-0067 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains pending; no application code or BL-010 mutation occurred.
