# BL-009 / STORY-0042 — Customer Registration Test Catalogue

- Source Story: `BL-002/stories/STORY-0042.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0042.csv`

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0042-01 | Valid customer registration | Customer, address and phone graph is mapped and saved |
| TC-0042-02 | Missing customer name | Validation error; no save |
| TC-0042-03 | Invalid GST format | Validation error; no save |
| TC-0042-04 | Duplicate GST | Duplicate validation error; no second customer save |
| TC-0042-05 | Invalid/duplicate phone | Validation error; no save |
| TC-0042-06 | Missing address | Validation error; no save |
| TC-0042-07 | Missing/unresolved Address Type | Validation error path exercised |
| TC-0042-08 | Invalid City/State/Country | Validation error; no save |
| TC-0042-09 | Valid submit success | Redirect to /ownership-dashboard |
| TC-0042-10 | Address Type persistence gap | Current source omission is exposed; do not infer fk_address_type persistence |
| TC-0042-11 | Transaction boundary | Persistence succeeds through repository-proxy save boundary |
| TC-0042-12 | Validation redisplay | Entered DTO values/errors are restored on the registration view |

Execution and coverage remain NOT_EXECUTED.
