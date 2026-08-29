# STORY-0058 — Individual Trip Review Dashboard

- Release: R1
- Endpoint: `GET /trip-review/{vehicleTripId}`
- Controller: `TripReviewController.showTripReview`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`TripReviewController.showTripReview` invokes `TripReviewFetchService.fetchTripReview`. Canonical BL-001 proves branches for the trip header from `public.vw_trip_review_header`; stops and challan/photo identity from trip-stop/challan tables; cylinder movement/accountability from load, logistics, order, pickup, supplier and yard records plus `public.fn_trip_load_accountability`; custody synchronization through `public.tbl_cylinder_party_custody`; and trip map data through active yard locations and `public.vw_trip_review_customer_stop_location`. The terminal is `with-menu/TripReviewDashboard`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining exact proof includes `vehicleTripId` datatype and invalid/missing behavior, exact dashboard model attributes, per-section IDs/controls, photo URLs/actions, close-review button enable/disable logic, map interaction semantics, empty/error behavior, and all exact request IDs propagated by user actions.

No missing behavior is inferred.
