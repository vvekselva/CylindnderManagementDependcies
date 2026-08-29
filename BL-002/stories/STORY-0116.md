# STORY-0116 — Delivery Planning Dashboard Alias

- Release: R2
- Endpoint: `GET /delivery-planning/dashboard`
- Controller: `DeliveryPlanningController.showDeliveryPlanningDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This route is an exact alias of STORY-0115 in the same `@GetMapping({"/delivery-planning", "/delivery-planning/dashboard"})`. It accepts optional `forecastWindow`, renders `with-menu/DeliveryPlanningDashboard`, reads `DeliveryPlanningDemandJpaDao.findSignalMatches()`, conditionally normalizes/filter-matches the forecast window, and always reads `findSignalMatchKpi()`.

When filtering is active the normalized value is exposed as `selectedForecastWindow`; result rows are `signalMatches` and KPI data is `signalMatchKpi`. There is no mutation or explicit error branch in this handler. No approval occurred.
