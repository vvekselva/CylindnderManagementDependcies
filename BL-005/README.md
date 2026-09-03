# BL-005 — Approved Story Integration Test Creation

Purpose: generate and execute JUnit 5 integration tests with PostgreSQL Testcontainers for every explicitly approved BL-002 Story that has an applicable persistence/runtime integration boundary.

## Entry gate
A Story enters BL-005 only after explicit user approval is durably recorded in BL-002 and post-approval code conformance passes. A Story with detected drift remains held until the exact drift/code-change manifest is explicitly approved. BL-004 generation may proceed independently when write sets do not conflict, but BL-005 execution must preserve normal application/Flyway behavior.

## Required outputs per approved Story
- `BL-005/stories/<story-id>.md` — human-readable integration-test contract.
- `BL-005/generated-tests/<story-id>/*IntegrationTest.java` — JUnit 5 + Testcontainers source.
- `BL-005/integration-test-task-queue.csv` — dispatch/status projection.
- durable execution evidence after Testcontainers tests actually run.

## Integration standard
Use JUnit 5 and Testcontainers where PostgreSQL is applicable. Preserve normal Spring/Flyway startup, isolated disposable test data, and assertions across application behavior and persisted state. Do not substitute raw/manual SQL or an external hosted database for the governed integration path.

## Current projection
Reconciled by `CYLINDER-PRODUCTION-FIRE-20260903-095645-UTC-RUN-009`:

- Explicitly approved Stories: **20**
- Code-conformance pass / generated source-bound: **18**
- Drift holds: **2** (`STORY-0101`, `STORY-0103`)
- Integration execution: **blocked by missing faithful Maven/Testcontainers/container runtime**
- Java available: **OpenJDK 21.0.11**
- Maven/Gradle/Docker/Podman: **unavailable in current runtime**

No integration PASS or JaCoCo coverage is claimed until actual execution evidence exists.
