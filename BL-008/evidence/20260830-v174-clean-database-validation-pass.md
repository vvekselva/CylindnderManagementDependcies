# BL-008 V174 Ownership Clean-Database Validation — PASS

Migration: `V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

Target: fresh PostgreSQL database after clean Flyway migration through V174.

User-returned consolidated validation:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V174 | PASS | V174 recorded successfully |
| 2 | FRESH_DATABASE_CYLINDER_COUNT | PASS | tbl_cylinder_count=0 |
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
| 99 | BL008_OWNERSHIP_V174_OVERALL_RESULT | PASS | BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0 |

## Conclusion

- Clean Flyway migration through V174 is accepted.
- Fresh target contains zero cylinder application rows immediately after migration.
- COMPANY_OWNED, SUPPLIER_OWNED and CUSTOMER_OWNED ownership master entries are present.
- Database ownership constraint and trigger enforcement are active.
- Valid ownership combinations are accepted and governed invalid combinations are rejected.
- No legacy backfill is required.
- V174 is terminally PASS.

Next Ownership Model phase: supplier/customer lifecycle and external-asset count/accounting validation. A V175 migration must be source/evidence driven; it is not created merely to advance the version.

Status: `V174_CLEAN_DATABASE_VALIDATED_PASS_PHASE2_OWNERSHIP_LIFECYCLE_ACTIVE`.
