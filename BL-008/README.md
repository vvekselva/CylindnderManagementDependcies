# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-MANUAL-FLYWAY-JDBC-TEST-20260829-064455IST`.

## Target policy

- Current explicitly approved target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Database: `postgres`.
- PostgreSQL version observed: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism: **genuine Flyway 10.0.0 Java API**.
- Manual/raw SQL replay and Supabase-native `apply_migration` are forbidden as substitutes for Flyway.
- GitHub is durable SSOT/version control only; GitHub runners are forbidden.
- Never invoke `clean` / `flyway clean`.

## Frozen-source reconciliation — PASS

Frozen repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Migration path: `cylinder.datascripts/src/main/resources/db/migration`  
POM: `cylinder.datascripts/pom.xml`

The corrected inventory in `BL-008/migration-inventory.txt` binds the exact frozen V1-V17 filenames to immutable Git blob SHA-1 values. First source-order candidate remains `V1__DailyLogin.sql`; it is not yet Flyway-selected or applied.

## Flyway Java dependency path — PASS

The user-supplied `flyway-lib.zip` was tested in the ChatGPT execution container and contains the complete required runtime set used by the governed Java path, including:

- `flyway-core-10.0.0.jar`
- `flyway-database-postgresql-10.0.0.jar`
- `postgresql-42.7.2.jar`
- required Gson, Jackson, Commons and Checker Qual dependencies.

Verified with Java 21.0.11:

- `org.flywaydb.core.Flyway` class load: PASS
- `org.postgresql.Driver` class load: PASS
- `Flyway.configure()` / `.load()`: PASS
- `cleanDisabled(true)`: configured
- `baselineOnMigrate(false)`: configured
- `outOfOrder(false)`: configured

`JAVA_API_DEPENDENCY_PATH = PASS`.

The previous dependency/classpath portion of `BL008_CHATGPT_JAVA_FLYWAY_RUNTIME_UNAVAILABLE` is resolved.

## Current target read-only state

Connector verification during the latest test:

- project status: `ACTIVE_HEALTHY`
- database: `postgres`
- PostgreSQL: `17.6`
- `public.flyway_schema_history` exists: **NO**
- public table count: **0**
- database writes in the migration flow: **0**

## Current primary blocker

`BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`

Subreason: `OUTBOUND_DNS_AND_TCP_EGRESS_UNAVAILABLE`.

The PostgreSQL JDBC driver was genuinely used for pre-auth connection probes. Non-secret dummy credentials were used because the purpose was only to test the network path; no real database credential was persisted or exercised.

Results:

- direct `db.xipkywwvzvrwcqnkifuv.supabase.co:5432` -> SQLSTATE `08001`, `UnknownHostException`
- session pooler candidate `aws-0-ap-southeast-2.pooler.supabase.com:5432` -> SQLSTATE `08001`, `UnknownHostException`
- transaction pooler candidate `aws-0-ap-southeast-2.pooler.supabase.com:6543` -> SQLSTATE `08001`, `UnknownHostException`
- Java socket `1.1.1.1:443` -> connection refused
- Java socket `8.8.8.8:53` -> connection refused

A genuine Flyway 10.0.0 Java API `info()` connectivity test was also attempted against all three Supabase routes. Flyway initialized correctly, but each attempt stopped before authentication with `UnknownHostException`.

Therefore the remaining problem is no longer Flyway installation or JDBC-driver availability. It is the ChatGPT Java execution container's outbound network route to Supabase.

## Safety result

- Flyway Java runtime: **PASS**
- PostgreSQL JDBC driver: **PASS**
- Flyway Java `info()` reached database: **NO**
- Flyway Java `validateWithResult()`: **NOT RUN**
- Flyway Java `migrate()`: **NOT RUN**
- `V1__DailyLogin.sql`: **NOT APPLIED**
- provider-native migration replay: **NOT RUN**
- raw/manual SQL migration: **NOT RUN**
- database writes: **0**
- secrets persisted: **0**

## Governed next flow

1. Keep the working uploaded Flyway Java dependency bundle available for the current ChatGPT execution path.
2. Re-test only ChatGPT-native network/JDBC capabilities that could change the active route blocker; do not repeat resolved dependency discovery.
3. When a Java JDBC route to the Supabase target becomes available, execute genuine Flyway `info()` first using runtime-only credentials.
4. Confirm Flyway's first pending migration against the frozen source binding.
5. Run `validateWithResult()`.
6. Run `migrate()` with exact target version `1` only if Flyway proves V1 is first pending.
7. Re-read `flyway_schema_history`, verify expected V1 schema objects/integrity, persist evidence, and stop before V2.
8. Never substitute Supabase-native/raw SQL migration replay for Flyway.
9. BL-002 may continue independently while the JDBC route remains blocked.

Latest evidence: `BL-008/evidence/CYLINDER-MANUAL-FLYWAY-JDBC-TEST-20260829-064455IST.md`.
