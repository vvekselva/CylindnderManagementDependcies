# STORY-0007 — Create Predefined Delivery Trip

- Release: R2
- Endpoint: `POST /delivery-planning/predefined-trips/create`
- Controller: `PredefinedDeliveryTripController.create`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0007-local-source-business-behavior-20260902-1637.yaml`

On the Predefined Delivery Trips screen the user enters visible required input `tripName` (HTML maxlength 200) and optional `description` (maxlength 1000), then clicks `Create trip`. The form performs a normal POST; no debounce or asynchronous API is present. Controller parameters are exact request fields `tripName` (required String) and `description` (optional String).

`PredefinedDeliveryTripService.create(name, description)` rejects null/blank names with `Trip name is required.` It trims the name and rejects an existing active case-insensitive name with `An active predefined trip with this name already exists.` On success it creates `PredefinedDeliveryTripDo`, persists trimmed `tripName`, the supplied description, and `active=true` through `PredefinedDeliveryTripJpaDao.save`.

The controller catches any exception. Success adds flash `successMessage = Predefined trip created.` and redirects to `/delivery-planning/predefined-trips?tripId=<new id>`, causing the new trip to become the selected trip on the management screen. Failure adds the exception message as `errorMessage` and redirects to `/delivery-planning/predefined-trips`. The GET screen visibly renders these flash messages.

The recovered governed ZIP independently confirms the form, validations, active-name uniqueness check, persistence and redirect/flash behavior. STORY-0007 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
