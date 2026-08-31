# STORY-0040 — Vehicle Load Save

- Release: R1
- Endpoint: `POST /vehicleLoad`
- Functional area: Vehicle Load
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to save the prepared Vehicle Load so that the selected trip, operator details and cylinder allocations are validated and persisted together, the trip is marked Loaded, a Yard-start stop is created, and the selected cylinders move from active Yard Inventory into active vehicle logistics execution.

## Entry and related page behavior

This POST is the Save action embedded in the Vehicle Load page documented by related `STORY-0039` (`GET /vehicleLoad`). The GET page provides the visible Vehicle, Driver, Load Date/Time, Loaded By, Remarks, cylinder picker and FULL/EMPTY allocation controls. Vehicle and Driver use search-based selectors, cylinder selection uses state/serial search, and stale selected IDs are cleared when the visible selector text changes. The POST Story does not duplicate that GET page source trace; it binds the submitted identities and explains the mutation that follows Save.

## Submitted fields and business meaning

`Uc02Phase01VehicleLoadController.doPost()` binds `@ModelAttribute("vehicleLoad") UC02Phase01VehicleLoadRequestDto`.

The request contains:

- `vehicleTripDto` — identifies the active trip whose status/load relationship is being changed.
- `vehicleLoadDto` — carries load header data, including loaded-by/remarks and selected load lines.
- `quantityFullForDelivery` — number of selected FULL cylinders intended for customer delivery.
- `quantityFullForBuffer` — number of selected FULL cylinders intended for buffer/adhoc supply.
- `quantityEmptyForSupplier` — number of selected EMPTY cylinders intended for supplier refill.
- each selected load line carries the Cylinder identity used by the service to locate the current active Yard Inventory record.

The wider request DTO also contains four challan-book IDs and starting-sheet-number fields. Those fields belong to the combined trip/load wizard path when populated; this POST Story only attributes behavior to values actually consumed by the Vehicle Load ingestion path proved below.

## Browser-side submit rules inherited from the page

The related GET page source proves that browser submit requires Vehicle, Driver, Loaded By and at least one selected cylinder, maintains selected FULL/EMPTY counts, and requires Delivery + Buffer to equal the selected FULL count before submission.

A current UI/server difference is preserved: server validation permits an empty load for pickup-only trips, while the browser blocks Save when no cylinder is selected.

## Controller and mediator behavior

The controller invokes `Uc02Phase01VehicleLoadMediator.invokeServices(requestDto)`.

The concrete mediator creates `VehicleLoadIngestionRequestDto`, copies `vehicleLoadDto` and `vehicleTripDto`, invokes `VehicleLoadIngestionService.processRequest(...)`, then maps the returned persisted Vehicle Load into the use-case response.

`InvalidInputParameterException` is rethrown to the controller. Other `CylinderManagementApplicationException` values are caught/logged by the mediator before its common SUCCESS response-code assignment. This is current-source behavior and is not silently normalized by Story rework.

## Server validation and why it matters

The service invokes `VehicleLoadIngestionValidator` before persistence.

Source-proved rules include:

1. request DTO, `VehicleTripDto` and `VehicleLoadDto` must be non-null;
2. `loadedBy` must not be blank, because the saved load must identify the loading operator;
3. when load lines are present, each line must contain an existing Cylinder identity;
4. each selected Cylinder must be available only in Yard and have an active Yard Inventory state of `FULL` or `EMPTY`;
5. the service additionally requires exactly one active Yard Inventory line for every selected Cylinder;
6. the submitted trip must resolve through `VehicleTripJpaDao.findById(...)` even though the validator's explicit positive/existence trip-ID block is commented out;
7. quantity allocation must not exceed the selected FULL/EMPTY population.

A current-source validator defect is recorded: the quantity-summary null check evaluates `quantityFullForDelivery` twice and does not explicitly include `quantityEmptyForSupplier` in that null condition.

## Load-purpose and state assignment

For each selected Cylinder the service reads the single active Yard Inventory line and its current Cylinder state.

- `EMPTY` cylinders are assigned purpose `EMPTY_FOR_SUPPLIER` up to the submitted EMPTY allocation and target logistics state `EMPTY_PICKED_FOR_REFILL`.
- `FULL` cylinders are allocated first to `FULL_FOR_DELIVERY`, then to `FULL_FOR_BUFFER`, according to the submitted counters. Their target logistics state is `FULL_PICKED_UP_FOR_DELIVERY`.
- unexpected Yard states, missing state/purpose/master records, or excess selected counts cause `CylinderManagementApplicationException`.

