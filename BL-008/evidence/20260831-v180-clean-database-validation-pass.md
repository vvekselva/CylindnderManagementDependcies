# BL-008 V180 Clean Database Validation PASS

Date: 2026-08-31

Migration: `V180__Freeze_Cylinder_Ownership_Identity.sql`

Validation result returned after clean Flyway migration through V180:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V180 | PASS | V180 recorded successfully |
| 2 | FRESH_DATABASE_CYLINDER_COUNT | PASS | tbl_cylinder_count=0 |
| 3 | GOVERNED_OWNERSHIP_MASTER_SEMANTICS | PASS | governed_rows=3; exact_semantics=3 |
| 4 | GOVERNED_OWNERSHIP_MASTER_CONSTRAINT | PASS | governed ownership semantic constraint present |
| 5 | GOVERNED_OWNERSHIP_MASTER_PROTECTION_TRIGGER | PASS | trigger exists and is enabled |
| 6 | CYLINDER_OWNERSHIP_IMMUTABILITY_TRIGGER | PASS | trigger exists and is enabled |
| 7 | CYLINDER_OWNERSHIP_IMMUTABILITY_GUARD | PASS | ownership type + owner parties + derived flags immutable guard found |
| 8 | OWNERSHIP_GOVERNANCE_INTEGRITY_VIEW | PASS | vw_cylinder_ownership_governance_integrity |
| 9 | OWNERSHIP_GOVERNANCE_VIEW_COLUMNS | PASS | expected_columns_present=8/8 |
| 10 | FRESH_OWNERSHIP_GOVERNANCE_INTEGRITY | PASS | rows=0; failures=0 |
| 11 | V179_COMPANY_FLEET_ACCOUNTING_REGRESSION | PASS | vw_company_fleet_accounting_integrity |
| 12 | V178_CUSTOMER_ASSET_ACCOUNTING_REGRESSION | PASS | vw_customer_owned_asset_count_integrity |
| 13 | V177_LOCATION_EXCLUSIVITY_REGRESSION | PASS | vw_cylinder_location_exclusivity_integrity |
| 14 | V176_CUSTOMER_CUSTODY_INTEGRITY_REGRESSION | PASS | vw_customer_owned_custody_integrity |
| 15 | V175_SUPPLIER_ASSET_INTEGRITY_REGRESSION | PASS | vw_supplier_owned_asset_count_integrity |
| 16 | V174_STRICT_OWNERSHIP_TRIGGER_REGRESSION | PASS | V174 ownership trigger remains enabled |
| 99 | BL008_OWNERSHIP_V180_OVERALL_RESULT | PASS | BL008_OWNERSHIP_V180_VALIDATION_PASS; failed_checks=0 |

## Acceptance

V180 is accepted as **CLEAN_DATABASE_VALIDATED_PASS**.

The three governed ownership-master definitions are protected, post-registration cylinder ownership identity is immutable, and the ownership-governance integrity view is present with zero failures on the fresh database.

Runtime ownership-mutation tests remain postponed and tracked in the governed BL-008 test-case backlog; they are not required to keep the clean-migration gate open.
