# STORY-0125 — Search Reconciliation Dashboard

- Release: R2
- Endpoint: `POST /reconciliation-dashboard/search`
- Controller: `ReconciliationDashboardController.searchDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The POST binds `@ModelAttribute("searchCriteria") ReconciliationDashboardFetchRequestDto`. If its `reconciliationCheckpointDto` is null, the controller creates one before processing. It invokes `ReconciliationDashboardService.processRequest(requestDto)`, then null-safely computes total, MATCHED, VARIANCE and ESCALATED counts from returned checkpoint DTOs.

It returns the same `final-version-1/reconciliation_checkpoint_dashboard` view and exposes exact model keys `searchCriteria`, `dashboardData`, `checkpointLabels`, `totalCount`, `matchedCount`, `varianceCount`, and `escalatedCount`. The handler declares `throws Exception` and has no local catch branch. It is a search/read workflow; no persistence mutation is claimed. No approval occurred.
