# BL-008 Evidence — CYLINDER-MANUAL-SOURCE-RECON-20260829-043848IST

## Scope

Governed continuation of BL-008 source reconciliation and Flyway-runtime gate.

Execution host: ChatGPT
GitHub role: repository/versioned durable evidence only
GitHub runner used: no
Manual SQL substitution: no
Database write parallelism: 1
Database provider under current approved evaluation: Supabase
Project ref: xipkywwvzvrwcqnkifuv
Database: postgres

## Frozen-source reconciliation

Frozen repository: vvekselva/CylinderManagement
Frozen commit: 3ae6e61442132d94a307275b08dd65fcef228d89
Migration path: cylinder.datascripts/src/main/resources/db/migration
POM: cylinder.datascripts/pom.xml
POM Flyway version: 10.0.0
POM migration location: filesystem:src/main/resources/db/migration
POM target schema: public

The previous BL-008 inventory filenames were incorrect. The exact frozen V1-V17 files were read successfully and rebound to their immutable Git blob SHA-1 values in `BL-008/migration-inventory.txt`.

Result: `BL008_FROZEN_MIGRATION_SOURCE_MISMATCH` = RESOLVED for governed scope V1-V17.

First frozen source candidate: `V1__DailyLogin.sql`.
This is a source-order candidate only; it has NOT been selected by Flyway because a genuine Flyway runtime has not yet connected to the target.

## Target database read-only proof

Read-only query result during this run:

- current database: postgres
- current role: postgres
- PostgreSQL version: 17.6
- public.flyway_schema_history exists: false
- public table count: 0

No database mutation was performed by this query.

## ChatGPT-native Flyway runtime probe

Execution image/runtime observations:

- Java: OpenJDK 21.0.11 available
- Maven executable: unavailable
- Flyway CLI executable: unavailable
- Gradle executable: unavailable
- user Maven cache: unavailable
- `/usr/share/maven-repo` exists but contains no Flyway jars and no PostgreSQL JDBC jar
- direct DNS resolution from the execution container failed for `repo1.maven.org`
- direct DNS resolution failed for `central.sonatype.com`
- direct DNS resolution failed for `download.red-gate.com`
- direct DNS resolution failed for `db.xipkywwvzvrwcqnkifuv.supabase.co`

The connected Supabase tool can perform SQL, but provider-native SQL/migration actions are not a genuine Flyway execution path and are forbidden as a substitute for replaying the frozen Flyway migrations.

Result: `BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE` remains ACTIVE.

## Safety / write result

- Flyway info: NOT RUN
- Flyway validate: NOT RUN
- Flyway migrate: NOT RUN
- provider-native migration replay: NOT RUN
- manual SQL migration: NOT RUN
- database writes performed: 0
- destructive branch/project action: 0

The run stops fail-closed at the Flyway-runtime gate.
