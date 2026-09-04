# BL-011 Human-Readable Test Packet — STORY-0012 Challan Book Add Form

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule. Every executable test case below contains its own code block immediately beside its explanation.

## Business behavior and scope
## 1. Story and Test Scope

- Source Story: `BL-002/stories/STORY-0012.md`
- Approval state: `APPROVED_AFTER_REWORK`
- Post-approval code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Business behavior under test: `GET /logistics/challan-books/add-form` prepares the Challan Book add form and the summary/reference information required by the screen. Opening this form is a read/preparation operation and must not persist a new Challan Book.
- Governed source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## 2. Why these tests exist

The Challan Book Add page depends on controller-side form preparation and summary metric lookups. The tests therefore verify both the normal page-preparation path and the failure/fallback behavior when summary metrics cannot be obtained. Integration coverage additionally verifies that the approved controller behavior can consume a real JPA-backed metric from a PostgreSQL database prepared with Flyway migrations.

The purpose of this packet is not merely to list executable Java files. Every executable test case below is explained in business-readable terms, with its setup, action, expected result, assertions, side-effect expectation, and implementation trace.

---

## Production Code Evidence
```java
@GetMapping("/add-form")
public ModelAndView showAddBookForm() {
    ModelAndView modelAndView =
        new ModelAndView("final-version-1/add-challan-book.html");
    ChallanBookIngestionRequestDto formBackingObject =
        new ChallanBookIngestionRequestDto();
    modelAndView.addObject("ingestionRequest", formBackingObject);
    populateSummaryMetrics(modelAndView);
    return modelAndView;
}
```

## BL-004 Unit Test Cases
### STORY-0012 UT-01 GET renders Challan Book form with blank request and all metric groups

**Layer:** BL-004 — Unit Test Case  
**Executable:** `BL-004/generated-tests/STORY-0012/Story0012ChallanBookFormUnitTest.java#getRendersFormAndMetricGroups`  
**Business objective:** Verify the exact governed behavior expressed by this executable test case.  
**Preconditions / input:** Use the setup, mocks, fixtures, parameters and data values shown in the code immediately below.  
**Action:** Execute `getRendersFormAndMetricGroups()`.  
**Expected result:** The assertions in this same method are the authoritative expected service/API/UI/database outcome for this case.  
**Persistence / side effects:** Only the interactions and persistence assertions visible in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    @DisplayName("STORY-0012 UT-01 GET renders Challan Book form with blank request and all metric groups")
    void getRendersFormAndMetricGroups() {
        SummaryMetricLookupDto total = new SummaryMetricLookupDto();
        SummaryMetricLookupDto active = new SummaryMetricLookupDto();
        SummaryMetricLookupDto unused = new SummaryMetricLookupDto();
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenReturn(List.of(total));
        when(summaryMetricLookupFetchService.fetchChallanBookActiveMetrics()).thenReturn(List.of(active));
        when(summaryMetricLookupFetchService.fetchChallanBookUnusedPageMetrics()).thenReturn(List.of(unused));

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertEquals(List.of(total), result.getModel().get("challanBookTotalMetrics"));
        assertEquals(List.of(active), result.getModel().get("challanBookActiveMetrics"));
        assertEquals(List.of(unused), result.getModel().get("challanBookUnusedMetrics"));
    }
```

### STORY-0012 UT-02 metric failure does not turn the read-only GET into a write or failed page

**Layer:** BL-004 — Unit Test Case  
**Executable:** `BL-004/generated-tests/STORY-0012/Story0012ChallanBookFormUnitTest.java#metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel`  
**Business objective:** Verify the exact governed behavior expressed by this executable test case.  
**Preconditions / input:** Use the setup, mocks, fixtures, parameters and data values shown in the code immediately below.  
**Action:** Execute `metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel()`.  
**Expected result:** The assertions in this same method are the authoritative expected service/API/UI/database outcome for this case.  
**Persistence / side effects:** Only the interactions and persistence assertions visible in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    @DisplayName("STORY-0012 UT-02 metric failure does not turn the read-only GET into a write or failed page")
    void metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel() {
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics())
                .thenThrow(new RuntimeException("metric store unavailable"));

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertTrue(((List<?>) result.getModel().get("challanBookTotalMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookActiveMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookUnusedMetrics")).isEmpty());
        assertEquals("Summary metrics are temporarily unavailable.",
                result.getModel().get("summaryMetricErrorMessage"));
    }
