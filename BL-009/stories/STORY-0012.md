# BL-009 / STORY-0012 — Challan Book Registration Form Test Catalogue

- Source Story: `BL-002/stories/STORY-0012.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS_NO_APPROVED_BEHAVIOR_DRIFT`
- Test data: `BL-009/test-data/STORY-0012.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java`

## Test intent
Validate the approved read-only `GET /logistics/challan-books/add-form` contract against the recovered governed source.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0012-01 | Open registration form with metrics available | Render `final-version-1/add-challan-book.html`, create `ingestionRequest`, expose all three metric groups. |
| TC-0012-02 | Total metrics service fails | Still render the form, expose empty metric groups and `Summary metrics are temporarily unavailable.`. |
| TC-0012-03 | Open/refresh GET | No Challan Book registry write is performed by this GET. |
| TC-0012-04 | Metric group contains fewer persisted keys | Read service may return fewer items; missing keys are omitted rather than invented. |
| TC-0012-05 | Form relationship to submit | Form submit targets STORY-0013; GET itself does not persist the book. |

Execution PASS requires the faithful Maven/JUnit runtime. This catalogue is generated/mapped, not executed.
