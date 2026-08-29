# STORY-0120 — Delivery Planning Stop Management Slash Alias

- Release: R2
- Endpoint: `GET /delivery-planning/stops/manage/`
- Controller: `DeliveryPlanningStopManagementController.showStopManagementPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This trailing-slash route is mapped to the same exact handler as STORY-0119. Optional `editStopId` is exposed unchanged, the page renders `with-menu/DeliveryPlanningStopManagement`, stop/customer-count data comes from `listWithCustomerCounts()`, coverage KPI data from `coverageKpis()`, and default radius is 5000 meters. It is read-only and has no explicit error/mutation branch. No approval occurred.
