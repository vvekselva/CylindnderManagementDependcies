# BL-009 / STORY-0033 — Submit Walk-in Sale Test Catalogue

- Source Story: `BL-002/stories/STORY-0033.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `POST /walkin-sale`
- Test data: `BL-009/test-data/STORY-0033.csv`
- Human-readable test data: `BL-009/test-data/STORY-0033.md`
- Executable mapping: `BL-004/generated-tests/STORY-0033/Story0033UnitTest.java`

| ID | Input / precondition | Outcome class | Expected current-source result |
|---|---|---|---|
| TC-0033-01 | valid request | SUCCESS | exact request delegated and redirect returned |
| TC-0033-02 | validator raises InvalidInputParameterException | VALIDATION_ERROR | same form rendered with controlled validation message |
| TC-0033-03 | service raises CylinderManagementApplicationException | APPLICATION_ERROR | same form rendered with controlled processing message |
| TC-0033-04 | delivery + empty return | SERVICE_PATH | transactional service owns order/walk-in pickup/yard entry sequencing |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
