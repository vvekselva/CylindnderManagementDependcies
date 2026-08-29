# STORY-0109 — Save Product Category

- Release: R1
- Endpoint: `POST /domainLookup/productCategory/save`
- Controller: `DomainLookupController.saveProductCategory`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Exact submitted fields
The MVC handler accepts optional `productCategoryId` (`Long`), required form field `productCategory` (`String`), and optional `description` defaulting to an empty string. The category value is trimmed and upper-cased; description is trimmed. `isNew` is true when ID is null or zero.

## DTO/service path
The controller builds `ProductCategoryDto`, sets ID/category/description, wraps it in `ProductCategoryIngestionRequestDto`, and calls `productCategoryIngestionService.processRequest(req)`. On success it immediately invokes `lookupDataCache.refreshProductCategory()` so subsequent GET rendering uses refreshed data.

## Success and validation outcome
Success follows PRG: a flash message distinguishes added versus updated and redirects to `/domainLookup?tab=productCategory`. For `InvalidInputParameterException` representing user input, the controller's documented validation path returns a full `ModelAndView` directly so inline validation errors and the failed DTO remain visible instead of being lost by redirect. Unexpected errors use the generic error/redirect path.

## Screen/data consistency
The Domain Lookup GET serves product-category data from `LookupDataCache`; therefore targeted cache refresh is the source-proved invalidation step connecting successful persistence to the visible screen.

## Approval boundary
Strict field/UI contract is complete from frozen controller/page architecture. Approval remains pending; no auto-approval occurred.
