# BL-009 / STORY-0088 — Challan Type Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0088.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /search/challantype/{searchText}`
- Test data: `BL-009/test-data/STORY-0088.csv`
- Human-readable test data: `BL-009/test-data/STORY-0088.md`
- Executable mapping: `BL-004/generated-tests/STORY-0088/Story0088UnitTest.java`

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0088-01 | DELIVERY | SUCCESS | searchTerm preserved and same service response |
| TC-0088-02 | DELIVERY | GOVERNED_EXCEPTION | non-null empty response DTO |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
