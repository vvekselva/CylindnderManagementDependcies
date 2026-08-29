# STORY-0052 — Open Trip Return Page

## Status

- Release: R1
- Endpoint: `GET /trip-return`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user handling a returning vehicle trip, I want to open the Trip Return page so that the system can show the current trip, vehicle and driver context together with the challan books, challan-page audit state and available challan-page photo evidence needed for return review.

## Source-proved execution flow

1. The request is handled by `TripReturnController.showReturnPage`.
2. The controller invokes `TripReturnWorkflowService.loadReturnPage`.
3. The trip-header branch reads `VehicleLoadDo` through `VehicleLoadJpaDao`, backed by `public.tbl_vehicle_load`.
4. The accepted chain continues through `VehicleTripDo` / `public.tbl_vehicle_trip` and `VehicleTripStatusDo` / `public.tbl_trip_status`.
5. The same source-proved header branch includes `VehicleDo` / `public.tbl_vehicle` and `DriverDo` / `public.tbl_driver`.
6. The returned-challan-books branch reads the trip challan-book assignment view through `TripChallanBookAssignmentViewJpaDao` and `TripChallanBookAssignmentViewDo`, backed by `public.vw_trip_challan_book_assignments`.
7. Challan-page audit state is read through `ChallanPageAuditLedgerJpaDao`, backed by `public.tbl_challan_page_audit_ledger`.
8. Challan-page photo evidence is read through `ChallanPagePhotoJpaDao`, backed by `public.tbl_challan_page_photo`.
9. The accepted terminal is `final-version-1/TripReturnChallanBookReview`.

## Persistence effect

This endpoint is source-proved as a read/render flow. The accepted canonical chain proves reads from vehicle-load/trip/status, vehicle, driver, challan-assignment, challan-audit and challan-photo structures. It does not prove that `GET /trip-return` performs a database mutation, so no persistence write is asserted.

## Validation and guard behavior

The canonical trace proves the dependencies needed to load the Trip Return review page, but it does not by itself prove the full request parameter contract, exact requiredness rules, every trip-status eligibility predicate, how missing or invalid identifiers are handled, or every user-facing validation/error message. Those details remain exact-source review items and must not be invented.

## Unique-key proof

The BL-002 register identifies STORY-0052 as `GET /trip-return`. The canonical BL-001 matrix contains the exact same HTTP method and path and identifies `TripReturnController.showReturnPage` as the controller method. No endpoint remapping is required.

## Review contract

Before user approval, exact source review must confirm the request parameter contract, any precise eligibility/guard rules for opening the return page, the view-model fields assembled by `loadReturnPage`, and the behavior for missing or invalid trip/load identifiers. No missing behavior may be invented.

## Acceptance evidence already proved

- Story unique key matches canonical BL-001 exactly.
- Vehicle load, trip and trip-status read chain is represented.
- Vehicle and driver dependencies are represented.
- Returned challan-book assignment view is represented.
- Challan-page audit and photo dependencies are represented.
- Terminal Trip Return review view is represented.
- No approval is granted by this enrichment step.
