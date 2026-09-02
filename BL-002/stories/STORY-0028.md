# STORY-0028 — Open Customer Consumption Dashboard at Slash Alias

- Release: R2
- Endpoint: `GET /customer-consumption/`
- Controller: `CustomerConsumptionDashboardController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0028-local-source-business-behavior-20260902-1644.yaml`

The trailing-slash route enters exactly the same `dashboard` handler as the root and `/dashboard` aliases under `/customer-consumption`. Spring binds the same dashboard search DTO, the controller delegates to `CustomerConsumptionDashboardService.fetchDashboard`, and the same Thymeleaf dashboard is rendered.

The visible filter, sorting and pagination contracts are the same as STORY-0027. Service-side normalization, optional customer/product/expected-need-date predicates, paging, sort mapping, summary reads and projection mapping are identical. The immutable data source remains `public.vw_customer_product_consumption_projection`; no persistence mutation occurs.

The recovered governed ZIP independently confirms the explicit slash alias in `@GetMapping({"", "/", "/dashboard"})` and the shared handler/service path. STORY-0028 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
