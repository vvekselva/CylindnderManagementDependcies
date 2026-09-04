# BL-009 / STORY-0080 — Supplier Registration Form Test Catalogue

- Source Story: `BL-002/stories/STORY-0080.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0080.csv`

| ID | Scenario | Expected result |
|---|---|---|
| TC-0080-01 | Open supplier form | Initialized nested supplier model is present |
| TC-0080-02 | Verify visible fields | Supplier/GST/phone/address/geography fields bind to expected paths |
| TC-0080-03 | Empty autocomplete query | Dropdown closes and no search API call is made |
| TC-0080-04 | Country search/select | Visible country and hidden ID are populated |
| TC-0080-05 | State search/select | Visible state and hidden ID are populated |
| TC-0080-06 | City search/select | Visible city and hidden ID are populated |
| TC-0080-07 | Change Country | Existing State and City selections are cleared |
| TC-0080-08 | Change State | Existing City selection is cleared |
| TC-0080-09 | GST input behavior | Input is uppercased and constrained to 15 characters |
| TC-0080-10 | GET no mutation | Opening the form performs no database write |

Execution and coverage remain NOT_EXECUTED.
