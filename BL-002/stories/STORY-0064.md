# STORY-0064 — Reconciliation Command Center

- Release: R2
- Endpoint: `GET /reconciliation-command-center`
- Controller: `ReconciliationCommandCenterController.showCommandCenter`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The GET accepts optional `accountingStatus`, optional `closureStatus`, and optional Long `tripId`. These exact filter values are passed to `ReconciliationCommandCenterService.fetchDashboard(accountingStatus, closureStatus, tripId)`. The result is rendered in `with-menu/ReconciliationCommandCenter` as `dashboard`; selected filter values are preserved as `selectedAccountingStatus`, `selectedClosureStatus`, and `tripId`.

This handler is read-only and contains no local validation/error branch, mutation, debounce or hidden-field transformation. No approval occurred.
