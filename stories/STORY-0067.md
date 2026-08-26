# STORY-0067 — Trip review — Close review

**State:** NEEDS_CLARIFICATION  
**Release:** RELEASE_1  
**Endpoint:** `POST /trip-review/{vehicleTripId}/close-review`  
**Controller:** `TripReviewController.closeReview`

## Human-readable flow

A user closes the review for a selected vehicle trip. The request identifies the trip through `vehicleTripId`. The accepted BL-001 trace proves that the close-review controller flow reaches the vehicle-trip and vehicle-review-status persistence area and then redirects back to `/trip-review/{vehicleTripId}`.

## Source-proved persistence boundary

The accepted canonical trace proves dependency on `public.tbl_vehicle_trip` and `public.tbl_vehicle_review_status` for this flow. The exact entity fields and database columns changed during closure are not yet proved in this checkpoint.

## Field-level status

The endpoint path input `vehicleTripId` is proved. However, its exact Java datatype/validation, any additional request fields, the exact service/DAO/repository method names, entity-field mappings, database columns, allowed prior review statuses, resulting status, and invalid/not-found behavior are not completely proved from the frozen source evidence currently bound to this Story.

Because those details are required by the Release-1 field-level Story contract, this Story remains **NEEDS_CLARIFICATION**. No business meaning or database-column mapping has been invented.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-213728.md`
- Frozen source baseline `3ae6e61442132d94a307275b08dd65fcef228d89`

User approval is not requested until the missing field-level chain is source-proved.
