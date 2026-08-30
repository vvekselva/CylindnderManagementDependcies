# BL-008 — Database Migration Authoring / Local Apply Workflow

Current governed mode: **ChatGPT authors migration changes; the user applies them to a fresh PostgreSQL database and returns the Flyway result.**

This supersedes the earlier Testcontainers/Supabase execution requirement for BL-008. No local runner package or ChatGPT-side database connection is required for the current workflow.

## Execution boundary

- ChatGPT owns source analysis, migration design, additive SQL authoring, consistency checks, corrective follow-up, and durable BL-008 evidence.
- The user owns execution of the normal Flyway migration chain against the new local database and returns the migration result/error to ChatGPT.
- GitHub remains durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- Migration changes are additive by default. Existing historical migrations are not rewritten unless the user explicitly approves a historical migration repair because a fresh-database failure cannot be corrected by a later migration.
- Flyway remains the migration mechanism. Raw/manual SQL replay is not a substitute for the migration chain.
- Never use `flyway clean` against a database containing required data.

## Current application source being reconciled

Uploaded application backup: `Harinandhan-Cylinder-Backup(20260830-093548).zip`.

Current migration directory:

`cylinder.datascripts/src/main/resources/db/migration`

The uploaded project currently contains V1 through V170, with historical gaps in version numbers where no migration file exists.

## Static application/schema reconciliation

The current Java DAO/entity layer references:

- `public.vw_customer_order_request_dashboard`
- `public.vw_customer_order_request_daily_product_metrics`

The existing migration chain creates the equivalent legacy relations:

- `public.vw_customer_demand_dashboard`
- `public.vw_customer_demand_daily_product_metrics`

The dashboard DAO directly queries `vw_customer_order_request_dashboard`, so the current migration set does not fully expose all relation names expected by the application source.

## Current additive correction

New migration authored for the local handoff:

`V171__Customer_Order_Request_View_Compatibility.sql`

It preserves the legacy `vw_customer_demand_*` views and adds compatibility views with the exact names/columns expected by the current Java mappings.

No V1-V170 migration was modified.

## User execution / feedback loop

1. ChatGPT supplies the updated application/migration ZIP.
2. User runs the normal Flyway migration chain on the fresh PostgreSQL database.
3. User sends the Flyway result. If it fails, send the failing migration version, SQLSTATE/error text, and the relevant Flyway stack/error section.
4. ChatGPT analyzes the failure against source and migration history.
5. When an additive correction is possible, ChatGPT adds the next migration (`V172`, `V173`, ...), returns the updated package, and records the result.
6. If a fresh-database failure occurs inside an older migration before later migrations can run, ChatGPT must explicitly identify that an additive migration cannot execute yet and propose the smallest governed historical repair or another user-approved recovery path rather than pretending a later migration can fix an earlier failed migration.

## Current state

- Existing migrations modified: **0**
- New migrations added in current handoff: **1**
- Latest new migration: **V171**
- Database execution result: **WAITING_FOR_USER_LOCAL_FLYWAY_RESULT**
- User-local database writes by ChatGPT: **0**

BL-002 remains independently eligible and is not blocked while BL-008 waits for the local Flyway result.
