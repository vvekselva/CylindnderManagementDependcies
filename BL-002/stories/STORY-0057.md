# STORY-0057 — Trip Review Queue

- Release: R1
- Endpoint: `GET /trip-review`
- Controller: `TripReviewController.showReviewQueue`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`TripReviewController.showReviewQueue` invokes `TripReviewFetchService.fetchNotReviewedTrips`. The service reads the review queue through `TripReviewHeaderViewJpaDao` / `TripReviewHeaderViewDo` from `public.vw_trip_review_header`, then renders `with-menu/TripReviewList`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Exact frozen controller/template source was not materialized in this invocation. Remaining proof includes exact queue filters/query parameters, pagination/sort defaults, row identifiers and links, visible status fields, empty/error behavior, and exact navigation event from a queue row into an individual trip review.

No missing behavior is inferred.
