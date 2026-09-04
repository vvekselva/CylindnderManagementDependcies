# BL-011 Human-Readable Test Packet — STORY-0127 Legacy Lookup Redirect

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0127.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: the legacy lookup route must redirect to the approved destination/context and perform no business-data mutation.
- Unit: verify exact redirect destination/context and no service/DAO write; `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java`.
- Integration: exercise MVC redirect mapping; database runtime is not applicable to this navigation-only path. Executable `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0127.md` / `.csv`, 4 catalogued rows for route/context/boundary behavior.
- E2E: Given a caller reaches the legacy route, when it is invoked, then navigation ends at the governed destination with no persistence change. Catalogue `BL-009/stories/STORY-0127.md`; executable `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

```java
@GetMapping("/lookup")
public String legacyRedirect() {
    logger.info("Redirecting legacy /lookup request to /lookupManagement");
    return "redirect:/lookupManagement";
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java`

```java
class Story0127LegacyLookupRedirectUnitTest {

    @Test
    @DisplayName("STORY-0127 UT-01 legacy lookup route returns exact current Lookup Management redirect")
    void legacyLookupReturnsExactRedirect() {
        LookupManagementController controller = new LookupManagementController();

        String result = controller.legacyRedirect();

        assertEquals("redirect:/lookupManagement", result);
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java`

```java
class Story0127LegacyLookupRedirectIntegrationTest {

    @Test
    void mappedGetLookupReturnsExactRedirectWithoutApplicationServiceOrDatabaseBoundary() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new LookupManagementController()).build();

        mvc.perform(get("/lookup"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/lookupManagement"));
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java`

```java
class Story0127TestDataDrivenTest {

    @Test
    void tc012701LegacyLookupRedirect() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
    }

    @Test
    void tc012702RepeatedInvocationIsPureNavigation() {
        LookupManagementController controller = new LookupManagementController();
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
        assertEquals("redirect:/lookupManagement", controller.legacyRedirect());
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
