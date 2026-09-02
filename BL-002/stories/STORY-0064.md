# STORY-0064 — Reconciliation Command Center

- Release: R2
- Endpoint: `GET /reconciliation-command-center`
- Controller: `ReconciliationCommandCenterController.showCommandCenter`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0064-local-source-business-behavior-20260902-1648.yaml`

The GET accepts optional `accountingStatus`, optional `closureStatus`, and optional Long `tripId`. These exact values are passed to `ReconciliationCommandCenterService.fetchDashboard(accountingStatus, closureStatus, tripId)`.

The result is rendered in `with-menu/ReconciliationCommandCenter` as model `dashboard`; selected filter values are preserved as `selectedAccountingStatus`, `selectedClosureStatus`, and `tripId`. The controller performs no mutation and defines no local exception conversion branch.

The recovered governed ZIP independently confirms the controller, filter propagation, service delegation and read-only view rendering. STORY-0064 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
