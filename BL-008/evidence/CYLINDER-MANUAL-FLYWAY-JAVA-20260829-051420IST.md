# BL-008 Evidence — CYLINDER-MANUAL-FLYWAY-JAVA-20260829-051420IST

## Decision

The user directed BL-008 to run Flyway through Java instead of the CLI.

Execution mode is now **genuine Flyway 10.0.0 Java API**.

## Governed Java harness

Created:

`BL-008/java/FlywayJavaRunner.java`

Commit:

`e6fc0602353ee439b1182fa698cb6cd7ef50b1d1`

The runner is designed for three modes:

- `info`
- `validate`
- `migrate-one`

Safety controls include public schema only, clean disabled, no baseline-on-migrate, no out-of-order execution, exact target version, preflight first-PENDING check, validation before migration, exactly-one-migration assertion, and post-migration SUCCESS verification.

## Flyway 10.0.0 API verification

Authoritative Flyway tag `flyway-10.0.0` was inspected to verify the Java API elements used by the harness:

- `FluentConfiguration.target(MigrationVersion)` exists.
- `MigrationState.PENDING` exists.
- `MigrationState.SUCCESS` exists.
- `MigrationInfo` exposes version, checksum, script and state.
- `ValidateResult` exposes validation success and invalid migrations.
- `MigrateResult` exposes migrationsExecuted and targetSchemaVersion.

## Runtime probe

Current ChatGPT execution image:

- Java 21.0.11: PASS
- `javac`: PASS
- `jshell`: PASS
- Flyway CLI: no longer required
- Java Flyway class availability: FAIL

JShell probe result:

`package org.flywaydb.core does not exist`

Therefore `org.flywaydb.core.Flyway` is not currently available on the Java classpath.

Required core runtime artifacts remain unavailable locally:

- `org.flywaydb:flyway-core:10.0.0`
- `org.flywaydb:flyway-database-postgresql:10.0.0`
- `org.postgresql:postgresql:42.7.2`
- required transitive dependencies

A direct HTTPS connection attempt to Maven Central using a pinned current IPv4 address also failed before TLS/HTTP exchange, confirming that package bootstrap is blocked by execution-container egress and not merely by DNS resolution.

The Java execution image also does not have a direct JDBC-capable network route to the Supabase PostgreSQL endpoint. Supabase connector SQL access remains functional but is not a JDBC connection available inside the Java process and is not used as a substitute for Flyway.

## Database safety

No Flyway Java `info()`, `validateWithResult()` or `migrate()` could run because the Java dependency/JDBC prerequisites are unavailable.

- database writes: 0
- Flyway history mutations: 0
- provider-native migration replay: 0
- raw/manual SQL migration: 0
- V1 applied: false

## Current blocker

`BL008_CHATGPT_JAVA_FLYWAY_RUNTIME_UNAVAILABLE`

Subreason:

`JAVA_API_DEPENDENCY_AND_JDBC_ROUTE_UNAVAILABLE`

The absence of the Flyway CLI is no longer considered a blocker.
