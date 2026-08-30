# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration deltas; the user performs a clean Flyway migration against a fresh PostgreSQL database and returns one consolidated validation result.**

## Execution boundary

- The prior populated database is not an ownership-migration input and its application rows will be discarded.
- Ownership-model migration validation is performed on a fresh database created by the normal Flyway chain.
- Delta ZIPs contain only changed/new files, preserving workspace-relative paths.
- GitHub is durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Historical migrations remain unchanged by default. Historical compatibility backfill statements that encounter zero application rows on the fresh database are harmless no-ops.
- No manual/raw SQL is substituted for Flyway migration execution.

## Current workspace

User workspace snapshot: `Harinandhan-Cylinder-Backup(20260830-100356).zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## V171–V173 — prior reconciliation evidence

V171, V172 and V173 passed their user-returned existing-database validations. Those results remain useful source/schema evidence, but the final Ownership Model acceptance target is now a fresh clean migration.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

The current application ingestion service already:

- resolves one of the three active ownership types;
- derives `is_company_fleet_asset` and `is_external_exchangeable` from the ownership-type master;
- sets only the correct owner side for supplier/customer-owned cylinders;
- creates an active primary cylinder identifier for each newly ingested cylinder.

Historical V144 introduced the ownership schema but its `chk_cylinder_owner_party_consistency` constraint is broader than the current type-specific rules.

## Disposition of the populated-database audit

The earlier baseline audit found 1327 legacy `COMPANY_OWNED` cylinders and zero active primary identifiers. The user clarified that this is a fresh application and those rows will be removed before final clean-migration acceptance.

Therefore:

- **no legacy cylinder or identifier backfill migration will be created**;
- the 1327-row identifier condition is not a blocker for the fresh Ownership Model migration;
- V144 backfill statements affect zero rows on the fresh target and need no historical rewrite.

## V174 — OWNERSHIP LOGIC PASS / CLEAN DATABASE RETEST PENDING

`V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

Application-source commit: `f590dd08b902de9580ba41ab530eed0c238e3736`.

V174:

1. replaces the broad owner-shape check with an exact structural rule that forbids both owners and requires exactly one owner for non-company cylinders;
2. adds `fn_validate_cylinder_ownership_model()`;
3. adds `trg_validate_cylinder_ownership_model` on `tbl_cylinder`;
4. validates the selected ownership type, active state, correct owner side, company-fleet flag and exchangeable flag without hard-coding lookup IDs;
5. performs no cylinder-data backfill.

### User-returned V174 validation

The validation was run against the prior populated database, so `FRESH_DATABASE_CYLINDER_COUNT` failed with `tbl_cylinder_count=1327`.

All V174 ownership enforcement checks passed:

- Flyway V174: **PASS**
- ownership type master: **PASS**
- strict owner constraint: **PASS**
- ownership trigger: **PASS**
- valid COMPANY_OWNED: **PASS**
- valid SUPPLIER_OWNED: **PASS**
- valid CUSTOMER_OWNED: **PASS**
- company with supplier owner rejected: **PASS**
- supplier without supplier owner rejected: **PASS**
- supplier with customer owner rejected: **PASS**
- customer without customer owner rejected: **PASS**
- customer with supplier owner rejected: **PASS**
- ownership flag mismatch rejected: **PASS**

Evidence: `BL-008/evidence/20260830-v174-ownership-logic-pass-clean-db-pending.md`.

Interpretation: **V174 ownership logic is accepted. The only unresolved item is validation on the true fresh database. No V175 is justified by this result.**

## Current state

- Ownership Model Migration: **ACTIVE**
- Migration target for Ownership Model: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- Legacy application data preservation: **NOT REQUIRED**
- Legacy identifier backfill: **CANCELLED / NOT REQUIRED**
- Historical migration rewrite: **0**
- Current ownership migration: **V174**
- V174 ownership enforcement logic: **PASS**
- V174 clean-database acceptance: **PENDING**
- Current state: **V174_LOGIC_PASS_WAITING_FOR_TRUE_CLEAN_DATABASE_VALIDATION**
- Database writes by ChatGPT: **0**

## Next action

Create/use the actual fresh PostgreSQL database, run the complete normal Flyway chain through V174, then rerun `BL008_Ownership_V174_Clean_Migration_Validation.sql` before entering application data.

Acceptance requires `FRESH_DATABASE_CYLINDER_COUNT = PASS` with `tbl_cylinder_count=0` and overall `BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0`.

After that clean-database PASS, continue with the next source-proved Ownership Model requirement, including supplier/customer asset lifecycle and supplier-owned count-preservation rules. Do not create later versions merely to advance the number.
