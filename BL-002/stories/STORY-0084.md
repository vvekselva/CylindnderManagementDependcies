# STORY-0084 — Close Trip Review

- Release: R1
- Endpoint: `POST /trip-review/{vehicleTripId}/close-review`
- Controller: `TripReviewController.closeReview`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As a reviewer on a Trip Review dashboard, I can enter optional review remarks and close the selected trip review when the dashboard's `reviewAllowed` predicate enables the form. The trip identity is carried in the URL path; the only explicit form field is optional `reviewRemarks`.

The browser form posts to `/trip-review/{vehicleTripId}/close-review`; `Close Review` is disabled when `reviewAllowed` is false. The controller binds required `vehicleTripId: Long`, optional `reviewRemarks: String`, and calls `TripReviewUpdateService.closeReview(vehicleTripId, reviewRemarks)`.

The service is transactional. Blank/null remarks are normalized to `Trip review closed from Trip Review screen`; otherwise submitted remarks are trimmed. `VehicleTripReviewJpaDao.markTripReviewed(...)` executes a native update against `public.tbl_vehicle_trip`: it changes `fk_review_status` from the configured `NOT_REVIEWED` row in `public.tbl_vehicle_review_status` to the configured `REVIEWED` row and appends the review remarks to `audit_notes`. The update predicate includes the selected `pk_vehicle_trip_id` and current NOT_REVIEWED status, so an already-reviewed/nonexistent trip updates zero rows. Zero rows cause `IllegalStateException("Trip review was not closed. It may already be reviewed or may not exist.")`.

On success the controller flashes `Trip review closed successfully.`; any `RuntimeException` is logged and its message is flashed as `errorMessage`. Both branches redirect back to `/trip-review/{vehicleTripId}`, where the GET dashboard renders the message.

The browser-side `reviewAllowed` guard is not repeated by the controller itself. The service's server-side mutation guard is specifically current review status `NOT_REVIEWED`; it does not independently re-evaluate every dashboard terminal/stop/custody predicate before the update. That is current-source behavior, not an inferred stronger guarantee.

## Completion and approval gate

The recovered ZIP proves the exact browser predicate, request contract, normalization, transactional service, native database update, idempotency/current-state predicate and visible outcomes. STORY-0084 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
