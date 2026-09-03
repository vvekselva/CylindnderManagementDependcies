# BL-009 / STORY-0092 — Driver Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0092.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0092.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0092/Story0092TestDataDrivenTest.java`

## Test intent
Validate approved read-only `GET /search/driver/{searchText}` behavior, pageable service handoff, governed exception response, and driver-name DAO search.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0092-01 | `Ravi` | Exact text copied to `searchTerm`; pageable delegation; same response returned. |
| TC-0092-02 | Governed application exception | Non-null empty `DriverSearchResponseDto`. |
| TC-0092-03 | `ravi` DAO search | Case-insensitive driver-name lookup; no mutation. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
