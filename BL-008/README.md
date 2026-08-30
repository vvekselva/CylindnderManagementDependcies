# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration deltas/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.** UI/runtime testing may be deferred into the governed test-case backlog and does not block independent source/migration work unless a specific acceptance gate requires it.

## Execution boundary

- The prior populated database is not an ownership-migration input and its application rows are discarded.
- Ownership-model migration acceptance is based on a fresh database created by the normal Flyway chain.
- Delta ZIPs contain only changed/new files, preserving workspace-relative paths.
- GitHub is durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Historical migrations remain unchanged by default.
- No legacy cylinder/identifier backfill is required for the fresh application.
- No raw/manual SQL substitutes for Flyway migration execution.

## Current workspace

Authoritative base snapshot before V176 integration: `Harinandhan-Cylinder-Backup(20260830-140843).zip`.

Prepared merged workspace for the V176 clean rerun: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens database ownership rules. V175 preserves supplier-owned logical asset count through replacement and terminal lifecycle events. V176 is additive and enforces customer-owned owner/custody consistency.

## V174 — CLEAN DATABASE VALIDATION PASS

Migration: `V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

Overall: **BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`.

## V175 — CLEAN DATABASE VALIDATION PASS

Migration: `V175__Preserve_Supplier_Owned_Asset_Count.sql`

Overall: **BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v175-clean-database-validation-pass.md`.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

### Location exclusivity — implemented

The Yard -> Vehicle precondition evaluates Yard inventory, Vehicle logistics, Customer active custody, Supplier active custody, and Decommissioned terminal status. Focused unit execution is deferred to the test backlog.

### Supplier refill physical-identifier exchange — source implemented

The supplier-refill collection path supports an optional changed returned identifier while retaining the same logical cylinder. UI/runtime validation is postponed and non-blocking in the governed test backlog.

### Customer-owned owner/custody consistency — V176 AUTHORED / INTEGRATION RERUN PENDING

V176: `V176__Enforce_Customer_Owned_Custody_Consistency.sql`

V176 adds exact CUSTOMER/SUPPLIER custody column shape, ACTIVE/CLOSED custody status consistency, an owner-customer guard at the custody boundary, supplier-refill allowance for customer-owned cylinders, and `vw_customer_owned_custody_integrity`.

The first V176 validation attempt did **not** execute V176. The consolidated result showed `FLYWAY_V176=FAIL`, with every V176 constraint/trigger/function/view absent while V174/V175 regression checks remained PASS. This is classified as **MIGRATION_SOURCE_INTEGRATION_OMISSION**, not as a V176 SQL defect.

A merged full workspace containing the V176 migration has been prepared for the next clean Flyway run.

## Test policy / backlog

UI and runtime workflow tests that are postponed are retained as explicit test cases and executed later as a consolidated test phase. Backlog: `BL-008/test-case-backlog.csv`.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **AUTHORED / FIRST_VALIDATION_NOT_EXECUTED / INTEGRATION_RERUN_PENDING**
- V176 first validation classification: **MIGRATION_SOURCE_INTEGRATION_OMISSION**
- Location exclusivity Customer/Supplier/Decommissioned: **IMPLEMENTED / TEST BACKLOG**
- Supplier refill physical-identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- UI testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2: **V176_CLEAN_RERUN_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176.zip` as the migration source.
2. Perform a fresh clean Flyway migration through V176.
3. Run `BL008_Ownership_V176_Customer_Custody_Validation_v2.sql` and return its consolidated result table.
4. If V176 passes, continue to the next source-proved Ownership Model requirement; do not create V177 merely to advance the version.
