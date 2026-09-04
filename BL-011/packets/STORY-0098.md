# BL-011 Human-Readable Test Packet — STORY-0098 Product Category Search

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
## 1. Story, governance and source
- Source Story: `BL-002/stories/STORY-0098.md`
- Endpoint: `GET /search/product-category/{searchText}`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## 2. Business behavior protected
`GET /search/product-category/{searchText}` is a read-only product-category lookup. The controller copies `searchText` into the application request DTO and delegates to `ProductCategorySearchService.searchWithText`. The service validates with `PRODUCT_CATEGORY_SEARCH_SERVICE`, queries `ProductCategoryJpaDao.findByProductCategoryContainingIgnoreCase`, maps matching entities and returns `ProductCategorySearchResponseDto`. A governed application exception becomes the defined empty response. No category row may be created, updated or deleted by this search.

## 3. Preconditions and input data
- Positive: synthetic category row whose name contains the supplied fragment.
- Negative: valid fragment with no matching row.
- Error: source-governed validator/application-exception condition.
- Boundary: minimal source-valid search text and supported paging boundary; no unproved UI debounce/minimum-length rule is added.
- Integration cases require isolated PostgreSQL data.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0098/Story0098ProductCategorySearchUnitTest.java`.

**Positive:** mocked matching category data returns mapped category identity/name and governed success metadata.  
**No-match:** empty DAO result returns the governed empty/failure outcome.  
**Validation/error:** rejected request/application exception returns the source-defined error/empty response.  
**Side effects:** mocked persistence writes must remain zero.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0098/Story0098ProductCategorySearchIntegrationTest.java`.

Using PostgreSQL Testcontainers and real JPA mappings, seed a matching category, execute the search path and verify the persistent identity/name is returned. Repeat with a no-match fragment and verify the governed empty result. Before/after category master data must be unchanged.

## 6. Test Data Story — BL-009
Readable: `BL-009/test-data/STORY-0098.md`; CSV: `BL-009/test-data/STORY-0098.csv`; executable mapping: `BL-009/generated-tests/STORY-0098/Story0098TestDataDrivenTest.java`.

Three mapped rows cover successful lookup, no-match behavior and governed validation/error handling. Data uses synthetic/stable category identities and remains isolated. Data-contract mapping is not application execution evidence.

## 7. Use-case / End-to-End Story
**Given** category reference data exists, **when** a caller searches with a matching category-name fragment, **then** matching categories are returned as selectable reference data and the master rows remain unchanged.

**Given** no category matches, **when** the same endpoint is called, **then** the governed empty/failure result is returned with no mutation.

**Given** validation/application processing fails, **then** the source-defined empty/error response is returned rather than an inferred success.

## 8. Traceability
- BL-002: `STORY-0098.md`
- BL-004: `Story0098ProductCategorySearchUnitTest.java`
- BL-005: `Story0098ProductCategorySearchIntegrationTest.java`
- BL-009: Story catalogue, readable/CSV test data, `Story0098TestDataDrivenTest.java`

## 9. Execution and coverage
- Unit: `NOT EXECUTED`
- Integration: `NOT EXECUTED`
- Application/E2E: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage: `NOT INFERRED`

## 10. BL-011 validation
Freshly validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`: business behavior, preconditions, inputs, validation, positive/negative/boundary cases, expected API/database outcomes, executable references, four-backlog traceability, and execution/coverage separation are present.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.

## Production Code Evidence
```java
@GetMapping("/{searchText}")
public ProductCategorySearchResponseDto getProductCategories(@PathVariable String searchText) {
    try {
        CylinderManagementApplicationRequestDto request =
            new CylinderManagementApplicationRequestDto();
        request.setSearchTerm(searchText);
        return productCategorySearchService.searchWithText(request, null);
    } catch (CylinderManagementApplicationException e) {
        return new ProductCategorySearchResponseDto();
    }
}
```

## BL-004 Unit Test Cases
### governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0098/Story0098ProductCategorySearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        ProductCategorySearchResponseDto expected = new ProductCategorySearchResponseDto();
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        ProductCategorySearchResponseDto actual = controller.getProductCategories("Industrial");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(productCategorySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Industrial", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getProductCategories("Industrial"));
    }
```


## BL-005 Integration Test Cases


## BL-009 Test Data / Use-case Cases
### tc0098_02_governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0098/Story0098TestDataDrivenTest.java#tc0098_02_governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `tc0098_02_governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test void tc0098_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        ProductCategorySearchResponseDto expected = new ProductCategorySearchResponseDto();
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        ProductCategorySearchResponseDto actual = controller.getProductCategories("Industrial");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(productCategorySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Industrial", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void tc0098_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(productCategorySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getProductCategories("Industrial"));
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
