# STORY-0095 — Human-readable Test Data

| Case | Input / precondition | Service outcome | Expected result |
|---|---|---|---|
| TC-0095-01 | searchTerm=CYL-100,page=2,size=25 | SUCCESS | ownership serial/state service receives request and pageable page=1 size=25 |
| TC-0095-02 | default paging request | GOVERNED_EXCEPTION | non-null empty response DTO |

The executable mapping is `BL-004/generated-tests/STORY-0095/Story0095UnitTest.java`. These rows are generated test data; execution remains **NOT_EXECUTED**.
