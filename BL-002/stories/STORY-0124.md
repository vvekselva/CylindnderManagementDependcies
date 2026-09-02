# STORY-0124 — Reconciliation Dashboard

- Release: R2
- Endpoint: `GET /reconciliation-dashboard`
- Controller: `ReconciliationDashboardController.viewDashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0124-local-source-business-behavior-20260902-1658.yaml`

The GET creates `ReconciliationDashboardFetchRequestDto` containing a new `ReconciliationCheckpointDto` whose `checkpointDate` is `LocalDate.now()`, then invokes `ReconciliationDashboardService.processRequest(requestDto)`. From returned checkpoint DTOs it computes total count and null-safe counts whose status is MATCHED, VARIANCE or ESCALATED.

The view is `final-version-1/reconciliation_checkpoint_dashboard`. Exact model keys are `searchCriteria`, `dashboardData`, `checkpointLabels`, `totalCount`, `matchedCount`, `varianceCount`, and `escalatedCount`. This GET is a read dashboard; no controller mutation/reset is performed. The method declares `throws Exception` and contains no local error branch.

The recovered governed ZIP independently confirms the current-date request initialization, service delegation, status counts and rendered model. STORY-0124 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
