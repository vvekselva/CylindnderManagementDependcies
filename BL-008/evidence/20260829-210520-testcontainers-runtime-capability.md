# BL-008 Testcontainers Runtime Capability Evidence

Initial run: `CYLINDER-PRODUCTION-FIRE-20260829-210423IST`  
Initial observation: `2026-08-29T21:05:20+05:30`  
Confirmation run: `CYLINDER-BL008-TESTCONTAINERS-20260830-061203IST`  
Confirmation observation: `2026-08-30T06:15:11+05:30`  
Execution host: ChatGPT  
Purpose: determine whether the approved PostgreSQL Testcontainers validation path can start inside the current ChatGPT execution runtime.

## Governance applied

- Testcontainers is the approved BL-008 PostgreSQL migration-validation runtime.
- Genuine Flyway 10.0.0 Java API remains mandatory.
- Database-write parallelism remains 1.
- `clean` is forbidden.
- Raw/manual SQL substitution remains forbidden.
- External worker runtime and GitHub runners remain forbidden.
- Testcontainers validation does not count as a persistent Supabase-applied migration.

## Initial capability evidence

The ChatGPT execution container was inspected for a local OCI/container runtime required by standard Java Testcontainers.

Observed results:

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

## 2026-08-30 confirmation and strengthened evidence

The approved V1 Testcontainers flow was retried only because the user explicitly requested proceeding with this alternate execution path. The execution environment materially confirmed the prerequisite failure before any database write was attempted.

Observed runtime facts:

- Docker CLI: absent.
- Docker socket `/var/run/docker.sock`: absent.
- Podman: absent.
- nerdctl: absent.
- containerd/`ctr`: absent.
- Java runtime: present.
- Process runs as root, but the sandbox capability set does not include `CAP_SYS_ADMIN` or `CAP_NET_ADMIN`.
- An attempt to refresh the package metadata for a possible `docker.io` route timed out; more importantly, installing only client/daemon packages would not supply the missing host container API/kernel capability boundary required by standard Testcontainers in this sandbox.

The governed source and runner inputs were independently reconfirmed before the runtime gate:

- `BL-008/java/FlywayJavaRunner.java` is present in the control repository.
- governed `V1__DailyLogin.sql` is present at `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89` under `cylinder.datascripts/src/main/resources/db/migration`.

## Result

`TESTCONTAINERS_CONTAINER_RUNTIME_GATE = BLOCKED`

Canonical blocker:

`BL008_CHATGPT_EXECUTION_RUNTIME_TESTCONTAINERS_BACKEND_UNAVAILABLE`

Legacy/equivalent fingerprint retained for traceability:

`BL008_TESTCONTAINERS_CONTAINER_RUNTIME_UNAVAILABLE_IN_CHATGPT_EXECUTION_HOST`

The blocker is distinct from the existing persistent-target connectivity blocker:

`BL008_CHATGPT_EXECUTION_RUNTIME_OUTBOUND_POSTGRES_EGRESS_UNAVAILABLE`

The migration source and genuine Flyway runner are not the cause of this failure. The current ChatGPT execution surface exposes neither a Docker-compatible API/socket nor another OCI backend that Java Testcontainers can use.

Do not repeat the same Docker/Podman/nerdctl/containerd/capability probe unless execution-environment evidence materially changes.

## Safety state after confirmation

- Testcontainer started: NO
- PostgreSQL container started: NO
- Flyway `info()` against Testcontainer: NOT RUN
- Flyway `validateWithResult()` against Testcontainer: NOT RUN
- Flyway `migrate()` against Testcontainer: NOT RUN
- Testcontainers validation delta: 0
- Supabase migrations applied: 0
- Persistent-target database writes: 0
- Raw/manual SQL: NOT RUN
- Repeated Supabase network probe: NO

BL-002 remains independently eligible and must not be blocked by this BL-008 lane-local blocker.
