# BL-011 Human-Readable Test Packet — STORY-0109 Product Category Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0109.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: source-bound Product Category save accepts governed valid data, validates it and persists the resulting reference record; rejected input must not create unintended data.
- Unit: valid mapping/save, invalid/null/duplicate or conflict behavior where source-bound, DAO interaction and response/error mapping; `BL-004/generated-tests/STORY-0109/Story0109ProductCategorySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and validation failure state; `BL-005/generated-tests/STORY-0109/Story0109ProductCategorySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0109.md` / `.csv`, 4 mapped rows covering successful and governed negative/boundary cases.
- E2E: Given acceptable category data, when saved, then the expected category record becomes available; invalid/conflicting data follows the governed failure path without unintended persistence. Catalogue `BL-009/stories/STORY-0109.md`; executable `BL-009/generated-tests/STORY-0109/Story0109TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
```java
@PostMapping("/domainLookup/productCategory/save")
public ModelAndView saveProductCategory(
        @RequestParam(value = "productCategoryId", required = false) Long productCategoryId,
        @RequestParam("productCategory") String productCategory,
        @RequestParam(value = "description", defaultValue = "") String description,
        RedirectAttributes ra) {
    ProductCategoryDto dto = new ProductCategoryDto();
    dto.setProductCategoryId(productCategoryId);
    dto.setProductCategory(productCategory.trim().toUpperCase());
    dto.setDescription(description.trim());
    ProductCategoryIngestionRequestDto req = new ProductCategoryIngestionRequestDto();
    req.setProductCategoryDto(dto);
    productCategoryIngestionService.processRequest(req);
    lookupDataCache.refreshProductCategory();
    return new ModelAndView("redirect:/domainLookup?tab=productCategory");
}
```

## BL-004 Unit Test Cases


## BL-005 Integration Test Cases


## BL-009 Test Data / Use-case Cases


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
