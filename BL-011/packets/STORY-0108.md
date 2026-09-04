# BL-011 Human-Readable Test Packet — STORY-0108 Domain Lookup Page

## Identity, approval, source and conformance
- Source: `BL-002/stories/STORY-0108.md`; endpoint `GET /domainLookup`; controller `DomainLookupController.showDomainLookupPage`.
- Approval: `APPROVED_AFTER_REWORK`; downstream BL-004/005/009 fan-out explicitly requested.
- Approved source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
- This fire recovered the 16:33 Library ZIP after the named 08:02 object was not found; local SHA-256 equals the approved 08:02 SHA, establishing byte-identical production-source evidence.
- Conformance: `PASS`; no application code mutation.

## Business behavior, preconditions and rules
Opening `/domainLookup` renders `final-version-1/DomainLookup`. HTTP parameter `tab` defaults to `productCategory`; a supplied tab value is exposed unchanged as `activeTab`. The GET reads page data from `LookupDataCache`: product categories, UOMs, vehicles, drivers, products and cylinders, plus product/cylinder option collections. The GET performs no direct repository/service save and is governed as read-only presentation. POST save operations in the same controller are separate Stories.

Precondition: `LookupDataCache` is available and contains the current in-memory reference collections. Inputs are absent `tab` (default case) or a supplied tab such as `vehicle`, `driver`, or `cylinder`. There is no GET validation whitelist in the shown source; therefore the Story claims preservation of supplied tab text, not rejection of unsupported values. Duplicate/conflict/idempotency concerns are not persistence concerns for this GET: repeated rendering has no intended write effect.

## Production Code Evidence
**Byte-identical recovered source:** `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/DomainLookupController.java` — `showDomainLookupPage`.
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
    mav.addObject("productCategoryOptions", lookupDataCache.getProductCategories());
    mav.addObject("productUomOptions", lookupDataCache.getProductUom());
    mav.addObject("cylinders", lookupDataCache.getCylinder());
    mav.addObject("cylinderUomOptions", lookupDataCache.getProductUom());
    mav.addObject("cylinderProductOptions", lookupDataCache.getProduct());
    return mav;
}
```

## Unit Test Story — BL-004
Dependencies are mocked; these tests prove controller/model composition, not real cache loading, Thymeleaf rendering, database access, or browser behavior.

### UT-0108-01 — default-tab contract and all principal cached collections
**Input/precondition:** explicit `productCategory` argument and six distinct cached collections.  
**Action:** invoke `showDomainLookupPage`.  
**Expected UI/model:** governed view, active tab and exact collection identities for categories, UOMs, vehicles, drivers, products and cylinders.  
**Persistence:** none.  
**Executable:** `BL-004/generated-tests/STORY-0108/Story0108DomainLookupPageUnitTest.java#defaultTabContractRendersExpectedViewAndCachedCollections`.  
**Execution:** `NOT_EXECUTED`.
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
```

### UT-0108-02 — requested tab is preserved
**Input:** `driver`; empty cache lists.  
**Expected UI/model:** `activeTab=driver`.  
**Persistence:** none.  
**Executable:** `...Story0108DomainLookupPageUnitTest.java#requestedTabIsPreserved`.  
**Execution:** `NOT_EXECUTED`.
```java
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

## Integration Test Story — BL-005
This is standalone MockMvc integration around the controller with a **mocked** `LookupDataCache`. It proves Spring MVC request parameter/default binding, status, view name and model tab; it does not prove a real application context, real cache population, database state or Thymeleaf template rendering.

### IT-0108-01 — omitted HTTP tab uses default
**Input:** `GET /domainLookup` without query parameter.  
**Expected API/UI:** HTTP 200, governed view, `activeTab=productCategory`.  
**Persistence:** none.  
**Executable:** `BL-005/generated-tests/STORY-0108/Story0108DomainLookupPageMvcIntegrationTest.java#getWithoutTabUsesProductCategoryDefault`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void getWithoutTabUsesProductCategoryDefault() throws Exception {
    mvc.perform(get("/domainLookup"))
        .andExpect(status().isOk())
        .andExpect(view().name("final-version-1/DomainLookup"))
        .andExpect(model().attribute("activeTab", "productCategory"));
}
```

### IT-0108-02 — supplied HTTP tab survives MVC binding
**Input:** `GET /domainLookup?tab=driver`.  
**Expected API/UI:** HTTP 200, governed view, `activeTab=driver`.  
**Persistence:** none.  
**Executable:** `...Story0108DomainLookupPageMvcIntegrationTest.java#getWithTabPreservesRequestedTab`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void getWithTabPreservesRequestedTab() throws Exception {
    mvc.perform(get("/domainLookup").param("tab", "driver"))
        .andExpect(status().isOk())
        .andExpect(view().name("final-version-1/DomainLookup"))
        .andExpect(model().attribute("activeTab", "driver"));
}
```

## Test Data Story — BL-009
The governed CSV maps four tab cases: `productCategory`, `vehicle`, `driver`, `cylinder`; every row expects `final-version-1/DomainLookup`, the same active tab and write effect `NONE`.

### TD/E2E-0108-01..04 — parameterized tab matrix
**Inputs:** four governed tab rows.  
**Expected UI:** approved view, exact active tab, product-category collection from cache.  
**Persistence:** none intended.  
**Executable:** `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java#pageRendersApprovedViewAndPreservesTab`. Each invocation is driven by the adjacent `tabs()` source.  
**Execution:** `NOT_EXECUTED`.
```java
static Stream<Arguments> tabs() {
    return Stream.of(
        Arguments.of("productCategory"),
        Arguments.of("vehicle"),
        Arguments.of("driver"),
        Arguments.of("cylinder"));
}

@ParameterizedTest @MethodSource("tabs")
void pageRendersApprovedViewAndPreservesTab(String tab) {
    ModelAndView mav = controller.showDomainLookupPage(tab);
    assertEquals("final-version-1/DomainLookup", mav.getViewName());
    assertEquals(tab, mav.getModel().get("activeTab"));
    assertSame(cache.getProductCategories(), mav.getModel().get("productCategories"));
}
```

