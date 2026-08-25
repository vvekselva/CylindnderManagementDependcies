# STORY-0030 — Return customer consumption dashboard data as JSON

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `1b8d259c2de2ce7aaded367ddf01b4a18d58aff6790d6ab5e1b733844f26a3f5`

A caller requests `GET /customer-consumption/api/dashboard`. The request reaches `CustomerConsumptionDashboardController.dashboardData`, which invokes `CustomerConsumptionDashboardService.fetchDashboard`. The accepted trace proves filtered/paged and summary reads through `CustomerProductConsumptionProjectionViewJpaDao`, mapped from `public.vw_customer_product_consumption_projection` by `CustomerProductConsumptionProjectionViewDo` and `CustomerConsumptionProjectionMapper`, then returned as a JSON response body.

The accepted trace does not enumerate exact filter fields, normalization/defaulting or field-level invalid-value handling, so those details are not invented. Hibernate synchronization metadata is not treated as a direct endpoint final dependency because the proved query target is the projection view.

Postcondition: mapped customer consumption dashboard data is returned as JSON and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-consumption/api/dashboard`; `logs/runs/PRODUCTION-FIRE-20260824-023321.md`.

Approval is pending explicit user decision for the exact fingerprint above.
