# BL-009 / STORY-0127 — Legacy Lookup Redirect Test Catalogue

- Source Story: `BL-002/stories/STORY-0127.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `PASS_NO_APPROVED_BEHAVIOR_DRIFT`
- Test data: `BL-009/test-data/STORY-0127.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java`

## Test intent
Validate the approved navigation-only contract for `GET /lookup` without conflating it with destination Lookup Management save/search behavior.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0127-01 | Request legacy `/lookup` | Return exact `redirect:/lookupManagement`. |
| TC-0127-02 | Redirect invocation | No request DTO or persistent identity is required. |
| TC-0127-03 | Redirect invocation | No DAO/database write is performed by `legacyRedirect`. |
| TC-0127-04 | Follow destination | Destination `/lookupManagement` defaults `tab` to `addressType`; this is destination context, not a write by STORY-0127. |

Execution PASS requires the faithful JUnit/runtime lane. This catalogue is generated/mapped, not executed.
