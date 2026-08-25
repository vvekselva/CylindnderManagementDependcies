# STORY-0028 — Display customer consumption dashboard via trailing-slash mapping

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `af8aeb62ca47f17ac42af9bf3920456b2cbe1171cccc1293a599f90e5ea5cf2c`

A caller requests `GET /customer-consumption/`. This distinct caller-visible mapping reaches the same `CustomerConsumptionDashboardController.dashboard` handler as the non-trailing-slash route. The accepted trace proves `CustomerConsumptionDashboardService.fetchDashboard -> CustomerProductConsumptionProjectionViewJpaDao -> CustomerProductConsumptionProjectionViewDo -> public.vw_customer_product_consumption_projection -> CustomerConsumptionProjectionMapper`, followed by `with-menu/CustomerConsumptionDashboard`.

The accepted trace does not enumerate exact filter fields, normalization/defaulting or invalid-value handling, so those details are not invented.

Postcondition: the dashboard view is returned with source-proved data and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-consumption/`; `logs/runs/PRODUCTION-FIRE-20260824-023321.md`.

Approval is pending explicit user decision for the exact fingerprint above.
