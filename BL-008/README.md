# BL-008 — Database Migration Execution Status

Run basis: `CYLINDER-MANUAL-FIRE-20260829-025819IST` plus the 29-Aug Neon MCP/tool-path review.

## Target policy

- Environment: Neon TEST database.
- Database: `neondb` unless the live authoritative target proves otherwise.
- No new Neon branches may be created.
- Database write parallelism: `1`.
- Manual SQL substitution for Flyway migrations: **FORBIDDEN**.
- User-supplied PostgreSQL connection URI is runtime-only; credentials are **not persisted** in this repository.
- The Orchestrator must resolve the live target from authoritative runtime/project evidence on each governed run and must not reuse stale hard-coded project/branch identifiers from older framework revisions.

## Frozen migration source

Repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Path: `cylinder.datascripts/src/main/resources/db/migration`

The frozen tree contains V1 through V17. See `migration-inventory.txt`.

## What is proved about the database/tool path

A direct PostgreSQL connection was attempted from the ChatGPT execution container using the PostgreSQL URI supplied by the user. The connection could not reach the database endpoint because outbound network/DNS access from that execution container was unavailable (`Temporary failure in name resolution`). An independent outbound HTTPS reachability probe also failed.

Separately, the installed Neon Postgres/MCP-backed integration can enumerate the user's Neon organization/project through management actions. A read-only SQL action was invoked using the action schema exposed to ChatGPT. The action then returned an argument-validation error in which the backend expected snake_case fields such as `project_id` while the exposed action contract accepted camelCase fields such as `projectId`.

This parameter behavior is **runtime observation evidence only**. Official Neon material documents the Neon MCP Server, ChatGPT MCP connectivity, and the existence of `run_sql`, but the Orchestrator has no vendor documentation proving the exact ChatGPT wrapper parameter-schema contract or attributing this mismatch to Neon REST API, SDK, MCP server, or ChatGPT. Therefore:

- Do **not** classify this as a Neon REST API defect.
- Do **not** classify this as a Neon SDK defect.
- Do **not** assert that Neon documentation confirms the observed parameter mismatch.
- Record the mismatch under the ChatGPT/Neon MCP SQL execution path with attribution `UNDETERMINED`.
- Preserve the exact observed error as execution evidence without converting it into a vendor-root-cause claim.

## Safety result

Because current `flyway_schema_history` could not be read, the Orchestrator cannot safely determine which frozen migration is the next unapplied migration. Therefore it did not infer a version and did not execute any migration.

- Read-only database validation: **NOT COMPLETED**
- `flyway_schema_history`: **NOT READ**
- Flyway validate: **NOT PERFORMED**
- Flyway migrate: **NOT PERFORMED**
- Manual SQL migration: **NOT PERFORMED**
- Database writes: **0**
- New Neon branch created: **NO**

## Current blocker classification

Primary execution blocker:

`BL008-CHATGPT-DATABASE-EXECUTION-PATH`

Evidence dimensions:

1. `DIRECT_POSTGRES_PATH = BLOCKED_EXECUTION_CONTAINER_NETWORK_DNS`
2. `NEON_MCP_MANAGEMENT_PATH = AVAILABLE`
3. `NEON_MCP_SQL_PATH = BLOCKED_OBSERVED_ARGUMENT_VALIDATION`
4. `NEON_VENDOR_ROOT_CAUSE = UNDETERMINED`
5. `CHATGPT_WRAPPER_ROOT_CAUSE = UNDETERMINED`

`BLOCKED_NEON_CONNECTOR_SQL_ACTION_SCHEMA` is not an approved vendor-root-cause classification and must not be used as though Neon documentation proves it.

## Orchestrator retry policy

On each governed BL-008 attempt:

1. Resolve the live Neon target through available read-only management discovery.
2. Attempt one read-only SQL-path probe sufficient to read database identity and `flyway_schema_history`.
3. If the same argument-validation fingerprint repeats, cache it for that invocation; do not burn the production window by repeating identical calls.
4. If the direct PostgreSQL network path becomes available, use it for read-only validation and then a real Flyway runtime.
5. Only after `flyway_schema_history` is successfully read may Flyway validate/select the exact next migration from the frozen source.
6. Apply exactly one migration at a time through Flyway, verify history/schema/ownership/integrity, persist evidence, then select the next requirement.
7. Never substitute `run_sql` or manually replay a migration file as the migration mechanism.
8. A blocked BL-008 stream must not stop independently eligible BL-002 work.
