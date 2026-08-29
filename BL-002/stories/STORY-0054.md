# STORY-0054 — Customer Demand Dashboard

- Release: R1
- Endpoint: `GET /customer-demands`
- Controller: `CustomerDemandController.dashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable behavior proved by canonical BL-001

When the customer-demand dashboard is opened, `CustomerDemandController.dashboard` loads three source-proved groups of information.

1. Demand rows: `CustomerDemandService.fetchPage` reads through `CustomerDemandDashboardViewJpaDao` / `CustomerDemandDashboardViewDo` from `public.vw_customer_demand_dashboard`.
2. Demand metrics: `CustomerDemandService.fetchMetrics` reads demand records through `CustomerDemandJpaDao` / `CustomerDemandDo` from `public.tbl_customer_order_request` and daily product metrics through `CustomerDemandDailyProductMetricsViewJpaDao` / `CustomerDemandDailyProductMetricsViewDo` from `public.vw_customer_demand_daily_product_metrics`.
3. Reference lists: customer, customer-address and product reference data are sourced through `CustomerJpaDao`, `CustomerAddressJpaDao` and `ProductJpaDao`, backed by `public.tbl_customer`, `public.tbl_customer_address` and `public.tbl_product`.

The source-proved terminal is `final-version-1/CustomerDemandDashboard`.

## Strict field/UI enrichment gate

This story is NOT marked strict-field/UI complete. The canonical BL-001 matrix proves the backend/read/view chain, but the frozen application-source search available in this execution did not materialize the exact controller/template source needed to prove the full screen contract without invention.

Remaining exact evidence required:

- exact dashboard request/filter/query parameter names, datatypes, defaults and requiredness;
- exact visible controls and HTML element/input names or IDs;
- browser events used for filter/search/pagination actions;
- any dependent customer/address/product lookup request and exact selected ID propagation;
- exact pagination/sort semantics passed to `fetchPage`;
- exact model attribute names assembled for `CustomerDemandDashboard`;
- exact empty/error behavior and visible messages/button states;
- reset/invalidation behavior when a parent selection changes.

## Governed conclusion

`GET /customer-demands` is source-proved through the canonical BL-001 trace chain, but remains `SOURCE_DETAIL_REVIEW_REQUIRED` for the stricter screen/field/ID contract. No missing UI behavior is inferred.
