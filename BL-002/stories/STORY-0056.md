# STORY-0056 — Mark Customer Demand Delivered

- Release: R1
- Endpoint: `POST /customer-demands/{requestId}/mark-delivered`
- Controller: `CustomerDemandController.markDelivered`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

The canonical BL-001 model proves that the path variable identifies a customer demand. `CustomerDemandController.markDelivered` invokes `CustomerDemandService.markDelivered`, which reads and writes the demand through `CustomerDemandJpaDao.findById/save`, backed by `CustomerDemandDo` in `public.tbl_customer_order_request`. The successful terminal is `redirect:/customer-demands`.

## Strict field/UI enrichment gate

This story is not strict-field/UI complete. Exact application controller/template source was not materialized by the available frozen-source search in this invocation. Remaining proof includes exact `requestId` datatype and missing-ID behavior, the exact delivered status/value and delivered timestamp/other fields written, authorization or current-status guards, repeat/idempotent behavior, originating screen control/button state, confirmation behavior if any, and exact visible success/error message.

No missing behavior is inferred.
