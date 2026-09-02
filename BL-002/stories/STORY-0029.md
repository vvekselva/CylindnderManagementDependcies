# STORY-0029 — Open Customer Consumption Dashboard

- Release: R2
- Endpoint: `GET /customer-consumption/dashboard`
- Controller: `CustomerConsumptionDashboardController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0029-local-source-business-behavior-20260902-1645.yaml`

This is the canonical URL emitted by the dashboard filter, sorting and pagination links. The controller class is mapped at `/customer-consumption` and the shared dashboard handler maps `/dashboard` together with the root aliases. Spring binds the query string to `CustomerConsumptionSearchRequestDto` and returns `with-menu/CustomerConsumptionDashboard` with `requestDto` and `dashboardDto`.

The visible filters are customerId, productId, expectedNeedDateFrom, expectedNeedDateTo and itemsPerPage, with hidden page/sort state. `CustomerConsumptionDashboardService.fetchDashboard` normalizes page/sort/date values, builds optional JPA predicates, reads the projection repository with paging and mapped sort properties, maps projection rows, and populates dashboard summary/page metadata.

The immutable data source is `public.vw_customer_product_consumption_projection`; this GET performs no persistence mutation. The recovered governed ZIP independently confirms the canonical route, shared handler/service behavior, projection read path and visible filter/sort/pagination contract.

STORY-0029 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
