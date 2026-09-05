# BL-009 / STORY-0086 — Customer Address Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0086.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /search/address/customer-address/{customerId}`
- Test data: `BL-009/test-data/STORY-0086.csv`
- Human-readable test data: `BL-009/test-data/STORY-0086.md`
- Executable mapping: `BL-004/generated-tests/STORY-0086/Story0086UnitTest.java`

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0086-01 | customerId 77 | SUCCESS | searchTerm=77 and same service response |
| TC-0086-02 | blank customerId | NO_CALL | service not invoked and no usable response |
| TC-0086-03 | customerId 77 | GOVERNED_EXCEPTION | non-null empty response DTO |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
