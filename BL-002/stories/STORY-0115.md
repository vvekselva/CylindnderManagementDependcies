# STORY-0115 — Delivery Planning Dashboard

- Release: R2
- Endpoint: `GET /delivery-planning`
- Controller: `DeliveryPlanningController.showDeliveryPlanningDashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0115-local-source-business-behavior-20260902-1651.yaml`

The exact frozen handler maps both `/delivery-planning` and `/delivery-planning/dashboard` to the same read-only dashboard method. For this story's `/delivery-planning` route, optional request parameter `forecastWindow` is accepted as String. The view is `with-menu/DeliveryPlanningDashboard`.

The controller reads `DeliveryPlanningDemandJpaDao.findSignalMatches()`. When `forecastWindow` is non-null and nonblank, it trims and upper-cases the value, filters rows whose forecast window equals the selected value case-insensitively, and exposes `selectedForecastWindow`. It always exposes `signalMatches` and reads `signalMatchKpi` from `demandDao.findSignalMatchKpi()`.

This GET has no mutation or write path. The recovered governed ZIP independently confirms the handler alias, forecast filter and DAO reads. STORY-0115 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
