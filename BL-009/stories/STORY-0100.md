# BL-009 / STORY-0100 — Product UOM Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0100.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0100.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0100/Story0100TestDataDrivenTest.java`

## Test intent
Validate approved read-only `GET /search/product-uom/{searchText}` request delegation, governed exception behavior, and case-insensitive UOM lookup.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0100-01 | `KG` | Exact text copied to request and same service response returned. |
| TC-0100-02 | Governed application exception | Non-null empty response DTO. |
| TC-0100-03 | `kg` DAO search | Case-insensitive UOM lookup; no mutation. |

Execution remains blocked until the faithful Maven/JUnit runtime is available.