## Use-case / End-to-End Test Story
**Given** the lookup cache has been populated, **when** a user opens `/domainLookup` with no tab, **then** MVC defaults to `productCategory`, the controller returns `final-version-1/DomainLookup`, and model collections are read from cache. **When** a supported tab value is supplied, **then** it is preserved as `activeTab`. The GET itself performs no save.

Code trace: HTTP GET `/domainLookup` -> Spring MVC `@RequestParam(defaultValue="productCategory")` -> `DomainLookupController.showDomainLookupPage` -> `LookupDataCache` getters -> `ModelAndView("final-version-1/DomainLookup")` -> Thymeleaf view resolution. No repository/ingestion-service call is present in this GET method.

**Full E2E execution:** `NOT_EXECUTED`. MockMvc uses a mocked cache and does not render a browser/template end-to-end, so no full UI/database E2E PASS is inferred.

## Positive / negative / boundary / duplicate-conflict assessment
- Positive default tab: executable-generated; not executed.
- Positive explicit tab: executable-generated; not executed.
- Empty cache collections: used in unit/MockMvc setup; no error is expected by these generated cases.
- Unsupported/blank tab: source has no whitelist validation; no governed negative executable exists.
- Cache failure/null dependency: no governed Story-specific executable exists.
- Boundary: no tab-length or character boundary rule exists in approved Story evidence.
- Duplicate/conflict: not applicable to this read-only GET's persistence behavior.
- Idempotency: repeated GET has no intended write effect; no repeated-call assertion is generated.

## Traceability and execution separation
BL-002 approved contract -> byte-identical production source -> BL-004 unit -> BL-005 MockMvc -> BL-009 four-row data-driven mapping -> BL-011 reviewer packet. Generated source is not execution proof.

- BL-004: `NOT_EXECUTED`.
- BL-005: `NOT_EXECUTED`.
- BL-009: `NOT_EXECUTED`.
- Full E2E: `NOT_EXECUTED`.
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`; no percentage inferred.

## README / policy validation
PASS: source identity/approval/conformance, business behavior/impact, inputs/preconditions/rules, actual production code, separate adjacent UT cases, separate adjacent IT cases, adjacent parameterized data/E2E mapping, code-path trace, BL-002/004/005/009 traceability, persistence expectations, scenario gaps and execution/coverage separation are explicit.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
