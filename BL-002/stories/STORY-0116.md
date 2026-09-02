# STORY-0116 — Delivery Planning Dashboard Alias

- Release: R2
- Endpoint: `GET /delivery-planning/dashboard`
- Controller: `DeliveryPlanningController.showDeliveryPlanningDashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0116-local-source-business-behavior-20260902-1652.yaml`

This route is an exact alias of STORY-0115 in the same `@GetMapping({"/delivery-planning", "/delivery-planning/dashboard"})`. It accepts optional `forecastWindow`, renders `with-menu/DeliveryPlanningDashboard`, reads signal matches, conditionally normalizes/filter-matches the forecast window, and always reads the signal-match KPI.

When filtering is active the normalized value is exposed as `selectedForecastWindow`; result rows are `signalMatches` and KPI data is `signalMatchKpi`. There is no mutation or explicit error branch in this handler.

The recovered governed ZIP independently confirms the exact alias and shared handler/read behavior. STORY-0116 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
