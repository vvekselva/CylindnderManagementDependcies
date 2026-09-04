# BL-011 Human-Readable Test Packet — STORY-0128 Lookup Management Screen

## Identity / source / approval
BL-002 STORY-0128 is `APPROVED_AFTER_REWORK`, fan-out requested. Approved 08:02 source SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2` equals the locally recovered 16:33 ZIP SHA in this fire, so source evidence is byte-identical. Conformance PASS; GET is read/render only.

## Business behavior / impact / rules
`GET /lookupManagement` renders `final-version-1/LookupManagement`; omitted `tab` defaults to `addressType`, explicit tab is preserved. Model receives `addressTypes`, `countries`, `states`, `cities` from `LookupDataCache`. Page load creates no ingestion DTO, calls no save repository, and performs no cache refresh. Business impact: one current reference-data maintenance entry screen with current cached values and stable tab context. No typing/debounce/hidden-ID validation applies to this GET. Unsupported/blank tab has no source whitelist rule; framework/controller preserves supplied value. Duplicate/conflict and persistence idempotency are not mutation concerns.

## Production Code Evidence
`cylindermanagement.web/.../LookupManagementController.java#showLookupPage`:
```java
@GetMapping("/lookupManagement")
public ModelAndView showLookupPage(
        @RequestParam(value = "tab", defaultValue = "addressType") String tab) {
    ModelAndView mav = new ModelAndView(VIEW);
    mav.addObject("activeTab", tab);
    mav.addObject("addressTypes", lookupDataCache.getAddressTypes());
    mav.addObject("countries", lookupDataCache.getCountries());
    mav.addObject("states", lookupDataCache.getStates());
    mav.addObject("cities", lookupDataCache.getCities());
    return mav;
}
```

## Unit Test Story — BL-004
### UT-0128-01 — view and four cached collections
**Input:** `addressType`; four distinct mock collections. **Expected:** exact view/tab and same collection objects. **Persistence:** none; cache mocked. **Execution:** `NOT_EXECUTED`.  
Executable `BL-004/generated-tests/STORY-0128/Story0128LookupManagementPageUnitTest.java#rendersExpectedViewAndCachedCollections`.
```java
@Test void rendersExpectedViewAndCachedCollections() {
    List<AddressTypeDto> addressTypes = List.of(new AddressTypeDto());
    List<CountryDto> countries = List.of(new CountryDto());
    List<StateDto> states = List.of(new StateDto());
    List<CityDto> cities = List.of(new CityDto());
    when(cache.getAddressTypes()).thenReturn(addressTypes);
    when(cache.getCountries()).thenReturn(countries);
    when(cache.getStates()).thenReturn(states);
    when(cache.getCities()).thenReturn(cities);
    ModelAndView mav = controller.showLookupPage("addressType");
    assertEquals("final-version-1/LookupManagement", mav.getViewName());
    assertEquals("addressType", mav.getModel().get("activeTab"));
    assertSame(addressTypes, mav.getModel().get("addressTypes"));
    assertSame(countries, mav.getModel().get("countries"));
    assertSame(states, mav.getModel().get("states"));
    assertSame(cities, mav.getModel().get("cities"));
}
```

### UT-0128-02 — explicit tab preservation
**Input:** `city`; empty cache collections. **Expected:** `activeTab=city`. **Execution:** `NOT_EXECUTED`.
```java
@Test void explicitTabIsPreserved() {
    when(cache.getAddressTypes()).thenReturn(List.of());
    when(cache.getCountries()).thenReturn(List.of());
    when(cache.getStates()).thenReturn(List.of());
    when(cache.getCities()).thenReturn(List.of());
    assertEquals("city", controller.showLookupPage("city").getModel().get("activeTab"));
}
```

## Integration Test Story — BL-005
Standalone MockMvc uses mocked cache; it proves Spring MVC default/explicit parameter binding, status, view and active-tab model, not real cache startup/database/template rendering.

