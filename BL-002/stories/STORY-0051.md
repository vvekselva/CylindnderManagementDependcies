# STORY-0051 — Open Add Stop Page

## Status

- Release: R1
- Endpoint: `GET /add-stop`
- Approval: `PENDING_USER_APPROVAL`
- Review state: `READY_FOR_USER_REVIEW`
- Rework state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user handling an active vehicle load, I want to open the Add Stop page for a customer or supplier stop so that office challan entry is allowed only after the trip has reached the accepted return/proceeding state and the correct stop-specific challan data is loaded.

## Exact request contract

`AddStopController.showStopPage(...)` is `@GetMapping("/add-stop")` and requires two request parameters:

- `vehicleLoadId` — required `Long`;
- `actionType` — required `String`.

The controller first calls `TripReturnWorkflowService.getTripStatusByVehicleLoadId(vehicleLoadId)`.

## Trip-status resolution and guard

`TripReturnWorkflowService.getTripStatusByVehicleLoadId(...)` loads the vehicle load through `VehicleLoadJpaDao.findById(vehicleLoadId)`. Missing load raises `IllegalArgumentException`. The service follows `VehicleLoadDo -> VehicleTripDo -> VehicleTripStatusDo` and returns the trip status name, or null when the trip/status link is absent.

`AddStopController.isChallanEntryAllowed(...)` accepts only status `Returned` or `Proceeding`, case-insensitively.

Any other/null status is rejected before stop-page rendering. The controller returns `redirect:/vehicle-load/fetch?vehicleLoadId={id}` and adds `errorMessage = Trip must be marked Returned before office challan entry is allowed.`

## Customer-stop branch

When `actionType` equals `CustomerStop`, the controller renders:

`with-menu/Customerstopselectionpage-withoutAutoChallanUpdate`

and loads two assigned challan-book families through `ChallanHeatmapFetchService`:

- `DELIVERY_CHALLAN` -> model keys `customerDeliveryAssignedBooks` and `customerDeliveryPageWindowByBook`;
- `EMPTY_PICKUP_CHALLAN` -> model keys `customerEmptyPickupAssignedBooks` and `customerEmptyPickupPageWindowByBook`.

Each request carries `VEHICLE_LOAD_ID` and `ASSIGNED_BOOKS_ONLY=true`. A governed service failure supplies an empty list/map and the applicable customer challan error message rather than aborting the entire page.

The visible customer template consumes these model values to render assigned books/page windows and the related challan-photo upload/delete state.

## Supplier-stop branch

Any `actionType` other than exact `CustomerStop` is treated as the supplier branch and renders:

`with-menu/Supplierstopselectionpage`

The controller requests book type `FILLING_NOTE` from `ChallanHeatmapFetchService` using `VEHICLE_LOAD_ID` and `SUPPLIER_STOP_ASSIGNED_BOOKS_ONLY=true`, exposing:

- `supplierDropOffAssignedBooks`;
- `supplierDropOffPageWindowByBook`.

A governed service failure returns empty structures and `supplierDropOffChallanError = Unable to load assigned supplier drop-off challan book.`

The supplier template uses the assigned book/page window to let the user select the physical challan leaf and manage its photo evidence.

## Shared model and persistence reads

Both successful branches add `vehicleLoadId` to the model.

The Add Stop GET operation is a read/render flow. Its source-proved dependencies include vehicle-load/trip/status reads and, through the heatmap service, trip challan-book assignment, challan-page audit-ledger and active-photo data. No database write is asserted for `GET /add-stop`.

The page/heatmap path depends on the accepted persistence identities already bound by the governed trace, including `public.tbl_vehicle_load`, `public.tbl_vehicle_trip`, `public.tbl_trip_status`, `public.vw_trip_challan_book_assignments`, `public.tbl_challan_page_audit_ledger`, and `public.tbl_challan_page_photo`.

## Business effect

The endpoint is the office-entry gate for Add Stop processing. It prevents challan entry before Returned/Proceeding, chooses the stop screen from `actionType`, and populates the currently assigned physical challan books/leaves and photo state required by subsequent stop operations.

## Completion and approval gate

The exact request parameters, status lookup, accepted status predicate, rejection redirect/message, customer-vs-supplier selection rule, model attributes, service-error fallbacks, terminal views and read-only persistence role are source-bound from the recovered governed ZIP.

STORY-0051 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval is inferred. No application code was changed and no BL-010 work was created or executed.
