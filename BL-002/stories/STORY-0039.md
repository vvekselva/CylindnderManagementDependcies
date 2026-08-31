# STORY-0039 — Vehicle Load

- Release: R1
- Endpoint: `GET /vehicleLoad`
- Functional area: Vehicle Load
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to prepare a vehicle load for an active trip, select cylinders physically available in the yard, distribute FULL cylinders between delivery and buffer purposes and identify EMPTY cylinders for supplier refill, so that saving the load records the vehicle load and its lines, marks the trip Loaded, records the yard-start stop and transfers the selected cylinders from active yard inventory into active vehicle logistics execution.

## Entry behavior

`GET /vehicleLoad` is handled by `Uc02Phase01VehicleLoadController.doGet(Model)` and renders `with-menu/Uc02-Phase01-VehicleLoadView` with model attribute `vehicleLoad`.

The controller creates a fresh `UC02Phase01VehicleLoadRequestDto` and `VehicleLoadDto`. When `REDIRECT_REQUEST` is present after trip creation, it also reads `DRIVER_ID`, `DRIVER_NAME`, `VEHICLE_ID`, `VEHICLE_NUMBER` and `VEHICLE_TRIP_ID`, sends them to the page as preselected values, creates `VehicleTripDto`, sets its trip ID and attaches it to the request. Without redirect attributes, this trip attachment is not performed by the GET source.

The GET also calls `lookupDataCache.getVehicleLoadPurposes()`, but the returned local list is not added to the model, so no unproved UI effect is attributed to that lookup.

## Visible fields and business meaning

- **Vehicle** identifies the trip vehicle. Redirect entry can preselect and lock it; direct entry uses vehicle type-ahead search.
- **Driver** identifies the trip driver. Redirect entry can preselect and lock it; direct entry uses driver type-ahead search.
- **Load Date / Load Time** describe when the load is prepared; browser logic synchronizes the visible time into the submitted vehicle-load model.
- **Loaded By** records the person/operator responsible for loading and is required by both browser and server validation.
- **Remarks** records optional load notes.
- **Cylinder picker** selects cylinders and submits each selected identity as `vehicleLoadDto.loadLines[i].cylinder.cylinderId`.
- **For Customer Delivery** is the submitted FULL-cylinder allocation for delivery.
- **Buffer / Adhoc Supply** is the submitted FULL-cylinder allocation for buffer use.
- **For Supplier Refill** is synchronized by the browser to the selected EMPTY-cylinder count.
- **Save Vehicle Load** executes the embedded POST mutation described below.

## Search and client behavior

Vehicle and Driver are search-based selectors. Editing their visible text clears the stale selected hidden ID and a 280 ms debounce is used before lookup. Cylinder lookup uses the state and serial/state APIs and supports paging/search/add/remove.

The browser maintains selected FULL/EMPTY counts. It recalculates Delivery and Buffer as complementary values and requires `Delivery + Buffer == selected FULL count` before submit. It also requires Vehicle, Driver, Loaded By and at least one cylinder.

A notable current-state mismatch is preserved: the server validator explicitly permits an empty load for pickup-only trips, while the browser `submitLoad()` blocks submission when no cylinder is selected.

## Save Vehicle Load — concrete server path

`POST /vehicleLoad` invokes `Uc02Phase01VehicleLoadMediator.invokeServices(requestDto)`. The concrete mediator creates `VehicleLoadIngestionRequestDto`, copies `VehicleLoadDto` and `VehicleTripDto`, and invokes `VehicleLoadIngestionService.processRequest()`.

`VehicleLoadIngestionService.processRequest()` is `@Transactional`, so its persisted load, trip, stop, yard and logistics changes participate in the same service transaction unless a database/runtime failure rolls the transaction back.

## Server validation and loadability rules

`VehicleLoadIngestionValidator` source proves:

1. request DTO, `VehicleTripDto` and `VehicleLoadDto` must be non-null;
2. `loadedBy` must not be blank;
3. load lines may be empty at server level for pickup-only trips;
4. when lines exist, every line must contain a Cylinder ID and that Cylinder must exist;
5. every selected cylinder must pass location-exclusivity validation and be available only in Yard;
6. the active Yard Inventory line and cylinder state must exist;
7. only Yard states `FULL` and `EMPTY` are loadable.

The service independently requires exactly one active Yard Inventory line for each selected cylinder.