### IT-0128-01 — omitted tab defaults to addressType
**Expected:** HTTP 200, governed view, activeTab addressType. **Execution:** `NOT_EXECUTED`.
```java
@Test void getWithoutTabUsesAddressTypeDefault() throws Exception {
    mvc.perform(get("/lookupManagement"))
        .andExpect(status().isOk())
        .andExpect(view().name("final-version-1/LookupManagement"))
        .andExpect(model().attribute("activeTab", "addressType"));
}
```

### IT-0128-02 — explicit city tab survives HTTP binding
**Expected:** HTTP 200, governed view, activeTab city. **Execution:** `NOT_EXECUTED`.
```java
@Test void getWithTabPreservesRequestedTab() throws Exception {
    mvc.perform(get("/lookupManagement").param("tab", "city"))
        .andExpect(status().isOk())
        .andExpect(view().name("final-version-1/LookupManagement"))
        .andExpect(model().attribute("activeTab", "city"));
}
```

## Test Data / Use-case Story — BL-009
### TC-0128-01 — addressType render contract
**Expected:** view/tab plus all four empty cached collections. **Execution:** `NOT_EXECUTED`.
```java
@Test
void tc012801AddressTypeRenderContract() {
    ModelAndView mav = controller.showLookupPage("addressType");
    assertEquals("final-version-1/LookupManagement", mav.getViewName());
    assertEquals("addressType", mav.getModel().get("activeTab"));
    assertSame(Collections.emptyList(), mav.getModel().get("addressTypes"));
    assertSame(Collections.emptyList(), mav.getModel().get("countries"));
    assertSame(Collections.emptyList(), mav.getModel().get("states"));
    assertSame(Collections.emptyList(), mav.getModel().get("cities"));
}
```

### TC-0128-02 — country tab preservation
**Expected:** country active tab and governed view. **Execution:** `NOT_EXECUTED`.
```java
@Test
void tc012802ExplicitCountryTabIsPreserved() {
    ModelAndView mav = controller.showLookupPage("country");
    assertEquals("country", mav.getModel().get("activeTab"));
    assertEquals("final-version-1/LookupManagement", mav.getViewName());
}
```

### TC-0128-04 — GET does not refresh any lookup cache
**Objective:** protect read-only page-load side effects. **Expected:** no refresh method called. **Execution:** `NOT_EXECUTED`.
```java
@Test
void tc012804GetDoesNotRefreshCaches() {
    controller.showLookupPage("state");
    verify(cache, never()).refreshAddressTypes();
    verify(cache, never()).refreshCountries();
    verify(cache, never()).refreshStates();
    verify(cache, never()).refreshCities();
}
```

## Use-case / E2E Story
**Given** lookup cache values are available, **when** the operator opens `/lookupManagement`, **then** MVC selects default `addressType` or preserves the requested tab, reads the four reference collections from cache, and returns the Lookup Management view without refresh/write. Trace: HTTP GET -> MVC request-param binding -> `showLookupPage` -> four `LookupDataCache` getters -> ModelAndView -> Thymeleaf resolution.

Full browser/template/cache/database E2E is `NOT_EXECUTED`; MockMvc is standalone with mocked cache. Positive default/explicit/empty-cache and no-refresh cases exist. Unsupported/blank tab, cache exception/null and template-rendering failure lack governed Story-specific executable cases. Duplicate/conflict and DB boundaries are not applicable to this GET.

## Traceability / execution / coverage
BL-002 -> byte-identical production source -> BL-004 -> BL-005 -> BL-009 -> BL-011. BL-004 `NOT_EXECUTED`; BL-005 `NOT_EXECUTED`; BL-009 `NOT_EXECUTED`; E2E `NOT_EXECUTED`; coverage `NO_DURABLE_COVERAGE_EVIDENCE`.

## README / policy validation
PASS: reviewer-readable business behavior/impact/preconditions/rules, source code, every existing UT/IT/BL-009 method separated with adjacent code, read-only persistence expectation, gaps, E2E trace and execution/coverage separation are explicit.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
