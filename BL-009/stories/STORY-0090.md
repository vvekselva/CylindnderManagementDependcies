# BL-009 / STORY-0090 — Country Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0090.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0090.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `GET /search/country/{searchText}` controller contract and source-bound search handoff.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0090-01 | Search text `India` | Exact input is copied to request `searchTerm`; service response is returned unchanged. |
| TC-0090-02 | Governed application exception | REST handler returns a non-null empty `CountrySearchResponsesDto`. |
| TC-0090-03 | Successful search service path | `CountryJpaDao.findByCountryNameContainingIgnoreCase(searchTerm)` supplies DTO results; Story remains read-only. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
