# STORY-0065 — Reconciliation Command Center Details

- Release: R2
- Endpoint: `GET /reconciliation-command-center/details`
- Controller: `ReconciliationCommandCenterController.showTripDetails`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0065-local-source-business-behavior-20260902-1649.yaml`

Required `tripId` Long plus optional `accountingStatus` and `closureStatus` are passed to `ReconciliationCommandCenterService.fetchDashboard`. View `with-menu/ReconciliationCommandCenterDetails` receives `dashboard`, `selectedTripId`, `selectedAccountingStatus`, and `selectedClosureStatus`.

When `dashboard.getTripRows()` is non-null/nonempty, its first row is additionally exposed as `selectedTrip`; otherwise that model key is omitted. This is a read-only detail flow with no controller mutation or local error branch.

The recovered governed ZIP independently confirms the required trip identity, filter propagation, service delegation and selected-trip rendering rule. STORY-0065 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
