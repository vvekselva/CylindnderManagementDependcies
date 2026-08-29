# STORY-0065 — Reconciliation Command Center Details

- Release: R2
- Endpoint: `GET /reconciliation-command-center/details`
- Controller: `ReconciliationCommandCenterController.showTripDetails`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

Required `tripId` Long plus optional `accountingStatus` and `closureStatus` are passed to `ReconciliationCommandCenterService.fetchDashboard`. View `with-menu/ReconciliationCommandCenterDetails` receives `dashboard`, `selectedTripId`, `selectedAccountingStatus`, and `selectedClosureStatus`. If `dashboard.getTripRows()` is non-null/nonempty, its first row is additionally exposed as `selectedTrip`; otherwise that model key is omitted. This is a read-only detail flow with no controller mutation or local error branch. Approval remains pending.