## Exact transactional read/write effect

`VehicleLoadIngestionService.processRequest()` is `@Transactional`. Within that transaction the source proves these changes:

1. Resolve the submitted `VehicleTrip`.
2. Create a `YARD_START` `VehicleTripStopDo` with status `ARRIVED` and the next stop sequence, then save it through `VehicleTripStopJpaDao`.
3. Resolve trip status `Loaded`, assign it to the trip and save through `VehicleTripJpaDao`.
4. Save `VehicleLoadDo` through `VehicleLoadJpaDao`.
5. Persist its `VehicleLoadLineDo` collection through `CascadeType.ALL`.
6. Create an OPEN `CylinderLogisticsExecutionDo` linked to the saved vehicle load/trip.
7. Create one active, incomplete, non-exception `CylinderLogisticsExecutionLineDo` per selected Cylinder with the target Cylinder state.
8. Mark each source active `YardInventoryLineDo` inactive and save the modified Yard Inventory lines.

This means Save is not only a Vehicle Load header insert: it also changes trip execution state and transfers custody/location representation of the selected cylinders from active Yard Inventory into active logistics execution.

## Exact database identities

The executable JPA mappings prove:

- `VehicleLoadDo` -> `public.tbl_vehicle_load`, primary key `pk_vehicle_load_id`, unique trip FK `fk_vehicle_trip`.
- `VehicleLoadLineDo` -> `public.tbl_vehicle_load_line`, primary key `pk_vehicle_load_line_id`, with `fk_vehicle_load`, `fk_cylinder`, `fk_load_purpose`, `loaded_at`.
- `VehicleTripDo` -> `public.tbl_vehicle_trip`, including `fk_trip_status`.
- `VehicleTripStopDo` -> `public.tbl_vehicle_trip_stop`, including `fk_vehicle_trip`, `fk_stop_type`, `stop_sequence`, `stop_status`.
- `CylinderLogisticsExecutionDo` -> `public.tbl_cylinder_logistics_execution`.
- `CylinderLogisticsExecutionLineDo` -> `public.tbl_cylinder_logistics_execution_line`.
- `YardInventoryLineDo` -> `public.tbl_yard_inventory_line`, whose active source rows are set inactive for loaded cylinders.

The service source also documents a database-trigger synchronization after vehicle-load-line persistence for legacy `tbl_cylinder_current_status`; Java does not directly update that legacy table in this path.

## Visible success and error outcome

On a normal mediator return the controller redirects the browser to `/vehicle-loads/list`.

If `InvalidInputParameterException` is raised, the controller renders `with-menu/Uc02-Phase01-VehicleLoadView` again with the submitted `vehicleLoad` model and `errorMessage`.

Other service-level `CylinderManagementApplicationException` handling remains the current mediator behavior described above; no stronger error propagation is invented.

## Current-source gaps requiring user review

- Browser requires at least one Cylinder while server validation explicitly permits an empty pickup-only load.
- The mediator logs/swallows non-input `CylinderManagementApplicationException` and then reaches common SUCCESS response-code assignment.
- Quantity-summary null validation checks `quantityFullForDelivery` twice and omits an explicit `quantityEmptyForSupplier` null check.
- Direct GET entry can omit `VehicleTripDto` unless redirect attributes are present, while this POST persistence path requires a resolvable trip identity.

These are current-source observations only. They are not authorized code changes. If a future approved Story/code conformance step proposes correcting them, the exact drift/code-change manifest must be shown to the user and explicitly approved before any BL-010 implementation.

## Selector UX review

The same page's selector behavior is source-proved in `STORY-0039`: Vehicle and Driver are type-ahead searches with stale hidden-ID clearing, and Cylinder selection is state/serial-search based. No static-list-to-search conversion is required for this POST page contract.

- `search_conversion_required: false`
- `dependent_selector_rework_required: false`

## Review and approval gate

The POST business contract is source-bound from submitted fields through controller, concrete mediator, transactional service, validation, exact persistence identities, trip/status changes, Yard deactivation, logistics creation and browser outcome.

`STORY-0040` is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval or reapproval occurred. BL-004/BL-005/BL-009 fan-out remains unauthorized until the current Story contract receives explicit user approval/reapproval and the required post-approval Story/code conformance gate passes.
