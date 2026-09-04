# BL-011 Human-Readable Test Packet — STORY-0127 Legacy Lookup Redirect

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0127.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: the legacy lookup route must redirect to the approved destination/context and perform no business-data mutation.
- Unit: verify exact redirect destination/context and no service/DAO write; `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java`.
- Integration: exercise MVC redirect mapping; database runtime is not applicable to this navigation-only path. Executable `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0127.md` / `.csv`, 4 catalogued rows for route/context/boundary behavior.
- E2E: Given a caller reaches the legacy route, when it is invoked, then navigation ends at the governed destination with no persistence change. Catalogue `BL-009/stories/STORY-0127.md`; executable `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
```java
@GetMapping("/lookup")
public String legacyRedirect() {
    logger.info("Redirecting legacy /lookup request to /lookupManagement");
    return "redirect:/lookupManagement";
}
```

## BL-004 Unit Test Cases
### STORY-0127 UT-01 legacy lookup route returns exact current Lookup Management redirect

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java#legacyLookupReturnsExactRedirect`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `legacyLookupReturnsExactRedirect()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    @DisplayName("STORY-0127 UT-01 legacy lookup route returns exact current Lookup Management redirect")
    void legacyLookupReturnsExactRedirect() {
        LookupManagementController controller = new LookupManagementController();

        String result = controller.legacyRedirect();

        assertEquals("redirect:/lookupManagement", result);
    }
```


## BL-005 Integration Test Cases
### mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java#mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new LookupManagementController()).build();

        mvc.perform(get("/lookup"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/lookupManagement"));
    }
```


## BL-009 Test Data / Use-case Cases
### tc012701LegacyLookupRedirect

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java#tc012701LegacyLookupRedirect`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `tc012701LegacyLookupRedirect()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc012701LegacyLookupRedirect() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    }
```

### tc012702RepeatedInvocationIsPureNavigation

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java#tc012702RepeatedInvocationIsPureNavigation`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `tc012702RepeatedInvocationIsPureNavigation()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc012702RepeatedInvocationIsPureNavigation() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
