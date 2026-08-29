# BL-008 Evidence — CYLINDER-MANUAL-FLYWAY-JDBC-TEST-20260829-064455IST

## Purpose

Test the user-supplied Flyway Java runtime bundle and then test the remaining Java/JDBC route to the approved Supabase target without performing any migration write.

## Runtime dependency result

Uploaded bundle: `flyway-lib.zip` (conversation attachment; not persisted to GitHub).

Extracted and verified present:

- `flyway-core-10.0.0.jar`
- `flyway-database-postgresql-10.0.0.jar`
- `postgresql-42.7.2.jar`
- `checker-qual-3.42.0.jar`
- `gson-2.10.1.jar`
- `jackson-dataformat-toml-2.15.2.jar`
- `jackson-databind-2.15.2.jar`
- `jackson-annotations-2.15.2.jar`
- `jackson-core-2.15.2.jar`
- `commons-text-1.10.0.jar`
- `commons-lang3-3.12.0.jar`

Java runtime:

- OpenJDK `21.0.11`
- `javac 21.0.11`

Class loading smoke test:

- `org.flywaydb.core.Flyway` = PASS
- `org.postgresql.Driver` = PASS

Flyway Java API construction test:

- `Flyway.configure()` / `.load()` = PASS
- `cleanDisabled(true)` used
- `baselineOnMigrate(false)` used
- `outOfOrder(false)` used
- no migration command executed in the construction test

Result: `JAVA_API_DEPENDENCY_PATH = PASS`.

## Supabase target read-only proof

Approved target project: `xipkywwvzvrwcqnkifuv`

Connector read-only inspection during this run:

- project status: `ACTIVE_HEALTHY`
- region: `ap-southeast-2`
- direct database host: `db.xipkywwvzvrwcqnkifuv.supabase.co`
- database: `postgres`
- PostgreSQL: `17.6`
- `public.flyway_schema_history` exists: `false`
- public table count: `0`

## Java network/JDBC probes

The PostgreSQL JDBC driver was loaded successfully and actual `DriverManager.getConnection(...)` attempts were made using non-secret dummy credentials solely to test the pre-auth network path.

Direct endpoint:

- host: `db.xipkywwvzvrwcqnkifuv.supabase.co`
- port: `5432`
- result: SQLSTATE `08001`
- root cause: `UnknownHostException`

Session pooler candidate:

- host: `aws-0-ap-southeast-2.pooler.supabase.com`
- port: `5432`
- result: SQLSTATE `08001`
- root cause: `UnknownHostException`

Transaction pooler candidate:

- host: `aws-0-ap-southeast-2.pooler.supabase.com`
- port: `6543`
- result: SQLSTATE `08001`
- root cause: `UnknownHostException`

Independent Java socket probes also showed:

- `1.1.1.1:443` -> connection refused
- `8.8.8.8:53` -> connection refused

This demonstrates that the remaining issue is not a missing JDBC driver. The ChatGPT execution container currently lacks usable outbound network reachability for this Java process.

## Genuine Flyway Java info network test

A genuine Flyway 10.0.0 Java API `info()` connectivity attempt was made against each target route using dummy credentials so no secret was required or persisted.

Results:

- direct endpoint -> `UnknownHostException`
- session pooler -> `UnknownHostException`
- transaction pooler -> `UnknownHostException`

Flyway itself initialized successfully and identified itself as Flyway OSS Edition 10.0.0 before the network failure on the pooler probe.

No real database credential was exercised because the connection failed before authentication.

## Blocker transition

Resolved:

- `BL008_CHATGPT_JAVA_FLYWAY_RUNTIME_UNAVAILABLE` dependency portion
- `JAVA_API_DEPENDENCY_PATH = PASS`

New active blocker:

`BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`

Subreason:

`OUTBOUND_DNS_AND_TCP_EGRESS_UNAVAILABLE`

## Safety result

- Flyway Java dependency load: PASS
- PostgreSQL JDBC driver load: PASS
- Flyway Java API construction: PASS
- Flyway `info()` reached database: NO
- Flyway `validateWithResult()`: NOT RUN
- Flyway `migrate()`: NOT RUN
- `V1__DailyLogin.sql`: NOT APPLIED
- provider-native migration replay: NOT RUN
- raw/manual SQL migration: NOT RUN
- database writes: 0
- database secrets persisted: 0

The run remains fail-closed before any database write.