```


## BL-005 Integration Test Cases
### actualJpaMetricReadFeedsTheApprovedRegistrationGet

**Layer:** BL-005 — Integration Test Case  
**Executable:** `BL-005/generated-tests/STORY-0012/Story0012ChallanBookFormIntegrationTest.java#actualJpaMetricReadFeedsTheApprovedRegistrationGet`  
**Business objective:** Verify the exact governed behavior expressed by this executable test case.  
**Preconditions / input:** Use the setup, mocks, fixtures, parameters and data values shown in the code immediately below.  
**Action:** Execute `actualJpaMetricReadFeedsTheApprovedRegistrationGet()`.  
**Expected result:** The assertions in this same method are the authoritative expected service/API/UI/database outcome for this case.  
**Persistence / side effects:** Only the interactions and persistence assertions visible in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void actualJpaMetricReadFeedsTheApprovedRegistrationGet() {
        ChallanBookWebController controller = new ChallanBookWebController();
        ReflectionTestUtils.setField(controller, "summaryMetricLookupFetchService", metricService);

        ModelAndView result = controller.showAddBookForm();

        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        List<?> totals = (List<?>) result.getModel().get("challanBookTotalMetrics");
        assertNotNull(totals);
        assertTrue(totals.size() >= 1);
    }
```


## BL-009 Test Data / Use-case Cases
### tc001201FormAndMetrics

**Layer:** BL-009 — Test Data / Use-case Test Case  
**Executable:** `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java#tc001201FormAndMetrics`  
**Business objective:** Verify the exact governed behavior expressed by this executable test case.  
**Preconditions / input:** Use the setup, mocks, fixtures, parameters and data values shown in the code immediately below.  
**Action:** Execute `tc001201FormAndMetrics()`.  
**Expected result:** The assertions in this same method are the authoritative expected service/API/UI/database outcome for this case.  
**Persistence / side effects:** Only the interactions and persistence assertions visible in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc001201FormAndMetrics() {
        SummaryMetricLookupDto metric = new SummaryMetricLookupDto();
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenReturn(List.of(metric));
        when(summaryMetricLookupFetchService.fetchChallanBookActiveMetrics()).thenReturn(List.of(metric));
        when(summaryMetricLookupFetchService.fetchChallanBookUnusedPageMetrics()).thenReturn(List.of(metric));
        ModelAndView result = controller.showAddBookForm();
        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertNotNull(result.getModel().get("ingestionRequest"));
        assertEquals(1, ((List<?>) result.getModel().get("challanBookTotalMetrics")).size());
        assertEquals(1, ((List<?>) result.getModel().get("challanBookActiveMetrics")).size());
        assertEquals(1, ((List<?>) result.getModel().get("challanBookUnusedMetrics")).size());
    }
```

### tc001202MetricFailureFallback

**Layer:** BL-009 — Test Data / Use-case Test Case  
**Executable:** `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java#tc001202MetricFailureFallback`  
**Business objective:** Verify the exact governed behavior expressed by this executable test case.  
**Preconditions / input:** Use the setup, mocks, fixtures, parameters and data values shown in the code immediately below.  
**Action:** Execute `tc001202MetricFailureFallback()`.  
**Expected result:** The assertions in this same method are the authoritative expected service/API/UI/database outcome for this case.  
**Persistence / side effects:** Only the interactions and persistence assertions visible in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc001202MetricFailureFallback() {
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics()).thenThrow(new RuntimeException("unavailable"));
        ModelAndView result = controller.showAddBookForm();
        assertEquals("final-version-1/add-challan-book.html", result.getViewName());
        assertTrue(((List<?>) result.getModel().get("challanBookTotalMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookActiveMetrics")).isEmpty());
        assertTrue(((List<?>) result.getModel().get("challanBookUnusedMetrics")).isEmpty());
        assertEquals("Summary metrics are temporarily unavailable.", result.getModel().get("summaryMetricErrorMessage"));
    }
```


## Traceability
BL-002 approved Story -> production code -> BL-004 unit cases -> BL-005 integration cases -> BL-009 data/use-case cases -> BL-011 reviewer packet.

## Execution and coverage
- Packet rework: `COMPLETE_PER_CASE_CODE`
- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## Validation
Validated against the current BL-011 README and policy. Every executable test method has adjacent code; shared code sections are not used as substitutes for per-case code.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
