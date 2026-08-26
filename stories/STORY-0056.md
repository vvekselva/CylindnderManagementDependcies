# STORY-0056 — View ownership dashboard

State: **NEEDS_CLARIFICATION**  
Endpoint: `GET /ownership-dashboard`  
Controller: `OwnershipDashboardController.showOwnershipDashboard`

The accepted frozen-source trace proves that the controller uses `OwnershipDashboardFetchService` and reads `public.vw_ownership_summary_by_location`, `public.vw_ownership_current_cylinder_location`, and `public.vw_party_cylinder_dashboard_ownership`. The request renders the premium ownership dashboard and no database write is proved.

The accepted trace does not preserve every dashboard field/component's exact mapping to a model/view field and database view column. Those field-level mappings remain **NEEDS_CLARIFICATION** rather than being invented.

Evidence: `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.
