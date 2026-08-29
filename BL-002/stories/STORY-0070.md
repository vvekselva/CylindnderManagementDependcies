# STORY-0070 — Logistics / In Transit Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/logistics`
- Controller: `OwnershipDashboardController.showLogisticsOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator reviewing cylinder ownership, I can open Logistics / In Transit Ownership to see current ownership-location rows classified as `LOGISTICS`. The discriminator is fixed by the server and this flow is read-only.

## Strict browser/controller contract

Browser navigation is `GET /ownership-dashboard/logistics`. No request parameter, path variable, form/hidden field, request DTO, debounce/minimum-length rule, client validation, or dependent browser API applies. `showLogisticsOwnership()` creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Logistics / In Transit Ownership"`, and sets `rows = ownershipDashboardFetchService.fetchByLocation("LOGISTICS")`.

## Exact visible UI contract

The template iterates `row : ${rows}` and renders exactly: `Cylinder`→`row.cylinderSerial`; `Product`→`row.productName`; `State`→`row.cylinderState`; `Customer`→`row.customerName`; `Supplier`→`row.supplierName`; `Yard`→`row.yardName`; `Vehicle Trip`→`row.vehicleTripId`; `Vehicle Load`→`row.vehicleLoadId`; `Since`→`row.enteredAt`. Heading binds `${title}` and `Back to Dashboard` targets `/ownership-dashboard`. There are no editable controls, row actions, submit buttons, enable predicates, reset actions, or pagination controls.

## Service/data identity

`GET /ownership-dashboard/logistics` → `showLogisticsOwnership()` → `OwnershipDashboardFetchService.fetchByLocation("LOGISTICS")` → ownership current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → model `rows` → Thymeleaf table. No write occurs and no unproved base-table behavior is inferred.

## Branch / outcome

There is no request-dependent controller branch. Normal success renders returned rows. Null/empty cells render as supplied. No endpoint-specific catch/error mapping is declared, so no custom error response is asserted.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/OwnershipDashboardController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/OwnershipLocationDetail.html`
- Existing BL-002 ownership current-location DAO/view trace.

## Approval boundary

Strict source enrichment is complete; approval remains `PENDING_USER_APPROVAL`. No auto-approval, Use Case grouping, or testing-readiness promotion is performed.
