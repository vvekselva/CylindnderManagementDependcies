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

Latest validated source line is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176 and V177 migration deltas.

Prepared integrated workspace: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens database ownership rules. V175 preserves supplier-owned logical asset count through replacement and terminal lifecycle events. V176 enforces customer-owned owner/custody consistency. V177 enforces database-wide cross-table location exclusivity.

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

Overall: **BL008_OWNERSHIP_V176_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260830-v176-clean-database-validation-pass.md`.

## V177 — CLEAN DATABASE VALIDATION PASS

Migration: `V177__Enforce_Cross_Table_Cylinder_Location_Exclusivity.sql`

Successful clean validation proved:

- Flyway V177 recorded successfully.
- fresh cylinder count is `0`.
- `vw_cylinder_location_exclusivity_integrity` exists with all `10/10` expected columns.
- assertion and trigger functions exist.
- Yard, Logistics, Party Custody and State Audit deferred constraint triggers are enabled.
- required deferred trigger set is `4/4`.
- fresh location integrity reports `rows=0; failures=0`.
- V176 customer-custody regression: PASS.
- V175 supplier-asset regression: PASS.
- V174 strict-ownership regression: PASS.
- overall: **BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260831-v177-clean-database-validation-pass.md`.

The earlier V177 validation run that occurred before V177 execution remains historical only and is not a migration defect.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

### Location exclusivity — application + database enforcement complete

The Yard -> Vehicle Java precondition evaluates Yard inventory, Vehicle logistics, Customer active custody, Supplier active custody, and Decommissioned terminal status. V177 now provides database-wide deferred enforcement across the same authoritative physical/terminal location model.

Focused unit execution and positive/negative runtime hand-off scenarios remain deferred to the governed test backlog.

### Supplier refill physical-identifier exchange — source implemented

The supplier-refill collection path supports an optional changed returned identifier while retaining the same logical cylinder. UI/runtime validation is postponed and non-blocking in the governed test backlog.

### Customer-owned owner/custody consistency — V176 PASS

A CUSTOMER_OWNED cylinder can open CUSTOMER custody only at its owner customer. Supplier refill custody remains allowed without ownership transfer. UI/runtime lifecycle cases remain postponed and tracked in `BL-008/test-case-backlog.csv`.

### Cross-table location exclusivity — V177 PASS

The database now enforces `active_location_bucket_count <= 1` at transaction end across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state. Deferred enforcement intentionally permits a legitimate hand-off transaction to close the old location and open the new location in either SQL statement order, while rejecting an invalid committed state with multiple active buckets.

## Test policy / backlog

UI, unit and runtime workflow tests that are postponed remain explicit test cases for the later consolidated test phase. Backlog: `BL-008/test-case-backlog.csv`.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- Location exclusivity Customer/Supplier/Decommissioned: **APPLICATION_AND_DATABASE_ENFORCEMENT_COMPLETE / RUNTIME_TEST_BACKLOG**
- Supplier refill physical-identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned owner/custody consistency: **V176_PASS / UI_RUNTIME_TEST_POSTPONED**
- UI testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2: **CONTINUE_EXTERNAL_ASSET_TERMINAL_AND_ACCOUNTING_ANALYSIS**
- Database writes by ChatGPT: **0**

## Next action

1. Continue source analysis of external-asset terminal/accounting behavior for CUSTOMER_OWNED and SUPPLIER_OWNED cylinders, including the distinction between logical owned-asset count and active operational asset balance.
2. Reconcile LOST / DAMAGED / DECOMMISSIONED / CLOSED event semantics with identifier and custody/location rules already validated in V174–V177.
3. Add resulting UI/runtime scenarios to the postponed test backlog.
4. Create V178 only if a concrete schema/function mismatch is proved; do not create a migration merely to advance the version.
