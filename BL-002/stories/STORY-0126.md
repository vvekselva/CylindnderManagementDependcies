# STORY-0126 — Vehicle Load Fetch

- Release: R1
- Endpoint: `GET /vehicle-load/fetch`
- Controller: `VehicleLoadFetchByIdController.doGet`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business purpose and screen entry

An operator opens `/vehicle-load/fetch?vehicleLoadId={id}` to inspect one persisted vehicle load, its trip/vehicle/driver context and recorded stops, see live cylinders currently on that load, and access only those trip actions allowed by the current trip status.

The controller requires `vehicleLoadId: Long`, creates `VehicleLoadFetchByIdRequestDto` containing that exact ID, calls `vehicleLoadFetchService.processRequest(...)`, adds the result as model `vehicleLoad`, resolves the current trip status through `TripReturnWorkflowService`, and renders `with-menu/Displayvehicleload.html`.

## Exact service/DAO/entity read path

The concrete service is `VehicleLoadFetchByIdService`. It rejects a null request, null nested `VehicleLoadDto`, null ID or negative ID through the governed invalid-input path. It then executes `VehicleLoadJpaDao.findById(vehicleLoadId)`. A missing load raises `DomainObjectNotFoundException(vehicleLoadId)`.

`VehicleLoadJpaDao` is the Spring Data JPA repository for `VehicleLoadDo`. `VehicleLoadDo` maps `public.tbl_vehicle_load`, primary key `pk_vehicle_load_id`, generated from `public.pk_vehicle_load_id_serial`, and carries the non-null unique trip link `fk_vehicle_trip`. Source-proved load values mapped into the response include total cylinders loaded, loaded-by, remarks, created-at, full-for-delivery, full-for-buffer and empty-for-supplier quantities.

From the loaded entity the service follows `VehicleLoadDo.vehicleTrip` to `VehicleTripDo`, mapped to `public.tbl_vehicle_trip` / `pk_vehicle_trip_id`. It maps the trip DTO and explicitly maps the linked `VehicleDo` (`public.tbl_vehicle`) and `DriverDo` (`public.tbl_driver`) into the displayed load DTO.

For every `VehicleTripDo.stops` entry the service maps `VehicleTripStopDo`, which maps `public.tbl_vehicle_trip_stop` / `pk_stop_id` and the trip link `fk_vehicle_trip`. It also maps each stop's `VehicleTripStopTypeDo`, backed by `public.tbl_stop_type`. Stop source fields include sequence, supplier reference, drop-off date, planned/arrived/departed timing and stop status. Customer/supplier context remains on the stop entity where applicable.

The response returns `vehicleLoadDto`, `vehicleTripDto`, the mapped stop collection and SUCCESS. This GET performs no persistence mutation.

## Trip-status action guards

The controller separately resolves trip status for the same load and exposes exact booleans consumed by the template: Returned, Proceeding, Halt, can-return when `Loaded`, challan-entry allowed when Returned or Proceeding, and can-complete when Proceeding.

Customer Stop and Supplier Stop navigation is enabled only when challan entry is allowed. Returned Trip is enabled only while the trip is `Loaded`. Complete Trip is enabled only while `Proceeding`, opens a confirmation modal, and submits the same persistent `vehicleLoadId` to the separate `/complete-trip` POST.

## Live cylinder browser behavior

On DOM load the template copies the persistent load ID into `LOAD_ID` and, when present, POSTs `/cylindermanagement/search/cylinder/on-vehicle` with `VEHICLE_LOAD_ID`, EMPTY/FULL state criteria and paging. Returned rows drive the live cylinder table and state-count chips. An empty result shows `Vehicle is empty`; failed/rejected loading displays `Failed to load live cylinder data. Please refresh the page.` This search is a separate read endpoint and does not mutate the load.

## Error and visible outcomes

If the vehicle-load application service raises `CylinderManagementApplicationException`, the controller logs it, sets model `vehicleLoad` to null and returns the same view rather than redirecting. A successful read displays the load console, trip/vehicle/driver data, recorded stops, live cylinder data and status-governed action controls.

## Completion and approval gate

The recovered ZIP now binds the previously missing downstream service, repository, entity/table and trip-stop read path in addition to the already-proved screen/UI contract. No database write is performed by this GET.

STORY-0126 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
