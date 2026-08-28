# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-MANUAL-FLYWAY-BOOTSTRAP-20260829-045929IST`.

## Target policy

- Current explicitly approved target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Database: `postgres`.
- PostgreSQL version observed: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism: **genuine Flyway only**.
- Frozen project declares Flyway `10.0.0`.
- Manual/raw SQL replay and Supabase-native `apply_migration` are forbidden as substitutes for Flyway.
- Full automation remains ChatGPT-owned; GitHub is version control/durable evidence only and GitHub runners are forbidden.
- No user terminal work, local bridge or external worker runtime is permitted by the current automation policy.
- Never invoke `flyway clean`.

## Target database read-only proof

Current target inspection proves:

- database: `postgres`
- connected role: `postgres`
- PostgreSQL: `17.6`
- `public.flyway_schema_history` exists: **NO**
- public table count: **0**
- database writes by the Orchestrator so far in the current migration flow: **0**

## Frozen-source reconciliation — PASS

Frozen repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Migration path: `cylinder.datascripts/src/main/resources/db/migration`  
POM: `cylinder.datascripts/pom.xml`

The frozen POM proves Flyway `10.0.0`, migration location `filesystem:src/main/resources/db/migration`, and target schema `public`.

The old control inventory filenames were incorrect. `BL-008/migration-inventory.txt` now binds the actual frozen V1-V17 filenames to their immutable Git blob SHA-1 values. Git blob SHA-1 is source-binding evidence only; genuine Flyway must calculate/validate Flyway checksums.

`BL008_FROZEN_MIGRATION_SOURCE_MISMATCH` is **RESOLVED for governed V1-V17 scope**.

First frozen source-order candidate: `V1__DailyLogin.sql`. It is not yet Flyway-selected or applied.

## Current primary blocker

`BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE`

Subreason: `RUNTIME_BOOTSTRAP_NETWORK_AND_BINARY_PATH_UNAVAILABLE`.

Latest ChatGPT-native bootstrap evidence:

- Java 21.0.11: available.
- `javac` / `jshell`: available.
- Maven executable: unavailable.
- Flyway CLI executable: unavailable.
- Gradle executable: unavailable.
- PostgreSQL `psql`: unavailable.
- Docker/Podman/Buildah/Nerdctl: unavailable.
- no usable local Flyway 10.0.0 + PostgreSQL JDBC artifact set was found.
- package-manager bootstrap could not complete because outbound package-network access is unavailable.
- direct Flyway 10.0.0 download could not be reached from the execution container.
- Maven Central and Redgate download routes could not be reached from the execution container.
- an IP-pinned Maven Central connectivity probe also failed, proving the problem is not DNS alone.
- direct PostgreSQL route from the execution container to the Supabase database remains unavailable.
- no installed Flyway/Redgate execution plugin is available.

Connected Supabase SQL access works, but it is not Flyway.

## Supabase Edge Function investigation

Official Supabase documentation proves that hosted Edge Functions:

- run in a Deno/TypeScript Edge Runtime;
- receive `SUPABASE_DB_URL` as a default database connection secret;
- can connect to PostgreSQL from the hosted runtime;
- support NPM modules and WebAssembly.

This creates a potentially useful **database-connected execution location**, but it does not yet prove a genuine Flyway 10.0.0 process. Documentation/repository searches in this run did not establish a supported hosted arbitrary-subprocess route capable of launching genuine Flyway.

Dimension: `SUPABASE_EDGE_DB_CONNECTIVITY_AVAILABLE_BUT_GENUINE_FLYWAY_EXECUTION_UNPROVEN`.

A TypeScript Flyway-compatible reimplementation, raw SQL replay, or Supabase-native migration is not accepted as genuine Flyway and was not used.

## Safety result

- Flyway `info`: **NOT PERFORMED**
- Flyway `validate`: **NOT PERFORMED**
- Flyway `migrate`: **NOT PERFORMED**
- `V1__DailyLogin.sql`: **NOT APPLIED**
- Supabase-native migration replay: **NOT PERFORMED**
- raw/manual SQL migration: **NOT PERFORMED**
- database writes: **0**
- destructive project/branch changes: **0**

## Governed next flow

1. Keep the corrected immutable V1-V17 source binding fixed.
2. On each governed attempt, re-check only ChatGPT-native capabilities that could materially change the Flyway blocker: a genuine Flyway-capable installed tool/runtime, an execution image with required dependency/network access, or a proven ChatGPT-invokable hosted runtime capable of executing genuine Flyway 10.0.0 and reaching the target.
3. When that path becomes available, run genuine Flyway `info` first.
4. Confirm Flyway's pending migration against the frozen source binding.
5. Run genuine Flyway `validate`.
6. Apply exactly one migration through Flyway.
7. Re-read `flyway_schema_history`, verify schema/integrity, persist evidence, and stop before considering the next migration.
8. Do not ask the user to run commands, and do not substitute provider-native migrations/raw SQL.
9. BL-002 may continue independently while BL-008 remains blocked.

Detailed latest evidence: `BL-008/evidence/CYLINDER-MANUAL-FLYWAY-BOOTSTRAP-20260829-045929IST.md`.
