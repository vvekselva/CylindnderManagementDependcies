# BL-009 / STORY-0097 — Cylinders by Supplier Test Catalogue

- Source Story: `BL-002/stories/STORY-0097.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `POST /search/cylinder/by-supplier`
- Test data: `BL-009/test-data/STORY-0097.csv`
- Human-readable test data: `BL-009/test-data/STORY-0097.md`
- Executable mapping: `BL-004/generated-tests/STORY-0097/Story0097UnitTest.java`

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0097-01 | page=1,size=50 | SUCCESS | ownership supplier service receives request and pageable page=0 size=50 |
| TC-0097-02 | default request | GOVERNED_EXCEPTION | non-null empty response DTO |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
