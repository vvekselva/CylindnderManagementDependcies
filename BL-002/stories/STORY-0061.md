# STORY-0061 — All Vehicle Loads

- Release: R1
- Endpoint: `GET /vehicle-loads/all-list`
- Controller: `VehicleLoadByPageController.listAllVehicleLoads`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`VehicleLoadByPageController.listAllVehicleLoads` invokes `VehicleLoadFetchByPageService.processRequest`, reading `VehicleLoadDo` from `public.tbl_vehicle_load` with related trip, driver and vehicle records from `public.tbl_vehicle_trip`, `public.tbl_driver` and `public.tbl_vehicle`. Trip-status helper logic uses `TripReturnWorkflowService.getTripStatusByVehicleLoadIds` and `public.tbl_trip_status`. The terminal view is `final-version-1/VehicleLoadFetchByPageView`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining proof includes exact page/filter/search names/defaults, difference in controls between all-list and active-list modes, selected load/trip ID propagation, status display/button rules, pagination/sort semantics, and exact empty/error behavior.

No missing behavior is inferred.
