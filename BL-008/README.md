# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-PRODUCTION-FIRE-20260829-210423IST`.

## Target and validation policy

- Persistent test target: **Supabase** project `xipkywwvzvrwcqnkifuv`, database `postgres`, PostgreSQL `17.6`.
- ChatGPT-side migration-validation runtime: **PostgreSQL Testcontainers**.
- Database write parallelism: `1`.
- Migration mechanism: **genuine Flyway 10.0.0 Java API only**.
- Manual/raw SQL replay and Supabase-native migration replay are forbidden as substitutes for Flyway.
- GitHub is durable SSOT/version control only; GitHub runners are forbidden.
- External worker runtimes remain forbidden.
- Never invoke `clean` / `flyway clean`.

A successful Testcontainers run proves the governed frozen migrations work against an ephemeral PostgreSQL test database. It does **not** count as a migration applied to the persistent Supabase test target.

## Frozen-source reconciliation — PASS

Frozen repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Migration path: `cylinder.datascripts/src/main/resources/db/migration`  
POM: `cylinder.datascripts/pom.xml`

`BL-008/migration-inventory.txt` binds governed V1-V17 filenames to immutable Git blob SHA-1 values. `V1__DailyLogin.sql` remains only the first source-order candidate until genuine Flyway `info()` selects pending work.

## Flyway Java dependency path — PASS

Previously verified with Java 21.0.11:

- `org.flywaydb.core.Flyway` class load: PASS
- `org.postgresql.Driver` class load: PASS
- `Flyway.configure()` / `.load()`: PASS
- `cleanDisabled(true)`: configured
- `baselineOnMigrate(false)`: configured
- `outOfOrder(false)`: configured

`JAVA_API_DEPENDENCY_PATH = PASS`.

## Testcontainers runtime gate — BLOCKED

The newly approved Testcontainers path was probed during `CYLINDER-PRODUCTION-FIRE-20260829-210423IST`.

Current blocker fingerprint:

`BL008_TESTCONTAINERS_CONTAINER_RUNTIME_UNAVAILABLE_IN_CHATGPT_EXECUTION_HOST`

Observed in the ChatGPT execution runtime:

- Java 21.0.11: available.
- `docker`: unavailable (`command not found`).
- `podman`: unavailable.
- `nerdctl`: unavailable.
- `ctr`: unavailable.

Therefore standard Java Testcontainers cannot currently start a PostgreSQL container in this ChatGPT execution surface. This is a container-runtime prerequisite blocker, not a migration-script failure.

Latest evidence: `BL-008/evidence/20260829-210520-testcontainers-runtime-capability.md`.

## Persistent Supabase route — secondary blocker unchanged

The earlier persistent-target blocker remains relevant only when applying already validated migrations to Supabase:

`BL008_CHATGPT_EXECUTION_RUNTIME_OUTBOUND_POSTGRES_EGRESS_UNAVAILABLE`

Parent:

`BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`

Subreason:

`SANDBOX_DNS_AND_RAW_OUTBOUND_TCP_BLOCKED_NO_PROXY`

Existing evidence already proves the unavailable DNS/raw-TCP route, so identical network probes must not be repeated unless runtime capability changes.

## Current safety state

- Testcontainer started: **NO**
- PostgreSQL Testcontainer started: **NO**
- Flyway Java `info()` against Testcontainer: **NOT RUN**
- Flyway Java `validateWithResult()` against Testcontainer: **NOT RUN**
- Flyway Java `migrate()` against Testcontainer: **NOT RUN**
- Persistent Supabase Flyway `info()` reached database: **NO**
- migrations successfully applied to Testcontainer: **0/17**
- migrations successfully applied to persistent Supabase target: **0/17**
- migration-flow database writes: **0**
- provider-native replay: **NOT RUN**
- raw/manual SQL migration: **NOT RUN**
- repeated Supabase network probe in latest fire: **NO**

## Governed next flow

When the ChatGPT execution host exposes a Docker-compatible local container runtime:

1. start an ephemeral PostgreSQL 17.x Testcontainer;
2. bind the immutable V1-V17 migration source;
3. run genuine Flyway Java `info()`;
4. run `validateWithResult()`;
5. migrate exactly one pending governed migration;
6. verify `flyway_schema_history`, resulting schema objects and integrity;
7. continue one migration at a time, DB-write parallelism 1;
8. destroy the Testcontainer after validation.

BL-002 remains independently eligible and must not be blocked by this BL-008 lane-local prerequisite blocker.
