# STORY-0110 — Save Product UOM

- Release: R1
- Endpoint: `POST /domainLookup/productUom/save`
- Controller: `DomainLookupController.saveProductUom`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and visible contract
The operation belongs to the Product UOM tab of `GET /domainLookup?tab=productUom`. The GET view is `final-version-1/DomainLookup` and reads the Product UOM collection from `LookupDataCache.getProductUom()`. The save is a normal form POST; no source-proved typing-time search/debounce contract applies to this endpoint.

## Exact submitted fields and controller mapping
The handler accepts optional `productUomId` (`Long`), required `productUom` (`String`), and optional `description` defaulting to an empty string. It constructs `ProductUomDto`, preserves the submitted ID, trims and upper-cases `productUom`, and trims `description`. `isNew` is true only when the ID is null or zero.

## DTO/service/cache path
The controller wraps the DTO in `ProductUomIngestionRequestDto` and invokes `productUomIngestionService.processRequest(req)`. Successful processing is followed by targeted `lookupDataCache.refreshProductUom()`, invalidating the stale in-memory lookup before the next page render.

## Branch, error, and visible outcome
Success adds a flash message distinguishing added versus updated and redirects using PRG to `/domainLookup?tab=productUom`. A user-input `InvalidInputParameterException` carrying `ProductUomIngestionRequestDto` returns the full Domain Lookup `ModelAndView` directly with `activeTab=productUom`, `formOpen=true`, and `failedProductUomDto`, preserving inline validation state. An unexpected validation DTO type or any other exception follows the error-flash redirect path to the Product UOM tab.

## Persistence/read identity boundary
The exact source-proved write identity passed downstream is `ProductUomDto.productUomId`, `productUom`, and `description` inside `ProductUomIngestionRequestDto`; the controller does not perform raw SQL. The refreshed cache is the source-proved read path used by the visible Domain Lookup screen after success.

## Approval boundary
The applicable strict field/UI contract is complete from frozen authoritative controller and cache architecture. Approval remains pending; no auto-approval occurred.
