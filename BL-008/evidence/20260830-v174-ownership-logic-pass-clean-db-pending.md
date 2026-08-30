# BL-008 V174 Ownership Validation — Logic PASS / Clean Database Retest Pending

Migration: `V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

User-returned consolidated validation result:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V174 | PASS | V174 recorded successfully |
| 2 | FRESH_DATABASE_CYLINDER_COUNT | FAIL | tbl_cylinder_count=1327 |
| 3 | OWNERSHIP_TYPE_MASTER | PASS | governed_active_types=3 |
| 4 | STRICT_OWNER_CONSTRAINT | PASS | strict owner-shape CHECK exists |
| 5 | OWNERSHIP_TRIGGER | PASS | trigger exists and is enabled |
| 6 | VALID_COMPANY_OWNED | PASS | accepted |
| 7 | VALID_SUPPLIER_OWNED | PASS | accepted |
| 8 | VALID_CUSTOMER_OWNED | PASS | accepted |
| 9 | REJECT_COMPANY_WITH_SUPPLIER_OWNER | PASS | rejected as expected |
| 10 | REJECT_SUPPLIER_WITHOUT_SUPPLIER_OWNER | PASS | rejected as expected |
| 11 | REJECT_SUPPLIER_WITH_CUSTOMER_OWNER | PASS | rejected as expected |
| 12 | REJECT_CUSTOMER_WITHOUT_CUSTOMER_OWNER | PASS | rejected as expected |
| 13 | REJECT_CUSTOMER_WITH_SUPPLIER_OWNER | PASS | rejected as expected |
| 14 | REJECT_FLAG_MISMATCH | PASS | rejected as expected |
| 99 | BL008_OWNERSHIP_V174_OVERALL_RESULT | FAIL | failed_checks=1 |

## Interpretation

The only failed check is the clean-database precondition. The validation was executed against the prior populated database containing 1327 cylinder rows, even though the Ownership Model acceptance target is a fresh database.

All V174 ownership-model logic checks passed:

- ownership master contains the three governed active types;
- strict owner-shape constraint exists;
- ownership trigger exists and is enabled;
- all three valid ownership combinations are accepted;
- all tested invalid combinations are rejected;
- flag/type consistency enforcement works.

## Disposition

- V174 ownership enforcement logic: **PASS**.
- V174 final clean-migration acceptance: **PENDING**.
- No V175 is justified by this result.
- Next action: create/use the fresh PostgreSQL database, run the complete normal Flyway chain through V174, then rerun the same consolidated V174 clean-migration validation.
- Expected clean target: `tbl_cylinder_count=0` immediately after migrations and before application data entry.

Status: `V174_LOGIC_PASS_WAITING_FOR_TRUE_CLEAN_DATABASE_VALIDATION`.
