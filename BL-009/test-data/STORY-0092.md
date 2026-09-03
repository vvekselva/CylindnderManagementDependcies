# STORY-0092 Human-Readable Test Data

| Test case | Input | Service condition | Expected result |
|---|---|---|---|
| TC-0092-01 | Driver search `Ravi` | Success | Request carries `Ravi`, pageable service delegation occurs, service response is returned unchanged. |
| TC-0092-02 | Driver search `Ravi` | Governed application exception | REST layer returns a non-null empty driver-search response. |
| TC-0092-03 | Driver search `ravi` | DAO success | Case-insensitive driver-name lookup returns matching references without persistence mutation. |
