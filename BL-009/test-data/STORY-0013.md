# STORY-0013 Test Data

## Purpose and scope
This data exercises the approved current-source Challan Book registration contract, including successful persistence inputs and source-proved gaps that must remain visible until separately approved code changes are implemented.

## How the data is used
Each row maps one-to-one to a human-readable test case and to a case ID consumed by `Story0013TestDataDrivenTest`. Values are synthetic and contain no credentials or production secrets.

| Data ID | Test Case | Type | Book Code | Prefix | Start | End | Location | Expected current-source result |
|---|---|---|---|---|---:|---:|---|---|
| D0013-01 | TC-0013-01 | DELIVERY_CHALLAN | DEL-1001 | DC | 1 | 50 | IN_OFFICE | SAVE_SUCCESS |
| D0013-02 | TC-0013-02 | EMPTY_PICKUP_CHALLAN | EMP-1001 | — | 1 | 25 | IN_OFFICE | SAVE_SUCCESS_OPTIONAL_PREFIX |
| D0013-03 | TC-0013-03 | — | — | — | — | — | — | CURRENT_GAP_NULL_GUARD_NOT_CONTROLLED |
| D0013-04 | TC-0013-04 | DELIVERY_CHALLAN | RANGE-1001 | RG | 50 | 1 | IN_OFFICE | CURRENT_GAP_RANGE_THROW_COMMENTED |
| D0013-05 | TC-0013-05 | DELIVERY_CHALLAN | DUP-1001 | DP | 1 | 10 | IN_OFFICE | DB_UNIQUE_EFFECTIVE_GUARD_NO_SERVICE_PRECHECK |
| D0013-06 | TC-0013-06 | FILLING_NOTE | FILL-1001 | FN | 1 | 20 | IN_OFFICE | TIMESTAMPS_ASSIGNED |
| D0013-07 | TC-0013-07 | CUSTOMER_SPOT_CYLINDER_CHECK | SPOT-1001 | SC | 1 | 15 | IN_OFFICE | TBL_CHALLAN_BOOK_REGISTRY_IDENTITY |
| D0013-08 | TC-0013-08 | DELIVERY_CHALLAN | LEDGER-1001 | LG | 1 | 5 | IN_OFFICE | NO_PER_SHEET_LEDGER_GENERATION |
| D0013-09 | TC-0013-09 | DELIVERY_CHALLAN | CTRL-1001 | CT | 1 | 5 | IN_OFFICE | CONTROLLER_SUCCESS_REDIRECT |
| D0013-10 | TC-0013-10 | DELIVERY_CHALLAN | ERR-1001 | ER | 1 | 5 | IN_OFFICE | CONTROLLER_APPLICATION_EXCEPTION_REDISPLAY |

CSV and this table have semantic row parity. Application behavior is not considered PASS merely because this data exists.
