# BL-008 Evidence — CYLINDER-MANUAL-FLYWAY-JAVA-TEST-20260829-052725IST

## Purpose

Read-only/pre-write test of the governed Flyway Java API execution path. No migration write was authorized unless the genuine Flyway Java runtime and JDBC route both passed preflight.

## Execution boundary

- execution host: ChatGPT
- GitHub runner: not used
- external worker: not used
- manual user execution: not used
- migration mechanism under test: genuine Flyway 10.0.0 Java API
- provider target: Supabase project `xipkywwvzvrwcqnkifuv`
- database: `postgres`

## Java runtime probe

Observed in the ChatGPT execution image:

- Java: OpenJDK 21.0.11
- javac: 21.0.11
- runtime CLASSPATH: empty
- local Flyway/PostgreSQL jars found by filesystem scan: none

Direct Java class probe:

- `org.flywaydb.core.Flyway` -> `ClassNotFoundException`
- `org.postgresql.Driver` -> `ClassNotFoundException`

The governed runner `BL-008/java/FlywayJavaRunner.java` was copied into the execution workspace and compiled with the currently available classpath. `javac` exited with status 1 because packages such as `org.flywaydb.core`, `org.flywaydb.core.api`, and `org.flywaydb.core.api.output` are not present. This is an environment/dependency failure before any database operation.

## Artifact bootstrap probe

Public artifact discovery confirms the required pinned artifacts exist in Maven Central, including:

- `org.flywaydb:flyway-core:10.0.0`
- `org.flywaydb:flyway-database-postgresql:10.0.0`
- `org.postgresql:postgresql:42.7.2`

However, the ChatGPT execution container could not resolve `repo.maven.apache.org`. Direct artifact download into the execution image therefore did not become usable in this test. No unpinned or substitute Flyway version was attempted.

## JDBC network probe

Supabase project metadata reports region `ap-southeast-2` and direct database host `db.xipkywwvzvrwcqnkifuv.supabase.co`.

TCP/DNS preflight from the ChatGPT Java execution environment was tested for:

- `db.xipkywwvzvrwcqnkifuv.supabase.co:5432`
- `aws-0-ap-southeast-2.pooler.supabase.com:5432`
- `aws-0-ap-southeast-2.pooler.supabase.com:6543`

All three failed before connection establishment with DNS resolution errors (`gaierror: Temporary failure in name resolution`). Therefore a JDBC-capable route from the Java process is still unavailable.

## Supabase control-path verification

The connected Supabase integration was queried read-only during the same test and succeeded:

- database: `postgres`
- role: `postgres`
- PostgreSQL version: `17.6`
- `public.flyway_schema_history` exists: false
- public table count: 0

This proves the Supabase project itself remains reachable through the connected Supabase tool while the local Java/JDBC route remains blocked.

## Flyway test result

- Flyway Java `info()`: NOT RUN
- Flyway Java `validateWithResult()`: NOT RUN
- Flyway Java `migrate()`: NOT RUN
- first source-order candidate remains `V1__DailyLogin.sql`
- Flyway-selected next migration: NOT YET PROVED
- V1 applied: false
- database writes: 0
- provider-native migration replay: not used
- raw/manual SQL migration: not used

## Blocker

`BL008_CHATGPT_JAVA_FLYWAY_RUNTIME_UNAVAILABLE`

Subreason: `JAVA_API_DEPENDENCY_AND_JDBC_ROUTE_UNAVAILABLE`

The test confirmed both missing prerequisites independently:

1. genuine Flyway/PostgreSQL Java dependencies are not loadable in the ChatGPT execution image; and
2. the Java execution image has no current DNS/TCP route to the Supabase direct or pooler PostgreSQL endpoints.

The run therefore stopped fail-closed with zero database writes.
