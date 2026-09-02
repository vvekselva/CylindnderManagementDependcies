# STORY-0030 — Read Customer Consumption Dashboard API

- Release: R2
- Endpoint: `GET /customer-consumption/api/dashboard`
- Controller: `CustomerConsumptionDashboardController.dashboardData`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0030-local-source-business-behavior-20260902-1646.yaml`

A caller sends GET `/customer-consumption/api/dashboard`. Spring binds the same optional query values into `CustomerConsumptionSearchRequestDto`. The controller method is `@ResponseBody`; it does not render a template and returns the `CustomerConsumptionDashboardDto` produced by `CustomerConsumptionDashboardService.fetchDashboard(requestDto)` directly.

The service normalizes page number/items-per-page, swaps reversed expected-need dates, normalizes sort field/direction, and applies customer/product/projected-empty-date predicates. Although `projectionStatus` and `forecastConfidence` exist on the request DTO, this frozen service method does not add predicates for them; they therefore do not change this query result.

The DAO is `CustomerProductConsumptionProjectionViewJpaDao`, using JPA Specification/paging against the immutable `public.vw_customer_product_consumption_projection` projection. Result rows are mapped into the dashboard DTO along with summary and page metadata. No persistence write occurs and there is no controller-local catch transformation.

The recovered governed ZIP independently confirms the API handler, request sanitization/filter behavior, non-effective legacy fields and read-only projection path. STORY-0030 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
