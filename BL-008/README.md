# BL-008 — Database Migration Authoring / Existing-Database Apply Workflow

Current governed mode: **ChatGPT authors additive Flyway migration changes; the user applies them to the existing PostgreSQL database and returns the Flyway result.**

This supersedes the earlier wording that referred to a fresh/new database. No database recreation is required.

## Execution boundary

- ChatGPT owns source analysis, migration design, additive SQL authoring, consistency checks, corrective follow-up, consolidated validation-script generation, and durable BL-008 evidence.
- The user owns execution of the normal Flyway migration process and consolidated validation scripts against the **existing database**, then returns the result to ChatGPT.
- Existing database data, schema and `flyway_schema_history` are preserved.
- Flyway determines pending migrations from existing history. Already-applied migrations are not rerun.
- GitHub remains durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Migration changes are additive by default. Existing historical migrations are not rewritten unless the user explicitly approves a historical repair because an earlier failed migration cannot be corrected by a later migration.
- Flyway remains the migration mechanism. Raw/manual SQL replay is not a substitute for the migration chain.
- **Do not use `flyway clean`, drop/recreate the database, clear `flyway_schema_history`, or re-baseline the existing database merely to apply BL-008 corrections.**

## Current application source being reconciled

Current user workspace snapshot: `Harinandhan-Cylinder-Backup(20260830-100356).zip`.

Migration directory:

`cylinder.datascripts/src/main/resources/db/migration`

The workspace snapshot contains migrations through V170 before the BL-008 additive correction. V171 is maintained as the next additive migration delta.

## V171 additive correction

Migration:

`V171__Customer_Order_Request_View_Compatibility.sql`

It preserves the legacy `vw_customer_demand_*` views and adds compatibility views with the exact names/columns expected by current Java mappings.

No V1-V170 migration was modified.

## V171 existing-database validation — PASS

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

## Next governed step — full application schema compatibility audit

Before authoring V172, the current workspace is statically reconciled against the migration corpus and the existing database must now be checked in one consolidated run.

Generated validation artifact:

`BL008_Full_Schema_Audit_After_V171.sql`

Audit scope derived from the main runtime/DAO source:

- 119 mapped or directly referenced runtime relations (tables/views),
- 1,134 explicit JPA mapped columns (`@Column`, `@JoinColumn`, `@PrimaryKeyJoinColumn`),
- 68 explicitly configured sequences,
- V171 Flyway history success.

The audit is read-only against permanent application data/schema and uses temporary session tables only for reporting. It returns failures-only, summary counts and one overall PASS/FAIL line.

Decision rule:

- `BL008_FULL_SCHEMA_AUDIT_PASS` -> do **not** create V172 from static schema mapping; advance to application/runtime functional smoke testing.
- `BL008_FULL_SCHEMA_AUDIT_FAIL` -> analyze only the proved failures and author the smallest additive V172 correction when possible.

## Existing-database execution / feedback loop

1. ChatGPT analyzes the next source/schema mismatch, if any.
2. ChatGPT supplies delta-only migration ZIPs only when a proved schema correction exists.
3. User applies pending Flyway migrations to the existing database.
4. User runs one consolidated validation script and returns the final output.
5. ChatGPT records the evidence and either accepts the migration/audit or authors the next additive migration.
6. If a failure occurs inside an already-pending older migration before a new additive migration can run, ChatGPT identifies that separately; a later migration cannot repair an earlier migration that never completed.

## Current state

- Existing migrations modified: **0**
- New migrations added in current handoff: **1**
- Latest new migration: **V171**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- V171 database validation: **PASS**
- V172 required for V171 scope: **NO**
- Full application schema audit: **WAITING_FOR_USER_SINGLE_RUN_RESULT**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 waits for the consolidated schema-audit result.
