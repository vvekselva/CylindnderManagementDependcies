# STORY-0009 — Remove Stop from Predefined Delivery Trip

- Release: R2
- Endpoint: `POST /delivery-planning/predefined-trips/remove-stop`
- Controller: `PredefinedDeliveryTripController.removeStop`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0009-local-source-business-behavior-20260902-1637.yaml`

Each assigned-stop row shows a `Remove` button in a POST form carrying hidden Long fields `tripId` (selected trip) and `assignmentId` (the persisted trip-stop assignment). There is no browser confirmation on this stop-removal form, no debounce and no asynchronous call.

The controller passes only `assignmentId` to `PredefinedDeliveryTripService.removeStop`. The service loads `PredefinedDeliveryTripStopDo` by assignment ID or throws `Trip stop assignment not found.` It sets `active=false`, saves the assignment, then resequences the remaining active assignments for that assignment's persisted `predefinedTripId`: active rows are read in current stopSequence order and rewritten sequentially starting at 1.

The controller adds flash `successMessage = Stop removed from predefined trip.` and redirects to `/delivery-planning/predefined-trips?tripId=<submitted tripId>`. There is no controller catch branch for this endpoint, so a service exception is not converted into a local flash error by this handler. The refreshed screen reads active assignments only, so the deactivated stop disappears and remaining sequence numbers reflect resequencing.

The recovered governed ZIP independently confirms the hidden identifiers, soft-deactivation, resequencing and redirect behavior. STORY-0009 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
