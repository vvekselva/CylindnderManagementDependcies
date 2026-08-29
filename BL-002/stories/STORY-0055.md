# STORY-0055 — Create Customer Demand

- Release: R1
- Endpoint: `POST /customer-demands`
- Controller: `CustomerDemandController.create`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

The canonical BL-001 model proves that `CustomerDemandController.create` invokes `CustomerDemandService.create`. The service validates/loads the selected customer through `CustomerJpaDao` (`public.tbl_customer`), product through `ProductJpaDao` (`public.tbl_product`), and customer address through `CustomerAddressJpaDao` (`public.tbl_customer_address`). The new demand is persisted by `CustomerDemandJpaDao.save` as `CustomerDemandDo` in `public.tbl_customer_order_request`. The successful terminal is `redirect:/customer-demands`.

## Strict field/UI enrichment gate

This story is not strict-field/UI complete. Exact frozen controller/template source needed to prove the screen contract was not materialized by the available source search in this invocation. Remaining proof includes exact posted field/form names and datatypes, requiredness/defaults, selected customer/product/address ID propagation, validation messages and reference-mismatch behavior, demand quantity/date/status semantics, duplicate rules if any, button enable/disable rules, and exact visible success/error behavior.

No missing behavior is inferred.
