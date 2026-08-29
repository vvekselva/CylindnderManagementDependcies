# STORY-0115 — Delivery Planning Dashboard

- Release: R2
- Endpoint: `GET /delivery-planning`
- Controller: `DeliveryPlanningController.showDeliveryPlanningDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The exact frozen handler maps both `/delivery-planning` and `/delivery-planning/dashboard` to the same read-only dashboard method. For this story's `/delivery-planning` route, optional request parameter `forecastWindow` is accepted as String. The view is `with-menu/DeliveryPlanningDashboard`.

The controller reads `DeliveryPlanningDemandJpaDao.findSignalMatches()`. When `forecastWindow` is non-null and nonblank, it trims and upper-cases the value, filters rows whose `row.getForecastWindow()` equals the selected value case-insensitively, and exposes `selectedForecastWindow`. It always exposes `signalMatches` and also reads/exposes `signalMatchKpi` from `demandDao.findSignalMatchKpi()`.

This GET has no mutation, DTO ingestion, hidden-field propagation, debounce, reset or write path. Its exact persistence read boundary is the named JPA DAO methods above; no deeper table identity is invented without source proof. No explicit exception branch exists in the controller. Approval remains pending.
