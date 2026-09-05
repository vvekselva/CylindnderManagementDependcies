# BL-009 / STORY-0094 — Global Cylinder Search Test Catalogue

- Source Story: `BL-002/stories/STORY-0094.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `GET /search/cylinder/{searchText}`
- Test data: `BL-009/test-data/STORY-0094.csv`
- Human-readable test data: `BL-009/test-data/STORY-0094.md`
- Executable mapping: `BL-004/generated-tests/STORY-0094/Story0094UnitTest.java`

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0094-01 | CYL-100 | SUCCESS | ownership-model service receives exact searchTerm |
| TC-0094-02 | CYL-100 | GOVERNED_EXCEPTION | non-null empty response DTO |

Execution: **NOT_EXECUTED**; no PASS or coverage inferred.
