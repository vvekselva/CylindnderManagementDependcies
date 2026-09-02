# STORY-0127 Human-Readable Test Data

| Case | Input / condition | Expected result |
|---|---|---|
| TC-0127-01 | Browser requests legacy `/lookup` | Exact redirect target is `/lookupManagement`. |
| TC-0127-02 | Redirect is invoked with no parameters | No DTO, filter, or persistent identity is required. |
| TC-0127-03 | Redirect is invoked | No DAO call or database mutation belongs to this Story. |
| TC-0127-04 | Browser follows the destination route | Lookup Management defaults to the `addressType` tab; this destination behavior does not change STORY-0127 into a write Story. |

Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
