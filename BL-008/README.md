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

The dashboard DAO directly queries `vw_customer_order_request_dashboard`, so the migration set does not fully expose all relation names expected by the application source.

## Current additive correction

New migration authored:

`V171__Customer_Order_Request_View_Compatibility.sql`

It preserves the legacy `vw_customer_demand_*` views and adds compatibility views with the exact names/columns expected by the current Java mappings.

No V1-V170 migration was modified.

## Existing-database execution / feedback loop

1. ChatGPT supplies the updated application/migration ZIP.
2. User points the normal Flyway-enabled application/migration process to the **existing database**.
3. Flyway validates the existing migration history and applies only pending migrations, including V171 when appropriate.
4. User sends the Flyway result. If it fails, send the failing migration version, SQLSTATE/error text, and the relevant Flyway error/stack section.
5. ChatGPT analyzes the failure against source, current schema expectations and migration history.
6. When an additive correction is possible, ChatGPT adds the next migration (`V172`, `V173`, ...), returns the updated package, and records the result.
7. If the failure occurs inside an already-pending older migration before V171 can run, ChatGPT identifies that separately; a later migration cannot repair an earlier migration that never completed.

## Current state

- Existing migrations modified: **0**
- New migrations added in current handoff: **1**
- Latest new migration: **V171**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- Database execution result: **WAITING_FOR_USER_EXISTING_DATABASE_FLYWAY_RESULT**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible and is not blocked while BL-008 waits for the local Flyway result.
