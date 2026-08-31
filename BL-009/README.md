# BL-009 — Approved Story Test Cases, Test Data and Executable Validation

Purpose: maintain human-readable test cases, controlled test-data definitions, and executable code validation for every explicitly approved BL-002 Story.

## Entry gate
Only Stories with durable `Approval: APPROVED` enter BL-009. Approval is user-owned and never generated automatically.

## Required outputs per approved Story
- `BL-009/stories/<story-id>.md` — human-readable end-to-end test catalogue.
- `BL-009/test-data/<story-id>.csv` — machine-readable non-secret generated test data.
- `BL-009/test-data/<story-id>.md` — human-readable test data containing the same applicable values as the CSV.
- `BL-009/generated-tests/<story-id>/*Test.java` — executable JUnit 5 test/data harness consuming the governed test cases/test-data rows.
- `BL-009/test-case-task-queue.csv` — lifecycle projection.

## Code-execution requirement
BL-009 is not documentation-only. Every applicable test case must map to executable test code, and every test-data row must be consumed by executable code or carry a durable justified exclusion/blocker. Parameterized/data-driven JUnit 5 tests are preferred where multiple rows exercise the same behavior.

A data-contract test may validate row identity, expected values, classifications and secret-handling rules. It does **not** by itself prove application behavior. Application-behavior PASS requires execution against the exact frozen-source-bound unit, integration or authorized runtime/UI path.

## Coverage layers
BL-009 test cases trace to BL-004 unit tests, BL-005 JUnit/Testcontainers integration tests, BL-009 data-driven/runtime tests, and authorized live-test-data validation. JaCoCo coverage evidence must be linked where Java application code is executed. Unit, integration and combined coverage are tracked separately. Generated source alone never counts as coverage.

## Test-data safety
Test data must be synthetic/sanitized and must never contain credentials, tokens, personal data or production secrets. Runtime-secret placeholders may be persisted; real runtime secrets may not.

## Automatic approval fan-out
At each orchestrator startup and replan, diff approved BL-002 Stories against BL-004, BL-005 and BL-009. Materialize missing downstream files, executable test code and queue entries idempotently. Future approved Stories follow the same rule without needing a new user instruction.

## Current approved Story
- STORY-0001 — human-readable catalogue, CSV/human-readable test data and generated JUnit 5 data-driven test code materialized. Application-behavior execution remains separate until exact source/runtime binding and actual execution evidence exist.
