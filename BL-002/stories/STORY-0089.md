# STORY-0089 — City Search

- Release: R1
- Endpoint: `GET /search/city/{searchText}`
- Controller: `RestfulCityServices.getCities`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0089-approval-20260902.md`
- Fan-out: REQUESTED
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only lookup accepts exact path variable `searchText`. The recovered ZIP confirms `RestfulCityServices` at `/search/city`, `CitySearchService.searchWithText`, request validation, `CityJpaDao.findByCityNameContainingIgnoreCase`, `CityDo` / `public.tbl_city`, DTO mapping and `CitySearchResponseDto`.

The query is a case-insensitive contains lookup. Successful results are returned in the response DTO; service failure is converted to an empty response DTO. This endpoint performs no database write. Browser-specific debounce/minimum-length/hidden-ID behavior is documented only in the consuming screens that actually implement it, not invented as a property of this standalone API.

## Completion and approval gate

The request input, validation/search/DAO/table path, result/error behavior and read-only effect are source-bound. STORY-0089 is `APPROVED_AFTER_REWORK` by explicit user instruction dated 2026-09-02, and downstream testing/test-data fan-out is requested.

This approval applies to the documented Story contract. It does not independently authorize unrelated application-code mutation or scope expansion.
