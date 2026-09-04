# BL-009 / STORY-0041 — Customer Registration Test Catalogue

- Source Story: `BL-002/stories/STORY-0041.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0041.csv`

| ID | Scenario | Expected result |
|---|---|---|
| TC-0041-01 | Open registration page | Fresh customer model, empty address/phone collections, Address Type options rendered |
| TC-0041-02 | Enter valid customer name and GST | Values bind correctly |
| TC-0041-03 | Add multiple phone numbers | Primary/secondary rows bind without losing prior values |
| TC-0041-04 | Add address and select Country/State/City | Hidden IDs bind and child selections reset when parent changes |
| TC-0041-05 | Invalid GST/customer input | Same page redisplays with validation feedback |
| TC-0041-06 | Valid embedded registration submit | Companion STORY-0042 persistence path invoked and success redirects to /ownership-dashboard |
| TC-0041-07 | Address Type persistence | Current-source omission is exposed; test must not infer fk_address_type persistence |
| TC-0041-08 | No GET mutation | GET page load performs no database write |

Execution and coverage remain NOT_EXECUTED.
