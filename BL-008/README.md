# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-MANUAL-SOURCE-RECON-20260829-043848IST`.

## Target policy

- Current explicitly approved provider evaluation target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Database: `postgres`.
- PostgreSQL version observed: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism: **Flyway only**.
- Frozen project declares Flyway `10.0.0`.
- Manual SQL substitution for Flyway migrations is **FORBIDDEN**.
- Supabase-native `apply_migration` or raw SQL execution must **not** be used to replay frozen Flyway migration files as a substitute for Flyway.
- Full automation remains ChatGPT-owned; GitHub is version control/durable evidence only and GitHub runners are forbidden.
- No destructive project/branch operation is authorized by this flow.

## Target database read-only proof

Current read-only inspection succeeded:

- database: `postgres`
- connected role: `postgres`
- PostgreSQL: `17.6`
- `public.flyway_schema_history` exists: **NO**
- public table count: **0**
- database writes by this governed continuation: **0**

The target is therefore still empty from the perspective of public tables and Flyway history.

## Frozen-source reconciliation — PASS

Frozen repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Migration path: `cylinder.datascripts/src/main/resources/db/migration`  
POM: `cylinder.datascripts/pom.xml`

The frozen POM proves:

- Flyway version: `10.0.0`
- migration location: `filesystem:src/main/resources/db/migration`
- schema: `public`

The previous V1-V17 filenames in the control inventory were incorrect. The exact frozen files have now been read successfully from the immutable commit and rebound to their Git blob SHA-1 values in `BL-008/migration-inventory.txt`.

Correct governed V1-V17 sequence:

1. `V1__DailyLogin.sql`
2. `V2__ProductCategory.sql`
3. `V3__ProductUom.sql`
4. `V4__City.sql`
5. `V5__State.sql`
6. `V6__Country.sql`
7. `V7__Address.sql`
8. `V8__AddressType.sql`
9. `V9__PhoneNumber.sql`
10. `V10__Customer.sql`
11. `V11__CustomerPhoneNumber.sql`
12. `V12__CustomerAddress.sql`
13. `V13__Product.sql`
14. `V14__CustomerProductRate.sql`
15. `V15__CylinderStates.sql`
16. `V16__Cylinder.sql`
17. `V17__Driver.sql`

`BL008_FROZEN_MIGRATION_SOURCE_MISMATCH` is therefore **RESOLVED for governed scope V1-V17**.

`V1__DailyLogin.sql` is the first frozen **source-order candidate**. It has not been declared Flyway-selected or applied because a genuine Flyway runtime has not connected to the target yet.

## Current primary blocker

`BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE`

Latest execution-image evidence:

- Java 21.0.11: available.
- Maven executable: unavailable.
- Flyway CLI executable: unavailable.
- Gradle executable: unavailable.
- user Maven dependency cache: unavailable.
- `/usr/share/maven-repo` contains no Flyway jars and no PostgreSQL JDBC jar.
- direct DNS resolution from the ChatGPT execution container failed for Maven Central endpoints.
- direct DNS resolution failed for Redgate's Flyway download endpoint.
- direct DNS resolution failed for the Supabase PostgreSQL host.
- connected Supabase SQL access works, but it is not Flyway and therefore cannot substitute for Flyway execution.

The source gate is now clear; the Flyway runtime/connectivity gate is the active blocker.

## Safety result

- `flyway_schema_history`: **PROVED ABSENT ON CURRENT SUPABASE TARGET**
- public tables: **0**
- first source-order candidate: `V1__DailyLogin.sql`
- Flyway `info`: **NOT PERFORMED**
- Flyway `validate`: **NOT PERFORMED**
- Flyway `migrate`: **NOT PERFORMED**
- provider-native migration replay: **NOT PERFORMED**
- manual SQL migration: **NOT PERFORMED**
- database writes: **0**
- destructive project/branch changes: **0**

## Governed next flow

1. Keep the corrected immutable V1-V17 source binding fixed.
2. Obtain a genuine ChatGPT-native Flyway 10.0.0 execution path that can reach the Supabase PostgreSQL endpoint with runtime-only credentials.
3. Run genuine Flyway `info` against the target.
4. Confirm the first pending migration reported by Flyway matches the frozen source-order candidate.
5. Run genuine Flyway `validate`.
6. Apply exactly one migration through Flyway only.
7. Re-read `flyway_schema_history`, verify the created schema objects and integrity, persist evidence, then stop before considering the next migration.
8. Never invoke `flyway clean` and never substitute provider-native SQL/migration actions for Flyway.
9. A blocked BL-008 stream must not stop independently eligible BL-002 work.

Detailed evidence: `BL-008/evidence/CYLINDER-MANUAL-SOURCE-RECON-20260829-043848IST.md`.
