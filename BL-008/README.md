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

Prepared integrated workspace through V177: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens database ownership rules. V175 preserves supplier-owned logical asset count through replacement and terminal lifecycle events. V176 enforces customer-owned owner/custody consistency. V177 enforces database-wide cross-table location exclusivity. V178 is the next additive migration and hardens external-asset terminal/accounting integrity.

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

Overall: **BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0**.

Evidence: `BL-008/evidence/20260831-v177-clean-database-validation-pass.md`.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

### Location exclusivity — application + database enforcement complete

The Yard -> Vehicle Java precondition evaluates Yard inventory, Vehicle logistics, Customer active custody, Supplier active custody, and Decommissioned terminal status. V177 provides database-wide deferred enforcement across the same authoritative physical/terminal location model.

Focused unit execution and positive/negative runtime hand-off scenarios remain deferred to the governed test backlog.

### Supplier refill physical-identifier exchange — source implemented

The supplier-refill collection path supports an optional changed returned identifier while retaining the same logical cylinder. UI/runtime validation is postponed and non-blocking in the governed test backlog.

### Customer-owned owner/custody consistency — V176 PASS

A CUSTOMER_OWNED cylinder can open CUSTOMER custody only at its owner customer. Supplier refill custody remains allowed without ownership transfer. UI/runtime lifecycle cases remain postponed and tracked in `BL-008/test-case-backlog.csv`.

### Cross-table location exclusivity — V177 PASS

The database enforces `active_location_bucket_count <= 1` at transaction end across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state.

### External-asset terminal/accounting consistency — V178 AUTHORED / CLEAN VALIDATION PENDING

Source analysis proved two remaining database-boundary gaps in `tbl_external_cylinder_asset_ledger`:

1. V175 constrains event/delta semantics but does not independently prove that an external-ledger row's event family, ownership type, owner party and product match the referenced cylinder.
2. CUSTOMER_OWNED terminal events (`CLOSED`, `LOST`, `DECOMMISSIONED`) shrink the active external balance by `-1`, but the ledger had no one-time/idempotence guard preventing repeated terminal bookkeeping from shrinking the same logical cylinder more than once.

V178: `V178__Harden_External_Asset_Terminal_Accounting.sql`

V178 adds:

- `chk_external_asset_ledger_owner_shape`: supplier events carry only supplier owner; customer events carry only customer owner;
- `fn_validate_external_asset_ledger_context()` plus trigger: event family, ownership type, owner party and product must match `tbl_cylinder`;
- `uq_external_asset_customer_terminal_shrink_per_cylinder`: at most one customer terminal shrink across CLOSED/LOST/DECOMMISSIONED per logical cylinder;
- idempotent suppression of repeated customer terminal shrink insertion at the ledger boundary;
- `vw_customer_owned_asset_count_integrity`: reconciles logical customer-owned population, state terminal assets, reserved CLOSED exits, registration events, terminal shrink events and active ledger balance.

Supplier-owned accounting remains governed by V175: supplier registration is `+1`, identifier/condition/terminal events are `0`, and `vw_supplier_owned_asset_count_integrity` reconciles the stable supplier logical asset population.

CUSTOMER_ASSET_CLOSED remains supported/reserved by the existing schema, but current application source exposes no governed CLOSED producer. V178 does not invent a UI/service workflow for it; a future CLOSED workflow must be separately source-proved and approved.

V178 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

UI, unit and runtime workflow tests that are postponed remain explicit test cases for the later consolidated test phase. Backlog: `BL-008/test-case-backlog.csv`.

The backlog now also includes V178 wrong-context rejection, repeated customer-terminal idempotence, customer active-balance reconciliation, and a reserved CLOSED test that remains PLANNED until a governed CLOSED producer exists.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- V178: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- Location exclusivity Customer/Supplier/Decommissioned: **APPLICATION_AND_DATABASE_ENFORCEMENT_COMPLETE / RUNTIME_TEST_BACKLOG**
- Supplier refill physical-identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned owner/custody consistency: **V176_PASS / UI_RUNTIME_TEST_POSTPONED**
- External-asset accounting: **V178_AUTHORED / CLEAN_VALIDATION_PENDING / RUNTIME_TEST_BACKLOG**
- UI testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2: **V178_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Integrate `V178__Harden_External_Asset_Terminal_Accounting.sql` into the current V177-validated workspace.
2. Perform a fresh clean Flyway migration through V178.
3. Execute `BL008_Ownership_V178_External_Asset_Terminal_Accounting_Validation.sql` and return its consolidated result table.
4. Keep V178 runtime/UI scenarios postponed in `BL-008/test-case-backlog.csv`.
5. After V178 acceptance, continue the next source-proved Ownership Model requirement; do not create V179 merely to advance the version.
