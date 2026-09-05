# BL-009 / STORY-0093 — Driver by ID Test Catalogue

- Source Story: `BL-002/stories/STORY-0093.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /find/Driver-by-Id/{driverId}`
- Test data: `BL-009/test-data/STORY-0093.csv`
- Human-readable test data: `BL-009/test-data/STORY-0093.md`
- Executable mapping: `BL-004/generated-tests/STORY-0093/Story0093UnitTest.java`

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0093-01 | driverId=91 | SUCCESS | persistent ID delegated and same response returned |
| TC-0093-02 | driverId=91 | GOVERNED_EXCEPTION | non-null empty response DTO |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
