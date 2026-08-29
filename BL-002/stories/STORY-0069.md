# STORY-0069 — Supplier Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/supplier`
- Controller: `OwnershipDashboardController.showSupplierOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator reviewing cylinder ownership, I can open Supplier Ownership to see current ownership-location rows classified as `SUPPLIER`. The location selector is a fixed server-side literal and the flow is read-only.

## Strict browser/controller contract

Browser navigation is `GET /ownership-dashboard/supplier`. No request parameter, path variable, form/hidden field, request DTO, debounce/minimum-length rule, client validation, or dependent browser API applies. `showSupplierOwnership()` creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title = "Supplier Ownership"`, and sets `rows = ownershipDashboardFetchService.fetchByLocation("SUPPLIER")`.

## Exact visible UI contract

The terminal template iterates `row : ${rows}` and renders exactly: `Cylinder`→`row.cylinderSerial`; `Product`→`row.productName`; `State`→`row.cylinderState`; `Customer`→`row.customerName`; `Supplier`→`row.supplierName`; `Yard`→`row.yardName`; `Vehicle Trip`→`row.vehicleTripId`; `Vehicle Load`→`row.vehicleLoadId`; `Since`→`row.enteredAt`. Heading binds `${title}`. `Back to Dashboard` targets `/ownership-dashboard`. No editable controls, row actions, submit buttons, enable predicates, reset actions, or pagination controls exist in this detail template.

## Service/data identity

`GET /ownership-dashboard/supplier` → `showSupplierOwnership()` → `OwnershipDashboardFetchService.fetchByLocation("SUPPLIER")` → ownership current-location DAO/projection → `public.vw_ownership_current_cylinder_location` → DTO rows → `rows` → Thymeleaf table. No write occurs; no unproved base-table behavior is inferred.

## Branch / outcome

There is no request-dependent controller branch. Normal success renders returned rows. Null/empty cells render as supplied. No endpoint-specific catch/error mapping is declared, so no custom error response is asserted.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/OwnershipDashboardController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/OwnershipLocationDetail.html`
- Existing BL-002 ownership current-location DAO/view trace.

## Approval boundary

Strict source enrichment is complete; approval remains `PENDING_USER_APPROVAL`. No auto-approval, Use Case grouping, or testing-readiness promotion is performed.
