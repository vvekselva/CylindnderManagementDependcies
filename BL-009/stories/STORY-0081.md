# BL-009 / STORY-0081 — Supplier Registration Test Catalogue

- Source Story: `BL-002/stories/STORY-0081.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0081.csv`

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0081-01 | Valid supplier registration | Active supplier aggregate is mapped and saved |
| TC-0081-02 | Null supplier request | Controlled validation rejection |
| TC-0081-03 | Missing supplier name | Validation error; no save |
| TC-0081-04 | Invalid GST | Validation error; no save |
| TC-0081-05 | Duplicate GST | Duplicate rejection; no second save |
| TC-0081-06 | Invalid phone | Validation error; no save |
| TC-0081-07 | Duplicate phone | Duplicate rejection; no save |
| TC-0081-08 | Missing address/geography | Validation error; no save |
| TC-0081-09 | Valid geography IDs | Address resolves City/State/Country |
| TC-0081-10 | Successful persistence | Supplier, address and phone relationships are stored |
| TC-0081-11 | Validation redisplay | Supplier form re-renders with entered data/errors |
| TC-0081-12 | General application exception | Supplier form re-renders without an unproved global message |
| TC-0081-13 | Active flag | New supplier is persisted active=true |
| TC-0081-14 | Success outcome | Configured success/home/list redirect is returned |

Execution and coverage remain NOT_EXECUTED.
