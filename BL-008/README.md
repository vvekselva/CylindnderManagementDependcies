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

Authoritative user workspace snapshot for further source changes: `Harinandhan-Cylinder-Backup(20260830-140843).zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

The application ingestion path resolves the ownership type, derives company/exchangeable flags from the ownership master, populates only the correct owner side, creates the active primary identifier and creates the initial yard inventory record.

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens database ownership rules. V175 preserves supplier-owned logical asset count through replacement and terminal lifecycle events. V176 is the next additive migration and enforces customer-owned owner/custody consistency.

## V174 — CLEAN DATABASE VALIDATION PASS

Migration: `V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

Fresh-database validation result:

- Flyway V174: **PASS**
- `tbl_cylinder_count=0`: **PASS**
- ownership type master: **PASS**
- strict owner constraint: **PASS**
- ownership trigger: **PASS**
- valid COMPANY_OWNED / SUPPLIER_OWNED / CUSTOMER_OWNED: **PASS**
- tested invalid owner/type/flag combinations rejected: **PASS**
- overall: **BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0**

Evidence: `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`.

## V175 — CLEAN DATABASE VALIDATION PASS

Migration: `V175__Preserve_Supplier_Owned_Asset_Count.sql`

Fresh-database validation result:

- Flyway V175: **PASS**
- fresh cylinder count: **PASS (`0`)**
- external-ledger single-registration index: **PASS**
- external-ledger delta constraint: **PASS**
- supplier asset-count integrity view and expected columns: **PASS**
- supplier replacement owner-match guard: **PASS**
- supplier lifecycle count-neutral guard: **PASS**
- supplier registration `+1`: **PASS**
- supplier identifier replacement `0`: **PASS**
- supplier decommission `0`: **PASS**
- supplier decommission `-1`: correctly rejected
- customer terminal/replacement semantics: **PASS**
- overall: **BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0**

Evidence: `BL-008/evidence/20260830-v175-clean-database-validation-pass.md`.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

### Location exclusivity — implemented

The Yard -> Vehicle precondition now evaluates five mutually exclusive buckets:

1. Yard inventory
2. Vehicle logistics
3. Customer active custody
4. Supplier active custody
5. Decommissioned terminal status

Authoritative sources:

- Customer/Supplier: `tbl_cylinder_party_custody` ACTIVE rows with `exited_at IS NULL`.
- Decommissioned: latest `tbl_cylinder_state_audit` state resolving to `DECOMMISSIONED`.
- Legacy `tbl_cylinder_current_status` is not used as the ownership-model decision source.

Focused JUnit execution is deferred to the governed test-case backlog.

### Supplier refill physical-identifier exchange — source implemented

The supplier-refill collection path supports an optional changed returned identifier while retaining the same logical cylinder. The existing V175 database replacement function preserves supplier-owned logical asset count with a zero-delta replacement event.

The UI/runtime validation scenario requires a real supplier-owned refill exchange to create `SUPPLIER_REPLACED_AFTER_REFILL`. The user explicitly postponed UI testing; therefore this validation is classified as **POSTPONED / NON-BLOCKING**, not as an implementation failure.

### Customer-owned owner/custody consistency — V176 READY FOR CLEAN VALIDATION

Source/migration analysis proved a database boundary gap: `tbl_cylinder.fk_owner_customer` identifies the owner of a `CUSTOMER_OWNED` cylinder, but the generic party-custody path could otherwise open CUSTOMER custody at a different customer.

V176: `V176__Enforce_Customer_Owned_Custody_Consistency.sql`

V176 adds:

- exact party column shape on `tbl_cylinder_party_custody`: CUSTOMER custody has only `fk_customer`; SUPPLIER custody has only `fk_supplier`;
- ACTIVE/CLOSED custody status consistency with exit metadata;
- `fn_validate_customer_owned_custody_owner()` plus trigger at the authoritative custody boundary;
- rule: if a `CUSTOMER_OWNED` cylinder is in CUSTOMER custody, that customer must equal `tbl_cylinder.fk_owner_customer`;
- supplier refill custody remains allowed for a customer-owned cylinder;
- `vw_customer_owned_custody_integrity` for operational integrity checks.

No backfill is included because the governed target is a fresh database.

V176 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

Backlog: `BL-008/test-case-backlog.csv`.

## Test policy / backlog

UI and runtime workflow tests that are postponed are retained as explicit test cases and executed later as a consolidated test phase. They do not justify manual test-data insertion or speculative migrations.

Current queued tests include location-exclusivity unit execution, supplier refill exchange scenarios, customer-owned owner-customer delivery, negative delivery to a non-owner customer, customer-owned supplier refill, identifier-owner mismatch rejection, and customer-owned terminal lifecycle behavior.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- Authoritative source workspace: **Harinandhan-Cylinder-Backup(20260830-140843).zip**
- Legacy application data preservation: **NOT REQUIRED**
- Legacy identifier backfill: **NOT REQUIRED**
- Historical migration rewrites: **0**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- Location exclusivity Customer/Supplier/Decommissioned: **IMPLEMENTED / TEST BACKLOG**
- Supplier refill physical-identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned owner/custody consistency: **V176_READY_FOR_VALIDATION / UI_RUNTIME_TESTS_POSTPONED**
- UI testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2: **V176_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Integrate V176 into the current workspace and perform the clean Flyway migration through V176.
2. Execute the consolidated V176 clean-database validation script and return its single result table.
3. Keep customer-owned UI/runtime scenarios postponed in `BL-008/test-case-backlog.csv`.
4. After V176 acceptance, continue the next source-proved Ownership Model requirement; do not create V177 merely to advance the version.
