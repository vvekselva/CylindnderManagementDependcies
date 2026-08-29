# STORY-0124 — Reconciliation Dashboard

- Release: R2
- Endpoint: `GET /reconciliation-dashboard`
- Controller: `ReconciliationDashboardController.viewDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The GET creates `ReconciliationDashboardFetchRequestDto` containing a new `ReconciliationCheckpointDto` whose `checkpointDate` is `LocalDate.now()`, then invokes `ReconciliationDashboardService.processRequest(requestDto)`. From returned checkpoint DTOs it computes total count and counts whose status is MATCHED, VARIANCE or ESCALATED, null-safely.

The view is `final-version-1/reconciliation_checkpoint_dashboard`. Exact model keys are `searchCriteria`, `dashboardData`, `checkpointLabels`, `totalCount`, `matchedCount`, `varianceCount`, and `escalatedCount`. This GET is a read dashboard; no controller mutation/reset is performed. The method declares `throws Exception` and contains no local error branch. Approval remains pending.
