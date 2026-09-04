# BL-011 Human-Readable Test Packet — STORY-0109 Product Category Save

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0109.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: source-bound Product Category save accepts governed valid data, validates it and persists the resulting reference record; rejected input must not create unintended data.
- Unit: valid mapping/save, invalid/null/duplicate or conflict behavior where source-bound, DAO interaction and response/error mapping; `BL-004/generated-tests/STORY-0109/Story0109ProductCategorySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and validation failure state; `BL-005/generated-tests/STORY-0109/Story0109ProductCategorySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0109.md` / `.csv`, 4 mapped rows covering successful and governed negative/boundary cases.
- E2E: Given acceptable category data, when saved, then the expected category record becomes available; invalid/conflicting data follows the governed failure path without unintended persistence. Catalogue `BL-009/stories/STORY-0109.md`; executable `BL-009/generated-tests/STORY-0109/Story0109TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/DomainLookupController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0109/Story0109ProductCategorySaveUnitTest.java`

```java
    }

    @Test void addNormalizesInputDelegatesRefreshesAndRedirects() throws Exception {
        when(service.processRequest(any(ProductCategoryIngestionRequestDto.class))).thenReturn(new ProductCategoryIngestionResponseDto());
        ModelAndView mav = controller.saveProductCategory(null, "  industrial  ", "  desc  ", redirect);
        ArgumentCaptor<ProductCategoryIngestionRequestDto> cap = ArgumentCaptor.forClass(ProductCategoryIngestionRequestDto.class);
        verify(service).processRequest(cap.capture());
        assertEquals("INDUSTRIAL", cap.getValue().getProductCategoryDto().getProductCategory());
        assertEquals("desc", cap.getValue().getProductCategoryDto().getDescription());
        verify(cache).refreshProductCategory();
        assertEquals("redirect:/domainLookup?tab=productCategory", mav.getViewName());
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0109/Story0109ProductCategorySaveMvcIntegrationTest.java`

```java
    }

    @Test void successfulPostUsesPrgAndRefreshesOnlyCategoryCache() throws Exception {
        mvc.perform(post("/domainLookup/productCategory/save").param("productCategory", "industrial").param("description", "desc"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/domainLookup?tab=productCategory"));
        verify(cache).refreshProductCategory();
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0109/Story0109TestDataDrivenTest.java`

```java
    }

    @Test void createCurrentContract() throws Exception {
        when(service.processRequest(any(ProductCategoryIngestionRequestDto.class))).thenReturn(new ProductCategoryIngestionResponseDto());
        RedirectAttributes ra = mock(RedirectAttributes.class);
        ModelAndView mav = controller.saveProductCategory(null, " industrial ", " desc ", ra);
        ArgumentCaptor<ProductCategoryIngestionRequestDto> cap = ArgumentCaptor.forClass(ProductCategoryIngestionRequestDto.class);
        verify(service).processRequest(cap.capture());
        assertEquals("INDUSTRIAL", cap.getValue().getProductCategoryDto().getProductCategory());
        assertEquals("desc", cap.getValue().getProductCategoryDto().getDescription());
        verify(cache).refreshProductCategory();
        assertEquals("redirect:/domainLookup?tab=productCategory", mav.getViewName());
    }
}

```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
