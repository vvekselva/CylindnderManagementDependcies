# STORY-0096 Human-Readable Test Data

| Test case | Customer ID | Page | Size | Search term | Condition | Expected |
|---|---:|---:|---:|---|---|---|
| TC-0096-01 | 42 | 1 | 50 | empty | Success | Controller delegates with zero-based page 0 and size 50. |
| TC-0096-02 | 42 | 1 | 50 | three spaces | Success | Blank search normalizes to null; active CUSTOMER custody is queried for customer 42. |
| TC-0096-03 | missing | 1 | 50 | empty | Invalid identity | Service fails closed with governed application exception. |
| TC-0096-04 | 42 | 1 | 50 | empty | Governed service failure | REST handler returns a non-null empty response DTO. |
