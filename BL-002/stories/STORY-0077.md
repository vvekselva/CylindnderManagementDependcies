# STORY-0077 — Delivery Planning Stops GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/stops.geojson`
- Controller: `DeliveryPlanningApiController.planningStopsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0077-local-source-business-behavior-20260902-1654.yaml`

This read-only JSON GET has no parameters. The controller returns `DeliveryPlanningStopService.stopsGeoJson()`. The service reuses the active-stop list ordered by stop name and emits one GeoJSON Point per stop at `[longitude, latitude]`.

Each feature exposes stopId, stopName, remarks, defaultRadiusMeters and fixed markerColor `#0f766e`. Metadata contains pointCount and source `CMAS_DELIVERY_PLANNING_STOPS`. There is no validation branch, form interaction, hidden field, debounce or database mutation.

The recovered governed ZIP independently confirms the active-stop source, feature mapping and metadata. STORY-0077 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
