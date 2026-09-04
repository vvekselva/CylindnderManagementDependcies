# BL-011 Human-Readable Test Packet — STORY-0128 Lookup Management Page

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0128.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: the governed Lookup Management page must render current cache/reference information and navigation/model state without unintended persistence during page display.
- Unit: verify page/model population, normal/empty/error conditions and cache interaction; `BL-004/generated-tests/STORY-0128/Story0128LookupManagementPageUnitTest.java`.
- Integration: exercise MVC page mapping and reference/cache wiring; `BL-005/generated-tests/STORY-0128/Story0128LookupManagementPageMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0128.md` / `.csv`, 4 mapped rows.
- E2E: opening the management page presents the approved lookup context; page display itself does not create/update lookup records. Catalogue `BL-009/stories/STORY-0128.md`; executable `BL-009/generated-tests/STORY-0128/Story0128TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0128/Story0128LookupManagementPageUnitTest.java`

```java
    }

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

    @Test void explicitTabIsPreserved() {
        when(cache.getAddressTypes()).thenReturn(List.of());
        when(cache.getCountries()).thenReturn(List.of());
        when(cache.getStates()).thenReturn(List.of());
        when(cache.getCities()).thenReturn(List.of());
        assertEquals("city", controller.showLookupPage("city").getModel().get("activeTab"));
```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0128/Story0128LookupManagementPageMvcIntegrationTest.java`

```java
    }

    @Test void getWithoutTabUsesAddressTypeDefault() throws Exception {
        mvc.perform(get("/lookupManagement"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/LookupManagement"))
            .andExpect(model().attribute("activeTab", "addressType"));
    }

    @Test void getWithTabPreservesRequestedTab() throws Exception {
        mvc.perform(get("/lookupManagement").param("tab", "city"))
            .andExpect(status().isOk())
            .andExpect(view().name("final-version-1/LookupManagement"))
            .andExpect(model().attribute("activeTab", "city"));
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0128/Story0128TestDataDrivenTest.java`

```java
    }

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

    @Test
    void tc012802ExplicitCountryTabIsPreserved() {
        ModelAndView mav = controller.showLookupPage("country");
        assertEquals("country", mav.getModel().get("activeTab"));
        assertEquals("final-version-1/LookupManagement", mav.getViewName());
    }

    @Test
    void tc012804GetDoesNotRefreshCaches() {
        controller.showLookupPage("state");
        verify(cache, never()).refreshAddressTypes();
        verify(cache, never()).refreshCountries();
        verify(cache, never()).refreshStates();
        verify(cache, never()).refreshCities();
    }
```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
