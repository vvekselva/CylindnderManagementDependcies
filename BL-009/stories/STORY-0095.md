# BL-009 / STORY-0095 — Cylinder by Serial and State Test Catalogue

- Source Story: `BL-002/stories/STORY-0095.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Endpoint: `POST /search/cylinder/by-serial-and-state`
- Test data: `BL-009/test-data/STORY-0095.csv`
- Human-readable test data: `BL-009/test-data/STORY-0095.md`
- Executable mapping: `BL-004/generated-tests/STORY-0095/Story0095UnitTest.java`

## Scenarios

| ID | Input / precondition | Service outcome | Expected current-source result |
|---|---|---|---|
| TC-0095-01 | searchTerm=CYL-100,page=2,size=25 | SUCCESS | ownership serial/state service receives request and pageable page=1 size=25 |
| TC-0095-02 | default paging request | GOVERNED_EXCEPTION | non-null empty response DTO |

## Execution status

Generated and mapped only. **NOT_EXECUTED** in this fire; no PASS or coverage is inferred.
