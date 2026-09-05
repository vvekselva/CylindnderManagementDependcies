# STORY-0062 — Vehicle Trip List

- Release: R1
- Endpoint: `GET /vehicle-trips/list`
- Controller: `VehicleTripController.listVehicleTrips`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0062-vehicle-trip-list-drift-review-20260902.yaml`

## User intent and exact request contract
Opening `/vehicle-trips/list` renders the TST vehicle-trip record list. The controller accepts query parameter `page` int default `1`, `size` int default `10`, and optional String `searchTerm`. It maps those values to `VehicleTripFetchByPageRequestDto`, calls `VehicleTripFetchByPageService.processRequest`, and returns `tst/trip-list`.

The model receives `trips`, `currentPage`, `totalItems`, `pageSize`, `searchTerm`, and calculated `totalPages`.

## Service paging, sort and search semantics
The service normalizes pageNumber < 1 to 1 and itemsPerPage < 1 to 10, then uses zero-based `PageRequest.of(pageNumber - 1, pageSize, Sort.by("vehicleTripId").descending())`. Thus the source-proved ordering is newest/highest vehicleTripId first.

Although the controller and template accept/display `searchTerm`, both nonblank and blank branches in the service call the same `VehicleTripJpaDao.findAll(pageable)`. Therefore no filtering by vehicle, driver, customer, status, or any other field is implemented by this frozen service. The entered search value is preserved in the model and pagination URLs but has no source-proved effect on the returned rows. This is recorded as an implementation gap rather than inferred behavior.

## Database identity and mapped row data
`VehicleTripJpaDao` reads `VehicleTripDo`, mapped to `public.tbl_vehicle_trip`, whose primary identity is `pk_vehicle_trip_id` / `vehicleTripId` generated from sequence `pk_vehicle_trip_id_serial`. The entity links vehicle through `fk_vehicle`, driver through `fk_driver`, trip status through `fk_trip_status`, and also contains customer/customer-address relations in this frozen source.

The service maps each trip to `VehicleTripDto`, then explicitly maps nested vehicle and driver DTOs when those relations are non-null. The template renders trip.vehicleTripId, vehicle.vehicleNumber or `N/A`, driver.driverName or `N/A`, trip.startingTime, and customerDto.customerName or `N/A`.

Trip status/review status are not rendered by this frozen list template. No review-status lookup, review-action button, status filter, or trip-status button predicate is part of this endpoint's applicable UI contract.

## Exact visible controls and browser behavior
The page header contains a normal GET form targeting `/vehicle-trips/list` with one text input `searchTerm`, populated from the model and placeholder `Search...`, plus `Filter` submit. The form has no hidden page/size fields; submitting it therefore uses controller defaults for omitted page and size.

There is no story-specific JavaScript, AJAX search, keyup/change handler, debounce, minimum-length rule, dependent API call, hidden trip-ID field, row click handler, or detail/navigation action in the frozen template. The displayed trip ID is text only; selecting a row does not source-prove propagation of a selected trip ID anywhere.

## Pagination behavior and source-proved edge cases
`totalPages` is calculated as ceil(totalItems / responseDto.itemsPerPage), so it uses the service-normalized page size. Pagination renders only when totalPages > 1. Prev is disabled on page 1, Next on the last page, and numbered links span 1..totalPages.

Prev/numbered/Next links preserve `searchTerm` and change `page`, but they omit `size`. Consequently a non-default size supplied on the original request is not preserved by pagination links and subsequent navigation falls back to controller default size 10. Filter form submission likewise omits size.

## Empty and error behavior
When `trips` is empty, the table renders one five-column row saying `No records found in the database.` The controller declares `CylinderManagementApplicationException` from its service call and contains no local catch, redirect, flash-message or error-view branch; therefore no story-specific graceful error UI is proved here.

## Persistence effect
This GET reads trip/vehicle/driver-related persistence only. No database write is asserted.

## Drift governance
The recovered ZIP confirms that the visible search field currently has no filtering effect and that size is not retained in browser navigation. The exact proposed remediation is isolated in the referenced review packet. No application/BL-010 mutation is allowed without explicit user approval of that manifest.

## Governed conclusion
The current-source business behavior—including ineffective search, paging propagation, visible rows, sorting, empty state and read-only persistence effect—is completely source-bound and explicitly documented.

STORY-0062 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains `PENDING_USER_APPROVAL`; no application code was changed and no BL-010 work was created or executed.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
