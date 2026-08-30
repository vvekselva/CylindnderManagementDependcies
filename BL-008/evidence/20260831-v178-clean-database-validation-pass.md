# BL-008 V178 Clean Database Validation PASS

Date: 2026-08-31

Migration: `V178__Harden_External_Asset_Terminal_Accounting.sql`

Validation result returned after clean Flyway migration through V178:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V178 | PASS | V178 recorded successfully |
| 2 | FRESH_DATABASE_CYLINDER_COUNT | PASS | tbl_cylinder_count=0 |
| 3 | EXTERNAL_LEDGER_OWNER_SHAPE_CONSTRAINT | PASS | Supplier events carry only supplier owner; customer events carry only customer owner |
| 4 | CUSTOMER_TERMINAL_SINGLE_SHRINK_INDEX | PASS | uq_external_asset_customer_terminal_shrink_per_cylinder |
| 5 | EXTERNAL_LEDGER_CONTEXT_TRIGGER | PASS | trigger exists and is enabled |
| 6 | EXTERNAL_LEDGER_CONTEXT_AND_IDEMPOTENCE_GUARD | PASS | ownership/product/party context and customer terminal idempotence guards found |
| 7 | CUSTOMER_ASSET_COUNT_INTEGRITY_VIEW | PASS | vw_customer_owned_asset_count_integrity |
| 8 | CUSTOMER_ASSET_COUNT_VIEW_COLUMNS | PASS | expected_columns_present=11/11 |
| 9 | FRESH_CUSTOMER_ASSET_COUNT_INTEGRITY | PASS | rows=0; failures=0 |
| 10 | V175_EXTERNAL_LEDGER_DELTA_SEMANTICS_REGRESSION | PASS | constraint remains present |
| 11 | V177_LOCATION_EXCLUSIVITY_REGRESSION | PASS | vw_cylinder_location_exclusivity_integrity |
| 12 | V176_CUSTOMER_CUSTODY_INTEGRITY_REGRESSION | PASS | vw_customer_owned_custody_integrity |
| 13 | V175_SUPPLIER_ASSET_INTEGRITY_REGRESSION | PASS | vw_supplier_owned_asset_count_integrity |
| 14 | V174_STRICT_OWNERSHIP_TRIGGER_REGRESSION | PASS | V174 ownership trigger remains enabled |
| 99 | BL008_OWNERSHIP_V178_OVERALL_RESULT | PASS | BL008_OWNERSHIP_V178_VALIDATION_PASS; failed_checks=0 |

## Acceptance

V178 is accepted as **CLEAN_DATABASE_VALIDATED_PASS**.

The database now validates external-ledger event family, ownership type, owner party and product against the referenced external cylinder; customer terminal shrink is one-time/idempotent; and customer-owned active external-asset balance has an integrity read model.

UI/runtime terminal workflows remain postponed and tracked in the governed BL-008 test-case backlog; they are not required to keep this clean-migration gate open.
