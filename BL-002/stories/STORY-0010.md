# STORY-0010 — Remove Predefined Delivery Trip

- Release: R2
- Endpoint: `POST /delivery-planning/predefined-trips/remove`
- Controller: `PredefinedDeliveryTripController.remove`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0010-local-source-business-behavior-20260902-1638.yaml`

Each trip metric row contains a Remove POST form with hidden Long field `tripId`. Browser submission is guarded by `confirm('Remove this predefined trip?')`; cancelling the confirmation prevents the POST. There is no debounce or asynchronous API.

The controller calls `PredefinedDeliveryTripService.deactivate(tripId)`. The service loads `PredefinedDeliveryTripDo` by the exact persisted ID or throws `Predefined trip not found.` It performs a soft removal by setting `active=false` and saving the entity through `PredefinedDeliveryTripJpaDao.save`; it does not delete the row or automatically delete its stop assignments.

On successful return the controller sets flash `successMessage = Predefined trip removed.` and redirects to `/delivery-planning/predefined-trips`. There is no local controller catch branch for service failure. The refreshed page reads only active trips/metrics, so the deactivated trip no longer appears in the active comparison list.

The recovered governed ZIP independently confirms the browser confirmation, hidden identifier, soft-deactivation and redirect behavior. STORY-0010 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
