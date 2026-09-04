# BL-011 Human-Readable Test Packet — STORY-0109 Save Product Category

## Identity, approval, source and conformance
- BL-002: `STORY-0109 — Save Product Category`; endpoint `POST /domainLookup/productCategory/save`; approval `APPROVED_AFTER_REWORK`.
- Approved source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`. This fire's recovered 16:33 ZIP has the same locally computed SHA and is byte-identical to the approved 08:02 source.
- **Conformance has a known defect, not a clean PASS:** controller exposes create/update semantics, while `ProductCategoryIngestionService` rejects any contains-ignore-case match without excluding the same ID on update. Durable drift packet: `BL-002/evidence/STORY-0109-product-category-update-drift-review-20260902.yaml`, state `AWAITING_EXPLICIT_USER_CODE_CHANGE_APPROVAL`.
- No BL-010 or application-code mutation is performed by this packet rework.

## Business behavior and impact
The controller accepts optional `productCategoryId`, required category text and optional description; trims/uppercases category, trims description, preserves ID, delegates to ingestion service, refreshes only Product Category cache on success, flashes add/update-specific success and redirects to the Product Category tab. User-input validation can return the page inline; unexpected failures redirect with error flash.

The service validates non-null/nonblank category, currently rejects when `findByProductCategoryContainingIgnoreCase(value)` returns **any** row, maps DTO to `ProductCategoryDo`, saves, maps the saved entity back and returns success. Current business impact of drift: legitimate unchanged-name updates can reject themselves, and substring-distinct values can be rejected as duplicates. This current behavior is characterized; it is not presented as desired future behavior.

## Preconditions, inputs and rules
- Create: null/zero ID; update: nonzero ID.
- Controller normalization: category `trim().toUpperCase()`, description `trim()`.
- Service validation: request/DTO/category must be present/nonblank.
- Current duplicate rule: contains-ignore-case query; any match rejects. It is stricter than exact-key uniqueness and not update-ID aware.
- Success persistence: mapper -> `ProductCategoryJpaDao.save` -> response mapping; controller refreshes category cache.
- Duplicate/conflict: current behavior rejects contains matches; desired exact/update-aware repair remains approval-gated.

## Production Code Evidence
**Controller:** `cylindermanagement.web/.../DomainLookupController.java#saveProductCategory`.
```java
ProductCategoryDto dto = new ProductCategoryDto();
dto.setProductCategoryId(productCategoryId);
dto.setProductCategory(productCategory.trim().toUpperCase());
dto.setDescription(description.trim());
ProductCategoryIngestionRequestDto req = new ProductCategoryIngestionRequestDto();
req.setProductCategoryDto(dto);
boolean isNew = (productCategoryId == null || productCategoryId == 0L);
productCategoryIngestionService.processRequest(req);
lookupDataCache.refreshProductCategory();
ra.addFlashAttribute("successMessage",
    isNew ? "Product category \"" + dto.getProductCategory() + "\" added successfully."
          : "Product category \"" + dto.getProductCategory() + "\" updated successfully.");
return new ModelAndView("redirect:/domainLookup?tab=productCategory");
```

**Current service duplicate/persistence behavior:** `cylindermanagement.custommapper.service/.../ProductCategoryIngestionService.java#processRequest`.
```java
if (productCategoryIngestionRequestDto == null
    || productCategoryIngestionRequestDto.getProductCategoryDto() == null
    || StringUtils.isBlank(productCategoryIngestionRequestDto.getProductCategoryDto().getProductCategory())) {
    // builds REQUEST_NULL validation error and throws input-validation failure
} else if (!productCategoryJpaDao.findByProductCategoryContainingIgnoreCase(
        productCategoryIngestionRequestDto.getProductCategoryDto().getProductCategory()).isEmpty()) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(
        CustomerServiceErrorCodes.PRODUCT_CATEGORY_ALREADY_EXISTS, null, null, null);
    // attaches validation failure and throws
}
ProductCategoryDo entity = productCategoryMapper.mapDtoToDo(
    productCategoryIngestionRequestDto.getProductCategoryDto());
ProductCategoryDo savedEntity = productCategoryJpaDao.save(entity);
```

