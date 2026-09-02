# STORY-0060 — Active Vehicle Loads

- Release: R1
- Endpoint: `GET /vehicle-loads/list`
- Controller: `VehicleLoadByPageController.listVehicleLoads`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## User intent and entry
Opening `/vehicle-loads/list` shows active-trip vehicle loads. The screen lets the operator filter active loads, page through them, open a load detail by clicking a row, start a new trip/load, and enter the Returned Trip workflow when the row's trip status allows it.

## Exact GET/controller contract
`listVehicleLoads` accepts query parameter `page` int default `1`, `size` int default `10`, and optional String `searchTerm`. It maps them to `VehicleActiveTripFetchByPageRequestDto` as pageNumber/itemsPerPage/searchTerm and calls `VehicleActiveTripFetchByPageService.processRequest`.

The controller exposes model attributes `loads`, `tripStatusByLoadId`, `currentPage`, `totalItems`, `pageSize`, and `totalPages`, then returns `final-version-1/VehicleLoadFetchByPageView`. It declares `CylinderManagementApplicationException` and contains no local catch/redirect/error-view branch.

## Active-trip service/read contract
The service normalizes pageNumber < 1 to 1 and pageSize < 1 to 10. It creates zero-based `PageRequest.of(pageNumber - 1, pageSize, Sort.by("tripStartedAt").descending())`.

When searchTerm is non-null/non-blank it calls `VehicleActiveTripJpaDao.searchActiveTrips`; otherwise it calls `findAll(pageable)`. The search predicate is case-insensitive contains against `vehicleNumber` OR `driverName`.

`VehicleActiveTripDo` is immutable and maps to `public.vw_active_trips`, identity `pk_vehicle_trip_id`. For each returned active-trip row the service separately loads `VehicleTripDo` by vehicleTripId and, when a linked vehicle load exists, maps the vehicle load and attaches its trip driver and vehicle. The list response carries totalItems, currentPageNumber and itemsPerPage.

## Exact visible filter/navigation controls
The page has a normal GET filter form to `/vehicle-loads/list` containing hidden `page=1`, text input `searchTerm` with placeholder `Search loads…`, and `Filter` submit. There is no story-specific AJAX, keyup search, debounce, minimum-length rule or dependent lookup. `+ New Trip & Load` navigates to `/wizard/vehicle-trip-load`.

The controller does not add `searchTerm` as a model attribute even though the template references `${searchTerm}`. Therefore preserving the entered search value after the request is not proved by this controller contract; this is recorded as a current implementation characteristic rather than invented behavior.

## Exact row identity and click behavior
Each load row carries `data-href=/vehicle-load/fetch?vehicleLoadId={load.vehicleLoadId}`. Its row `onclick` assigns that URL to `window.location.href`, so the selected persisted load identity is propagated as query parameter `vehicleLoadId`. The Returned Trip control calls `event.stopPropagation()` so activating it does not also trigger row navigation.

Visible row values are load ID, vehicle number, driver name, total cylinders loaded, full quantity (full-for-delivery + full-for-buffer), empty-for-supplier quantity, loadedBy, createdAt, a static `ACTIVE / RETURNED` badge, and Return control. Null vehicle/driver/date values render a dash; null split quantities render as zero.

## Trip-status lookup and Returned Trip button state
The controller extracts non-null vehicleLoadIds and calls `TripReturnWorkflowService.getTripStatusByVehicleLoadIds`. That read-only method uses `VehicleLoadJpaDao.findAllById`, follows each load's linked vehicle trip and trip status, and returns loadId -> statusName (or null when no status is linked).

The template renders an enabled `Returned Trip` anchor to `/trip-return?vehicleLoadId={id}` only when the status string equals exactly `Loaded`. For every other status it renders a disabled-looking ordinary button with `cursor:not-allowed`; when status equals exactly `Returned`, its text becomes `Returned Trip ✓`, otherwise `Returned Trip`. No Add Stop or Complete Trip control exists on this list template; those enablement rules therefore do not belong to this endpoint's applicable UI contract.

## Pagination and source-proved edge behavior
`totalPages` is computed by the controller as `ceil(totalItems / size)` using the raw controller `size` parameter, while the service response exposes the normalized pageSize separately. The template renders pagination only when totalPages > 1. Previous is disabled at currentPage == 1; Next is disabled at currentPage == totalPages; numbered links span 1..totalPages.

Pagination links preserve `searchTerm` only if that model value is available and change `page`; they do not include `size`, so pagination navigation falls back to the controller default size 10 unless size is supplied elsewhere. These are source-proved characteristics retained for user review.

## Empty and persistence behavior
When `loads` is empty the table shows `No load records found` and `Start a new trip to create a vehicle load`. This GET performs active-trip/load/status reads only; no database write is asserted.

## Governed conclusion
The recovered ZIP confirms the active-list controller, service, active-trip view/entity, trip-status helper and final Thymeleaf contract. User intent, filters, identity propagation, row events, Returned Trip predicate, paging, empty state and read-only impact satisfy the business-behavior standard while retaining the source-proved filter/paging quirks for review.

STORY-0060 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains `PENDING_USER_APPROVAL`; no code mutation or auto-approval occurred.
