# BL-009 / STORY-0031 — Ownership Obligation Dashboard Test Catalogue

- Source Story: `BL-002/stories/STORY-0031.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /ownership-obligation-dashboard`
- Test data: `BL-009/test-data/STORY-0031.csv`
- Human-readable test data: `BL-009/test-data/STORY-0031.md`
- Executable mapping: `BL-004/generated-tests/STORY-0031/Story0031UnitTest.java`

| ID | Input / precondition | Outcome class | Expected current-source result |
|---|---|---|---|
| TC-0031-01 | CUSTOMER,ACTIVE,tripId=77,search='  Acme  ' | SUCCESS | global KPI counts returned; detail search uses trimmed Acme; summary page size 50; detail page size 200 |
| TC-0031-02 | all filters null | SUCCESS | global KPI/summary/detail reads execute without mutation |
| TC-0031-03 | no matching details | SUCCESS_EMPTY | empty detail collection is valid read-only result |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
