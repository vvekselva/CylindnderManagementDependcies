# STORY-0084 — Close Trip Review

- Release: R1
- Endpoint: `POST /trip-review/{vehicleTripId}/close-review`
- Controller: `TripReviewController.closeReview`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As a reviewer on a trip-review dashboard, I can enter optional review remarks and close the review only when the dashboard says review is allowed. The selected trip identity comes from the dashboard's `vehicleTripId` path. The controller sends that trip ID and remarks to `TripReviewUpdateService`; it then redirects back to the same trip review with either a success or error flash message.

## Exact screen/browser contract

The `Complete Review` card displays `dashboard.reviewBlockReason` when `!dashboard.reviewAllowed`. Its form action is `/trip-review/{dashboard.vehicleTripId}/close-review`, method POST. The only explicit form field is textarea `name="reviewRemarks"`, placeholder `Review remarks / variance notes`. `Close Review` is `th:disabled="*{!reviewAllowed}"`; therefore browser submission is enabled only when `reviewAllowed` is true. No debounce/minimum-length rule or client-side validation is present for remarks.

## Controller/service contract

Path variable `vehicleTripId: Long` is required. Request parameter `reviewRemarks: String` is optional. Controller calls `tripReviewUpdateService.closeReview(vehicleTripId, reviewRemarks)`.

## Branch / response / visible outcome

- Success: flash `successMessage = "Trip review closed successfully."`.
- Any `RuntimeException`: controller logs the failure and flashes `errorMessage = ex.getMessage()`.
- Both branches redirect to `/trip-review/<vehicleTripId>`.
- The GET dashboard renders `successMessage` and `errorMessage` in visible message blocks.

The UI guard is `reviewAllowed`; the controller shown here does not independently re-check that boolean, so no duplicate server predicate is invented. Any deeper guard inside `TripReviewUpdateService.closeReview` is outside the inspected controller/template evidence.

## Persistence boundary

Mutation boundary is `TripReviewUpdateService.closeReview(vehicleTripId, reviewRemarks)`. Exact persisted identity is the selected `vehicleTripId`; optional remarks are propagated unchanged by the controller. No unproved table/entity mapping is invented.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/TripReviewController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/TripReviewDashboard.html` (`Complete Review` form and `reviewAllowed` guard).

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
