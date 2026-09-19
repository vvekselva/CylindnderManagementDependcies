# BL-009 / STORY-0096 — Cylinders by Customer Test Catalogue

- Source Story: `BL-002/stories/STORY-0096.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0096.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0096/Story0096TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `POST /search/cylinder/by-customer` ownership-model contract: request routing/paging, CUSTOMER_ID resolution, active-customer-custody query semantics, fail-closed missing identity handling, and governed controller failure behavior.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0096-01 | Customer request page 1 / 50 | Controller delegates the same request to the ownership-model customer service with zero-based page 0 size 50. |
| TC-0096-02 | CUSTOMER_ID=42 and blank search text | Service queries active customer-held cylinders for customer 42 and normalizes blank search text to null. |
| TC-0096-03 | Missing CUSTOMER_ID | Service fails closed with `CylinderManagementApplicationException`. |
| TC-0096-04 | Governed service failure in REST controller | Controller returns a non-null empty `CylinderSearchResponseDto`. |

No custody/logistics mutation is performed by this search. Runtime execution and coverage remain pending faithful Maven/JUnit execution.
