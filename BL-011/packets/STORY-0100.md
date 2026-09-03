# BL-011 Human-Readable Test Packet — STORY-0100 Product UOM Search

## Governance and traceability

- Source Story: `BL-002/stories/STORY-0100.md`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`
- Frozen source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior protected

`GET /search/product-uom/{searchText}` is a read-only Unit-of-Measure reference lookup. `RestfulProductUomServices.getProductUoms` copies the path variable to `CylinderManagementApplicationRequestDto.searchTerm`, delegates to the Product UOM search service and returns `ProductUomSearchResponseDto`. A governed application exception is converted to an empty response. The endpoint must not persist or modify UOM master data.

## Unit Test Story

**Happy path:** A valid UOM search fragment with mocked matching data returns mapped UOM identities/names.

**Negative/error cases:** No matching UOM; governed validation/application exception; empty-result response.

**Boundary cases:** Minimal valid API search content. No screen-specific debounce/hidden-identity rule is invented unless a unique consuming screen proves it.

**Persistence expectation:** No UOM mutation.

**Executable reference:** `BL-004/generated-tests/STORY-0100/Story0100ProductUomSearchUnitTest.java`.

**Execution state:** `NOT EXECUTED`.

## Integration Test Story

**Participating layers:** REST/search service -> validation -> JPA/PostgreSQL read path.

**Happy path:** Seed a UOM matching the search fragment and verify the persisted UOM identity/name is returned.

**Negative path:** Search with no matching row returns the governed empty/failure result without changing source data.

**Database expectation:** Read-only; UOM rows unchanged.

**Executable reference:** `BL-005/generated-tests/STORY-0100/Story0100ProductUomSearchIntegrationTest.java`.

**Runtime:** PostgreSQL Testcontainers required; currently unavailable.

## Test Data Story

Readable catalogue: `BL-009/test-data/STORY-0100.md`; structured rows: `BL-009/test-data/STORY-0100.csv`.

Three mapped rows cover successful lookup, no-match behavior and governed validation/error handling. Test data uses stable UOM identities/names with isolation between cases.

## Use-case / End-to-End Test Story

**Given** UOM reference data exists, **when** a caller searches by UOM text, **then** matching UOM reference identities are returned; no-match/error behavior stays governed and the search performs no UOM persistence.

Catalogue: `BL-009/stories/STORY-0100.md`.
Executable data-driven mapping: `BL-009/generated-tests/STORY-0100/Story0100TestDataDrivenTest.java`.

## Evidence state

- Unit generation: complete/source-bound.
- Integration generation: complete/source-bound.
- Test-data mapping: 3 rows mapped.
- Application-behavior execution: `NOT EXECUTED`.
- Coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet status: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability only.
