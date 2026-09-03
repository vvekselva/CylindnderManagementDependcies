# STORY-0099 Human-Readable Test Data

| Test case | Input | Service condition | Expected result |
|---|---|---|---|
| TC-0099-01 | Product `Oxygen` | Success | Exact search text is delegated and the service response is returned unchanged. |
| TC-0099-02 | Product `Oxygen` | Governed application exception | REST layer returns a non-null empty product-search response. |
| TC-0099-03 | Product `oxygen` | DAO success | Case-insensitive lookup returns matching products without mutation. |
| TC-0099-04 | Customer Demand visible text `Oxy` | Selector flow | Source-bound caller threshold/debounce applies and selected persistent `productId` is the stored identity. |
