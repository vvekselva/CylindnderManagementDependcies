# STORY-0040 — Vehicle Load

- Release: R1
- Endpoint: `POST /vehicleLoad`
- Functional area: Vehicle Load
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit the **Vehicle Load** form through **POST /vehicleLoad** so that the selected vehicle/load/trip details and cylinder selections are validated, persisted as a vehicle load, removed from active yard inventory, represented as active vehicle logistics, and the browser returns to the active vehicle-load list when the request is accepted.

## Source-proved controller contract

`Uc02Phase01VehicleLoadController.doPost()` binds the submitted form as `@ModelAttribute("vehicleLoad") UC02Phase01VehicleLoadRequestDto requestDto` and invokes `uc02Phase01VehicleLoadMediator.invokeServices(requestDto)`.

The controller explicitly reads/logs three submitted load quantities from `requestDto.vehicleLoadDto` before invoking the mediator:

- `quantityFullForDelivery`
- `quantityFullForBuffer`
- `quantityEmptyForSupplier`

On mediator success the controller redirects to `/vehicle-loads/list`.

If the mediator throws `InvalidInputParameterException`, the same `with-menu/Uc02-Phase01-VehicleLoadView` is rendered again with the submitted `vehicleLoad` request object and `errorMessage` equal to the exception message.

## Source-proved request model

`UC02Phase01VehicleLoadRequestDto` contains:

- `vehicleLoadDto`
- `vehicleTripDto`
- `deliveryChallanBookId`
- `emptyPickupChallanBookId`
- `supplierDropOffChallanBookId`
- `customerSpotCylinderCheckBookId`
- `deliveryChallanBookStartingSheetNumber`
- `emptyPickupChallanBookStartingSheetNumber`
- `supplierDropOffChallanBookStartingSheetNumber`
- `customerSpotCylinderCheckBookStartingSheetNumber`

Its frozen-source documentation states that the nested `VehicleLoadDto` carries vehicle identity, driver identity, load date/time, loaded-by/remarks and load-line cylinder selections.

## Exact mediator and application-service chain

The concrete frozen mediator is `com.sreyas.datamatics.cylinder.management.mediator.Uc02Phase01VehicleLoadMediator`. It implements `ICylinderManagementApplicationMediator<UC02Phase01VehicleLoadRequestDto, UC02Phase01VehicleLoadResponseDto>` and injects an `ICylinderManagementApplicationService<VehicleLoadIngestionRequestDto, VehicleLoadIngestionResponseDto>` named `vehicleLoadIngestionService`.

The mediator copies the submitted `vehicleLoadDto` and `vehicleTripDto` into `VehicleLoadIngestionRequestDto`, invokes `vehicleLoadIngestionService.processRequest(...)`, and copies the returned persisted `vehicleLoadDto` into the use-case response. `InvalidInputParameterException` is rethrown to the controller. The frozen mediator catches/logs other `CylinderManagementApplicationException` values and then reaches its common SUCCESS response-code assignment; this source behavior is recorded as-is rather than silently corrected.

The concrete service is `com.sreyas.datamatics.cylinder.management.services.VehicleLoadIngestionService`. Its `processRequest(...)` method is `@Transactional`.

## Validation, state and quantity guards

Before persistence the service invokes `vehicleLoadIngestionValidator.validate(...)`. It then resolves the submitted trip with `VehicleTripJpaDao.findById(vehicleTripId)` and maps the vehicle-load header and each load-line DTO into JPA entities.

For every selected cylinder, the service requires exactly one active `YardInventoryLineDo`. The active yard inventory line is the source used to determine the cylinder's current Yard state.

The executable branches are:

- `EMPTY`: accepted only while the processed EMPTY count is below submitted `quantityEmptyForSupplier`; purpose becomes `EMPTY_FOR_SUPPLIER` and target cylinder state becomes `EMPTY_PICKED_FOR_REFILL`.
- `FULL`: allocated first to `FULL_FOR_DELIVERY` while below `quantityFullForDelivery`, then to `FULL_FOR_BUFFER` while below `quantityFullForBuffer`; the target state is `FULL_PICKED_UP_FOR_DELIVERY`.
- missing yard state, unexpected state, too many EMPTY/FULL cylinders, missing trip/purpose/master state, or not exactly one active yard-inventory row causes an application exception.

