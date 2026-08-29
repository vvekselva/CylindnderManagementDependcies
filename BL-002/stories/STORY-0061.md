# STORY-0061 — All Vehicle Loads

- Release: R1
- Endpoint: `GET /vehicle-loads/all-list`
- Controller: `VehicleLoadByPageController.listAllVehicleLoads`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User intent and exact request contract
Opening `/vehicle-loads/all-list` requests the paged vehicle-load table without the active-trip view restriction. The controller accepts `page` int default 1, `size` int default 10, and optional String `searchTerm`, maps them to `VehicleLoadFetchByPageRequestDto`, calls `VehicleLoadFetchByPageService.processRequest`, and returns `final-version-1/VehicleLoadFetchByPageView`.

It exposes `loads`, `tripStatusByLoadId`, `currentPage`, `totalItems`, `pageSize`, and `totalPages`. It declares `CylinderManagementApplicationException` and has no local catch/redirect branch.

## Service/read semantics
`VehicleLoadFetchByPageService` normalizes page <=0 to zero-based page 0 and size <=0 to 10, then calls `VehicleLoadJpaDao.findAll(PageRequest.of(pageNumber,pageSize,Sort.by("createdAt").descending()))`.

The submitted `searchTerm` is stored in the request DTO by the controller but is not consulted by this service. Therefore `/all-list?searchTerm=...` does not source-prove any server-side filtering. This is an implementation gap, not inferred behavior.

For each `VehicleLoadDo`, the service follows its linked `VehicleTripDo`, maps the load, and attaches the trip's driver and vehicle. `VehicleLoadDo` maps to `public.tbl_vehicle_load`, primary identity `pk_vehicle_load_id`, with non-null unique link `fk_vehicle_trip`; vehicle and driver are reached through the trip. The service returns totalItems/currentPage/itemsPerPage and success/service codes.

## Shared template behavior and endpoint mismatch
The all-list controller renders the same final template used by the active-list endpoint. Consequently visible row fields, row click navigation and Returned Trip button-state logic are identical: clicking a row navigates to `/vehicle-load/fetch?vehicleLoadId={vehicleLoadId}`; the enabled Returned Trip anchor appears only when the exact resolved trip status is `Loaded`, and navigates to `/trip-return?vehicleLoadId={id}`; status `Returned` displays the disabled `Returned Trip ✓` label.

The template's visible filter form and pagination links are hard-coded to `/vehicle-loads/list`, not `/vehicle-loads/all-list`. Thus using Filter, Previous, numbered pages or Next from an all-list-rendered page navigates into the active-list endpoint. The form contains hidden `page=1` and text `searchTerm`; it contains no size control. The controller also does not add `searchTerm` to the model. These endpoint/filter persistence differences are explicitly retained as source-proved implementation gaps.

No Add Stop or Complete Trip control appears on this list template; those controls are outside this endpoint's applicable UI contract.

## Pagination and empty behavior
Controller totalPages is `ceil(totalItems / size)` using raw request size, while the service may normalize non-positive size to 10. Pagination is displayed only when totalPages > 1. Pagination URLs omit size. Empty loads display `No load records found` and `Start a new trip to create a vehicle load`.

## Persistence effect
This endpoint reads vehicle-load/trip/driver/vehicle data and trip status only. No database write is asserted.

## Governed conclusion
The frozen controller, all-load service/entity, trip-status helper and shared final template resolve the applicable request, ordering, row identity, action state, endpoint mismatch, pagination and empty-state contract. STORY-0061 is `STRICT_FIELD_UI_COMPLETE`; approval remains `PENDING_USER_APPROVAL`.
