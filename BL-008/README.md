# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.**

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

V174:

1. replaces the broad owner-shape check with an exact structural rule;
2. adds `fn_validate_cylinder_ownership_model()`;
3. adds `trg_validate_cylinder_ownership_model` on `tbl_cylinder`;
4. validates ownership type, active state, correct owner side and ownership flags without hard-coding lookup IDs;
5. performs no cylinder-data backfill.

Fresh-database validation result:

- Flyway V174: **PASS**
- `tbl_cylinder_count=0`: **PASS**
- ownership type master: **PASS**
- strict owner constraint: **PASS**
- ownership trigger: **PASS**
- valid COMPANY_OWNED: **PASS**
- valid SUPPLIER_OWNED: **PASS**
- valid CUSTOMER_OWNED: **PASS**
- all tested invalid owner/type/flag combinations rejected: **PASS**
- overall: **BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0**

Evidence: `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`.

## Phase 2 — Supplier/Customer Ownership Lifecycle — ACTIVE

Static source/migration review has started.

Current source evidence:

- `CylinderIngestionService` creates the logical cylinder using the governed ownership type and correct owner side.
- New supplier-owned cylinders receive an initial `FULL` yard state with source type `SUPPLIER_RETURN`.
- New customer-owned cylinders receive an initial `EMPTY` yard state with source type `CUSTOMER_RETURN`.
- V149 routes supplier/customer-owned registration and terminal events to `tbl_external_cylinder_asset_ledger`, while company-owned cylinders use the company fleet ledger.
- Identifier replacement for supplier/customer-owned cylinders is recorded with ledger `delta=0`, preserving logical asset count across identifier changes.
- The application currently has no Java DAO/entity consuming `tbl_external_cylinder_asset_ledger`; it is presently database-side accounting evidence.
- `CylinderLocationExclusivityValidator` explicitly states customer/supplier/decommissioned location counts are future extension points, so end-to-end location exclusivity is not yet complete for all ownership lifecycle buckets.

The next migration version is **not pre-assigned**. V175 will be authored only if Phase-2 source/database validation proves an additive database correction is required.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- Legacy application data preservation: **NOT REQUIRED**
- Legacy identifier backfill: **NOT REQUIRED**
- Historical migration rewrites: **0**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- Phase 2: **SUPPLIER_CUSTOMER_LIFECYCLE_ANALYSIS_ACTIVE**
- Current state: **V174_PASS_PHASE2_OWNERSHIP_LIFECYCLE_ACTIVE**
- Database writes by ChatGPT: **0**

## Next action

Validate the supplier-owned and customer-owned lifecycle/accounting contract end to end, including initial state, external-asset registration, identifier replacement count neutrality, terminal event accounting, location exclusivity and the supplier-owned count-preservation requirement. Create V175 only where a concrete source/database mismatch is proven.
