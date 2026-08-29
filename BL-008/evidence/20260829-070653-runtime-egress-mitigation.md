# BL-008 Runtime Egress Mitigation Evidence

Run ID: `CYLINDER-MANUAL-RUNTIME-EGRESS-MITIGATION-20260829-070653IST`  
Started: `2026-08-29T07:06:53+05:30`  
Completed: `2026-08-29T07:11:15+05:30`  
Execution host: ChatGPT  
Result: `RUNTIME_EGRESS_CONFIRMED_BLOCKED_NO_WRITE`

## Goal

Attack the remaining Java/JDBC route blocker after the Flyway 10.0.0 dependency path and exact Supabase Session Pooler connection details were already proved.

## Pre-run governance

- Previous singleton lease was read first and was `RELEASED`.
- This run acquired the singleton BL-008 lease before mutable SSOT work.
- GitHub runners were not used.
- No external worker runtime was used.
- No provider-native migration replay or raw/manual SQL migration was used.
- BL-008 database write parallelism remained `1`.

## Resolved gates retained

- Java 21.0.11: PASS.
- User-supplied Flyway runtime bundle: PASS, 11 required JARs.
- `org.flywaydb.core.Flyway`: PASS.
- `org.postgresql.Driver`: PASS.
- `Flyway.configure()` / `.load()`: PASS.
- Frozen V1-V17 source reconciliation: PASS.
- Exact Supabase Session Pooler host/port/user format: previously confirmed from the Dashboard connection string.

## Proxy / egress gateway inspection

The ChatGPT execution container was inspected without exposing secrets.

- `HTTP_PROXY`: unset.
- `HTTPS_PROXY`: unset.
- `ALL_PROXY`: unset.
- lowercase HTTP/HTTPS/ALL proxy variables: unset.
- `JAVA_TOOL_OPTIONS`: unset.
- `JDK_JAVA_OPTIONS`: unset.
- No SOCKS proxy setting was available.
- `/etc/resolv.conf` contains a single resolver: `168.63.129.16`.

No usable HTTP/SOCKS/JVM proxy or egress gateway is exposed to the Java process.

## DNS tests

`socket.getaddrinfo()` failed with temporary name-resolution failure for all tested public hosts, including:

- `aws-0-ap-southeast-2.pooler.supabase.com`
- `db.xipkywwvzvrwcqnkifuv.supabase.co`
- `github.com`
- `pypi.org`
- `repo.maven.apache.org`

Direct UDP DNS queries also timed out against:

- configured resolver `168.63.129.16:53`
- Google DNS `8.8.8.8:53`
- Cloudflare DNS `1.1.1.1:53`

This proves the failure is not specific to Supabase DNS.

## Literal IPv4 bypass test

To determine whether the blocker was DNS-only, PostgreSQL JDBC was tested against literal IPv4 diagnostic candidates publicly associated with the same Supabase ap-southeast-2 pooler hostname. These IPs were used only as network diagnostics and are not treated as authoritative/current connection endpoints.

The genuine PostgreSQL JDBC 42.7.2 driver was used with non-secret dummy credentials and `sslmode=require`.

Results:

- literal IPv4 candidate A, port 5432 -> SQLSTATE `08001`, root `java.net.ConnectException: Connection refused`.
- literal IPv4 candidate A, port 6543 -> SQLSTATE `08001`, root `java.net.ConnectException: Connection refused`.
- literal IPv4 candidate B, port 5432 -> SQLSTATE `08001`, root `java.net.ConnectException: Connection refused`.
- literal IPv4 candidate B, port 6543 -> SQLSTATE `08001`, root `java.net.ConnectException: Connection refused`.
- independent literal public IPv4 `1.1.1.1:443` -> immediate `Connection refused`.

Therefore bypassing DNS does not create a usable outbound TCP route from this execution container.

## Alternative execution-surface discovery

The available plugin catalog was searched for Java/JVM/container/remote execution and TCP/proxy/tunnel capabilities.

- Installable external app/runtime candidates exist (for example hosted app-building runtimes), but none is currently an installed ChatGPT-native arbitrary Java/TCP execution surface.
- Current Cylinder governance explicitly marks `external_worker_runtime: forbidden`.
- No external runtime was installed or invoked during this run.
- No GitHub Codespaces execution action was available through the current GitHub connector discovery, and GitHub remains repository storage only by policy.

## Refined blocker

Primary refined blocker:

`BL008_CHATGPT_EXECUTION_RUNTIME_OUTBOUND_POSTGRES_EGRESS_UNAVAILABLE`

Parent blocker retained for continuity:

`BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`

Subreason:

`SANDBOX_DNS_AND_RAW_OUTBOUND_TCP_BLOCKED_NO_PROXY`

The current ChatGPT container exposes neither functioning public DNS nor raw outbound TCP, and no proxy/tunnel is available to the Java process. This is now proved independently of the Supabase hostname.

## Safety / database result

- Flyway Java `info()` against the database: not reachable.
- Flyway `validateWithResult()`: NOT RUN.
- Flyway `migrate()`: NOT RUN.
- V1 applied: NO.
- Provider-native migration replay: NOT RUN.
- Raw/manual SQL migration: NOT RUN.
- Database writes: `0`.
- Database secrets persisted: `0`.

## Governed next decision

Within the current policy boundary, there is no remaining in-container networking workaround to try. The next executable direction requires one of these to become true:

1. the ChatGPT execution runtime gains public DNS + outbound TCP access to the Supabase Session Pooler; or
2. governance is explicitly changed to permit a ChatGPT-controlled external compute runtime with Java 21 and outbound TCP, while keeping the user hands-off and preserving genuine Flyway Java execution.

Until then BL-008 remains fail-closed and performs zero database writes.
