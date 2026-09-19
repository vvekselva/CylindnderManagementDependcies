# STORY-0107 Human-Readable Test Data

| Test case | Vehicle load | Page | Size | Context/state | Condition | Expected |
|---|---:|---:|---:|---|---|---|
| TC-0107-01 | 77 | 1 | 50 | Supplier Stop | Success | Controller delegates with zero-based page 0 and size 50. |
| TC-0107-02 | 77 | 1 | 50 | Supplier Stop, no explicit state | Success | Service queries the two governed EMPTY on-vehicle states. |
| TC-0107-03 | 77 | 1 | 50 | BROKEN_STATE | Invalid state | Service fails closed before querying active logistics lines. |
| TC-0107-04 | 77 | 1 | 50 | Supplier Stop | Governed service failure | REST handler returns a non-null empty response DTO. |
