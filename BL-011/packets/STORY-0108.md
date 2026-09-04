# BL-011 Human-Readable Test Packet — STORY-0108 Domain Lookup Page

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0108.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: source-bound Domain Lookup page GET/cache-backed reference presentation must populate the governed lookup model without unintended mutation.
- Unit: verify model/cache interaction, normal and empty lookup states, governed error behavior; `BL-004/generated-tests/STORY-0108/Story0108DomainLookupPageUnitTest.java`.
- Integration: exercise MVC page mapping and cache/reference wiring; `BL-005/generated-tests/STORY-0108/Story0108DomainLookupPageMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0108.md` / `.csv`, 4 mapped rows.
- E2E: opening the lookup page exposes current governed reference data and remains read-only. Catalogue `BL-009/stories/STORY-0108.md`; executable `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/DomainLookupController.java`

```java
@GetMapping("/domainLookup")
public ModelAndView showDomainLookupPage(
        @RequestParam(value = "tab", defaultValue = "productCategory") String tab) {
    ModelAndView mav = new ModelAndView(VIEW);
    mav.addObject("activeTab", tab);
    mav.addObject("productCategories", lookupDataCache.getProductCategories());
    mav.addObject("productUoms", lookupDataCache.getProductUom());
    mav.addObject("vehicles", lookupDataCache.getVehicles());
    mav.addObject("drivers", lookupDataCache.getDrivers());
    mav.addObject("products", lookupDataCache.getProduct());
    mav.addObject("cylinders", lookupDataCache.getCylinder());
    return mav;
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0108/Story0108DomainLookupPageUnitTest.java`

```java
    }

    @Test void defaultTabContractRendersExpectedViewAndCachedCollections() {
        List<ProductCategoryDto> categories = List.of(new ProductCategoryDto());
        List<ProductUomDto> uoms = List.of(new ProductUomDto());
        List<VehicleDto> vehicles = List.of(new VehicleDto());
        List<DriverDto> drivers = List.of(new DriverDto());
        List<ProductDto> products = List.of(new ProductDto());
        List<CylinderDto> cylinders = List.of(new CylinderDto());
        when(cache.getProductCategories()).thenReturn(categories);
        when(cache.getProductUom()).thenReturn(uoms);
        when(cache.getVehicles()).thenReturn(vehicles);
        when(cache.getDrivers()).thenReturn(drivers);
        when(cache.getProduct()).thenReturn(products);
        when(cache.getCylinder()).thenReturn(cylinders);

        ModelAndView mav = controller.showDomainLookupPage("productCategory");

        assertEquals("final-version-1/DomainLookup", mav.getViewName());
        assertEquals("productCategory", mav.getModel().get("activeTab"));
        assertSame(categories, mav.getModel().get("productCategories"));
        assertSame(uoms, mav.getModel().get("productUoms"));
        assertSame(vehicles, mav.getModel().get("vehicles"));
        assertSame(drivers, mav.getModel().get("drivers"));
        assertSame(products, mav.getModel().get("products"));
        assertSame(cylinders, mav.getModel().get("cylinders"));
    }

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0108/Story0108DomainLookupPageMvcIntegrationTest.java`

```java
    }

    @Test void getWithoutTabUsesProductCategoryDefault() throws Exception {
        mvc.perform(get("/domainLookup"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/DomainLookup"))
            .andExpect(model().attribute("activeTab", "productCategory"));
    }

    @Test void getWithTabPreservesRequestedTab() throws Exception {
        mvc.perform(get("/domainLookup").param("tab", "driver"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/DomainLookup"))
            .andExpect(model().attribute("activeTab", "driver"));
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java`

```java
    }

    @ParameterizedTest @MethodSource("tabs")
    void pageRendersApprovedViewAndPreservesTab(String tab) {
        ModelAndView mav = controller.showDomainLookupPage(tab);
        assertEquals("final-version-1/DomainLookup", mav.getViewName());
        assertEquals(tab, mav.getModel().get("activeTab"));
        assertSame(cache.getProductCategories(), mav.getModel().get("productCategories"));
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
