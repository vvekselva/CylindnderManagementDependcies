# STORY-0089 — City Search

- Release: R1
- Endpoint: `GET /search/city/{searchText}`
- Controller: `RestfulCityServices.getCities`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
Exact input is path variable `searchText`. Canonical trace proves `RestfulCityServices.getCities` -> `CitySearchService.searchWithText` -> `SearchRequestValidator.validate` -> `CityJpaDao.findByCityNameContainingIgnoreCase` -> `CityDo` -> `public.tbl_city` -> `ICylindermanagementApplicationDoToDtoMapper<CityDto, CityDo>.mapDoToDto` -> `CitySearchResponseDto`. Successful results are returned in the response DTO; service exception returns an empty response DTO. The endpoint is read-only.

No frozen evidence attaches a particular browser event, debounce/minimum-length rule, selected hidden field, or dependent call to this standalone endpoint, so those details are not invented.

## Related management behavior
The Lookup Management City form uses `cityId` optional, required `cityName`, required `description`; controller trims `cityName`, delegates `CityIngestionRequestDto` to `cityIngestionService`, refreshes city cache, redirects with add/update success, or returns inline validation DTO on user-input validation error. This is contextual management behavior, not a mutation performed by the GET search endpoint.

## Approval boundary
Applicable strict contract is complete. Approval remains pending and testing readiness remains unchanged.