## Source-proved persistence and side effects

Within the same transaction the service performs the following executable writes:

1. Creates a `YARD_START` `VehicleTripStopDo`, sets its sequence to previous maximum + 1 and status to `ARRIVED`, then saves it through `VehicleTripStopJpaDao`.
2. Resolves trip status `Loaded`, assigns it to the trip, and saves the trip through `VehicleTripJpaDao`.
3. Saves `VehicleLoadDo` through `VehicleLoadJpaDao`. `VehicleLoadDo.loadLines` has `cascade = CascadeType.ALL`, so its mapped `VehicleLoadLineDo` rows are persisted with the load.
4. Creates an `OPEN` `CylinderLogisticsExecutionDo` tied to the saved vehicle load and trip and saves it through `CylinderLogisticsExecutionJpaDao`.
5. Creates one active, incomplete, non-exception `CylinderLogisticsExecutionLineDo` per loaded cylinder, with the resolved target cylinder state, then persists them through `CylinderLogisticsExecutionLineJpaDao.saveAll(...)`.
6. Marks each source active `YardInventoryLineDo` inactive, updates its timestamp, and persists those changes through `YardInventoryLineJpaDao.saveAll(...)`.
7. Maps the saved `VehicleLoadDo` back to the response DTO and returns SUCCESS.

The service source also documents an existing database-trigger synchronization after vehicle-load-line flush; that comment is retained only as source context and is not needed to establish the Java/JPA persistence proof above.

## Exact JPA/database identities

The executable entity mappings prove these database identities:

- `VehicleLoadDo` -> `public.tbl_vehicle_load`, primary key `pk_vehicle_load_id`, sequence `public.pk_vehicle_load_id_serial`, trip FK `fk_vehicle_trip`.
- `VehicleLoadLineDo` -> `public.tbl_vehicle_load_line`, primary key `pk_vehicle_load_line_id`, sequence `public.pk_vehicle_load_line_id_serial`, FKs `fk_vehicle_load`, `fk_cylinder`, `fk_load_purpose`, plus `loaded_at`.
- `VehicleTripDo` -> `public.tbl_vehicle_trip`, primary key `pk_vehicle_trip_id`, with `fk_trip_status` used for the `Loaded` state.
- `VehicleTripStopDo` -> `public.tbl_vehicle_trip_stop`, primary key `pk_stop_id`, sequence `public.pk_trip_stop_id_serial`, FKs `fk_vehicle_trip` and `fk_stop_type`, with `stop_sequence` and `stop_status`.
- `CylinderLogisticsExecutionDo` -> `public.tbl_cylinder_logistics_execution`, primary key `pk_cylinder_logistics_execution_id`, FKs `fk_vehicle_trip` and `fk_vehicle_load`, plus `execution_status`.
- `CylinderLogisticsExecutionLineDo` -> `public.tbl_cylinder_logistics_execution_line`, primary key `pk_cylinder_logistics_execution_line_id`, FKs `fk_cylinder_logistics_execution`, `fk_cylinder`, `fk_cylinder_state`, plus `is_active`, `is_completed`, and `is_exception`.
- `YardInventoryLineDo` -> `public.tbl_yard_inventory_line`, primary key `pk_yard_inventory_line_id`, sequence `public.tbl_yard_inventory_line_pk_yard_inventory_line_id_seq`, with `fk_cylinder`, `fk_cylinder_state`, and `is_active`.

## Visible outcome and strict completion

The applicable browser/controller/request/validation/mediator/service/DAO/entity/database/side-effect/response chain is now source-proved. On a successful mediator return the browser redirects to `/vehicle-loads/list`; an `InvalidInputParameterException` re-renders the Vehicle Load page with its submitted request and error message.

`STORY-0040` is therefore `STRICT_FIELD_UI_COMPLETE`. This is enrichment completion only; user approval is still pending and no approval is inferred.
