# STORY-0077 — Delivery Planning Stops GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/stops.geojson`
- Controller: `DeliveryPlanningApiController.planningStopsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This read-only JSON GET has no parameters. The controller returns `DeliveryPlanningStopService.stopsGeoJson()`. The service reuses the active-stop list ordered by stop name and emits one GeoJSON Point per stop at `[longitude, latitude]`.

Each feature exposes stopId, stopName, remarks, defaultRadiusMeters and fixed markerColor `#0f766e`. Metadata contains pointCount and source `CMAS_DELIVERY_PLANNING_STOPS`. There is no validation branch, form interaction, hidden field, debounce or database mutation. No approval occurred.
