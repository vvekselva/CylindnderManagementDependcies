# STORY-0068 — Customer Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/customer`
- Controller: `OwnershipDashboardController.showCustomerOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator reviewing cylinder ownership, I can open Customer Ownership to see current ownership-location rows classified as `CUSTOMER`. The flow is read-only and the customer location selector is fixed by the server, not entered by the user.

## Strict browser/controller contract

Browser navigation is `GET /ownership-dashboard/customer`. There are no request parameters, path variables, form/hidden fields, request DTOs, debounce/minimum-length rules, client validation, or dependent browser APIs. `showCustomerOwnership()` creates `ModelAndView("with-menu/OwnershipLocationDetail")`, sets `title` exactly to `Customer Ownership`, and sets `rows` to `ownershipDashboardFetchService.fetchByLocation("CUSTOMER")`.

## Exact visible UI contract

The terminal template iterates `row : ${rows}` and renders exactly: `Cylinder`→`row.cylinderSerial`; `Product`→`row.productName`; `State`→`row.cylinderState`; `Customer`→`row.customerName`; `Supplier`→`row.supplierName`; `Yard`→`row.yardName`; `Vehicle Trip`→`row.vehicleTripId`; `Vehicle Load`→`row.vehicleLoadId`; `Since`→`row.enteredAt`. The heading binds `${title}` and the visible `Back to Dashboard` link targets `/ownership-dashboard`. No editable control, row action, submit button, button-enable predicate, reset/invalidation action, or pagination control exists in this detail template.

## Service/data identity

`GET /ownership-dashboard/customer` → `showCustomerOwnership()` → `OwnershipDashboardFetchService.fetchByLocation("CUSTOMER")` → `OwnershipCurrentCylinderLocationViewJpaDao` / current-location projection → `public.vw_ownership_current_cylinder_location` → DTO rows → model `rows` → Thymeleaf table. No write occurs and no unproved base-table behavior is inferred.

## Branch, success, error

There is no request-dependent controller branch. Normal success renders the detail table with returned rows. Empty/null cells render as supplied. The controller defines no endpoint-specific catch/error mapping, so no custom error response is asserted.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/OwnershipDashboardController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/OwnershipLocationDetail.html`
- Existing BL-002 trace evidence for the ownership current-location DAO/view.

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no Use Case or testing-readiness promotion is performed.
