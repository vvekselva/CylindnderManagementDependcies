# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.** UI/runtime tests may be deferred into the governed test-case backlog and do not block independent migration/source work unless a specific acceptance gate requires them.

## Execution boundary

- Ownership acceptance target: fresh database / normal clean Flyway chain.
- Prior populated application rows are not migration input.
- No legacy cylinder/identifier backfill is required.
- Historical migrations remain unchanged by default.
- Delta ZIPs contain changed/new files only and preserve workspace-relative paths.
- GitHub is durable SSOT/version control only; orchestration execution remains outside GitHub runners.
- No raw/manual SQL substitutes for Flyway migration execution.

## Current workspace

Validated source line through V178 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176, V177 and V178 deltas.

Prepared integrated workspace through V179: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179.zip`.

Workspace verification after the first V179 validation attempt confirmed that V174, V175, V176, V177, V178 and V179 are all physically present under `cylinder.datascripts/src/main/resources/db/migration` in this integrated ZIP.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 made lifecycle/ledger behavior ownership-aware. V174 enforces strict owner/type/flag consistency. V175 preserves supplier-owned logical asset count. V176 enforces customer-owned owner/custody consistency. V177 enforces database-wide location exclusivity. V178 hardens external-asset accounting. V179 is the next additive migration and hardens company-fleet accounting.

## Accepted clean-database gates

- **V174** `V174__Enforce_Strict_Cylinder_Ownership_Model.sql` — `BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0`
- **V175** `V175__Preserve_Supplier_Owned_Asset_Count.sql` — `BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0`
- **V176** `V176__Enforce_Customer_Owned_Custody_Consistency.sql` — `BL008_OWNERSHIP_V176_VALIDATION_PASS; failed_checks=0`
- **V177** `V177__Enforce_Cross_Table_Cylinder_Location_Exclusivity.sql` — `BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0`
- **V178** `V178__Harden_External_Asset_Terminal_Accounting.sql` — `BL008_OWNERSHIP_V178_VALIDATION_PASS; failed_checks=0`

Evidence:

- `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`
- `BL-008/evidence/20260830-v175-clean-database-validation-pass.md`
- `BL-008/evidence/20260830-v176-clean-database-validation-pass.md`
- `BL-008/evidence/20260831-v177-clean-database-validation-pass.md`
- `BL-008/evidence/20260831-v178-clean-database-validation-pass.md`

## Phase 2 — Supplier/Customer/Company Ownership Lifecycle — ACTIVE

### Location exclusivity — application + database enforcement complete

The application Yard -> Vehicle precondition evaluates Yard, Vehicle logistics, Customer custody, Supplier custody and Decommissioned. V177 provides deferred database enforcement across the same authoritative buckets. Runtime hand-off cases remain in the postponed test backlog.

### Supplier refill physical-identifier exchange — source implemented

Supplier refill may optionally replace the physical identifier while retaining the same logical supplier-owned cylinder. V175 keeps the supplier logical asset balance count-neutral. UI/runtime execution remains postponed and non-blocking.

### Customer-owned owner/custody consistency — V176 PASS

A CUSTOMER_OWNED cylinder can open CUSTOMER custody only at its owner customer. Supplier refill custody remains allowed without changing ownership.

### External-asset accounting — V178 PASS

V178 enforces external-ledger owner shape and validates event family, ownership type, owner party and product against the referenced external cylinder. Customer terminal shrink across CLOSED/LOST/DECOMMISSIONED is one-time/idempotent, and `vw_customer_owned_asset_count_integrity` reconciles active customer external-asset balance. Supplier-owned accounting remains governed by V175 and its stable logical-count integrity view.

### Company-fleet accounting — V179 AUTHORED / EXECUTION TARGET MISMATCH TO RESOLVE

V179: `V179__Harden_Company_Fleet_Accounting_Integrity.sql`

The first returned V179 validation result is **not classified as a V179 SQL failure**. It showed:

- `FLYWAY_V179=FAIL`;
- every V179 object absent;
- V178, V177, V176, V175 and V174 regression objects also absent;
- `tbl_cylinder_count=0` and the historical fleet-summary view still present.

Because V174–V178 had already passed clean validation previously, and the integrated V179 workspace has now been independently verified to contain all migrations V174 through V179, this result proves the validation was executed against a database/source run that did not execute the governed ownership migration chain. Classification: **VALIDATION_TARGET_NOT_MIGRATED_THROUGH_V174_V179**.

This is not evidence of V179 transaction rollback because the earlier accepted ownership objects are absent as well.

Before rerunning V179 validation, execute the read-only `BL008_Flyway_174_179_Execution_Diagnostic.sql` against the same database and verify V174–V179 are recorded successfully. Then perform/redo the clean Flyway migration using the integrated V179 workspace if necessary.

## Test policy / backlog

Postponed UI/unit/runtime cases remain explicit in `BL-008/test-case-backlog.csv` and are non-blocking for clean migration gates. The backlog includes V179 terminal idempotence, concurrent fleet accounting, mixed-ownership dashboard scope and append-only ledger mutation cases.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- V178: **CLEAN_DATABASE_VALIDATED_PASS**
- V179: **AUTHORED / CLEAN_EXECUTION_NOT_YET_PROVED**
- First V179 validation classification: **VALIDATION_TARGET_NOT_MIGRATED_THROUGH_V174_V179**
- Integrated V179 workspace migration presence: **V174–V179 VERIFIED_PRESENT**
- Location exclusivity: **APPLICATION_AND_DATABASE_ENFORCEMENT_COMPLETE / RUNTIME_TEST_BACKLOG**
- Supplier refill identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned custody consistency: **V176_PASS / UI_RUNTIME_TEST_POSTPONED**
- External-asset accounting: **V178_PASS / RUNTIME_TEST_BACKLOG**
- Company-fleet accounting: **V179_AUTHORED / EXECUTION_DIAGNOSTIC_AND_CLEAN_RERUN_PENDING**
- UI/runtime testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2 gate: **V179_EXECUTION_DIAGNOSTIC_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Run `BL008_Flyway_174_179_Execution_Diagnostic.sql` against the exact database used for the failed V179 validation.
2. Confirm whether V174–V179 were executed; if not, perform a fresh clean Flyway migration using `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179.zip`.
3. Verify Flyway records V174, V175, V176, V177, V178 and V179 successfully.
4. Run `BL008_Ownership_V179_Company_Fleet_Accounting_Validation.sql` only after that confirmation.
5. Return the consolidated V179 result table for acceptance.
