# BL-008 — Database Migration Execution Status

Latest governed fire: `CYLINDER-MANUAL-FIRE-20260829-040620IST`.

## Target policy

- Environment: Neon TEST database.
- Database: `neondb` unless live authoritative discovery proves otherwise.
- Neon is the first-choice provider.
- No new Neon branches may be created.
- Database write parallelism: `1`.
- Migration mechanism: **Flyway only**.
- Manual SQL substitution for Flyway migrations: **FORBIDDEN**.
- Full automation is mandatory and all automation must come from ChatGPT's own available execution/tooling environment.
- Do not require user-run terminal commands, a local bridge, TRIGGERcmd, an external worker runtime, or GitHub Actions.
- User-supplied PostgreSQL credentials are runtime-only and must not be persisted in this repository.

## Frozen migration source

Repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Path: `cylinder.datascripts/src/main/resources/db/migration`

The frozen tree contains V1 through V17. See `migration-inventory.txt`.

## Latest ChatGPT-native manual fire

The Orchestrator acquired the singleton lease, persisted START + heartbeat, and ran the Neon-first execution probes.

Observed execution paths:

1. `NEON_MCP_MANAGEMENT_PATH = PASS_PROJECT_DISCOVERY`
   - The installed Neon Postgres/MCP-backed management integration successfully enumerated the connected organization and the current Cylinder TEST project.
   - The discovered project is PostgreSQL 18.
2. `NEON_MCP_SQL_PATH = BLOCKED_OBSERVED_ARGUMENT_VALIDATION`
   - A read-only `run_sql` probe was attempted using the action contract exposed to ChatGPT.
   - The action returned MCP error `-32602`: the backend required `project_id` while the exposed contract accepted `projectId` / `databaseName`.
   - This is runtime observation only. Vendor root cause remains `UNDETERMINED`.
3. `DIRECT_POSTGRES_PATH = BLOCKED_OUTBOUND_DNS`
   - The ChatGPT execution container attempted DNS resolution for the current Neon PostgreSQL endpoint and received `Temporary failure in name resolution`.
4. `CHATGPT_FLYWAY_RUNTIME = UNAVAILABLE_IN_CURRENT_EXECUTION_IMAGE`
   - Java 21 is present in the ChatGPT execution image.
   - Maven is not installed in the current execution image.
   - Flyway CLI is not installed in the current execution image.
   - Even if a Flyway binary were present, the current direct PostgreSQL path is still blocked by DNS.

## Safety result

Because `flyway_schema_history` could not be read, the Orchestrator did not infer the next migration and did not execute a migration.

- `flyway_schema_history`: **NOT READ**
- Flyway validate: **NOT PERFORMED**
- Flyway migrate: **NOT PERFORMED**
- Manual SQL migration: **NOT PERFORMED**
- Database writes: **0**
- New Neon branch created: **NO**

## Current blocker classification

Primary blocker:

`BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE`

Supporting evidence:

- `DIRECT_POSTGRES_PATH = BLOCKED_OUTBOUND_DNS`
- `NEON_MCP_MANAGEMENT_PATH = PASS_PROJECT_DISCOVERY`
- `NEON_MCP_SQL_PATH = BLOCKED_OBSERVED_ARGUMENT_VALIDATION`
- `CHATGPT_FLYWAY_RUNTIME = UNAVAILABLE_IN_CURRENT_EXECUTION_IMAGE`
- `NEON_VENDOR_ROOT_CAUSE = UNDETERMINED`
- `CHATGPT_WRAPPER_ROOT_CAUSE = UNDETERMINED`

## Retry policy

On each governed BL-008 fire:

1. Rediscover the live Neon target through ChatGPT-side management tools.
2. Attempt one read-only Neon SQL/history probe for each distinct error fingerprint.
3. Retry the direct PostgreSQL path only once per distinct runtime/network state.
4. Re-check whether a ChatGPT-native Flyway-capable runtime is available.
5. Only after `flyway_schema_history` is successfully read may the Orchestrator select the exact next migration.
6. Apply exactly one migration at a time through Flyway, then verify history/schema/ownership/integrity.
7. Never replay migration SQL manually through `run_sql` as a Flyway substitute.
8. If ChatGPT-native execution remains unavailable, persist the blocker and continue independently eligible BL-002 work.
9. Do not switch providers automatically. Any future provider evaluation requires explicit user approval and must also be fully automatable through ChatGPT-side tools.
