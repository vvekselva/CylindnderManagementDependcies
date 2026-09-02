# STORY-0090 — Country Search

- Release: R1
- Endpoint: `GET /search/country/{searchText}`
- Controller: `RestfulCountryServices.getCountries`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

The exact request input is path variable `searchText`. The recovered ZIP confirms `RestfulCountryServices` at `/search/country`, `CountrySearchService.searchWithText`, request validation, `CountryJpaDao.findByCountryNameContainingIgnoreCase`, `CountryDo` / `public.tbl_country`, DTO mapping and `CountrySearchResponsesDto`.

Successful lookup returns matching country DTOs; application-service failure returns an empty response DTO. This endpoint is read-only. Browser-specific typeahead timing, hidden-ID propagation and dependent clearing are documented only in the consuming forms that implement those interactions.

## Completion and approval gate

The request, search/DAO/table path, result/error behavior and read-only business effect are source-bound. STORY-0090 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
