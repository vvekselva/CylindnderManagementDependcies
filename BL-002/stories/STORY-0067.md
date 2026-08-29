# STORY-0067 — OwnershipDashboardController.showYardOwnership

- Release: R1
- Endpoint: `GET /ownership-dashboard/yard`
- Controller: `OwnershipDashboardController.showYardOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator reviewing cylinder ownership, I can open the Yard Ownership detail page to see cylinders whose current ownership-location projection is classified as `YARD`. This is read-only: the controller supplies the literal location discriminator `YARD` to the fetch service, exposes returned rows as `rows`, sets the page title to `Yard Ownership`, and renders the ownership-location detail table.

## Strict browser/controller contract

- Browser entry/event: ordinary `GET /ownership-dashboard/yard` navigation.
- No request parameters, path variables, form fields, hidden fields, request DTO, debounce, minimum-length rule, or local validation applies.
- `showYardOwnership()` constructs `ModelAndView("with-menu/OwnershipLocationDetail")`.
- Model `title` is exactly `Yard Ownership`.
- Model `rows` is exactly the result of `ownershipDashboardFetchService.fetchByLocation("YARD")`.
- `YARD` is server-fixed; the browser does not type/select/derive it.

## Exact visible UI contract

`with-menu/OwnershipLocationDetail` iterates `row : ${rows}` and renders: `Cylinder`→`row.cylinderSerial`; `Product`→`row.productName`; `State`→`row.cylinderState`; `Customer`→`row.customerName`; `Supplier`→`row.supplierName`; `Yard`→`row.yardName`; `Vehicle Trip`→`row.vehicleTripId`; `Vehicle Load`→`row.vehicleLoadId`; `Since`→`row.enteredAt`.

The heading binds `${title}` and therefore displays `Yard Ownership`. The visible `Back to Dashboard` link targets `/ownership-dashboard`. There are no editable controls, detail actions, submit buttons, button-enable predicates, dependent API calls, reset/invalidation actions, or pagination controls in this detail template.

## Service/data identity

`GET /ownership-dashboard/yard` → `showYardOwnership()` → `OwnershipDashboardFetchService.fetchByLocation("YARD")` → `OwnershipCurrentCylinderLocationViewJpaDao` / `OwnershipCurrentCylinderLocationViewDo` → `public.vw_ownership_current_cylinder_location` → returned DTO rows → model `rows` → Thymeleaf table.

The controller/view prove the exact UI and fixed location selector. Existing frozen trace evidence proves the DAO/view identity above. No deeper unproved SQL predicate or physical base-table write is invented; this endpoint is read-only.

## Branch, success, and error behavior

There is no request-dependent controller branch and no page/size normalization on this endpoint. Normal success renders the detail template with the service rows. Null/empty cell values are rendered as supplied by each row. The controller declares no endpoint-specific catch/error response, so no custom error behavior is asserted.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/OwnershipDashboardController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/OwnershipLocationDetail.html`
- Existing BL-002 trace evidence for `OwnershipDashboardFetchService` → `OwnershipCurrentCylinderLocationViewJpaDao` / `OwnershipCurrentCylinderLocationViewDo` → `public.vw_ownership_current_cylinder_location`.

## Approval boundary

Strict source enrichment is complete, but approval remains `PENDING_USER_APPROVAL`. No auto-approval, Use Case grouping, or testing-readiness promotion is performed.