The validator's VehicleTrip-ID positive/existence validation block is commented out. The service subsequently performs `vehicleTripJpaDao.findById(vehicleTripId).orElseThrow(...)`, so a resolvable trip identity is still required by the effective persistence path.

The quantity-summary null check contains a current-source defect: `quantityFullForDelivery` is checked twice and `quantityEmptyForSupplier` is not explicitly included in that null condition. This is documented as current behavior and is not silently corrected by Story rework.

## Load-purpose and cylinder-state assignment

For every selected cylinder, the service obtains its single active Yard Inventory line and reads the Yard cylinder state.

- `EMPTY` is assigned load purpose `EMPTY_FOR_SUPPLIER` while the requested EMPTY allocation has capacity. Its target logistics cylinder state becomes `EMPTY_PICKED_FOR_REFILL`.
- `FULL` is first allocated to `FULL_FOR_DELIVERY` until that requested count is satisfied, then to `FULL_FOR_BUFFER`. Both FULL purposes target `FULL_PICKED_UP_FOR_DELIVERY`.
- Any other Yard state, missing state, excess EMPTY count or excess FULL count causes `CylinderManagementApplicationException`.

The service sets each load-line `loadedAt` timestamp and derives total cylinders loaded from the actual constructed line list.

## Exact persistence and business impact

The transaction performs these source-proved mutations:

1. It creates a `YARD_START` `VehicleTripStop` with status `ARRIVED` and the next stop sequence for the trip.
2. It changes the selected `VehicleTrip` status to `Loaded`.
3. It saves `VehicleLoadDo` through `VehicleLoadJpaDao`. `VehicleLoadDo` maps to `public.tbl_vehicle_load`, primary key `pk_vehicle_load_id`, and owns unique `fk_vehicle_trip`.
4. `VehicleLoadDo.loadLines` uses `CascadeType.ALL`; therefore the attached `VehicleLoadLineDo` rows are persisted to `public.tbl_vehicle_load_line`, primary key `pk_vehicle_load_line_id`, containing `fk_vehicle_load`, `fk_cylinder`, `fk_load_purpose` and `loaded_at`.
5. It creates one OPEN `CylinderLogisticsExecutionDo`, mapped to `public.tbl_cylinder_logistics_execution`, linked to the saved vehicle load and trip.
6. It creates active `CylinderLogisticsExecutionLineDo` rows in `public.tbl_cylinder_logistics_execution_line`, one per selected cylinder, with the target cylinder-state identity, `is_active=true`, `is_completed=false` and `is_exception=false`.
7. It sets each selected source `public.tbl_yard_inventory_line.is_active` to `false` and saves the modified Yard Inventory lines.

The service comments additionally state that database triggers fired by persisted vehicle-load lines synchronize legacy `tbl_cylinder_current_status`; Java intentionally does not directly update that legacy current-status table in this path.

The business result is therefore more than creation of a load header: the same service transaction establishes the trip as Loaded and transfers the selected cylinders out of active Yard Inventory into active logistics execution for that vehicle trip.

## Current-source gaps requiring review

- Direct GET entry does not attach `VehicleTripDto` unless redirect attributes are present, while the server validation/persistence path requires a trip DTO and resolvable trip ID. A successful direct-entry submit is therefore not source-proved by this path.
- Browser requires at least one cylinder, while server validation permits an empty pickup-only load.
- The mediator catches/logs `CylinderManagementApplicationException` from the ingestion service without rethrowing and afterwards sets SUCCESS response code. This can mask an application-level service failure in the mediator response path.
- Quantity-summary null validation checks `quantityFullForDelivery` twice and omits an explicit `quantityEmptyForSupplier` null check.

These are documented current-source behaviors, not automatically approved code changes. Any later Story/code conformance drift that would alter application code must pass the user-approved Drift / Code Change Manifest gate before BL-010 work or source mutation.

## Visible outcome

On the controller's normal success path, the browser is redirected to `/vehicle-loads/list`. `InvalidInputParameterException` redisplays the Vehicle Load form with the submitted model and `errorMessage`. No other exception behavior is invented beyond the source-proved mediator/controller handling.

## Review and approval gate

The page's embedded Save Vehicle Load capability is now bound through controller, concrete mediator, transactional service, validation, exact persistence identities and yard-to-logistics business effects. The Story is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. Explicit user approval or rework remains required, and testing fan-out remains unauthorized until all downstream approval/conformance gates pass.
