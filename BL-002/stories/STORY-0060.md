# STORY-0060 — Active Vehicle Loads

- Release: R1
- Endpoint: `GET /vehicle-loads/list`
- Controller: `VehicleLoadByPageController.listVehicleLoads`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`VehicleLoadByPageController.listVehicleLoads` invokes `VehicleActiveTripFetchByPageService.processRequest`, reading active-trip data via `VehicleActiveTripJpaDao` from `public.vw_active_trips`, with related trip/load/driver/vehicle data from `public.tbl_vehicle_trip`, `public.tbl_vehicle_load`, `public.tbl_driver`, and `public.tbl_vehicle`. Trip status by load is resolved through `TripReturnWorkflowService.getTripStatusByVehicleLoadIds`, backed by vehicle-load/trip-status entities and `public.tbl_trip_status`. The terminal view is `final-version-1/VehicleLoadFetchByPageView`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining exact proof includes page/search parameters, row/action control IDs, trip-status-to-button-state mapping, return/add-stop/complete-trip enablement conditions, selected `vehicleLoadId` propagation, pagination defaults, and exact empty/error behavior.

No missing behavior is inferred.
