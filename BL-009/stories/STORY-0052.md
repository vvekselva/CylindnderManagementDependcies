# BL-009 / STORY-0052 — Trip Return Deferred Reconciliation Test Catalogue

- Source Story: `BL-002/stories/STORY-0052.md`
- Approval: `APPROVED_AFTER_REWORK`
- Development gap: `BL-010 DEV-0006`
- Test data: `BL-009/test-data/STORY-0052.csv`

| ID | Scenario | Expected result |
|---|---|---|
| TC-0052-01 | Open Trip Return | Read-only trip/load/challan review |
| TC-0052-02 | Return with customer EMPTY cylinders | Physically returned; not prematurely reconciled Yard stock |
| TC-0052-03 | Return with supplier FULL cylinders | Physically returned; not prematurely reconciled Yard stock |
| TC-0052-04 | Mixed EMPTY + FULL physical return | Both sets preserved for later reconciliation |
| TC-0052-05 | Next-day Yard Audit before challan entry | Physical identities recorded; pending mismatch may be AMBER |
| TC-0052-06 | Later challans exactly match Yard Audit | Identity-level reconciliation GREEN |
| TC-0052-07 | Yard Audit has one extra cylinder | Mismatch notified |
| TC-0052-08 | Challan has one extra cylinder | Mismatch notified |
| TC-0052-09 | Wrong cylinder identity but same total count | Mismatch notified; count-only match is insufficient |
| TC-0052-10 | Duplicate/conflicting challan explanation | Mismatch remains |
| TC-0052-11 | Pending challan within allowed window | AMBER, not falsely RED |
| TC-0052-12 | Pending challan window expires | RED escalation/human investigation |
| TC-0052-13 | Corrective challan resolves mismatch | Gate transitions to GREEN when all identities match |
| TC-0052-14 | Dashboard/reconciliation notification | Unexplained cylinders and reason visible |
| TC-0052-15 | No premature Yard promotion | System Yard remains unreconciled until governed audit/reconciliation |
| TC-0052-16 | End-to-end trip -> audit -> challan | Complete flow preserves traceability |

Execution and coverage remain NOT_EXECUTED.
