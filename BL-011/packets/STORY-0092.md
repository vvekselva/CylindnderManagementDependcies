# BL-011 Human-Readable Test Packet — STORY-0092 Driver Search

## Governance and traceability

- Source Story: `BL-002/stories/STORY-0092.md`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`
- Frozen source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior protected

A caller searches drivers using `GET /search/driver/{searchText}`. The request text is copied to `CylinderManagementApplicationRequestDto.searchTerm`, paging is created, `DriverSearchService.searchWithText` validates the request, and `DriverJpaDao.findByDriverNameContainingIgnoreCase` performs the read. Matching driver records are mapped to response DTOs; an empty result produces the governed failure/empty-result behavior. This search is read-only and must not mutate driver data.

## Unit Test Story

**Actor/component:** Driver search service/controller path.

**Preconditions:** Search dependencies are available as mocks/stubs; no real database is required for the unit scope.

**Happy path:** Give a valid driver-name fragment and a DAO result containing matching drivers. Verify the service returns mapped driver DTOs and the expected paging/result status.

**Negative/error cases:** Empty DAO result; governed validation/application exception path; malformed/invalid request where the validator rejects it.

**Boundary cases:** Minimal non-empty search term and paging boundaries supported by the production contract. No extra minimum-length rule is invented at this API layer.

**Persistence expectation:** No insert/update/delete occurs.

**Executable reference:** `BL-004/generated-tests/STORY-0092/Story0092DriverSearchUnitTest.java`.

**Execution state:** `NOT EXECUTED` — faithful Maven/JUnit/Mockito runtime is unavailable.

## Integration Test Story

**Participating layers:** REST/search service -> validator -> JPA DAO -> PostgreSQL read path.

**Test setup:** PostgreSQL Testcontainers with source-bound schema/data setup when runtime is available.

**Happy path:** Seed a driver whose name contains the search text, call the search path, and verify the matching persistent identity/name is returned.

**Negative path:** Search text with no matching row must produce the governed empty/failure response without modifying data.

**Database expectation:** Driver rows remain unchanged; only read operations are expected.

**Executable reference:** `BL-005/generated-tests/STORY-0092/Story0092DriverSearchIntegrationTest.java`.

**Execution state:** `NOT EXECUTED` — PostgreSQL Testcontainers runtime is unavailable.

## Test Data Story

Readable catalogue: `BL-009/test-data/STORY-0092.md`; structured rows: `BL-009/test-data/STORY-0092.csv`.

The mapped catalogue contains three source-bound rows covering successful matching, no-match behavior, and the governed validation/error branch. Data must use stable driver identifiers/names and remain isolated so one test does not alter another test's expected read result.

## Use-case / End-to-End Test Story

**Given** driver reference data exists, **when** a consuming component searches with a driver-name fragment, **then** matching drivers are returned as selectable reference identities; a no-match search returns the governed empty/failure outcome; no driver record is changed.

Catalogue: `BL-009/stories/STORY-0092.md`.
Executable data-driven mapping: `BL-009/generated-tests/STORY-0092/Story0092TestDataDrivenTest.java`.

## Evidence state

- Unit generation: complete/source-bound.
- Integration generation: complete/source-bound.
- Test-data mapping: complete, 3 rows mapped.
- Application-behavior execution: `NOT EXECUTED`.
- Coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet status: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability; execution and coverage remain separately blocked.
