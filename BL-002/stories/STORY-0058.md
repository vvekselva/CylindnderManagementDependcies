# STORY-0058 — Individual Trip Review Dashboard

- Release: R1
- Endpoint: `GET /trip-review/{vehicleTripId}`
- Controller: `TripReviewController.showTripReview`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Entry and exact request contract
The user enters this screen from the Trip Review Queue by selecting `Open Review`, whose href is built from the queue row's exact vehicleTripId. The endpoint is `GET /trip-review/{vehicleTripId}` and the controller binds required path variable `vehicleTripId` as `Long`.

`showTripReview` calls `TripReviewFetchService.fetchTripReview(vehicleTripId)`, creates `ModelAndView("with-menu/TripReviewDashboard")`, adds the returned DTO as model attribute `dashboard`, and returns the view. A missing/non-convertible path variable cannot match/bind this controller contract; no controller-local recovery branch is declared. When the ID binds but the header is absent, the service throws `IllegalArgumentException("Trip not found for review: " + vehicleTripId)`.

## Header/read identity and dashboard composition
The service reads the immutable trip header from `TripReviewHeaderViewJpaDao.findByVehicleTripId(vehicleTripId)` against `public.vw_trip_review_header`, whose identity is `vehicle_trip_id`. It maps vehicleTripId, vehicleLoadId, vehicleNumber, driverName, tripStatus, reviewStatus and trip timestamps into the dashboard DTO.

It then reads stop rows, initial yard-loaded cylinders, customer empty pickups, supplier refill collections, customer deliveries, supplier drop-offs, explicit returned-to-yard cylinders, challan photos, party-custody synchronization rows and active load/logistics accountability rows through the frozen direct-detail DAO/projection paths. Returned-to-yard rows already represented as unloaded are removed. Movement rows are grouped by product, counts/serial CSVs are calculated for each stop, and challan photos are grouped by stop.

Optional movement/photo/custody projection DataAccessExceptions are converted to empty optional data sets so the whole review page remains usable. Offline map DataAccessException is converted to `tripReviewMap = null`.

## Exact visible header/KPIs/sections
The page binds `th:object="${dashboard}"` and shows success/error flash messages when present. Header pills show vehicle number, driver name, trip status and review status. KPIs show total loaded from yard, unloaded/received at stops, brought back to yard and stop count.

The frozen template renders: initial-load serial-wise summary; stop-wise review; loaded-from-yard product groups; unloaded/received-at-stops product groups; finally-brought-to-yard product groups; custody/logistics sync check; trip-review offline map; and Complete Review.

Empty-state messages are explicit for missing loaded/unloaded/returned groups, missing custody rows and missing offline map data. Stop rows include sequence/type/name/challan/status and picked-up/loaded, dropped-off/delivered and brought-back counts plus serial lists.

## Challan photo navigation
When a stop has challan photos, each photo link is built as `/challan-page-photo/{challanPagePhotoId}` and opens in a new browser tab (`target="_blank"`). The visible label combines book type, book code and sheet number and also shows the original filename when available. If none exist, the cell says `No photo uploaded`.

## Review eligibility / button state
The service first permits review only when reviewStatus is `NOT_REVIEWED` and either: (a) the trip is terminal, or status is HALTED/HALT/CLOSED/COMPLETED; or (b) stopCount is > 0 and equals completedStopCount. Otherwise `reviewAllowed=false` with block reason `Review is allowed only when the trip is halted/terminal, or all planned stops are completed.`

Even when that condition passes, any custody/logistics sync mismatch count > 0 changes `reviewAllowed` back to false and sets the mismatch block reason. The template displays the block reason and disables the `Close Review` submit button whenever `!reviewAllowed`.

## Close-review control exposed by this GET
The page contains a separate normal POST form to `/trip-review/{vehicleTripId}/close-review`. It has optional textarea `reviewRemarks` with placeholder `Review remarks / variance notes` and submit button `Close Review`. No story-specific AJAX/debounce/min-length/hidden-ID mechanism is used; vehicleTripId is propagated in the form action URL.

## Offline map behavior
When tripReviewMap is null, the page states that offline map data is unavailable. When present, it exposes `tripReviewOfflineMap`, plottable/missing-location counts and yard/stop location information. On DOMContentLoaded the page reads the server-rendered dashboard map object and, when `window.CmasOfflineVectorMap` and map data exist, invokes `renderTripReviewMap('tripReviewOfflineMap', tripReviewMap, window.CMAS_CONTEXT_PATH)`. This is rendering behavior, not a database mutation.

## Persistence effect
This GET is read-only at the proved controller/service boundary. It assembles the review dashboard from view/base-table projection reads and offline-map reads; it does not close the review or persist review remarks.

## Governed conclusion
The frozen controller, service and dashboard template resolve the path-variable, model, section/control, challan-photo URL, close-button predicate, map event, empty-state and navigation gaps applicable to this GET. STORY-0058 is `STRICT_FIELD_UI_COMPLETE`. Approval remains `PENDING_USER_APPROVAL`.
