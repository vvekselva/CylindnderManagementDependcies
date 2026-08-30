# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration deltas/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.**

## Execution boundary

- The prior populated database is not an ownership-migration input and its application rows are discarded.
- Ownership-model acceptance is based on a fresh database created by the normal Flyway chain.
- Delta ZIPs contain only changed/new files, preserving workspace-relative paths.
- GitHub is durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Historical migrations remain unchanged by default.
- No legacy cylinder/identifier backfill is required for the fresh application.
- No raw/manual SQL substitutes for Flyway migration execution.

## Current workspace

User workspace snapshot: `Harinandhan-Cylinder-Backup(20260830-100356).zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

The current application ingestion service resolves the ownership type, derives company/exchangeable flags from the master, populates only the correct owner side, creates the active primary identifier and creates the initial yard inventory record.

Historical V144 introduced the ownership schema. V149 added ownership-aware lifecycle logging and the external cylinder asset ledger. V174 strengthens the database ownership rules.

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

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

Current source/migration evidence:

- New supplier-owned cylinders receive initial `FULL` Yard state with source `SUPPLIER_RETURN`.
- New customer-owned cylinders receive initial `EMPTY` Yard state with source `CUSTOMER_RETURN`.
- V149 routes external registration/terminal events to `tbl_external_cylinder_asset_ledger`.
- External identifier replacement is count-neutral (`delta=0`).
- Supplier-owned logical asset-count preservation remains under end-to-end validation.

### Location exclusivity — Customer/Supplier/Decommissioned taken up

The user explicitly requested completion of the three buckets previously documented as future extension points.

Implemented source delta now evaluates five mutually exclusive buckets for the Yard -> Vehicle precondition:

1. Yard inventory
2. Vehicle logistics
3. Customer active custody
4. Supplier active custody
5. Decommissioned terminal status

Authoritative sources:

- Customer/Supplier: `tbl_cylinder_party_custody` ACTIVE rows with `exited_at IS NULL`.
- Decommissioned: latest `tbl_cylinder_state_audit` state resolving to `DECOMMISSIONED`.
- Legacy `tbl_cylinder_current_status` is not used as the ownership-model decision source.

Application source commits:

- DAO location queries: `38d3555879edafc92eebfeeeff2cf88808942cff`
- Validator completion: `c74e9011acd3ef27aca352d3933f09ebfa804feb`
- Focused JUnit test: `ac14d8363871ffe9bf46fa3eddcb2170b5109aa4`

Evidence: `BL-008/evidence/20260830-phase2-location-exclusivity-source-delta.md`.

Validation status: **IMPLEMENTED / FOCUSED JUNIT EXECUTION PENDING**. Maven was unavailable in the ChatGPT execution container, so no runtime test PASS is claimed yet.

No schema change was required for these validator buckets; therefore this work does **not** create V175.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- Legacy application data preservation: **NOT REQUIRED**
- Legacy identifier backfill: **NOT REQUIRED**
- Historical migration rewrites: **0**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- Phase 2: **SUPPLIER_CUSTOMER_LIFECYCLE_ANALYSIS_ACTIVE**
- Location exclusivity Customer/Supplier/Decommissioned: **IMPLEMENTED_SOURCE_VALIDATION_PENDING**
- Current state: **V174_PASS_PHASE2_LIFECYCLE_AND_LOCATION_EXCLUSIVITY_ACTIVE**
- Database writes by ChatGPT: **0**

## Next action

1. Execute the focused `CylinderLocationExclusivityValidatorTest` in the normal Maven/Eclipse project environment.
2. Continue the supplier-owned/customer-owned lifecycle and external-ledger analysis, especially supplier logical asset-count preservation and terminal-event accounting.
3. Create V175 only if a concrete database mismatch is proved; do not create it merely to advance the version.
