# STORY-0029 — Open Customer Consumption Dashboard

- Release: R2
- Endpoint: `GET /customer-consumption/dashboard`
- Controller: `CustomerConsumptionDashboardController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user opens `/customer-consumption/dashboard`, the canonical URL emitted by the dashboard's filter, sorting and pagination links. The controller class is mapped at `/customer-consumption` and the `dashboard` handler explicitly maps `/dashboard` together with the root aliases. Spring binds the query string to `CustomerConsumptionSearchRequestDto`; its defaults are page 1, 25 rows, `expectedNeedDate` ascending.

The visible GET filter controls are `customerId` and `productId` numeric inputs with browser min 1, `expectedNeedDateFrom` and `expectedNeedDateTo` date inputs, and `itemsPerPage` numeric input with browser min 5/max 100. Hidden fields carry `pageNumber=1`, `sortField`, and `sortDirection`. Apply Filter submits to this endpoint. There is no page-local JavaScript, debounce, typing endpoint, dependent API call, or dynamic button enable/disable condition.

`CustomerConsumptionDashboardService.fetchDashboard` normalizes page/sort/date-range values, swaps From/To when reversed, caps rows at 100, and builds optional JPA predicates for customer, product and projected need date. It reads `CustomerProductConsumptionProjectionViewJpaDao` with paging and mapped sort properties. The immutable entity reads `public.vw_customer_product_consumption_projection` through Hibernate `@Subselect`; this path is read-only and performs no persistence mutation.

The rendered table columns are Customer, Product, Last Delivered Date, Current Cylinders, Consumption Days / Cylinder, Expected Need Date and Previous Delivery. Mapper identities are `activeHoldingCylinders -> currentCylinderCount`, `latestDeliveredAt -> lastDeliveredAt`, `avgConsumptionDaysPerCylinder -> consumptionDaysPerCylinder`, `projectedEmptyAt -> expectedNeedDate`, and `oldestDeliveredAt -> previousDeliveredAt`. Summary cards are repository-derived total rows, total active cylinders, FIRST_DELIVERY count, NEED_NOW count and average positive days/cylinder. Sort links preserve filters and reset page to 1; pagination preserves filters/sort and exposes disabled Previous/Next when no page exists. Empty rows display exactly `No customer/product delivery rows available.` The controller returns `with-menu/CustomerConsumptionDashboard` with `requestDto` and `dashboardDto`. No approval occurred.
