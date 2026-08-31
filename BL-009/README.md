# BL-009 — Approved Story Test Cases and Test Data

Purpose: maintain human-readable test cases and controlled test-data definitions for every explicitly approved BL-002 Story.

## Entry gate
Only Stories with durable `Approval: APPROVED` enter BL-009. Approval is user-owned and never generated automatically.

## Required outputs per approved Story
- `BL-009/stories/<story-id>.md` — human-readable end-to-end test catalogue.
- `BL-009/test-data/<story-id>.csv` — non-secret generated test data definitions.
- `BL-009/test-case-task-queue.csv` — lifecycle projection.

## Coverage layers
BL-009 test cases trace to BL-004 unit tests, BL-005 JUnit/Testcontainers integration tests, and authorized live-test-data validation. Test data must be synthetic/sanitized and must never contain credentials, tokens, personal data or production secrets.

## Automatic approval fan-out
At each orchestrator startup and replan, diff approved BL-002 Stories against BL-004, BL-005 and BL-009. Materialize missing downstream files/queue entries idempotently. Future approved Stories follow the same rule without needing a new user instruction.

## Current approved Story
- STORY-0001 — test catalogue and generated synthetic data materialized.
