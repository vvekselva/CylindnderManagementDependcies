# BL-008 Testcontainers Runtime Capability Evidence

Run: `CYLINDER-PRODUCTION-FIRE-20260829-210423IST`  
Observed at: `2026-08-29T21:05:20+05:30`  
Execution host: ChatGPT  
Purpose: determine whether the newly approved PostgreSQL Testcontainers validation path can start inside the current ChatGPT execution runtime.

## Governance applied

- Testcontainers is the BL-008 PostgreSQL migration-validation runtime.
- Genuine Flyway 10.0.0 Java API remains mandatory.
- Database-write parallelism remains 1.
- `clean` is forbidden.
- Raw/manual SQL substitution remains forbidden.
- External worker runtime and GitHub runners remain forbidden.

## Capability probe

The ChatGPT execution container was inspected for a local OCI/container runtime required by standard Java Testcontainers.

Observed commands/results:

```text
$ docker --version
bash: docker: command not found

$ command -v podman
(no result)

$ command -v nerdctl
(no result)

$ command -v ctr
(no result)

$ java -version
openjdk version "21.0.11" 2026-04-21
OpenJDK Runtime Environment (build 21.0.11+10-1-deb13u2-Debian)
OpenJDK 64-Bit Server VM (build 21.0.11+10-1-deb13u2-Debian, mixed mode, sharing)
```

## Result

`TESTCONTAINERS_CONTAINER_RUNTIME_GATE = BLOCKED`

Blocker fingerprint:

`BL008_TESTCONTAINERS_CONTAINER_RUNTIME_UNAVAILABLE_IN_CHATGPT_EXECUTION_HOST`

The Java 21 runtime is present, but the current ChatGPT execution surface exposes no `docker`, `podman`, `nerdctl`, or `ctr` executable. Therefore a standard local PostgreSQL Testcontainer cannot be started in this execution surface at this time.

This is distinct from the existing Supabase outbound-JDBC blocker. The Testcontainers validation path is approved, but its local container-runtime prerequisite is currently unavailable.

## Safety state

- Testcontainer started: NO
- PostgreSQL container started: NO
- Flyway `info()` against Testcontainer: NOT RUN
- Flyway `validateWithResult()` against Testcontainer: NOT RUN
- Flyway `migrate()` against Testcontainer: NOT RUN
- Migration applied: 0
- Database writes: 0
- Raw/manual SQL: NOT RUN
- Repeated Supabase network probe: NO

BL-002 remains independently eligible and must not be blocked by this BL-008 lane-local blocker.
