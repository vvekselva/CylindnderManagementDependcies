# STORY-0029 — Display customer consumption dashboard via dashboard mapping

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `8369674424acd257c82a9fb0ef54da08e15d1eb78de471c6d1d46bf4597f2e39`

A caller requests `GET /customer-consumption/dashboard`. The request reaches `CustomerConsumptionDashboardController.dashboard`, which invokes `CustomerConsumptionDashboardService.fetchDashboard`. The accepted trace proves the projection read through `CustomerProductConsumptionProjectionViewJpaDao -> CustomerProductConsumptionProjectionViewDo -> public.vw_customer_product_consumption_projection`, followed by `CustomerConsumptionProjectionMapper` and the terminal view `with-menu/CustomerConsumptionDashboard`.

The accepted trace does not enumerate exact filter fields, normalization/defaulting or field-level invalid-value handling, so those details are not invented.

Postcondition: the dashboard view is returned with source-proved mapped data and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-consumption/dashboard`; `logs/runs/PRODUCTION-FIRE-20260824-023321.md`.

Approval is pending explicit user decision for the exact fingerprint above.
