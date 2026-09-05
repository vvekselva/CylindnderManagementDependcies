# BL-009 / STORY-0032 — Open Walk-in Sale Test Catalogue

- Source Story: `BL-002/stories/STORY-0032.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /walkin-sale`
- Test data: `BL-009/test-data/STORY-0032.csv`
- Human-readable test data: `BL-009/test-data/STORY-0032.md`
- Executable mapping: `BL-004/generated-tests/STORY-0032/Story0032UnitTest.java`

| ID | Input / precondition | Outcome class | Expected current-source result |
|---|---|---|---|
| TC-0032-01 | open page | SUCCESS | walkinSale model initialized with customer/address/challan leaf and DELIVERY type |
| TC-0032-02 | GET only | READ_ONLY | no walk-in sale application service or persistence mutation invoked |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
