# STORY-0119 — Delivery Planning Stop Management

- Release: R2
- Endpoint: `GET /delivery-planning/stops/manage`
- Controller: `DeliveryPlanningStopManagementController.showStopManagementPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The handler maps both management URLs and accepts optional `editStopId` Long. It renders `with-menu/DeliveryPlanningStopManagement`, reads `DeliveryPlanningStopService.listWithCustomerCounts()` and `coverageKpis()`, and exposes them as `stops` and `coverageKpis`. It also exposes `editStopId` and constant default radius `5000` meters as `defaultRadiusMeters`.

This GET is read-only; optional `editStopId` selects edit context but causes no mutation. There is no explicit controller error branch, debounce, DTO ingestion or reset. Approval remains pending.
