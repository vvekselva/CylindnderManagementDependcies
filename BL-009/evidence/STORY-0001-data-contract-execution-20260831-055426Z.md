# BL-009 / STORY-0001 — Data-Contract Execution Evidence

Execution time: `2026-08-31T05:54:26Z`.
Execution runtime: ChatGPT-side OpenJDK 21.0.11.

## Purpose
Execute the governed STORY-0001 test-data rows by code even though the preferred JUnit 5 runtime is not currently available. This is a behaviorally equivalent substitution for the **BL-009 data-contract layer only**. It does not execute the Cylinder application, does not replace BL-004/BL-005 JUnit tests, and is not application-behavior or JaCoCo coverage evidence.

Preferred mechanism: JUnit 5 parameterized/data-driven test.
Substitute: dependency-free Java 21 runner `BL-009/generated-tests/STORY-0001/Story0001TestDataContractRunner.java`.
Reason: JUnit 5/Mockito/JaCoCo runtime dependencies are not locally available and outbound dependency resolution is DNS-blocked.
Equivalence: both mechanisms consume the same governed CSV rows and assert row IDs, test-case mappings, expected authentication/result values, expected row counts, expected visible/navigation outcomes, classifications, duplicate IDs, row/header parity, and non-persistence of obvious real-secret markers.
Limitation: this substitute validates the test-data contract only; it does not invoke Spring MVC, Spring Security, JPA, Flyway, PostgreSQL, browser behavior, or application production classes.

## Execution output

- PASS `TD-0001-01 -> TC-0001-02`
- PASS `TD-0001-02 -> TC-0001-03`
- PASS `TD-0001-03 -> TC-0001-05`
- PASS `TD-0001-04 -> TC-0001-06`
- PASS `TD-0001-05 -> TC-0001-07`
- PASS `TD-0001-06 -> TC-0001-08`
- PASS `TD-0001-07 -> TC-0001-09`
- PASS `STORY-0001 BL-009 DATA_CONTRACT rows=7`

## Result
- executable data-contract code generated: PASS
- executable data-contract code compiled: PASS
- governed CSV rows consumed: `7/7`
- governed CSV rows PASS: `7/7`
- governed CSV rows FAIL: `0/7`
- application-behavior tests executed: `0`
- application-behavior PASS: `0`
- JaCoCo coverage: `NOT_EXECUTED`

No GitHub Action/runner was used. No database write was performed.