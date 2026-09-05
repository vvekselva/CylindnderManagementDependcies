# STORY-0031 — Human-readable Test Data

| Case | Input / precondition | Outcome class | Expected result |
|---|---|---|---|
| TC-0031-01 | CUSTOMER,ACTIVE,tripId=77,search='  Acme  ' | SUCCESS | global KPI counts returned; detail search uses trimmed Acme; summary page size 50; detail page size 200 |
| TC-0031-02 | all filters null | SUCCESS | global KPI/summary/detail reads execute without mutation |
| TC-0031-03 | no matching details | SUCCESS_EMPTY | empty detail collection is valid read-only result |

Executable mapping: `BL-004/generated-tests/STORY-0031/Story0031UnitTest.java`. Execution remains **NOT_EXECUTED**.
