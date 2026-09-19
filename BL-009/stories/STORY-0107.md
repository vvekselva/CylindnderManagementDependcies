# BL-009 / STORY-0107 — Cylinders on Vehicle Test Catalogue

- Source Story: `BL-002/stories/STORY-0107.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS`
- Test data: `BL-009/test-data/STORY-0107.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0107/Story0107TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `POST /search/cylinder/on-vehicle` ownership-model contract: controller paging handoff, vehicle-load identity resolution, Supplier Stop default EMPTY transit states, invalid-state rejection, and governed controller failure behavior.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0107-01 | Vehicle-content request page 1 / 50 | Controller delegates the same request to the ownership-model on-vehicle service with page 0 size 50. |
| TC-0107-02 | VEHICLE_LOAD_ID=77 + SUPPLIER_STOP and no explicit state | Service queries active vehicle contents using `EMPTY_PICKED_FOR_REFILL` and `EMPTY_IN_TRANSIT_TO_YARD`. |
| TC-0107-03 | Invalid explicit state `BROKEN_STATE` | Service fails closed before the logistics DAO query. |
| TC-0107-04 | Governed service failure in REST controller | Controller returns a non-null empty `CylinderSearchResponseDto`. |

The endpoint itself is read-only. Stop ingestion owns the later logistics mutation. Runtime execution and coverage remain pending faithful Maven/JUnit execution.
