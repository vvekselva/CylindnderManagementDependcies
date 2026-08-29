# BL-008 Exact Supabase Session-Pooler JDBC Test

Run ID: `CYLINDER-MANUAL-FLYWAY-SESSION-POOLER-TEST-20260829-065851IST`

Started: `2026-08-29T06:58:51+05:30`
Completed: `2026-08-29T07:00:30+05:30`

## Scope

Read-only connectivity/Flyway `info()` test only. No migration, DDL, raw SQL replay, provider-native migration replay, or destructive action was permitted.

## Exact Dashboard-provided connection identity

- Host: `aws-0-ap-southeast-2.pooler.supabase.com`
- Port: `5432`
- Database: `postgres`
- User: `postgres.xipkywwvzvrwcqnkifuv`
- SSL mode used by Java/JDBC test: `require`
- Database password was supplied at runtime only and was not written to this evidence, GitHub, or logs.

## Java/JDBC result

- Java DNS lookup of the exact host: `UnknownHostException`
- Java TCP connect to exact host:5432: failed at DNS resolution
- PostgreSQL JDBC 42.7.2 exact session-pooler connection attempt: FAIL
- SQLSTATE: `08001`
- Root cause: `java.net.UnknownHostException: aws-0-ap-southeast-2.pooler.supabase.com`
- Authentication was not reached, so credential validity was not established by the Java runtime.

## Genuine Flyway Java API result

- Flyway 10.0.0 `.load()`: PASS
- `Flyway.info()`: attempted
- Database reached: NO
- Failure stage: datasource connection before authentication
- Root cause: `UnknownHostException` for the exact Dashboard-provided session-pooler host
- `validateWithResult()`: NOT RUN
- `migrate()`: NOT RUN

## Independent target verification

After the failed Java/JDBC/Flyway test, the Supabase connector was used only for a read-only state check:

- `public.flyway_schema_history` exists: NO
- public table count: `0`

## Safety

- Real database credentials persisted: NO
- Flyway migration writes: `0`
- Provider-native migration writes: `0`
- Manual/raw SQL migration writes: `0`
- Database writes performed: `0`

## Conclusion

The previously tested pooler hostname is now confirmed to be the exact Supabase Dashboard session-pooler hostname. The failure is therefore not attributable to a guessed pooler host. The active blocker remains Java-runtime outbound DNS/TCP access from the ChatGPT execution environment.

Blocker: `BL008_SUPABASE_JDBC_ROUTE_UNAVAILABLE_FROM_CHATGPT_JAVA_RUNTIME`
Subreason: `OUTBOUND_DNS_AND_TCP_EGRESS_UNAVAILABLE`
