# BL-008 V177 Clean Database Validation PASS

Date: 2026-08-31

Migration: `V177__Enforce_Cross_Table_Cylinder_Location_Exclusivity.sql`

Validation result returned after clean Flyway migration through V177:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V177 | PASS | V177 recorded successfully |
| 2 | FRESH_DATABASE_CYLINDER_COUNT | PASS | tbl_cylinder_count=0 |
| 3 | LOCATION_EXCLUSIVITY_INTEGRITY_VIEW | PASS | vw_cylinder_location_exclusivity_integrity |
| 4 | LOCATION_EXCLUSIVITY_VIEW_COLUMNS | PASS | expected_columns_present=10/10 |
| 5 | LOCATION_EXCLUSIVITY_ASSERTION_FUNCTION | PASS | cross-table view + total>1 rejection guard found |
| 6 | LOCATION_EXCLUSIVITY_TRIGGER_FUNCTION | PASS | function exists |
| 7 | LOCATION_EXCLUSIVITY_YARD_TRIGGER | PASS | enabled deferred constraint trigger |
| 8 | LOCATION_EXCLUSIVITY_LOGISTICS_TRIGGER | PASS | enabled deferred constraint trigger |
| 9 | LOCATION_EXCLUSIVITY_PARTY_CUSTODY_TRIGGER | PASS | enabled deferred constraint trigger |
| 10 | LOCATION_EXCLUSIVITY_STATE_AUDIT_TRIGGER | PASS | enabled deferred constraint trigger |
| 11 | LOCATION_EXCLUSIVITY_DEFERRED_TRIGGER_SET | PASS | required_deferred_triggers_present=4/4 |
| 12 | FRESH_LOCATION_EXCLUSIVITY_INTEGRITY | PASS | rows=0; failures=0 |
| 13 | V176_CUSTOMER_CUSTODY_INTEGRITY_REGRESSION | PASS | vw_customer_owned_custody_integrity |
| 14 | V175_SUPPLIER_ASSET_INTEGRITY_REGRESSION | PASS | vw_supplier_owned_asset_count_integrity |
| 15 | V174_STRICT_OWNERSHIP_TRIGGER_REGRESSION | PASS | V174 ownership trigger remains enabled |
| 99 | BL008_OWNERSHIP_V177_OVERALL_RESULT | PASS | BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0 |

## Acceptance

V177 is accepted as **CLEAN_DATABASE_VALIDATED_PASS**.

The database now has validated cross-table cylinder location exclusivity infrastructure across Yard, Logistics, Party Custody and Decommissioned state, using deferred constraint triggers so valid hand-off transactions can complete in either statement order while the committed state remains exclusive.

UI/runtime hand-off scenarios remain postponed and tracked in the governed BL-008 test-case backlog; they are not required to keep this clean-migration gate open.
