# STORY-0100 — Product UOM Search

- Release: R1
- Endpoint: `GET /search/product-uom/{searchText}`
- Controller: `RestfulProductUomServices.getProductUoms`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
The endpoint receives path variable `searchText`. The controller creates `CylinderManagementApplicationRequestDto`, copies `searchText` to `searchTerm`, then calls `productUomSearchService.searchWithText(requestDto, null)`.

## Response/error behavior
Success returns `ProductUomSearchResponseDto`. A `CylinderManagementApplicationException` is logged and converted to a new empty response DTO. No write path is present.

## UI applicability
No endpoint-level debounce, minimum length, hidden field, selection guard, dependent API, or reset contract is proved here; these are caller concerns and are not invented.

## Approval boundary
Strict contract is complete for the applicable frozen-source behavior. Approval remains pending.
