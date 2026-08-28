# BL-008 — Database Migration Execution Status

Latest governed fire: `CYLINDER-MANUAL-FIRE-20260829-042152IST`.

## Target policy

- Current explicitly approved provider evaluation target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Supabase database discovered by ChatGPT: `postgres`.
- PostgreSQL version: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism remains **Flyway only**.
- Manual SQL substitution for Flyway migrations is **FORBIDDEN**.
- Supabase-native `apply_migration` or raw SQL execution must **not** be used to replay the frozen Flyway migration files as a substitute for Flyway.
- Full automation is mandatory and all automation must come from ChatGPT's own available execution/tooling environment.
- Do not require user-run terminal commands, a local bridge, an external worker runtime, or GitHub Actions.
- Neon is retained as prior provider evidence/alternate only; this evaluation does not delete or modify the existing Neon project.

## Supabase connectivity result

ChatGPT-side Supabase database access is working.

- Project: `xipkywwvzvrwcqnkifuv`
- Project health: `ACTIVE_HEALTHY`
- Database identity read: **PASS**
- PostgreSQL: `17.6`
- Database: `postgres`
- Connected role: `postgres`
- `public.flyway_schema_history` exists: **NO**
- Public tables returned by the Supabase project inspection: **0**
- Supabase migration history entries: **0**
- Database writes performed by the Orchestrator in this flow: **0**

This resolves the prior ChatGPT-to-database visibility problem for the Supabase evaluation target. It does **not** by itself prove that a compliant Flyway runtime is available.

## Control inventory currently recorded

The control SSOT currently declares this frozen source:

Repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Path: `cylinder.datascripts/src/main/resources/db/migration`

`migration-inventory.txt` currently claims V1 through V17 at that exact source/path.

## Frozen-source validation result — FAIL CLOSED

Direct inspection of the exact frozen Git commit/path does **not** match the control inventory:

- `V1__create_initial_schema_and_master_data.sql` at the declared frozen commit/path returned **404 / Not Found**.
- At the same declared frozen commit/path, `V100__StateMachineMigrationFixes.sql` is present and readable.
- Therefore the control inventory claiming V1 through V17 is not currently proven against the exact frozen source binding.

The Orchestrator must not silently replace the declared V1–V17 set with V100+ files, must not infer V1 merely because the Supabase database is empty, and must not choose any migration until the frozen-source binding is reconciled.

## Current primary blocker

`BL008_FROZEN_MIGRATION_SOURCE_MISMATCH`

Effect: the required version + filename + checksum + ordering source cannot be proved from the currently declared frozen commit/path, so no migration can be selected or validated safely.

## Secondary execution blocker

`BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE`

Current ChatGPT execution image evidence remains:

- Java 21: available.
- Maven: not installed.
- Flyway CLI: not installed.
- Direct outbound PostgreSQL/DNS from the ChatGPT execution container is unavailable.
- Supabase connector SQL access works, but Supabase connector SQL/native migration actions are not Flyway and therefore cannot substitute for the required Flyway execution mechanism.

The source mismatch is the first gate and must be resolved before the runtime blocker can become the active migration gate.

## Safety result

- `flyway_schema_history`: **PROVED ABSENT ON SUPABASE TARGET**
- Exact next Flyway migration: **NOT SELECTED**
- Flyway validate: **NOT PERFORMED**
- Flyway migrate: **NOT PERFORMED**
- Supabase native migration replay of Flyway files: **NOT PERFORMED**
- Manual SQL migration: **NOT PERFORMED**
- Database writes: **0**
- Supabase project/branch destructive changes: **0**
- Existing Neon project destructive changes: **0**

## Governed next flow

1. Reconcile `BL-008/migration-inventory.txt` with an exact, immutable Git source that actually contains the intended migrations.
2. Prove every selected migration's version, filename, checksum, order and prerequisites from that exact source.
3. Keep the Supabase target read-only until the source binding is valid.
4. Re-check for a genuine ChatGPT-native Flyway-capable execution path.
5. Only when both source binding and Flyway runtime are valid, run Flyway validation and apply exactly one requirement.
6. Re-read Flyway history and verify schema/ownership/integrity before considering another requirement.
7. Never substitute Supabase raw SQL or Supabase-native migration execution for Flyway.
8. A blocked BL-008 stream must not stop independently eligible BL-002 work.
