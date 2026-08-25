# STORY-0027 — Display customer consumption dashboard

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `ba71ec7e0805612b5adf91c461594f93ec5dc7073d7acded71e783ade7311c50`

A caller requests `GET /customer-consumption`. The request reaches `CustomerConsumptionDashboardController.dashboard`, which invokes `CustomerConsumptionDashboardService.fetchDashboard`. The accepted trace proves filtered/paged and summary reads through `CustomerProductConsumptionProjectionViewJpaDao`, mapped by `CustomerProductConsumptionProjectionViewDo` from `public.vw_customer_product_consumption_projection`, then mapped by `CustomerConsumptionProjectionMapper` before returning `with-menu/CustomerConsumptionDashboard`.

The accepted trace does not enumerate the exact caller filter fields, normalization/defaulting or field-level invalid-value behavior, so those details are not invented. Hibernate `@Synchronize` table names are not treated as direct endpoint final dependencies because the proved query target is the projection view.

Postcondition: the dashboard view is returned with source-proved mapped data and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-consumption`; `logs/runs/PRODUCTION-FIRE-20260824-023321.md`.

Approval is pending explicit user decision for the exact fingerprint above.