## Unit Test Story — BL-004
### UT-0109-01 — create normalization, delegation, cache refresh and PRG
**Input:** null ID, `"  industrial  "`, `"  desc  "`.  
**Expected:** request category `INDUSTRIAL`, description `desc`, service called, category cache refreshed, redirect to category tab.  
**Persistence:** service is mocked; database save is **not** proven.  
**Executable:** `BL-004/generated-tests/STORY-0109/Story0109ProductCategorySaveUnitTest.java#addNormalizesInputDelegatesRefreshesAndRedirects`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void addNormalizesInputDelegatesRefreshesAndRedirects() throws Exception {
    when(service.processRequest(any(ProductCategoryIngestionRequestDto.class)))
        .thenReturn(new ProductCategoryIngestionResponseDto());
    ModelAndView mav = controller.saveProductCategory(null, "  industrial  ", "  desc  ", redirect);
    ArgumentCaptor<ProductCategoryIngestionRequestDto> cap =
        ArgumentCaptor.forClass(ProductCategoryIngestionRequestDto.class);
    verify(service).processRequest(cap.capture());
    assertEquals("INDUSTRIAL", cap.getValue().getProductCategoryDto().getProductCategory());
    assertEquals("desc", cap.getValue().getProductCategoryDto().getDescription());
    verify(cache).refreshProductCategory();
    assertEquals("redirect:/domainLookup?tab=productCategory", mav.getViewName());
}
```

**Unit gaps:** no generated BL-004 methods cover update ID preservation, blank/null validation, duplicate rejection, inline validation ModelAndView, unexpected error redirect, service mapper/save/response, or the known update/substring drift.

## Integration Test Story — BL-005
The generated artifact is standalone MockMvc with mocked service and cache. It proves HTTP POST mapping/redirect and cache interaction; it does not integrate the ingestion service or database.

### IT-0109-01 — successful POST follows PRG and refreshes category cache
**Input:** POST category `industrial`, description `desc`.  
**Expected HTTP/UI:** 3xx redirect to `/domainLookup?tab=productCategory`; category cache refresh called.  
**Persistence:** not proven; service mocked.  
**Executable:** `BL-005/generated-tests/STORY-0109/Story0109ProductCategorySaveMvcIntegrationTest.java#successfulPostUsesPrgAndRefreshesOnlyCategoryCache`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void successfulPostUsesPrgAndRefreshesOnlyCategoryCache() throws Exception {
    mvc.perform(post("/domainLookup/productCategory/save")
        .param("productCategory", "industrial").param("description", "desc"))
        .andExpect(status().is3xxRedirection())
        .andExpect(redirectedUrl("/domainLookup?tab=productCategory"));
    verify(cache).refreshProductCategory();
}
```

**Integration gaps:** no real service/JPA/PostgreSQL integration and no validation/drift scenario.

## Test Data Story — BL-009
CSV defines four rows: create normalization, update ID 42, current contains-ignore-case duplicate rejection, and new-category save/success. Only the create-current-contract row has a mapped BL-009 Java test today.

### TC-0109-01 — create current contract
**Expected:** normalization, service delegation, cache refresh and redirect.  
**Persistence:** mocked service, so no DB assertion.  
**Executable:** `BL-009/generated-tests/STORY-0109/Story0109TestDataDrivenTest.java#createCurrentContract`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void createCurrentContract() throws Exception {
    when(service.processRequest(any(ProductCategoryIngestionRequestDto.class)))
        .thenReturn(new ProductCategoryIngestionResponseDto());
    RedirectAttributes ra = mock(RedirectAttributes.class);
    ModelAndView mav = controller.saveProductCategory(null, " industrial ", " desc ", ra);
    ArgumentCaptor<ProductCategoryIngestionRequestDto> cap =
        ArgumentCaptor.forClass(ProductCategoryIngestionRequestDto.class);
    verify(service).processRequest(cap.capture());
    assertEquals("INDUSTRIAL", cap.getValue().getProductCategoryDto().getProductCategory());
    assertEquals("desc", cap.getValue().getProductCategoryDto().getDescription());
    verify(cache).refreshProductCategory();
    assertEquals("redirect:/domainLookup?tab=productCategory", mav.getViewName());
}
```

### TC-0109-02 — update ID preserved
CSV input: `product_category_id=42`, category `industrial`, description `updated`; expected `UPDATE_ID_PRESERVED_PRG`.  
**Executable:** `NO_DEDICATED_BL-009_JAVA_METHOD`; therefore not executable-proven.  
**Execution:** `NOT_EXECUTED`.
```csv
TC-0109-02,42,industrial,updated,UPDATE_ID_PRESERVED_PRG
```

### TC-0109-03 — characterize current contains duplicate rejection
CSV input `IND`; expected current contains-ignore-case duplicate rejection. This is current-state characterization, not desired exact-key behavior.  
**Executable:** `NO_DEDICATED_BL-009_JAVA_METHOD`.  
**Execution:** `NOT_EXECUTED`.
```csv
TC-0109-03,,IND,duplicate,CURRENT_CONTAINS_IGNORE_CASE_DUPLICATE_REJECTION
```

### TC-0109-04 — new category service save/success
CSV input `NEW_CATEGORY`; expected save/success response.  
**Executable:** `NO_DEDICATED_BL-009_JAVA_METHOD`; no DB-backed assertion.  
**Execution:** `NOT_EXECUTED`.
```csv
TC-0109-04,,NEW_CATEGORY,new,SAVE_AND_SUCCESS_RESPONSE
```

## Use-case / End-to-End Test Story
**Given** a user submits Product Category data, **when** the controller normalizes and delegates it, **then** valid current-source input reaches the ingestion service; the service validates duplicates, maps and saves, and the controller refreshes cache and redirects. **For update**, the approved Story expects update semantics, but current service duplicate validation can reject the row itself or substring-distinct values. That discrepancy remains approval-gated for code repair.

Code trace: POST -> `DomainLookupController.saveProductCategory` -> `ProductCategoryIngestionService.processRequest` -> current `findByProductCategoryContainingIgnoreCase` duplicate check -> mapper -> `ProductCategoryJpaDao.save` -> response -> `LookupDataCache.refreshProductCategory` -> PRG redirect.

**Full E2E execution:** `NOT_EXECUTED`; generated MVC/data tests mock the service, and no BL-005 DB-backed service test is present.

## Drift governance packet
Current vs approved behavior, business impact and exact proposed locations are already durably isolated in `STORY-0109-product-category-update-drift-review-20260902.yaml`: service `processRequest`, repository exact ignore-case lookup, and relevant tests; database schema impact `NONE_SCHEMA`. State remains `AWAITING_EXPLICIT_USER_CODE_CHANGE_APPROVAL`. This BL-011 rework does not expand or implement that manifest.

## Scenario assessment and traceability
Positive create is generated; update, duplicate/conflict, blank/null, service persistence and drift-repair scenarios lack dedicated executable coverage. Boundary/special-character rules are not established. BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011 is maintained.

## Execution and coverage separation
BL-004 `NOT_EXECUTED`; BL-005 `NOT_EXECUTED`; BL-009 `NOT_EXECUTED`; full E2E `NOT_EXECUTED`; coverage `NO_DURABLE_COVERAGE_EVIDENCE`. No PASS or coverage percentage is inferred.

## README / policy validation
PASS for human-readable packet completeness: actual current source and drift are distinguished; each existing executable method has immediately adjacent code; CSV-only cases are explicitly labeled non-executable; business/API/UI/persistence outcomes, gaps, traceability, execution and coverage are explicit. Application code remains unchanged.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
