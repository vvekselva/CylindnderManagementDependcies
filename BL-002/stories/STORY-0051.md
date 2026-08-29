# STORY-0051 — Open Add Stop Page

## Status

- Release: R1
- Endpoint: `GET /add-stop`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working with an active vehicle load, I want to open the Add Stop page so that the system can verify whether the trip is in a state that allows stop processing and then prepare the appropriate customer-stop or supplier-stop challan view with the current challan-page evidence.

## Source-proved execution flow

1. The request is handled by `AddStopController.showStopPage`.
2. The controller first invokes `TripReturnWorkflowService.getTripStatusByVehicleLoadId`.
3. Trip/load status resolution uses `VehicleLoadJpaDao.findById` and the accepted entities/tables `VehicleLoadDo` → `public.tbl_vehicle_load`, `VehicleTripDo` → `public.tbl_vehicle_trip`, and `VehicleTripStatusDo` → `public.tbl_trip_status`.
4. The canonical trace proves a guard terminal that redirects to `redirect:/vehicle-load/fetch?vehicleLoadId=...` when the stop page is not the accepted terminal for the resolved trip state.
5. For customer-stop rendering, `AddStopController.showStopPage` invokes `ChallanHeatmapFetchService.processRequest`.
6. That branch reads current trip challan-book assignments through `TripChallanBookAssignmentViewJpaDao` / `TripChallanBookAssignmentViewDo` backed by `public.vw_trip_challan_book_assignments`.
7. It also reads challan-page audit information through `ChallanPageAuditLedgerJpaDao` / `ChallanPageAuditLedgerDo` backed by `public.tbl_challan_page_audit_ledger`, and challan-page photo evidence through `ChallanPagePhotoJpaDao` / `ChallanPagePhotoDo` backed by `public.tbl_challan_page_photo`.
8. The customer branch terminates at `with-menu/Customerstopselectionpage-withoutAutoChallanUpdate`.
9. For supplier-stop rendering, the same controller and `ChallanHeatmapFetchService.processRequest` chain reads the accepted challan assignment, audit-ledger, and photo dependencies and terminates at `with-menu/Supplierstopselectionpage`.

## Persistence effect

This endpoint is source-proved as a read/render flow. The accepted canonical chain proves reads from the vehicle-load/trip/status structures and challan assignment/audit/photo structures. It does not prove that `GET /add-stop` performs a database mutation, so no persistence write is asserted.

## Validation and guard behavior

The canonical trace proves a trip-status guard before the stop view is rendered and proves a redirect back to `/vehicle-load/fetch?vehicleLoadId=...` as a guard terminal. It does not by itself prove the exact accepted trip-status values, request parameter requiredness, customer-versus-supplier selection rules, or every validation/error message. Those details remain exact-source review items and must not be invented.

## Unique-key proof

The BL-002 register identifies STORY-0051 as `GET /add-stop`. The canonical BL-001 matrix contains the exact same HTTP method and path and identifies `AddStopController.showStopPage` as the controller method. No endpoint remapping is required.

## Review contract

Before user approval, exact source review must confirm the request parameter contract, the precise trip-status guard predicate, how customer versus supplier stop selection is determined, and any view-model fields not represented in the canonical dependency chain. No missing behavior may be invented.

## Acceptance evidence already proved

- Story unique key matches canonical BL-001 exactly.
- Trip-status guard chain is represented through vehicle load, vehicle trip, and trip-status persistence structures.
- Customer and supplier challan heatmap branches are represented.
- Challan assignment, audit-ledger, and photo dependencies are represented.
- Guard redirect plus customer and supplier terminal views are represented.
- No approval is granted by this enrichment step.
