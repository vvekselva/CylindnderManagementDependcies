# BL-011 Human-Readable Test Packet — STORY-0099 Product Search

## 1. Story, governance and source
- Source Story: `BL-002/stories/STORY-0099.md`
- Endpoint: `GET /search/product/{searchText}`
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## 2. Business behavior protected
The endpoint copies `searchText` to the application request DTO, delegates to `ProductSearchService.searchWithText`, validates with `PRODUCT_SEARCH_SERVICE`, queries `ProductJpaDao.findByProductNameContainingIgnoreCase`, maps product entities to DTOs and returns `ProductSearchResponseDto`. The search is read-only.

A source-proved Customer Demand consumer starts typeahead after 3 characters with a 280 ms debounce, displays product names, stores the selected persistent `productId`, and invalidates stale identity if visible product text is edited or cleared. Those selector rules apply only to that consuming flow.

## 3. Preconditions and inputs
- Positive API data: a synthetic product whose name contains the search fragment.
- No-match data: valid fragment matching no product.
- Error data: validator/application-exception path.
- Selector positive: at least 3 characters, matching option selected, stable productId written.
- Selector stale-ID negative: selected product text is changed/cleared after selection; stale productId must not remain authoritative.
- Search itself must not mutate product master data.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0099/Story0099ProductSearchUnitTest.java`.

**Happy path:** mocked matching product data produces expected mapped product identity/name and success/result metadata.  
**No-match:** empty result produces governed empty/failure behavior.  
**Error:** validator/application exception produces source-defined empty/error handling.  
**Selector boundary where bound:** 3-character threshold and stale selected-ID invalidation are checked only for the Customer Demand consumer; no caller-wide timing rule is invented.  
**Persistence:** zero product writes.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0099/Story0099ProductSearchIntegrationTest.java`.

With PostgreSQL Testcontainers and real JPA mappings, seed a product matching the search text, execute the search path and verify persistent ID/name mapping. A no-match search must return the governed empty/failure response. Product rows must remain unchanged.

## 6. Test Data Story — BL-009
Readable data: `BL-009/test-data/STORY-0099.md`; CSV: `BL-009/test-data/STORY-0099.csv`; executable mapping: `BL-009/generated-tests/STORY-0099/Story0099TestDataDrivenTest.java`.

Four catalogue rows cover successful product lookup, no-match/error behavior and source-proved consuming-selector identity behavior. Test values are synthetic/stable and isolated. Generated/data-mapping evidence does not imply runtime PASS.

## 7. Use-case / End-to-End Story
**Given** product reference data exists and Customer Demand has at least three typed characters, **when** the user selects a returned product, **then** the persistent `productId` is stored for the demand form.

**Given** the selected visible product text is later changed or cleared, **then** the old product identity must be invalidated rather than silently submitted.

**Given** no product matches, **when** search executes, **then** the governed empty/failure outcome is returned and product master data is unchanged.

## 8. Traceability
- BL-002: `STORY-0099.md`
- BL-004: `Story0099ProductSearchUnitTest.java`
- BL-005: `Story0099ProductSearchIntegrationTest.java`
- BL-009: Story catalogue, `STORY-0099.md/.csv`, `Story0099TestDataDrivenTest.java`

## 9. Execution and coverage status
- Unit: `NOT EXECUTED`
- Integration: `NOT EXECUTED`
- Customer Demand/UI E2E: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## 10. BL-011 validation
Fresh validation against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml` confirms business behavior, preconditions, inputs, validation, happy/no-match/error/boundary/stale-identity cases, expected API/UI/database outcomes, executable references, BL-002/004/005/009 traceability and explicit non-execution/coverage state.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.
