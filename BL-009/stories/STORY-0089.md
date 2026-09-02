# BL-009 / STORY-0089 — City Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0089.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0089.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `GET /search/city/{searchText}` controller contract and source-bound search handoff.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0089-01 | Search text `Coimbatore` | Exact input is copied to request `searchTerm`; service response is returned unchanged. |
| TC-0089-02 | Governed application exception | REST handler returns a non-null empty `CitySearchResponseDto`. |
| TC-0089-03 | Successful search service path | `CityJpaDao.findByCityNameContainingIgnoreCase(searchTerm)` supplies DTO results; Story remains read-only. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
