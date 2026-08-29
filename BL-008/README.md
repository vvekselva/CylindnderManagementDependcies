# BL-008 — Database Migration Execution Status

Latest governed continuation: `CYLINDER-MANUAL-RUNTIME-EGRESS-MITIGATION-20260829-070653IST`.

## Target policy

- Current approved target: **Supabase** project `xipkywwvzvrwcqnkifuv`.
- Database: `postgres`.
- PostgreSQL observed: `17.6`.
- Database write parallelism: `1`.
- Migration mechanism: **genuine Flyway 10.0.0 Java API only**.
- Manual/raw SQL replay and Supabase-native `apply_migration` are forbidden as substitutes for Flyway.
- GitHub is durable SSOT/version control only; GitHub runners are forbidden.
- Current governance also forbids an external worker runtime.
- Never invoke `clean` / `flyway clean`.

## Frozen-source reconciliation — PASS

Frozen repository: `vvekselva/CylinderManagement`  
Frozen commit: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Migration path: `cylinder.datascripts/src/main/resources/db/migration`  
POM: `cylinder.datascripts/pom.xml`

`BL-008/migration-inventory.txt` binds the governed V1-V17 filenames to immutable Git blob SHA-1 values. First source-order candidate remains `V1__DailyLogin.sql`; it is not yet Flyway-selected or applied.

## Flyway Java dependency path — PASS

The user-supplied `flyway-lib.zip` is usable from the ChatGPT execution container and contains the required Flyway/PostgreSQL runtime set.

Verified with Java 21.0.11:

- `org.flywaydb.core.Flyway` class load: PASS
- `org.postgresql.Driver` class load: PASS
- `Flyway.configure()` / `.load()`: PASS
- `cleanDisabled(true)`: configured
- `baselineOnMigrate(false)`: configured
- `outOfOrder(false)`: configured

`JAVA_API_DEPENDENCY_PATH = PASS`.

## Supabase connection details — CONFIRMED

Exact Dashboard Session Pooler details supplied for this project:

- host: `aws-0-ap-southeast-2.pooler.supabase.com`
- port: `5432`
- database: `postgres`
- user: `postgres.xipkywwvzvrwcqnkifuv`
- SSL: `sslmode=require`

No database password is persisted in SSOT.

The exact Session Pooler test still failed before authentication with SQLSTATE `08001` / `UnknownHostException`.

## Current primary blocker — CONFIRMED RUNTIME EGRESS

Refined blocker:

`BL008_CHATGPT_EXECUTION_RUNTIME_OUTBOUND_POSTGRES_EGRESS_UNAVAILABLE`

Parent continuity blocker:

`BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`

Subreason:

`SANDBOX_DNS_AND_RAW_OUTBOUND_TCP_BLOCKED_NO_PROXY`

Latest mitigation evidence proves:

- `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY` and lowercase equivalents are unset.
- no SOCKS/JVM proxy is exposed.
- the container resolver is `168.63.129.16`, but direct DNS queries to it time out.
- direct DNS queries to `8.8.8.8` and `1.1.1.1` also time out.
- name resolution fails not only for Supabase but also for unrelated public hosts such as GitHub, PyPI and Maven Central.
- PostgreSQL JDBC tests using literal IPv4 diagnostic candidates bypassed DNS but failed with SQLSTATE `08001` / `java.net.ConnectException: Connection refused` on ports 5432 and 6543.
- an independent literal public IPv4 TCP test also failed immediately.

Therefore this is no longer merely a hostname/DNS hypothesis. The current ChatGPT execution container does not expose a usable public DNS or raw outbound TCP route to the Java process.

## Current target read-only state

Latest independent connector verification remains:

- database: `postgres`
- PostgreSQL: `17.6`
- `public.flyway_schema_history` exists: **NO**
- public table count: **0**
- migration-flow database writes: **0**

## Alternative execution surface investigation

The installable plugin catalog was searched for Java/JVM/container/remote execution and TCP/proxy/tunnel capabilities.

External hosted runtime candidates exist, but none is a currently installed ChatGPT-native arbitrary Java/TCP surface. Current governance explicitly says `external_worker_runtime: forbidden`, so no external runtime was installed or invoked.

## Safety result

- Flyway Java runtime: **PASS**
- PostgreSQL JDBC driver: **PASS**
- exact Supabase Session Pooler URL shape: **PASS**
- authentication reached: **NO**
- Flyway Java `info()` reached database: **NO**
- Flyway Java `validateWithResult()`: **NOT RUN**
- Flyway Java `migrate()`: **NOT RUN**
- `V1__DailyLogin.sql`: **NOT APPLIED**
- provider-native migration replay: **NOT RUN**
- raw/manual SQL migration: **NOT RUN**
- database writes: **0**
- secrets persisted: **0**

## Governed next flow

Within the current policy boundary there is no remaining in-container networking workaround to try.

Execution can resume when either:

1. the ChatGPT Java execution runtime exposes working public DNS and outbound TCP to the Supabase Session Pooler; or
2. governance is explicitly changed to permit a **ChatGPT-controlled external compute runtime** with Java 21 and outbound TCP, while keeping the user hands-off and retaining genuine Flyway Java execution.

Once a compliant JDBC route exists:

1. run genuine Flyway Java `info()`;
2. prove the first pending migration against frozen source;
3. run `validateWithResult()`;
4. migrate exactly V1 only;
5. verify `SUCCESS`, `flyway_schema_history`, schema objects and integrity;
6. persist evidence and stop before V2.

BL-002 may continue independently while BL-008 remains fail-closed.

Latest evidence: `BL-008/evidence/20260829-070653-runtime-egress-mitigation.md`.
