# STORY-0054 — Customer Demand Dashboard

- Release: R1
- Endpoint: `GET /customer-demands`
- Controller: `CustomerDemandController.showDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User intent and entry
Opening `/customer-demands` renders `final-version-1/CustomerDemandDashboard` for viewing/filtering/paging customer-demand rows and daily metrics. The same page also renders the create-demand form.

## Exact GET contract
`showDashboard` accepts optional String query parameters `status`, `requestType`, `productName`, `searchTerm`; optional int `page` defaults to 0; optional int `size` defaults to 50. Paging is normalized to page >= 0 and size 10..200, then `PageRequest.of(safePage, safeSize)` is used.

The controller maps `status` to DTO `requestStatus`, and maps `requestType`, `productName`, and `searchTerm` directly to their DTO fields. The service trims string filters and converts null/blank strings to null.

## Visible filter controls and browser behavior
The Thymeleaf GET form targets `/customer-demands` and contains: `status` select (blank/PENDING/DELIVERED/CANCELLED), `requestType` select (blank/SAME_DAY/PLANNED), text input `productName`, text input `searchTerm`, and `Apply` submit.

The frozen template has no script block. Therefore no AJAX typing search, debounce, minimum-length rule, hidden ID propagation, dependent filter API, or change-handler behavior is source-proved. Filtering happens on normal GET form submission. No explicit reset control or parent-selection invalidation is present.

## Read/filter path
`CustomerDemandService.fetchPage` calls `CustomerDemandDashboardViewJpaDao.search` on immutable `CustomerDemandDashboardViewDo`, mapped to `public.vw_customer_demand_dashboard`.

The native query proves: case-insensitive exact match for status and requestType; case-insensitive contains match for productName; case-insensitive contains match for searchTerm against customer_name OR request_number; ordering by created_at DESC then customer_demand_id DESC. View identity is customer_demand_id.

## Pagination
The model exposes `pageNumber`, `pageSize`, `totalPages`, `totalElements`, `hasPrevious`, `hasNext`, `previousPage`, `nextPage`. Previous is rendered only when `hasPrevious`; Next only when `hasNext`. Page links retain size/status/requestType/productName/searchTerm.

## Metrics/reference reads
`fetchMetrics()` reads `public.tbl_customer_order_request` for today's request count/cylinder sum, today's delivered count/cylinder sum, and average non-null delivery duration. Null numeric values become zero. Product metrics are read through `CustomerDemandDailyProductMetricsViewJpaDao.findAll()`.

The controller also reads all customers, customer addresses, and products for the create form.

## Controls rendered by this GET
The visible POST create form is bound to `createRequest` and exposes: required `customerId` select; optional `customerAddressId` select; required `productId` select; required number `requestedCylinders` with min 1; optional date `requiredDeliveryDate`; required text `receivedBy`; optional textarea `remarks`; and `Save Request` submit. The template has no dependent customer-to-address JavaScript; these options are server-rendered lists.

## Exact view outcome
The GET returns `final-version-1/CustomerDemandDashboard` with: `metrics`, `requestPage`, `rows`, `createRequest`, `customers`, `customerAddresses`, `products`, `pageNumber`, `pageSize`, `totalPages`, `totalElements`, `hasPrevious`, `hasNext`, `previousPage`, `nextPage`, `selectedStatus`, `selectedRequestType`, `selectedProductName`, `searchTerm`.

Empty results display `No customer demands found.` The template can render success/error flash messages, while this GET method itself has no explicit exception/flash branch.

## Persistence effect and conclusion
This GET performs reads only at the proved service boundary; no database write is asserted. The previous source-detail gaps are resolved from frozen controller, DTO, service, DAO/view-entity and template source. STORY-0054 is `STRICT_FIELD_UI_COMPLETE` for its applicable GET/dashboard contract. Approval remains `PENDING_USER_APPROVAL`.
