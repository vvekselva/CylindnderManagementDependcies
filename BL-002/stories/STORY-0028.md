# STORY-0028 — Open Customer Consumption Dashboard at Slash Alias

- Release: R2
- Endpoint: `GET /customer-consumption/`
- Controller: `CustomerConsumptionDashboardController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user opens `/customer-consumption/`. The class-level mapping is `/customer-consumption` and the same `dashboard` handler explicitly maps `GET {"", "/", "/dashboard"}`, so the trailing-slash URL enters exactly the same read-only screen flow proven for STORY-0027. Spring binds query parameters to `CustomerConsumptionSearchRequestDto`; defaults are page 1, 25 rows, `expectedNeedDate` ascending. The visible GET form contains `customerId`, `productId`, `expectedNeedDateFrom`, `expectedNeedDateTo`, and `itemsPerPage`, with hidden `pageNumber=1`, `sortField`, and `sortDirection`. It submits to `/customer-consumption/dashboard`; there is no page-local JavaScript/debounce/dependent typing API or button gating.

`CustomerConsumptionDashboardService.fetchDashboard` sanitizes paging/sort/date-range values, builds optional customer/product/projected-empty-date JPA predicates, and reads a pageable projection through `CustomerProductConsumptionProjectionViewJpaDao`. The immutable entity reads `public.vw_customer_product_consumption_projection` via Hibernate `@Subselect`; the path performs no database write. Rows are mapped to Customer, Product, Last Delivered Date, Current Cylinders, Consumption Days / Cylinder, Expected Need Date, and Previous Delivery. Summary cards show customer/product row count, active cylinders, FIRST_DELIVERY count, NEED_NOW count, and average positive consumption days/cylinder.

Column-sort links preserve filters, reset to page 1 and toggle direction; pager links preserve filter/sort state and disable Previous/Next when unavailable. An empty result shows exactly `No customer/product delivery rows available.` The handler places `requestDto` and `dashboardDto` in the model and returns `with-menu/CustomerConsumptionDashboard`. There is no controller-local error conversion or mutation branch. No approval occurred.
