# STORY-0121 — Save Delivery Planning Stop

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/save`
- Controller: `DeliveryPlanningStopManagementController.saveStop`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

Exact parameters are optional `stopId`, required `stopName`, required `latitude`, required `longitude`, optional `defaultRadiusMeters`, and optional `remarks`. Server guards reject blank stop name, latitude outside -90..90, longitude outside -180..180, and radius <= 0. Missing radius defaults to 5000 meters. Each validation failure flashes its exact error and redirects back; when stopId exists the redirect preserves `?editStopId=<id>`.

Mutation branch is exact: null `stopId` calls `DeliveryPlanningStopService.add(stopName.trim(), latitude, longitude, radius, remarks)` and flashes `Planning stop added successfully.`; non-null ID calls `update(...)` and flashes `Planning stop updated successfully.`. Success redirects to `/delivery-planning/stops/manage` without edit ID. No raw SQL or deeper table identity is invented. Approval remains pending.
