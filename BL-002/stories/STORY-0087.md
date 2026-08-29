# STORY-0087 — Address Type Search

- Release: R1
- Endpoint: `GET /search/addresstype/{searchText}`
- Controller: `RestfulAddressTypeServices.getAddressTypes`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
This is a read-only address-type lookup. The exact path variable is `searchText`. Canonical trace proves controller -> `AddressTypeSearchService.searchWithText` -> `SearchRequestValidator.validate` -> `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase` -> `AddressTypeDo` -> `public.tbl_address_type` -> mapper interface `ICylindermanagementApplicationDoToDtoMapper<AddressTypeDto, AddressTypeDo>.mapDoToDto` -> `AddressTypeSearchResponseDto`.

The service performs containing/ignore-case lookup. Successful results are returned as the address-type response DTO; service exception produces an empty response DTO. This endpoint performs no persistence mutation and does not itself prove a particular screen's debounce/minimum-length behavior, so none is invented here.

## UI relationship
Address Type is also managed through the Lookup Management page, whose visible save path normalizes the submitted address type with trim + uppercase, delegates to `AddressTypeIngestionService`, refreshes the in-memory address-type cache, and renders inline validation failures without redirect. That management behavior is contextual evidence only and is not misrepresented as behavior of this GET search endpoint.

## Approval boundary
Strict applicable contract is source-proved. Approval remains pending; no auto-approval or testing-readiness promotion is made.
