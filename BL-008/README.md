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

Latest validated source line is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus the integrated V176 delta used for the successful clean rerun.

Prepared V177-integrated workspace for the next clean run: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens database ownership rules. V175 preserves supplier-owned logical asset count through replacement and terminal lifecycle events. V176 enforces customer-owned owner/custody consistency. V177 is the next additive migration and enforces cross-table location exclusivity.

## V174 — CLEAN DATABASE VALIDATION PASS

Migration: `V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

Overall: **BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`.

## V175 — CLEAN DATABASE VALIDATION PASS

Migration: `V175__Preserve_Supplier_Owned_Asset_Count.sql`

Overall: **BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v175-clean-database-validation-pass.md`.

## V176 — CLEAN DATABASE VALIDATION PASS

Migration: `V176__Enforce_Customer_Owned_Custody_Consistency.sql`

Successful clean rerun results:

- Flyway V176: PASS.
- fresh cylinder count: `0`.
- fresh party-custody count: `0`.
- CUSTOMER/SUPPLIER party-shape constraint: PASS.
- ACTIVE/CLOSED custody consistency: PASS.
- customer-owned custody trigger: PASS.
- owner-customer equality guard: PASS.
- `vw_customer_owned_custody_integrity`: PASS.
- expected view columns: `9/9`.
- fresh customer custody integrity: `rows=0; failures=0`.
- V175 regression: PASS.
- V174 regression: PASS.
- overall: **BL008_OWNERSHIP_V176_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v176-clean-database-validation-pass.md`.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

### Location exclusivity — application layer implemented

The Yard -> Vehicle Java precondition evaluates Yard inventory, Vehicle logistics, Customer active custody, Supplier active custody, and Decommissioned terminal status. Focused unit execution remains deferred to the governed test backlog.

### Supplier refill physical-identifier exchange — source implemented

The supplier-refill collection path supports an optional changed returned identifier while retaining the same logical cylinder. UI/runtime validation is postponed and non-blocking in the governed test backlog.

### Customer-owned owner/custody consistency — V176 PASS

A CUSTOMER_OWNED cylinder can open CUSTOMER custody only at its owner customer. Supplier refill custody remains allowed without ownership transfer. UI/runtime lifecycle cases remain postponed and tracked in `BL-008/test-case-backlog.csv`.

### Cross-table location exclusivity — V177 AUTHORED / NOT YET EXECUTED

V177: `V177__Enforce_Cross_Table_Cylinder_Location_Exclusivity.sql`

V177 adds:

- `vw_cylinder_location_exclusivity_integrity` across Yard, Logistics, Customer custody, Supplier custody and Decommissioned;
- `fn_assert_cylinder_location_exclusive(bigint)` with the invariant `active_location_bucket_count <= 1`;
- a generic deferred enforcement trigger function;
- DEFERRABLE INITIALLY DEFERRED constraint triggers on Yard inventory lines, Logistics execution lines, Party custody, and State audit.

The previously returned V177 validation table showed `FLYWAY_V177=FAIL` and all V177 objects absent while V174–V176 regression checks remained PASS. The user confirmed that **V177 had not been executed**. Therefore that result is classified as **VALIDATION_RUN_BEFORE_V177_EXECUTION**, not as a migration defect or migration rollback.

A merged workspace containing both V176 and V177 has been prepared for the actual V177 clean execution.

## Test policy / backlog

UI and runtime workflow tests that are postponed remain explicit test cases for the later consolidated test phase. Backlog: `BL-008/test-case-backlog.csv`.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **AUTHORED / NOT_YET_EXECUTED**
- Last V177 validation classification: **VALIDATION_RUN_BEFORE_V177_EXECUTION**
- Location exclusivity Customer/Supplier/Decommissioned: **APPLICATION_IMPLEMENTED / DB_WIDE_V177_AUTHORED / RUNTIME_TEST_BACKLOG**
- Supplier refill physical-identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned owner/custody consistency: **V176_PASS / UI_RUNTIME_TEST_POSTPONED**
- UI testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2: **V177_EXECUTION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177.zip` as the migration source.
2. Perform the clean Flyway migration through V177.
3. Run `BL008_Ownership_V177_Location_Exclusivity_Validation.sql` only after V177 has actually executed.
4. Return the consolidated V177 result table for acceptance.
