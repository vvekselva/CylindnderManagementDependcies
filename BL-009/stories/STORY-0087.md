# BL-009 / STORY-0087 — Address Type Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0087.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0087.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `GET /search/addresstype/{searchText}` controller contract and its handoff to the source-bound search service.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0087-01 | Search text `HOME` | Controller copies `HOME` into `CylinderManagementApplicationRequestDto.searchTerm` and returns the service response. |
| TC-0087-02 | Search service raises governed application exception | REST handler returns a non-null empty `AddressTypeSearchResponseDto` rather than propagating the exception. |
| TC-0087-03 | Successful service search | Service path is validated and uses `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(searchTerm)`; no write is part of this Story. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
