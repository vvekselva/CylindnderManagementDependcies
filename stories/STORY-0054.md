# STORY-0054 — View reconciliation command center

State: **NEEDS_CLARIFICATION**  
Endpoint: `GET /reconciliation-command-center`  
Controller: `ReconciliationCommandCenterController.showCommandCenter`

The accepted frozen-source trace proves that the controller calls `ReconciliationCommandCenterService`, which reads reconciliation header and challan-tracker information. When trip context is supplied, event and status-audit branches are also read. The request terminates at the reconciliation command-center view, and no persistence write is proved.

The accepted evidence does not preserve the exact optional trip request contract or every displayed page field's mapping to a model/view field and database column. Those details remain **NEEDS_CLARIFICATION** rather than being inferred.

Evidence: `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.
