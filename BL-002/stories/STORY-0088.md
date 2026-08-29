# STORY-0088 — Challan Type Search

- Release: R1
- Endpoint: `GET /search/challantype/{searchText}`
- Controller: `RestfulChallanTypeServices.getChallanTypes`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
This read-only lookup accepts exact path variable `searchText`. Canonical trace proves `RestfulChallanTypeServices.getChallanTypes` -> `ChallanTypeSearchService.searchWithText` -> `SearchRequestValidator.validate` -> `ChallanTypeJpaDao.findByChallanTypeContainingIgnoreCase` -> `ChallanTypeDo` -> `public.tbl_challan_type` -> mapper interface `ICylindermanagementApplicationDoToDtoMapper<ChallanTypeDto, ChallanTypeDo>.mapDoToDto` -> `ChallanTypeSearchResponseDto`.

Successful lookup returns the response DTO; service exception returns an empty DTO. The endpoint is read-only. No source-proved screen-specific typing event, minimum length, debounce or hidden-field propagation is attached to this endpoint in the frozen evidence, so those details are intentionally not invented.

## Approval boundary
Applicable source contract is strict-complete. Approval remains `PENDING_USER_APPROVAL`; testing/use-case readiness is unchanged.
