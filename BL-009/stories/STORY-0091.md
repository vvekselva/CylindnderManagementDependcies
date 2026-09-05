# BL-009 / STORY-0091 — Customer Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0091.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /search/customer/{searchText}`
- Test data: `BL-009/test-data/STORY-0091.csv`
- Human-readable test data: `BL-009/test-data/STORY-0091.md`
- Executable mapping: `BL-004/generated-tests/STORY-0091/Story0091UnitTest.java`

## Scenarios

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0091-01 | Acme | SUCCESS | searchTerm preserved and same service response |
| TC-0091-02 | Acme | GOVERNED_EXCEPTION | non-null empty response DTO |

## Execution status

Generated and mapped only. **NOT_EXECUTED** in this fire; no PASS or coverage is inferred.
