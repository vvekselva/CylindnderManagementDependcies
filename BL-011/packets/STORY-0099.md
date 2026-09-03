# BL-011 Human-Readable Test Packet — STORY-0099 Product Search

## Governance and traceability

- Source Story: `BL-002/stories/STORY-0099.md`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`
- Frozen source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior protected

`GET /search/product/{searchText}` is a read-only product lookup. The REST layer copies the search text into the application request DTO, delegates to the product search service and returns `ProductSearchResponseDto`; governed application exceptions are logged and converted to an empty response. A source-proved consumer is Customer Demand: its typeahead starts after 3 characters with a 280 ms debounce, displays product names and stores the selected persistent `productId`; editing/clearing the visible value invalidates a stale selected identity.

## Unit Test Story

**Happy path:** Valid product search text with matching mocked data returns mapped product identities/names.

**Negative/error cases:** No matching product; governed validation/application exception; stale selected product identity must not be retained by the source-proved Customer Demand selector after the visible value changes.

**Boundary cases:** API-level search remains governed by the service contract; the 3-character/280 ms behavior is tested only in the bound Customer Demand consumer context.

**Persistence expectation:** Search itself performs no product mutation.

**Executable reference:** `BL-004/generated-tests/STORY-0099/Story0099ProductSearchUnitTest.java`.

**Execution state:** `NOT EXECUTED`.

## Integration Test Story

**Participating layers:** REST/search service -> validator -> JPA/PostgreSQL read path, plus consuming selector contract where applicable.

**Happy path:** Seed a product matching the search fragment, execute the search path and verify the persistent product identity/name is returned.

**Negative path:** No-match returns governed empty/failure behavior; data remains unchanged.

**Database expectation:** Read-only product lookup; no insert/update/delete.

**Executable reference:** `BL-005/generated-tests/STORY-0099/Story0099ProductSearchIntegrationTest.java`.

**Runtime:** PostgreSQL Testcontainers required; currently unavailable.

## Test Data Story

Readable catalogue: `BL-009/test-data/STORY-0099.md`; structured rows: `BL-009/test-data/STORY-0099.csv`.

Four catalogue rows are mapped with executable core coverage, including successful lookup, no-match/error behavior and the source-proved consuming-selector identity behavior. Stable product IDs/names must be used and test cases isolated.

## Use-case / End-to-End Test Story

**Given** product reference data exists, **when** Customer Demand or another caller searches for a product, **then** matching product identities are returned. For Customer Demand, a valid selection stores the product ID; changing/clearing the text invalidates stale identity. Search must not mutate product master data.

Catalogue: `BL-009/stories/STORY-0099.md`.
Executable data-driven mapping: `BL-009/generated-tests/STORY-0099/Story0099TestDataDrivenTest.java`.

## Evidence state

- Unit generation: complete/source-bound.
- Integration generation: complete/source-bound.
- Test-data mapping: 4 rows catalogued with executable core mapping.
- Application-behavior execution: `NOT EXECUTED`.
- Coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet status: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability only.
