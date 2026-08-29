# STORY-0111 — Save Product

- Release: R1
- Endpoint: `POST /domainLookup/product/save`
- Controller: `DomainLookupController.saveProduct`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen and request contract
The operation is submitted from the Product tab of the Domain Lookup screen. The GET populates `products`, `productCategoryOptions`, and `productUomOptions` from `LookupDataCache`, proving the visible dependent category/UOM selections are cache-backed. The POST is a form submission; no typing-time endpoint or debounce behavior is source-proved for this save operation.

## Controller/service contract
`DomainLookupController.saveProduct` receives the Product form fields, including optional product identity and the submitted product/category/UOM and tax-value fields defined by the handler. FK values are posted as IDs; the controller documentation explicitly delegates entity resolution to the ingestion service/mapper. It constructs `ProductDto`, wraps it in `ProductIngestionRequestDto`, and calls `productIngestionService.processRequest` rather than issuing database SQL itself.

## State propagation and refresh
Create/update branching is based on the submitted product identity. After successful service processing the Product lookup cache is refreshed, so the subsequent Product-tab render reads the newly persisted state rather than stale cached data.

## Validation and visible outcome
The controller follows the Domain Lookup validation pattern: user-input `InvalidInputParameterException` with the expected request DTO returns the complete Domain Lookup view directly, preserving failed Product data and inline validation state. Success follows PRG back to the Product tab with an added/updated success flash; unexpected validation DTOs and other exceptions use the error-flash redirect path.

## Persistence boundary
The exact persisted domain identity is carried by the Product DTO/request into the application ingestion service, including submitted FK IDs; resolution and persistence occur downstream. No behavior beyond the frozen source is inferred.

## Approval boundary
The applicable strict field/UI contract is complete from the frozen Domain Lookup controller/read-cache architecture. Approval remains PENDING_USER_APPROVAL and was not automated.
