# STORY-0057 — Trip Review Queue

- Release: R1
- Endpoint: `GET /trip-review`
- Controller: `TripReviewController.showReviewQueue`
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

The Trip Review Queue gives an operator a single list of vehicle trips that still need review. It allows the user to identify the trip, vehicle, driver, operational state, load and stop summary, then open the exact trip review. The queue itself does not approve or mutate a trip.

## User entry and system selection rule

Opening `/trip-review` invokes `TripReviewController.showReviewQueue()` with no request parameters, path variables, search/filter fields, paging values or request DTO.

The controller creates `ModelAndView("with-menu/TripReviewList")`, invokes `TripReviewFetchService.fetchNotReviewedTrips()`, adds the returned list as model attribute `trips`, and renders the queue.

The service is `@Transactional(readOnly = true)` and calls `TripReviewHeaderViewJpaDao.findByReviewStatusOrderByTripStartedAtDesc("NOT_REVIEWED")`. Therefore the system, not the user, fixes the candidate condition to review status `NOT_REVIEWED` and sorts newest trip start first.

## Exact data read and business meaning

The repository reads immutable `TripReviewHeaderViewDo` from `public.vw_trip_review_header`, identified by `vehicle_trip_id`.

Each row maps:

- `vehicleTripId` — persistent trip identity used to open the review;
- `vehicleNumber` — vehicle assigned to the trip;
- `driverName` — trip driver;
- `tripStatus` — current operational trip state;
- `reviewStatus` — current review state;
- `tripStartedAt` — source ordering timestamp;
- `stopCount` — number of trip stops;
- `totalCylindersLoaded` — load quantity context.

The template displays Trip, Vehicle, Driver, Status, Review, Loaded, Stops and Action. `tripStartedAt` controls service ordering even though it is not displayed as a table column.

## User action and navigation

For every returned row, `Open Review` is a normal link to `/trip-review/{vehicleTripId}` using that exact row identity. The user therefore opens review for the selected persisted trip rather than submitting display text.

There is no queue-specific text search, select box, filter form, Apply/Reset action, paging link, AJAX request, debounce/minimum-length behavior, hidden-field propagation or dependent selector in this page.

## Empty and visible outcomes

If `trips` is null or empty, the table is suppressed and the page displays `No trips are pending review.` Otherwise, rows appear in the service-provided newest-first order.

The controller has no separate exception/redirect branch in this GET flow.

## Persistence and downstream impact

This endpoint is read-only and reads `public.vw_trip_review_header`; no database write is performed. Its business impact is navigational: it exposes only trips still awaiting review and passes the selected `vehicleTripId` to the related trip-review detail flow where review decisions can occur.

## Selector UX applicability

The queue has no large reference selector. The only row action uses an already-resolved persistent trip ID, so Customer/Product/Supplier/Vehicle/Driver/Address search conversion and dependent-selector rework are not applicable here.

## Review gate

The source proves the queue purpose, fixed eligibility predicate, sort order, exact database view/read identity, visible row fields, empty state and persistent-ID navigation. `STORY-0057` is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No code mutation or auto-approval occurred. Downstream testing fan-out remains blocked until explicit approval/reapproval plus a current post-approval Story/code conformance PASS.
