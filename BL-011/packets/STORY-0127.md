# BL-011 Human-Readable Test Packet — STORY-0127 Legacy Lookup Redirect

## Identity / source / approval
BL-002 STORY-0127 is `APPROVED_AFTER_REWORK`. Approved source package SHA-256 is `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`; the locally recovered 16:33 ZIP in this fire has the identical SHA, so the excerpt below is byte-identical to the approved 08:02 source. Conformance: PASS. This Story is navigation-only.

## Business behavior, impact, preconditions and rules
`GET /lookup` preserves old links/bookmarks by returning the exact Spring redirect `redirect:/lookupManagement`. It accepts no DTO, identifier, filter or form value; invokes no service/DAO; performs no validation branch or persistence mutation. Business impact is backward-compatible navigation instead of a missing legacy page. The destination `/lookupManagement` is a separate GET that defaults `tab=addressType` and reads lookup collections from cache; that destination context is not a write performed by `/lookup`.

Duplicate/conflict/boundary input rules are not applicable because `legacyRedirect()` is parameterless. Idempotency is applicable as pure navigation: repeated invocation returns the same redirect and has no intended data effect.

## Production Code Evidence
`cylindermanagement.web/.../LookupManagementController.java#legacyRedirect`:
```java
@GetMapping("/lookup")
public String legacyRedirect() {
    logger.info("Redirecting legacy /lookup request to /lookupManagement");
    return "redirect:/lookupManagement";
}
```
Destination context, same source:
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
### UT-0127-01 — exact redirect string
**Input:** none. **Action:** direct method invocation. **Expected:** exact `redirect:/lookupManagement`. **Persistence:** none in source; unit test needs no dependencies. **Execution:** `NOT_EXECUTED`.  
Executable `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java#legacyLookupReturnsExactRedirect`.
```java
@Test
@DisplayName("STORY-0127 UT-01 legacy lookup route returns exact current Lookup Management redirect")
void legacyLookupReturnsExactRedirect() {
    LookupManagementController controller = new LookupManagementController();
    String result = controller.legacyRedirect();
    assertEquals("redirect:/lookupManagement", result);
}
```

## Integration Test Story — BL-005
PostgreSQL/Testcontainers is **not applicable** to the approved method because there is no database boundary. Standalone MockMvc verifies actual Spring MVC mapping and redirect semantics.

### IT-0127-01 — mapped GET redirects
**Input:** HTTP `GET /lookup`. **Expected HTTP/UI:** 3xx and Location `/lookupManagement`. **Persistence:** no service/database boundary in handler. **Execution:** `NOT_EXECUTED`.  
Executable `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java#mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary`.
```java
@Test
void mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary() throws Exception {
    MockMvc mvc = MockMvcBuilders.standaloneSetup(new LookupManagementController()).build();
    mvc.perform(get("/lookup"))
        .andExpect(status().is3xxRedirection())
        .andExpect(redirectedUrl("/lookupManagement"));
}
```

## Test Data / Use-case Story — BL-009
CSV rows cover legacy navigation, absence of DTO, absence of persistence, and destination default-tab context. Only two direct Java cases exist; CSV-only destination-context claims are not called executed.

### TC-0127-01 — legacy navigation
**Expected:** exact redirect; no write. **Execution:** `NOT_EXECUTED`.  
Executable `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java#tc012701LegacyLookupRedirect`.
```java
@Test
void tc012701LegacyLookupRedirect() {
    LookupManagementController controller = new LookupManagementController();
    assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
}
```

### TC-0127-02 — repeated invocation is pure navigation
**Objective:** idempotency at navigation-result level. **Expected:** same redirect twice; no persistence path exists in method. **Execution:** `NOT_EXECUTED`.  
Executable `...Story0127TestDataDrivenTest.java#tc012702RepeatedInvocationIsPureNavigation`.
```java
@Test
void tc012702RepeatedInvocationIsPureNavigation() {
    LookupManagementController controller = new LookupManagementController();
    assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
}
```

### TC-0127-03/04 — CSV-only no-persistence and destination-context cases
No dedicated BL-009 Java methods exist for these two rows; therefore they remain readable test data, not executable PASS evidence.
```csv
TC-0127-03,no persistence effect,GET /lookup,no DAO or database mutation,NONE
TC-0127-04,destination context,GET /lookup then /lookupManagement,destination defaults tab to addressType,NONE
```

## Use-case / End-to-End Story
**Given** a user follows an old `/lookup` bookmark, **when** the route is requested, **then** Spring MVC redirects to `/lookupManagement`; following that destination without a tab defaults the current Lookup Management page to `addressType`. Code trace: browser -> `LookupManagementController.legacyRedirect` -> HTTP redirect -> destination `showLookupPage` -> cache-backed model. The legacy handler itself never reaches service/DAO/database.

**Full redirect-following E2E execution:** `NOT_EXECUTED`; generated MockMvc asserts the first redirect but does not follow and assert the destination page/cache model in one end-to-end test.

## Traceability / scenarios / execution
BL-002 approved Story -> byte-identical source -> BL-004 direct unit -> BL-005 MockMvc -> BL-009 data/use-case -> BL-011. Positive redirect and repeat/idempotency are executable-generated. Negative validation, duplicate/conflict and data boundaries are not applicable to a parameterless navigation handler. Destination default context is source/data documented but not a dedicated E2E executable.

BL-004 `NOT_EXECUTED`; BL-005 `NOT_EXECUTED`; BL-009 `NOT_EXECUTED`; full E2E `NOT_EXECUTED`; coverage `NO_DURABLE_COVERAGE_EVIDENCE`.

## README / policy validation
PASS: source-bound production code, complete business impact/preconditions/applicability, per-case adjacent executable code, database non-applicability, BL-002/004/005/009 traceability, E2E trace, explicit CSV-only gap, execution/coverage separation and no inference.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
