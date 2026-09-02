# STORY-0092 — Driver Search

- Release: R1
- Endpoint: `GET /search/driver/{searchText}`
- Controller: `RestfulDriverServices.getDrivers`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 92
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This read-only typeahead/search API accepts exact path variable `searchText`. `RestfulDriverServices.getDrivers` places that text in `CylinderManagementApplicationRequestDto.searchTerm`, builds paging with `PaginationUtils.createPageable`, and calls `DriverSearchService.searchWithText`.

`DriverSearchService` validates the request with `SearchRequestValidator`, then executes `DriverJpaDao.findByDriverNameContainingIgnoreCase(searchText, pageable)`. Matching `DriverDo` rows are mapped to `DriverDto`; the response carries driver list plus total items/current page/page size and SUCCESS when rows exist, FAILURE when the result list is empty. The REST handler converts a governed application exception to an empty `DriverSearchResponseDto`.

The persistent identity is `DriverDo` through `DriverJpaDao`; returned driver IDs are selectable reference identities for consuming screens. The search itself performs no driver mutation.

## Completion and approval gate

The canonical Story identity, request, validation/search/DAO path, paging/result behavior and read-only business effect are source-bound from the recovered ZIP. STORY-0092 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
