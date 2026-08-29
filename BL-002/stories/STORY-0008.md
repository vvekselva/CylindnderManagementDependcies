# STORY-0008 — Add Stop to Predefined Delivery Trip

- Release: R2
- Endpoint: `POST /delivery-planning/predefined-trips/add-stop`
- Controller: `PredefinedDeliveryTripController.addStop`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

When a trip is selected, the screen carries hidden `tripId` and presents required select `stopId` populated from existing planning stops; the visible option text is `<stop name> — radius <defaultRadiusMeters> m`. Clicking `Add stop` submits a normal POST with exact Long request parameters `tripId` and `stopId`; there is no debounce or asynchronous call.

`PredefinedDeliveryTripService.addStop` requires an existing active predefined trip or throws `Predefined trip not found.` It requires an existing active planning stop or throws `Planning stop not found.` It rejects an already-active assignment for the same trip and stop with `This stop is already assigned to the trip.` On success it creates `PredefinedDeliveryTripStopDo` with `predefinedTripId=tripId`, `planningStopId=stopId`, `stopSequence = active assignment count + 1`, and `active=true`, then persists it through `PredefinedDeliveryTripStopJpaDao.save`.

The controller catches exceptions, rendering them later via flash `errorMessage`; success uses `Stop added to predefined trip.` In both cases it redirects to `/delivery-planning/predefined-trips?tripId=<tripId>`, where the selected-stop table is rebuilt from persisted active assignments and planning-stop identities. No approval occurred.
