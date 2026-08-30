# BL-008 — Database Migration Authoring / Existing-Database Apply Workflow

Current governed mode: **ChatGPT authors additive Flyway migration changes; the user applies them to the existing PostgreSQL database and returns the Flyway result.**

This supersedes the earlier wording that referred to a fresh/new database. No database recreation is required.

## Execution boundary

- ChatGPT owns source analysis, migration design, additive SQL authoring, consistency checks, corrective follow-up, and durable BL-008 evidence.
- The user owns execution of the normal Flyway migration process against the **existing database** and returns the migration result/error to ChatGPT.
- Existing database data, schema and `flyway_schema_history` are preserved.
- Flyway determines the pending migration from the existing history. Already-applied migrations are not rerun.
- GitHub remains durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Migration changes are additive by default. Existing historical migrations are not rewritten unless the user explicitly approves a historical repair because an earlier failed migration cannot be corrected by a later migration.
- Flyway remains the migration mechanism. Raw/manual SQL replay is not a substitute for the migration chain.
- **Do not use `flyway clean`, drop/recreate the database, clear `flyway_schema_history`, or re-baseline the existing database merely to apply BL-008 corrections.**

## Current application source being reconciled

Uploaded application backup: `Harinandhan-Cylinder-Backup(20260830-093548).zip`.

Current migration directory:

`cylinder.datascripts/src/main/resources/db/migration`

The uploaded project contains migrations through V170 before the current BL-008 additive correction.

## Static application/schema reconciliation

The current Java DAO/entity layer references:

- `public.vw_customer_order_request_dashboard`
- `public.vw_customer_order_request_daily_product_metrics`

The existing migration chain creates the equivalent legacy relations:

- `public.vw_customer_demand_dashboard`
- `public.vw_customer_demand_daily_product_metrics`

The dashboard DAO directly queries `vw_customer_order_request_dashboard`, so the migration set did not fully expose all relation names expected by the application source.

## V171 additive correction

Migration:

`V171__Customer_Order_Request_View_Compatibility.sql`

It preserves the legacy `vw_customer_demand_*` views and adds compatibility views with the exact names/columns expected by the current Java mappings.

No V1-V170 migration was modified.

## V171 existing-database validation — PASS

User applied V171 through the normal Flyway process against the existing database and returned the consolidated validation result.

Validation evidence: `BL-008/evidence/20260830-v171-existing-database-validation-pass.md`.

Verified:

- V171 exists in `flyway_schema_history` with `success=true`.
- `vw_customer_order_request_dashboard` exists.
- `vw_customer_order_request_daily_product_metrics` exists.
- All expected compatibility-view columns are present.
- Dashboard compatibility/legacy row counts match (`0 = 0`) and data difference is `0`.
- Daily metrics compatibility/legacy row counts match (`11 = 11`) and data difference is `0`.
- Overall consolidated database validation result is `PASS`.

Conclusion: **V171 is database-validated. No V172 is required to repair the V171 scope.**

## Existing-database execution / feedback loop

1. ChatGPT analyzes the next source/schema mismatch, if any.
2. ChatGPT supplies a **delta-only ZIP** containing only new/changed files under their workspace-relative paths.
3. User points the normal Flyway-enabled application/migration process to the **existing database**.
4. Flyway validates existing migration history and applies only pending migrations.
5. User runs one consolidated validation script and returns its final result table.
6. ChatGPT records the evidence and either accepts the migration or authors the next additive migration if evidence proves another correction is required.
7. If a failure occurs inside an already-pending older migration before a new additive migration can run, ChatGPT identifies that separately; a later migration cannot repair an earlier migration that never completed.

## Current state

- Existing migrations modified: **0**
- New migrations added in current handoff: **1**
- Latest new migration: **V171**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- V171 database validation: **PASS**
- Current BL-008 state: **V171_DATABASE_VALIDATED_PASS**
- V172 required for V171 scope: **NO**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 continues source/schema reconciliation for any next proven mismatch.
