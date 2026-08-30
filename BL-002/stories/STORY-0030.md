# STORY-0030 — Read Customer Consumption Dashboard API

- Release: R2
- Endpoint: `GET /customer-consumption/api/dashboard`
- Controller: `CustomerConsumptionDashboardController.dashboardData`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

A caller sends GET `/customer-consumption/api/dashboard`. Spring binds the same optional query values into `CustomerConsumptionSearchRequestDto`: `customerId`, `productId`, `projectionStatus`, `forecastConfidence`, `pageNumber`, `itemsPerPage`, `sortField`, `sortDirection`, `expectedNeedDateFrom`, and `expectedNeedDateTo`. The DTO defaults page 1, 25 rows, sort `expectedNeedDate`, direction `asc`. The controller method is `@ResponseBody`; it does not render a template and returns the `CustomerConsumptionDashboardDto` produced by `CustomerConsumptionDashboardService.fetchDashboard(requestDto)` directly.

The service normalizes page number to at least 1, items-per-page to 25 when missing/invalid and at most 100, swaps reversed expected-need dates, defaults blank sort to `expectedNeedDate`, and normalizes direction to asc unless explicitly desc. Effective filters are customer equality, product equality, `projectedEmptyAt >= expectedNeedDateFrom 00:00`, and `projectedEmptyAt < (expectedNeedDateTo + 1 day) 00:00`. Although `projectionStatus` and `forecastConfidence` exist on the request DTO, this frozen service method does not add predicates for them; they therefore do not change this query result.

The DAO is `CustomerProductConsumptionProjectionViewJpaDao`, using JPA Specification/paging. The immutable projection entity reads `public.vw_customer_product_consumption_projection` by Hibernate `@Subselect` and declares synchronization with `tbl_cylinder_party_custody`, `tbl_cylinder`, `tbl_product`, and `tbl_customer`. No persistence write occurs. Result rows are mapped through `CustomerConsumptionProjectionMapper`; null/blank display strings and null timestamps become `-`, null current cylinder count becomes 0, and projected/customer/product consumption fields are copied from the projection view.

The returned dashboard DTO is populated with repository-derived summary, the mapped customer-product projection page, an empty cylinder-projection list, current page number, items per page, total elements, total pages, previous-page flag and next-page flag. Summary values are total projection count, sum of active holdings, count where projection status is `FIRST_DELIVERY`, count where projection status is `NEED_NOW`, and the rounded average of positive non-null `avgConsumptionDaysPerCylinder`. There is no controller-local catch/error transformation and no mutation branch. No approval occurred.
