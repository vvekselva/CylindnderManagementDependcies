# STORY-0121 — Save Delivery Planning Stop

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/save`
- Controller: `DeliveryPlanningStopManagementController.saveStop`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0121-local-source-business-behavior-20260902-1656.yaml`

Exact parameters are optional `stopId`, required `stopName`, required `latitude`, required `longitude`, optional `defaultRadiusMeters`, and optional `remarks`. Server guards reject blank stop name, latitude outside -90..90, longitude outside -180..180, and radius <= 0. Missing radius defaults to 5000 meters. Validation failures flash their error and redirect back; when stopId exists the redirect preserves its edit context.

A null `stopId` calls `DeliveryPlanningStopService.add(...)` and flashes `Planning stop added successfully.`; a non-null ID calls `update(...)` and flashes `Planning stop updated successfully.`. Success redirects to `/delivery-planning/stops/manage` without edit ID.

The recovered governed ZIP independently confirms the exact controller parameters, validation/defaulting and add/update service branches. STORY-0121 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
