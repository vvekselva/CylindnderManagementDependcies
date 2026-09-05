# STORY-0086 — Human-readable Test Data

| Case | Input / precondition | Service outcome | Expected result |
|---|---|---|---|
| TC-0086-01 | customerId 77 | SUCCESS | searchTerm=77 and same service response |
| TC-0086-02 | blank customerId | NO_CALL | service not invoked and no usable response |
| TC-0086-03 | customerId 77 | GOVERNED_EXCEPTION | non-null empty response DTO |

Executable mapping: `BL-004/generated-tests/STORY-0086/Story0086UnitTest.java`. Execution remains **NOT_EXECUTED**.
