# STORY-0090 — Country Search

- Release: R1
- Endpoint: `GET /search/country/{searchText}`
- Controller: `RestfulCountryServices.getCountries`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
The exact request input is path variable `searchText`. Canonical trace proves controller -> `CountrySearchService.searchWithText` -> `SearchRequestValidator.validate` -> `CountryJpaDao.findByCountryNameContainingIgnoreCase` -> `CountryDo` -> `public.tbl_country` -> `ICylindermanagementApplicationDoToDtoMapper<CountryDto, CountryDo>.mapDoToDto` -> `CountrySearchResponsesDto`. Success returns matching country DTO data; service exception returns an empty response DTO. This endpoint performs no write.

No frozen source evidence binds this standalone lookup to a particular typing event, debounce threshold, hidden field, or selection-reset rule, so none is asserted.

## Related management behavior
Lookup Management's Country save accepts optional `countryId`, required `description` and `countryName`; description is trim+uppercase, country name is trimmed, then `CountryIngestionRequestDto` is processed and country cache refreshed. Success redirects to the Country tab; validation can return the page directly with failed DTO. This context does not alter the GET endpoint's read-only contract.

## Approval boundary
Strict applicable source contract is complete. Approval remains `PENDING_USER_APPROVAL`.
