# BL-011 Human-Readable Test Packet — STORY-0108 Domain Lookup Page

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0108.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: source-bound Domain Lookup page GET/cache-backed reference presentation must populate the governed lookup model without unintended mutation.
- Unit: verify model/cache interaction, normal and empty lookup states, governed error behavior; `BL-004/generated-tests/STORY-0108/Story0108DomainLookupPageUnitTest.java`.
- Integration: exercise MVC page mapping and cache/reference wiring; `BL-005/generated-tests/STORY-0108/Story0108DomainLookupPageMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0108.md` / `.csv`, 4 mapped rows.
- E2E: opening the lookup page exposes current governed reference data and remains read-only. Catalogue `BL-009/stories/STORY-0108.md`; executable `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
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

## BL-004 Unit Test Cases
### requestedTabIsPreserved

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0108/Story0108DomainLookupPageUnitTest.java#requestedTabIsPreserved`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `requestedTabIsPreserved()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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

    @Test void requestedTabIsPreserved() {
        when(cache.getProductCategories()).thenReturn(List.of());
        when(cache.getProductUom()).thenReturn(List.of());
        when(cache.getVehicles()).thenReturn(List.of());
        when(cache.getDrivers()).thenReturn(List.of());
        when(cache.getProduct()).thenReturn(List.of());
        when(cache.getCylinder()).thenReturn(List.of());
        assertEquals("driver", controller.showDomainLookupPage("driver").getModel().get("activeTab"));
    }
```


## BL-005 Integration Test Cases
### getWithTabPreservesRequestedTab

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0108/Story0108DomainLookupPageMvcIntegrationTest.java#getWithTabPreservesRequestedTab`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `getWithTabPreservesRequestedTab()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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
```


## BL-009 Test Data / Use-case Cases
### pageRendersApprovedViewAndPreservesTab

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java#pageRendersApprovedViewAndPreservesTab`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `pageRendersApprovedViewAndPreservesTab()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @ParameterizedTest @MethodSource("tabs")
    void pageRendersApprovedViewAndPreservesTab(String tab) {
        ModelAndView mav = controller.showDomainLookupPage(tab);
        assertEquals("final-version-1/DomainLookup", mav.getViewName());
        assertEquals(tab, mav.getModel().get("activeTab"));
        assertSame(cache.getProductCategories(), mav.getModel().get("productCategories"));
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
