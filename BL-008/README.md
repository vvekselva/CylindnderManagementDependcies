# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-MANUAL-FLYWAY-JAVA-20260829-051420IST`.

## Target policy

- Current explicitly approved target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Database: `postgres`.
- PostgreSQL version observed: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism: **genuine Flyway 10.0.0 Java API**.
- Flyway CLI is no longer required by the BL-008 plan.
- Manual/raw SQL replay and Supabase-native `apply_migration` are forbidden as substitutes for Flyway.
- Full automation remains ChatGPT-owned; GitHub is version control/durable evidence only and GitHub runners are forbidden.
- No user terminal work, local bridge or external worker runtime is permitted by the current automation policy.
- Never invoke `clean` / `flyway clean`.

## Target database read-only proof

Current target inspection already proves:

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

`BL-008/migration-inventory.txt` binds the actual frozen V1-V17 filenames to immutable Git blob SHA-1 values. Git blob SHA-1 is source-binding evidence only; genuine Flyway must calculate/validate Flyway checksums.

`BL008_FROZEN_MIGRATION_SOURCE_MISMATCH` is **RESOLVED for governed V1-V17 scope**.

First frozen source-order candidate: `V1__DailyLogin.sql`. It is not yet Flyway-selected or applied.

## Java API execution design — ADOPTED

BL-008 now runs Flyway programmatically through Java instead of depending on the Flyway CLI.

Governed runner source:

`BL-008/java/FlywayJavaRunner.java`

Required core runtime libraries:

- `org.flywaydb:flyway-core:10.0.0`
- `org.flywaydb:flyway-database-postgresql:10.0.0`
- `org.postgresql:postgresql:42.7.2`
- Flyway's required transitive runtime dependencies

The runner is designed to use `Flyway.configure()` with:

- runtime-only JDBC URL/user/password;
- `public` schema;
- `cleanDisabled(true)`;
- `baselineOnMigrate(false)`;
- `outOfOrder(false)`;
- frozen filesystem migration location;
- explicit `TARGET_VERSION` for `migrate-one`;
- a preflight check that the exact target is the first Flyway `PENDING` migration;
- `validateWithResult()` before migrate;
- exactly one migration executed;
- post-migrate Flyway `info()` verification that the target state is `SUCCESS`.

Flyway 10.0.0 source was checked to confirm the Java API contains `FluentConfiguration.target(MigrationVersion)`, `MigrationState.PENDING`, `MigrationState.SUCCESS`, `MigrationInfo`, `ValidateResult`, and `MigrateResult` used by this harness.

## Current primary blocker

`BL008_CHATGPT_JAVA_FLYWAY_RUNTIME_UNAVAILABLE`

Subreason: `JAVA_API_DEPENDENCY_AND_JDBC_ROUTE_UNAVAILABLE`.

Latest Java-path evidence:

- Java 21.0.11: available.
- `javac`: available.
- `jshell`: available.
- Flyway CLI absence is **not** a blocker anymore.
- `org.flywaydb.core.Flyway` is not present on the current Java runtime classpath; JShell reports `package org.flywaydb.core does not exist`.
- required Flyway/PostgreSQL jars are not locally available.
- direct package-download egress from the execution container is unavailable.
- an IP-pinned HTTPS probe to Maven Central also failed, so the artifact-download problem is not DNS-only.
- direct JDBC-capable PostgreSQL network access from the Java execution container to Supabase is unavailable.
- connected Supabase SQL access works, but it is not a JDBC connection usable by the Java Flyway process and is not a Flyway substitute.

## Safety result

- Flyway Java `info()`: **NOT PERFORMED**
- Flyway Java `validateWithResult()`: **NOT PERFORMED**
- Flyway Java `migrate()`: **NOT PERFORMED**
- `V1__DailyLogin.sql`: **NOT APPLIED**
- Supabase-native migration replay: **NOT PERFORMED**
- raw/manual SQL migration: **NOT PERFORMED**
- database writes: **0**
- destructive project/branch changes: **0**

## Governed next flow

1. Keep the corrected immutable V1-V17 source binding fixed.
2. Use the Java API runner as the only Flyway execution design; do not wait for or require a Flyway CLI executable.
3. Re-check ChatGPT-native availability of the Flyway 10.0.0 Java dependency set and a JDBC-capable route to Supabase.
4. When available, run Java `info()` first.
5. Confirm Flyway's first pending migration against the frozen source binding.
6. Run Java `validateWithResult()`.
7. Run Java `migrate()` with an exact target so only one migration can execute.
8. Re-read `flyway_schema_history`, verify Flyway state/schema/integrity, persist evidence, and stop before the next migration.
9. Do not ask the user to run commands, and do not substitute provider-native migrations/raw SQL.
10. BL-002 may continue independently while BL-008 remains blocked.

Governed Java runner commit: `e6fc0602353ee439b1182fa698cb6cd7ef50b1d1`.
