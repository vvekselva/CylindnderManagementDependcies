# BL-005 — Approved Story Integration Test Creation

Purpose: generate and execute JUnit 5 integration tests with PostgreSQL Testcontainers for every explicitly approved BL-002 Story that has an applicable persistence/runtime integration boundary.

## Entry gate
A Story enters BL-005 only after explicit user approval is durably recorded in BL-002. BL-004 unit-test generation may proceed independently when write sets do not conflict, but BL-005 execution must preserve normal application/Flyway behavior.

## Required outputs per approved Story
- `BL-005/stories/<story-id>.md` — human-readable integration-test contract.
- `BL-005/generated-tests/<story-id>/*IntegrationTest.java` — JUnit 5 + Testcontainers source.
- `BL-005/integration-test-task-queue.csv` — dispatch/status projection.
- durable execution evidence after Testcontainers tests actually run.

## Integration standard
Use JUnit 5 and Testcontainers. Use PostgreSQL containers, normal Spring/Flyway startup, isolated disposable test data, and assertions across both HTTP/application behavior and persisted state where applicable. Do not replace the integration path with raw/manual SQL or external hosted databases.

## Approval fan-out rule
Every orchestrator invocation must reconcile all approved BL-002 Stories into BL-004, BL-005 and BL-009. Missing downstream artifacts are first-class work.

## Current approved Story
- STORY-0001 — queued for JUnit/Testcontainers integration generation and execution.
