# STORY-0057 — Trip Review Queue

- Release: R1
- Endpoint: `GET /trip-review`
- Controller: `TripReviewController.showReviewQueue`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User intent and entry
Opening `/trip-review` displays the Trip Review Queue for trips whose review status is still `NOT_REVIEWED`. The page tells the operator that review can be completed after trip halt/closure or when every stop is completed; this queue endpoint itself only lists candidates and performs no review mutation.

## Exact GET/controller contract
`TripReviewController.showReviewQueue()` has no request parameters, path variables, form fields, DTO request body, paging arguments, or filter arguments. It creates `ModelAndView("with-menu/TripReviewList")`, calls `TripReviewFetchService.fetchNotReviewedTrips()`, adds the returned list as model attribute `trips`, and returns the view.

No controller exception branch, redirect branch, or write operation is present for this GET.

## Service/read contract
`fetchNotReviewedTrips()` is `@Transactional(readOnly = true)` and calls `TripReviewHeaderViewJpaDao.findByReviewStatusOrderByTripStartedAtDesc("NOT_REVIEWED")`.

The Spring Data repository method proves a fixed review-status predicate of `NOT_REVIEWED` and ordering by `tripStartedAt DESC`. There is no user-selectable filter, search term, pagination, page size, or alternate sort path for this endpoint.

`TripReviewHeaderViewDo` is immutable and maps to `public.vw_trip_review_header`; its identity is `vehicle_trip_id`. Queue mapping exposes `vehicleTripId`, `vehicleNumber`, `driverName`, `tripStatus`, `reviewStatus`, `tripStartedAt`, `stopCount`, and `totalCylindersLoaded` into `TripReviewListRowDto` (the template renders all except tripStartedAt).

## Exact visible table and navigation
When `trips` is non-null/non-empty, the template renders columns: Trip, Vehicle, Driver, Status, Review, Loaded, Stops, Action. Each row displays the vehicle-trip ID, vehicle number, driver name, trip status, review status badge, total cylinders loaded and stop count.

The `Open Review` anchor is built as `/trip-review/{vehicleTripId}` using the row's exact `vehicleTripId`. Selecting it performs normal browser GET navigation to the detail endpoint.

There is no queue filter form, text input, select control, Apply/Reset control, paging link, button enable/disable predicate, AJAX call, debounce rule, minimum-length rule, hidden-field propagation, or dependent lookup in this frozen queue template. Shared layout scripts are included, but no story-specific queue script/event handler is declared.

## Empty and visible outcome
If `trips` is null or empty, the table is suppressed and the page displays `No trips are pending review.` Otherwise rows are shown in service-returned order.

## Persistence effect
This endpoint is read-only at the proved service boundary and reads `public.vw_trip_review_header`. No database write is asserted.

## Governed conclusion
The frozen controller, service, repository, immutable view entity and Thymeleaf queue template resolve the prior request/filter, sorting, row identity, navigation, empty-state and interaction gaps. STORY-0057 is `STRICT_FIELD_UI_COMPLETE` for its applicable queue contract. Approval remains `PENDING_USER_APPROVAL`.
