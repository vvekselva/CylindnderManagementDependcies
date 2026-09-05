# BL-009 — Approved Story Test Cases, Test Data and Executable Validation

Purpose: maintain human-readable test cases, controlled test-data definitions, and executable code validation for every explicitly approved BL-002 Story.

## Entry gate
Only Stories with durable explicit user approval and passed post-approval code conformance enter executable BL-009 fan-out. Approval is user-owned and never generated automatically. Drifted Stories remain held pending explicit approval of the exact drift/code-change manifest.

## Required outputs per approved Story
- `BL-009/stories/<story-id>.md` — human-readable end-to-end test catalogue.
- `BL-009/test-data/<story-id>.csv` — machine-readable non-secret generated test data.
- `BL-009/test-data/<story-id>.md` — human-readable test data.
- `BL-009/generated-tests/<story-id>/*Test.java` — executable JUnit 5 test/data harness.
- `BL-009/test-case-task-queue.csv` — lifecycle projection.

## Code-execution requirement
Generated source alone never counts as coverage. Application-behavior PASS requires execution against the exact frozen-source-bound unit, integration or authorized runtime/UI path. JaCoCo evidence must be linked where Java application code is executed.

## Current projection
Reconciled by `CYLINDER-PRODUCTION-FIRE-20260903-095645-UTC-RUN-009`:

- Explicitly approved testing-queue Stories: **21**
- Code-conformance pass / fan-out eligible: **19**
- Generated mapped test scopes: **18**; newly queued not yet generated: **1** (`STORY-0102`)
- Drift holds: **2** (`STORY-0101`, `STORY-0103`)
- Revised application-behavior execution: **not executed in this runtime**
- Java available: **OpenJDK 21.0.11**
- Maven/Gradle/Docker/Podman: **unavailable in current runtime**

No revised-contract application PASS or JaCoCo coverage is claimed without actual runtime execution evidence.
