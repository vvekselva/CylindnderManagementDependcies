# BL-009 / STORY-0099 — Product Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0099.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0099.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0099/Story0099TestDataDrivenTest.java`

## Test intent
Validate approved read-only `GET /search/product/{searchText}` request delegation, governed exception behavior, case-insensitive product lookup, and source-bound Customer Demand selector semantics.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0099-01 | `Oxygen` | Exact text copied to request and same service response returned. |
| TC-0099-02 | Governed application exception | Non-null empty response DTO. |
| TC-0099-03 | `oxygen` DAO search | Case-insensitive product lookup; no mutation. |
| TC-0099-04 | Customer Demand selector | 3-character threshold / 280 ms debounce and selected `productId` propagation remain caller behavior. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
