# STORY-0055 — View reconciliation command center trip details

State: **NEEDS_CLARIFICATION**  
Endpoint: `GET /reconciliation-command-center/details`  
Controller: `ReconciliationCommandCenterController.showTripDetails`

The accepted frozen-source trace proves that this detail request passes through `ReconciliationCommandCenterService` and reads reconciliation header, challan tracker, event, and status-audit data for the trip context. The request renders the reconciliation details view and no database write is proved.

The exact trip parameter name/type/default/validation behavior and the exact displayed field-to-model/database-column mappings are not preserved in the accepted trace. Those facts remain **NEEDS_CLARIFICATION**.

Evidence: `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.
