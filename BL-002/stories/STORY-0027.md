# STORY-0027 — Open Customer Consumption Dashboard at Root Route

- Release: R2
- Endpoint: `GET /customer-consumption`
- Controller: `CustomerConsumptionDashboardController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0027-local-source-business-behavior-20260902-1643.yaml`

The user opens `/customer-consumption`. `CustomerConsumptionDashboardController` is mapped at `/customer-consumption`, and its `dashboard` method accepts GET on the root, `/`, and `/dashboard`, so those aliases enter the same dashboard flow. Spring binds query values into `CustomerConsumptionSearchRequestDto`.

The visible Thymeleaf screen is `with-menu/CustomerConsumptionDashboard`. Its filter form is read-only and submits Customer Id, Product Id, Expected Need From/To and Rows; hidden values carry pageNumber, sortField and sortDirection. The template contains no page-local debounce or asynchronous write behavior.

`CustomerConsumptionDashboardService.fetchDashboard` sanitizes page/row limits, swaps reversed expected-need dates, normalizes sort direction and maps visible sort fields to the projection properties. Filtering is read-only through `CustomerProductConsumptionProjectionViewJpaDao` using optional customer/product equality and projected-empty date bounds. Paging is zero-based internally.

The immutable projection reads `public.vw_customer_product_consumption_projection`. Result rows are mapped to customer/product projection DTOs and the dashboard also reads summary counts/sums/averages. This path performs no persistence write.

The recovered governed ZIP independently confirms the aliases, request sanitization, specification filters, paging/sort mapping and projection-view read path. STORY-0027 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
