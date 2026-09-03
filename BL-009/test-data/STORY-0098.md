# STORY-0098 Human-Readable Test Data

| Test case | Input | Service condition | Expected result |
|---|---|---|---|
| TC-0098-01 | Product category `Industrial` | Success | Request carries exact search text and service response is returned unchanged. |
| TC-0098-02 | Product category `Industrial` | Governed application exception | REST layer returns a non-null empty product-category response. |
| TC-0098-03 | Product category `industrial` | DAO success | Case-insensitive category lookup returns matching reference data without mutation. |
