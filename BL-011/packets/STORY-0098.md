# BL-011 Human-Readable Test Packet — STORY-0098 Product Category Search

## Governance and traceability

- Source Story: `BL-002/stories/STORY-0098.md`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`
- Frozen source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior protected

`GET /search/product-category/{searchText}` performs a read-only product-category lookup. `RestfulProductCategoryServices.getProductCategories` copies the path text into the application request DTO, delegates to the product-category search service and returns `ProductCategorySearchResponseDto`. A governed application exception is converted to the defined empty response. The API must not create, update or delete product categories.

## Unit Test Story

**Happy path:** Provide a valid category search fragment and mocked service/DAO result containing matching categories. Verify the response contains the expected category identities/names.

**Negative/error cases:** No matching category; governed validation/application exception; empty-result behavior.

**Boundary cases:** Minimal valid search content accepted by the API contract. Screen-specific debounce/minimum-length rules are not attributed to this standalone endpoint unless proven by a consuming screen.

**Persistence expectation:** Read-only; no category mutation.

**Executable reference:** `BL-004/generated-tests/STORY-0098/Story0098ProductCategorySearchUnitTest.java`.

**Execution state:** `NOT EXECUTED`.

## Integration Test Story

**Participating layers:** REST/search service -> validation -> JPA/PostgreSQL read path.

**Happy path:** Seed a category matching the search fragment and verify the API/service path returns the persisted category identity/name.

**Negative path:** No matching row yields the governed empty/failure response.

**Database expectation:** Source rows remain unchanged.

**Executable reference:** `BL-005/generated-tests/STORY-0098/Story0098ProductCategorySearchIntegrationTest.java`.

**Runtime:** PostgreSQL Testcontainers required; currently unavailable.

## Test Data Story

Readable catalogue: `BL-009/test-data/STORY-0098.md`; structured rows: `BL-009/test-data/STORY-0098.csv`.

Three mapped rows cover successful lookup, no-match behavior and governed validation/error handling. Test data must preserve stable category identities and isolation between cases.

## Use-case / End-to-End Test Story

**Given** product-category reference data exists, **when** a caller searches using a category-name fragment, **then** matching categories are returned as reference data; no-match/error cases remain governed and no category row is changed.

Catalogue: `BL-009/stories/STORY-0098.md`.
Executable data-driven mapping: `BL-009/generated-tests/STORY-0098/Story0098TestDataDrivenTest.java`.

## Evidence state

- Unit generation: complete/source-bound.
- Integration generation: complete/source-bound.
- Test-data mapping: 3 rows mapped.
- Application-behavior execution: `NOT EXECUTED`.
- Coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet status: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability only.
