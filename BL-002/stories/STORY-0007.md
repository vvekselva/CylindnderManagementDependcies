# STORY-0007 — Create Predefined Delivery Trip

- Release: R2
- Endpoint: `POST /delivery-planning/predefined-trips/create`
- Controller: `PredefinedDeliveryTripController.create`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

On the Predefined Delivery Trips screen the user enters visible required input `tripName` (HTML maxlength 200) and optional `description` (maxlength 1000), then clicks `Create trip`. The form performs a normal POST; no debounce or asynchronous API is present. Controller parameters are exact request fields `tripName` (required String) and `description` (optional String).

`PredefinedDeliveryTripService.create(name, description)` rejects null/blank names with `Trip name is required.` It trims the name and rejects an existing active case-insensitive name with `An active predefined trip with this name already exists.` On success it creates `PredefinedDeliveryTripDo`, persists trimmed `tripName`, the supplied description, and `active=true` through `PredefinedDeliveryTripJpaDao.save`.

The controller catches any exception. Success adds flash `successMessage = Predefined trip created.` and redirects to `/delivery-planning/predefined-trips?tripId=<new id>`, causing the new trip to become the selected trip on the management screen. Failure adds the exception message as `errorMessage` and redirects to `/delivery-planning/predefined-trips`. The GET screen visibly renders these flash messages. No approval occurred.
