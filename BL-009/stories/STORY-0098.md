# BL-009 / STORY-0098 — Product Category Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0098.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0098.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0098/Story0098TestDataDrivenTest.java`

## Test intent
Validate approved read-only `GET /search/product-category/{searchText}` request delegation, governed exception behavior, and case-insensitive product-category lookup.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0098-01 | `Industrial` | Exact text copied to request and same service response returned. |
| TC-0098-02 | Governed application exception | Non-null empty response DTO. |
| TC-0098-03 | `industrial` DAO search | Case-insensitive category lookup; no mutation. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
