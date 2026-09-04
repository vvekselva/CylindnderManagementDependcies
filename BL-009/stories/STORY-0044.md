# BL-009 / STORY-0044 — Vehicle Trip Load Wizard Save Test Catalogue

- Source Story: `BL-002/stories/STORY-0044.md`
- Approval: `APPROVED_AFTER_REWORK`
- Development backlog: `BL-010 DEV-0005`
- Test data: `BL-009/test-data/STORY-0044.csv`

| ID | Scenario | Expected result |
|---|---|---|
| TC-0044-01 | Valid complete wizard submit | Trip/load transaction succeeds |
| TC-0044-02 | Driver ID null | Controlled validation; verify against fixed source revision |
| TC-0044-03 | Customer/address mismatch | Validation rejection, no writes |
| TC-0044-04 | quantityFullForDelivery null | Controlled quantity validation |
| TC-0044-05 | quantityFullForBuffer null | Controlled quantity validation |
| TC-0044-06 | quantityEmptyForSupplier null | Controlled quantity validation after DEV-0005 |
| TC-0044-07 | Valid EMPTY allocation | EMPTY cylinders map to EMPTY_FOR_SUPPLIER |
| TC-0044-08 | Valid FULL delivery allocation | FULL cylinders map to FULL_FOR_DELIVERY |
| TC-0044-09 | Valid FULL buffer allocation | Remaining FULL cylinders map to FULL_FOR_BUFFER |
| TC-0044-10 | Invalid/non-yard cylinder | Validation rejection |
| TC-0044-11 | Missing challan book | Validation rejection |
| TC-0044-12 | Invalid starting sheet | Validation rejection |
| TC-0044-13 | Duplicate physical book across types | Validation rejection |
| TC-0044-14 | Successful challan assignment | Four assignment rows persisted |
| TC-0044-15 | Successful logistics transfer | OPEN execution + active lines created |
| TC-0044-16 | Yard source deactivation | Former active Yard lines become inactive |
| TC-0044-17 | Transaction failure | Full rollback; no partial trip/load/logistics state |

Execution and coverage remain NOT_EXECUTED.
