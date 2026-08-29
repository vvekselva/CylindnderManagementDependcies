# STORY-0099 — Product Search

- Release: R1
- Endpoint: `GET /search/product/{searchText}`
- Controller: `RestfulProductServices.getProducts`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
Spring binds required path variable `searchText`. The controller creates `CylinderManagementApplicationRequestDto`, sets `searchTerm` to that exact path value, and delegates to `productSearchService.searchWithText(requestDto, null)`.

## Response/error behavior
Success returns `ProductSearchResponseDto`. `CylinderManagementApplicationException` is logged and returns a new empty `ProductSearchResponseDto`. This is read-only search; no persistence mutation is performed by the controller.

## UI applicability
The frozen endpoint does not itself define browser debounce/minimum-length, selected-ID propagation, button state, reset behavior, or a second API call. Such call-site behavior is not inferred without a specific source-proved caller.

## Approval boundary
Strict contract is complete for all applicable source-proved behavior. Approval remains pending.
