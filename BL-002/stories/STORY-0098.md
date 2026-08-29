# STORY-0098 — Product Category Search

- Release: R1
- Endpoint: `GET /search/product-category/{searchText}`
- Controller: `RestfulProductCategoryServices.getProductCategories`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
The exact visible/API input represented by this story is path variable `searchText`. Spring binds it through `@PathVariable String searchText`. The controller constructs `CylinderManagementApplicationRequestDto`, copies the path value with `setSearchTerm(searchText)`, and invokes `productCategorySearchService.searchWithText(requestDto, null)`.

## Response/error behavior
Success returns `ProductCategorySearchResponseDto`. `CylinderManagementApplicationException` is logged and converted to a new empty response DTO. The endpoint is read-only.

## UI applicability
No endpoint-specific minimum length, debounce, hidden field, dependent request, button guard, reset, or persistence mutation is established by the frozen controller contract. Those details are therefore not invented. Call-site screens may impose their own autocomplete behavior independently.

## Approval boundary
Strict contract is complete for the source-applicable behavior. Approval remains pending.
