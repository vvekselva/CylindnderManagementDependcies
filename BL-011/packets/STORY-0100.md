# BL-011 Human-Readable Test Packet — STORY-0100 Product UOM Search

## 1. Story, governance and source
- Source Story: `BL-002/stories/STORY-0100.md`
- Endpoint: `GET /search/product-uom/{searchText}`
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## 2. Business behavior protected
The endpoint copies `searchText` into the request DTO, delegates to `ProductUomSearchService.searchWithText`, validates with `PRODUCT_UOM_SEARCH_SERVICE`, queries `ProductUomJpaDao.findByProductUomContainingIgnoreCase`, maps matching UOM entities and returns `ProductUomSearchResponseDto`. A governed application exception is converted to the defined empty response. The lookup is read-only and must not modify UOM master data.

## 3. Preconditions and input data
- Positive: synthetic/stable UOM row matching the search fragment.
- No-match: valid fragment with no row.
- Error: source-governed validator/application-exception condition.
- Boundary: smallest source-valid API search term/paging boundary represented by executable tests.
- No screen debounce/hidden-ID rule is invented without a uniquely bound consuming screen.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0100/Story0100ProductUomSearchUnitTest.java`.

**Positive:** mocked matching UOM data returns mapped identity/name and governed success/result metadata.  
**No-match:** empty DAO result produces governed empty/failure behavior.  
**Validation/error:** validator/application exception produces the source-defined empty/error response.  
**Persistence expectation:** no UOM insert/update/delete calls.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0100/Story0100ProductUomSearchIntegrationTest.java`.

Using PostgreSQL Testcontainers and real JPA mapping, seed one matching UOM and verify the search returns its persistent identity/name. Repeat with a no-match fragment and verify the governed empty response. Master-data state must remain unchanged.

## 6. Test Data Story — BL-009
Readable data: `BL-009/test-data/STORY-0100.md`; CSV: `BL-009/test-data/STORY-0100.csv`; executable mapping: `BL-009/generated-tests/STORY-0100/Story0100TestDataDrivenTest.java`.

Three mapped rows cover successful lookup, no-match and governed validation/error handling. Test data is synthetic/stable and isolated. Data mapping does not imply application execution.

## 7. Use-case / End-to-End Story
**Given** UOM reference data exists, **when** a caller searches by matching UOM text, **then** matching UOM identities are returned and no UOM row changes.

**Given** no UOM matches, **then** the governed empty/failure response is returned.

**Given** validation/application processing fails, **then** the source-defined error/empty response is produced without persistence.

## 8. Traceability
- BL-002: `STORY-0100.md`
- BL-004: `Story0100ProductUomSearchUnitTest.java`
- BL-005: `Story0100ProductUomSearchIntegrationTest.java`
- BL-009: Story catalogue, readable/CSV test data, `Story0100TestDataDrivenTest.java`

## 9. Execution and coverage
- Unit: `NOT EXECUTED`
- Integration: `NOT EXECUTED`
- Application/E2E: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## 10. BL-011 validation
Fresh validation against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml` confirms business behavior, preconditions, inputs, validation, happy/no-match/error/boundary cases, expected service/API/database outcomes, executable references, BL-002/004/005/009 traceability and explicit execution/coverage separation.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.
