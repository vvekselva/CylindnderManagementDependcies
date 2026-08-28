# BL-008 — Database Migration Execution Status

Latest governed fire: `CYLINDER-MANUAL-FIRE-20260829-040046IST`.

## Target policy

- Environment: Neon TEST database.
- Database: `neondb` unless live authoritative discovery proves otherwise.
- Neon is the first-choice provider.
- No new Neon branches may be created.
- Database write parallelism: `1`.
- Migration mechanism: **Flyway only**.
- Manual SQL substitution for Flyway migrations: **FORBIDDEN**.
- Full automation is mandatory: the user must not be asked to run Maven/Flyway manually, paste command output, or start a per-run local bridge.
- User-supplied PostgreSQL credentials are runtime-only and must not be persisted in this repository.

## Frozen migration source

Repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Path: `cylinder.datascripts/src/main/resources/db/migration`

The frozen tree contains V1 through V17. See `migration-inventory.txt`.

## Latest full-automation manual fire

The Orchestrator acquired the singleton lease, persisted START + heartbeat, and read the START state back before BL-008 probing.

Observed execution paths:

1. `NEON_MCP_MANAGEMENT_PATH = PASS_PROJECT_DISCOVERY`
   - The installed Neon Postgres/MCP-backed management integration successfully enumerated the connected Neon organization and the Cylinder TEST project.
2. `NEON_MCP_SQL_PATH = BLOCKED_OBSERVED_ARGUMENT_VALIDATION`
   - A read-only `run_sql` probe was attempted using the action contract exposed to ChatGPT.
   - The action returned MCP error `-32602`: the backend required snake_case `project_id`, while the exposed action contract supplied camelCase `projectId` / `databaseName`.
   - This is runtime observation only. Vendor root cause remains `UNDETERMINED`; do not classify it as a Neon REST API or SDK defect without authoritative proof.
3. `DIRECT_POSTGRES_PATH = BLOCKED_OUTBOUND_DNS`
   - The ChatGPT execution container attempted DNS resolution for the live Neon PostgreSQL endpoint and received `Temporary failure in name resolution`.
4. `AUTOMATED_FLYWAY_RUNTIME = NOT_CONNECTED`
   - No currently connected unattended command/runtime service is available to run Maven/Flyway against Neon from outside the blocked ChatGPT network path.
   - The plugin directory was checked for a fully automated command runner. `TRIGGERcmd` is available as a candidate because it can expose configured commands on a continuously running computer to ChatGPT, but it is not currently connected/installed for this account. Connecting an external runtime is a one-time authorization/provisioning action, not a per-migration manual step.

## Safety result

Because `flyway_schema_history` could not be read, the Orchestrator did not infer the next migration and did not execute any migration.

- `flyway_schema_history`: **NOT READ**
- Flyway validate: **NOT PERFORMED**
- Flyway migrate: **NOT PERFORMED**
- Manual SQL migration: **NOT PERFORMED**
- Database writes: **0**
- New Neon branch created: **NO**

## Current blocker classification

Primary blocker:

`BL008_AUTOMATED_FLYWAY_RUNTIME_REQUIRED`

Supporting evidence:

- `DIRECT_POSTGRES_PATH = BLOCKED_OUTBOUND_DNS`
- `NEON_MCP_MANAGEMENT_PATH = PASS_PROJECT_DISCOVERY`
- `NEON_MCP_SQL_PATH = BLOCKED_OBSERVED_ARGUMENT_VALIDATION`
- `AUTOMATED_FLYWAY_RUNTIME = NOT_CONNECTED`
- `NEON_VENDOR_ROOT_CAUSE = UNDETERMINED`
- `CHATGPT_WRAPPER_ROOT_CAUSE = UNDETERMINED`

This is not a request for the user to run Flyway manually. The mitigation is to connect/provision one unattended execution runtime once, after which the Orchestrator must run the entire BL-008 loop automatically.

## Required automated runtime contract

The unattended runtime must allow the Primary Orchestrator to trigger a fixed, auditable command/job that:

1. stages or verifies the exact frozen source;
2. obtains Neon credentials securely at runtime;
3. runs Flyway `info` / reads `flyway_schema_history`;
4. proves version, filename, checksum, order and prerequisites;
5. runs Flyway validate;
6. applies exactly one selected Flyway target version;
7. re-reads `flyway_schema_history`;
8. verifies schema, ownership and critical integrity;
9. emits machine-readable evidence for durable SSOT synchronization;
10. never uses manual SQL as a Flyway substitute.

GitHub may store durable job/result manifests but remains repository/version-control/SSOT storage only; GitHub Actions/runners remain forbidden.

## Retry and fallback policy

- Neon remains first choice.
- Retry each distinct Neon path once per invocation; cache repeated identical error fingerprints.
- Do not switch database providers automatically.
- If Neon still fails after an automated Flyway runtime is connected, classify `BL008_PROVIDER_FALLBACK_REVIEW_REQUIRED` and request explicit user approval before evaluating another PostgreSQL provider.
- A blocked BL-008 stream must not stop independently eligible BL-002 work.
