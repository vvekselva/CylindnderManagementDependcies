# BL-008 Evidence — CYLINDER-MANUAL-FLYWAY-BOOTSTRAP-20260829-045929IST

## Scope

Governed ChatGPT-native Flyway 10.0.0 bootstrap attempt against the approved Supabase TEST target.

- Execution host: ChatGPT
- GitHub role: version control and durable evidence only
- GitHub runner used: no
- Manual user execution: forbidden / not requested
- External worker runtime: forbidden / not used
- Manual SQL migration substitution: forbidden / not used
- Database-write parallelism: 1
- Supabase project: `xipkywwvzvrwcqnkifuv`
- Database: `postgres`

## Preconditions

The frozen migration-source gate was already reconciled successfully for V1-V17 at:

- Repository: `vvekselva/CylinderManagement`
- Commit: `3ae6e61442132d94a307275b08dd65fcef228d89`
- Path: `cylinder.datascripts/src/main/resources/db/migration`
- Frozen POM Flyway version: `10.0.0`
- First source-order candidate: `V1__DailyLogin.sql`

The target remains read-only at this stage. Previous/current inspection proves `public.flyway_schema_history` absent and public table count 0. This does not substitute for genuine Flyway `info`/`validate`.

## ChatGPT-native runtime bootstrap probes

Execution-image tools/capabilities observed:

- Java 21.0.11: available
- `javac`: available
- `jshell`: available
- Maven executable: unavailable
- Flyway CLI executable: unavailable
- Gradle executable: unavailable
- PostgreSQL `psql`: unavailable
- Docker/Podman/Buildah/Nerdctl: unavailable
- user Maven dependency cache containing required Flyway/PostgreSQL artifacts: unavailable
- system Maven repository does not contain the required Flyway/PostgreSQL artifacts

Network/bootstrap probes:

- package-manager bootstrap could not complete because outbound package-network access was unavailable
- Flyway 10.0.0 direct download path could not be reached from the execution container
- Maven Central could not be reached from the execution container, including an IP-pinned connectivity probe
- Redgate Flyway download host could not be reached from the execution container
- direct PostgreSQL network route from the execution container to the Supabase database host remains unavailable
- no installed Flyway/Redgate ChatGPT plugin was found

Result dimension:

`RUNTIME_BOOTSTRAP_NETWORK_AND_BINARY_PATH_UNAVAILABLE`

## Supabase-hosted execution investigation

Official Supabase documentation was checked from the connected Supabase tooling.

Proved capabilities:

- Supabase Edge Functions run in the Deno/TypeScript Edge Runtime.
- Hosted Edge Functions receive `SUPABASE_DB_URL` as a default environment secret.
- Edge Functions can connect directly to Supabase PostgreSQL using serverless/Postgres clients.
- Edge Functions support NPM modules and WebAssembly.

Not proved:

- No authoritative evidence was found that a hosted Supabase Edge Function can launch the genuine Java/CLI Flyway 10.0.0 process required by this BL-008 policy.
- Repository/documentation searches for a supported arbitrary subprocess / `Deno.Command` Flyway execution route did not establish such a capability.

Therefore Edge Functions currently solve a potential database-connectivity location but do not prove a genuine Flyway execution engine. A TypeScript "Flyway-compatible" reimplementation, a provider-native migration action, or raw SQL replay would violate the current Flyway-only gate and was not used.

Result dimension:

`SUPABASE_EDGE_DB_CONNECTIVITY_AVAILABLE_BUT_GENUINE_FLYWAY_EXECUTION_UNPROVEN`

## Migration result

- Flyway `info`: NOT RUN
- Flyway `validate`: NOT RUN
- Flyway `migrate`: NOT RUN
- `V1__DailyLogin.sql`: NOT APPLIED
- Supabase native migration replay: NOT USED
- raw/manual SQL migration: NOT USED
- database writes: 0
- destructive project/branch operations: 0

## Current blocker

`BL008_CHATGPT_NATIVE_FLYWAY_PATH_UNAVAILABLE`

The frozen source binding is no longer the blocker. The active blocker is the lack of a genuine Flyway 10.0.0 binary/runtime plus a ChatGPT-controlled network path capable of reaching the approved PostgreSQL target.

## Next governed action

On later governed fires, re-check only ChatGPT-native capabilities that could materially change this blocker: an installed/available Flyway-capable tool, a native execution environment with package/network access, or a documented ChatGPT-invokable runtime that can execute genuine Flyway 10.0.0 and reach the target. Do not ask the user to run commands and do not substitute provider-native SQL/migrations.
