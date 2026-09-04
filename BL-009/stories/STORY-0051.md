# BL-009 / STORY-0051 — Add Stop Page Test Catalogue

- Source Story: `BL-002/stories/STORY-0051.md`
- Approval: `APPROVED_AFTER_REWORK`
- Test data: `BL-009/test-data/STORY-0051.csv`

| ID | Scenario | Expected result |
|---|---|---|
| TC-0051-01 | Returned + CustomerStop | Customer stop page opens |
| TC-0051-02 | Proceeding + CustomerStop | Customer stop page opens |
| TC-0051-03 | Loaded/other status | Redirect + returned-before-entry error |
| TC-0051-04 | Customer DELIVERY book | Assigned book/page window shown |
| TC-0051-05 | Customer EMPTY_PICKUP book | Assigned book/page window shown |
| TC-0051-06 | Supplier branch | FILLING_NOTE assigned book/page window shown |
| TC-0051-07 | Heatmap service failure/customer | Empty customer structures + error |
| TC-0051-08 | Heatmap service failure/supplier | Empty supplier structures + error |
| TC-0051-09 | Missing vehicle load | Governed exception path |
| TC-0051-10 | GET no mutation | No persistence changes |
| TC-0051-11 | Unknown actionType | Current-source supplier branch selected |
| TC-0051-12 | vehicleLoadId model | Selected load ID preserved |

Execution and coverage remain NOT_EXECUTED.
