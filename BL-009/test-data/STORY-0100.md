# STORY-0100 Human-Readable Test Data

| Test case | Input | Service condition | Expected result |
|---|---|---|---|
| TC-0100-01 | Product UOM `KG` | Success | Exact search text is delegated and the service response is returned unchanged. |
| TC-0100-02 | Product UOM `KG` | Governed application exception | REST layer returns a non-null empty Product UOM response. |
| TC-0100-03 | Product UOM `kg` | DAO success | Case-insensitive UOM lookup returns matching reference data without mutation. |
