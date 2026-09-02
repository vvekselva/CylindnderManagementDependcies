# STORY-0012 Human-Readable Test Data

| Case | Input / condition | Expected result |
|---|---|---|
| TC-0012-01 | Operator opens Challan Book registration page and summary metrics load | Registration template renders with blank `ingestionRequest` and all three metric collections. |
| TC-0012-02 | Summary metric service throws a runtime exception | Page still renders; three metric collections are empty and the temporary-unavailable message is exposed. |
| TC-0012-03 | Operator refreshes the GET page | A new blank form context is rendered; no Challan Book is persisted. |
| TC-0012-04 | One or more configured metric keys have no database row | Only the rows returned by the lookup service are displayed; missing metrics are not fabricated. |
| TC-0012-05 | Operator later presses Register | Persistence is owned by STORY-0013, not this GET Story. |

Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
