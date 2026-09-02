# STORY-0006 — Predefined Delivery Trips Page

- Release: R2
- Endpoint: `GET /delivery-planning/predefined-trips`
- Controller: `PredefinedDeliveryTripController.page`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0006-local-source-business-behavior-20260902-1636.yaml`

The user opens the reusable Predefined Delivery Trips management screen. The GET accepts optional request parameter `tripId` as Long. The controller renders `with-menu/PredefinedDeliveryTrips`, populating `trips` from `service.trips()`, `metrics` from `service.metrics()`, `planningStops` from `stopService.list()`, `selectedTripId` from the request, and `selectedStops` as an empty list when tripId is null or `service.stopRows(tripId)` otherwise.

`trips()` reads active predefined trips ordered by trip name. `metrics()` reads active trip metrics. When a trip is selected, `stopRows()` reads active trip-stop assignments ordered by sequence, resolves each planning stop and exposes assignmentId, sequence, stopId, stopName, radius, latitude and longitude.

The screen shows a Create predefined trip form with required `tripName` (maxlength 200), optional `description` (maxlength 1000), and Create trip button. It displays trip metrics and Manage stops links that reload this GET with `tripId`. A Remove form carries hidden `tripId` and uses browser `confirm('Remove this predefined trip?')`. When `selectedTripId` exists, an Add stop form carries hidden `tripId` and required select `stopId`; assigned stops display a Remove form with hidden `tripId` and `assignmentId`. This GET itself performs no mutation, debounce or client-side asynchronous API call.

Visible empty states are `No predefined trips have been created.` and `No stops assigned.` Flash success/error messages from POST actions are rendered when present.

The recovered governed ZIP independently confirms the controller model, active-page forms, hidden identifiers, confirmation behavior and read-only GET role. STORY-0006 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
