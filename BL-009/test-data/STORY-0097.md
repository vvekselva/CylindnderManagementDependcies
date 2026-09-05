# STORY-0097 — Human-readable Test Data

| Case | Input / precondition | Service outcome | Expected result |
|---|---|---|---|
| TC-0097-01 | page=1,size=50 | SUCCESS | ownership supplier service receives request and pageable page=0 size=50 |
| TC-0097-02 | default request | GOVERNED_EXCEPTION | non-null empty response DTO |

Executable mapping: `BL-004/generated-tests/STORY-0097/Story0097UnitTest.java`. Execution remains **NOT_EXECUTED**.
