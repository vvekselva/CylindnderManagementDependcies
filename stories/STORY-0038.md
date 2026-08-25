# STORY-0038 — View trips waiting for review

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `ef94b8a0e77a2f3f330f361d37634fb4b47ae55c316cbc26b83159a17633e0f6`  
**Matrix row:** `GET /trip-review`

`TripReviewController.showReviewQueue` invokes `TripReviewFetchService.fetchNotReviewedTrips`, which reads `TripReviewHeaderViewDo` through `TripReviewHeaderViewJpaDao` from `public.vw_trip_review_header`. The controller renders `with-menu/TripReviewList`. No request validation or write side effect is asserted by the accepted trace.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the proved review-header view is read and `TripReviewList` is rendered.

Pending explicit user approval for the exact fingerprint above.
