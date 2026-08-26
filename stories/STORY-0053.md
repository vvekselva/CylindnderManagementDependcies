# STORY-0053 — View party cylinder custody traceability

State: **NEEDS_CLARIFICATION**  
Endpoint: `GET /party-custody-traceability`  
Controller: `PartyCustodyTraceabilityController.showTraceability`

When the party custody traceability dashboard is opened, the controller uses `OwnershipObligationDashboardService`. The accepted frozen-source trace proves reads through custody detail/summary paths backed by `public.tbl_cylinder_party_custody`, `public.tbl_cylinder`, `public.tbl_customer`, and `public.tbl_supplier`, and then renders `PartyCustodyTraceabilityDashboard`. No database write is proved for this request.

The exact mapping of each displayed dashboard field/component to its DTO/entity/view field and database column is not preserved in the accepted BL-001 trace. Those mappings are therefore not invented and remain **NEEDS_CLARIFICATION** before this Story can become ready for approval.

Evidence: `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.
