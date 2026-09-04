# BL-011 Human-Readable Test Packet — STORY-0012 Challan Book Add Form

## Rework state
Reworked under the BL-011 code-required policy. Explanation-only or path-only evidence is not sufficient.

## Reviewer-readable business/test narrative
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

# 3. Unit Test Cases — BL-004

Executable file: `BL-004/generated-tests/STORY-0012/Story0012ChallanBookFormUnitTest.java`

## STORY-0012-UT-01 — Open Challan Book Add Form successfully

**Test type:** Unit test — Controller behavior with mocked service dependencies.

**Business objective:** Confirm that a user opening the Challan Book Add page receives the correct page together with the blank form object and all three summary metric groups needed by the screen.

**Scenario:** The summary-metric service is healthy and returns one value for each metric group: total Challan Books, active Challan Books, and unused Challan pages.

**Preconditions / setup:**
- `SummaryMetricLookupFetchService.fetchChallanBookTotalMetrics()` returns a list containing one `SummaryMetricLookupDto`.
- `SummaryMetricLookupFetchService.fetchChallanBookActiveMetrics()` returns a list containing one `SummaryMetricLookupDto`.
- `SummaryMetricLookupFetchService.fetchChallanBookUnusedPageMetrics()` returns a list containing one `SummaryMetricLookupDto`.
- `ChallanBookIngestionService` is mocked and is not expected to perform a persistence operation during this GET flow.

**Action under test:** Invoke `ChallanBookWebController.showAddBookForm()`.

**Expected result:**
- The returned view is `final-version-1/add-challan-book.html`.
- The model contains a non-null `ingestionRequest` representing the blank form backing object.
- `challanBookTotalMetrics` contains the total-metric value returned by the service.
- `challanBookActiveMetrics` contains the active-metric value returned by the service.
- `challanBookUnusedMetrics` contains the unused-page metric returned by the service.

**Persistence / side-effect expectation:** Opening the add form is read-only preparation. No new Challan Book should be persisted merely because this GET method is invoked.

**Assertions implemented:**
- `assertEquals` on the returned view name.
- `assertNotNull` on `ingestionRequest`.
- `assertEquals` on each of the three metric collections.

**Executable test method:** `getRendersFormAndMetricGroups()`

**What this test proves to a reviewer:** The controller correctly assembles the normal screen model when all reference/metric lookups succeed.

---

## STORY-0012-UT-02 — Summary metric lookup fails but the form remains usable

**Test type:** Unit test — Error/fallback behavior.

**Business objective:** Confirm that a temporary summary-metric failure does not prevent the user from opening the Challan Book Add page and does not convert the read-only GET flow into a write operation.

**Scenario:** The first metric lookup, `fetchChallanBookTotalMetrics()`, throws a runtime exception representing an unavailable metric store.

**Preconditions / setup:**
- `SummaryMetricLookupFetchService.fetchChallanBookTotalMetrics()` is configured to throw `RuntimeException("metric store unavailable")`.
- No successful metric lists are supplied after that failure.

**Action under test:** Invoke `ChallanBookWebController.showAddBookForm()`.

**Expected result:**
- The page still resolves to `final-version-1/add-challan-book.html`.
- A non-null `ingestionRequest` remains in the model, allowing the form itself to render.
- `challanBookTotalMetrics` is empty.
- `challanBookActiveMetrics` is empty.
- `challanBookUnusedMetrics` is empty.
- `summaryMetricErrorMessage` is set to `Summary metrics are temporarily unavailable.`

**Persistence / side-effect expectation:** The failure must not create or update a Challan Book. This remains a GET/read-preparation flow.

**Assertions implemented:**
- Correct view name.
- Non-null form request object.
- Three metric lists are empty.
- Exact user-visible fallback error message is present.

**Executable test method:** `metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel()`

**What this test proves to a reviewer:** The approved form-opening behavior degrades gracefully when metric data is unavailable instead of failing the complete page.

---

# 4. Integration Test Cases — BL-005

Executable file: `BL-005/generated-tests/STORY-0012/Story0012ChallanBookFormIntegrationTest.java`

## STORY-0012-IT-01 — Real PostgreSQL/JPA metric data feeds the approved form GET

**Test type:** Integration test — PostgreSQL Testcontainers + Flyway + JPA DAO + service + controller interaction.

**Business objective:** Verify that the controller can populate the approved Challan Book Add form using metric data that is actually stored and retrieved through the application persistence stack rather than through mocks alone.

**Environment/setup:**
- A PostgreSQL 16 Testcontainers database is started.
- Time zone is configured for Asia/Kolkata.
- Flyway is configured against `classpath:db/migration` and runs migrations before the integration path is exercised.
- Spring Data/JPA application configuration is imported.
- `SummaryMetricLookupJpaDao`, `SummaryMetricLookupFetchService`, and `SummaryMetricLookupMapper` participate in the test.

**Test data setup:** Before the test, the database is checked for lookup key `TOTAL_CHALLAN_BOOKS`. If it does not already exist, the test inserts a source-bound metric row with:
- Lookup key: `TOTAL_CHALLAN_BOOKS`
- UI label: `Total Challan Books`
- Meaning: `Integration-test source-bound summary metric`
- Value: `1`
- Decimal flag: `false`

**Action under test:**
- Construct the `ChallanBookWebController`.
- Inject the real `SummaryMetricLookupFetchService` into the controller.
- Invoke `showAddBookForm()`.

**Expected result:**
- The correct Challan Book Add view is returned.
- A non-null `ingestionRequest` is available.
- `challanBookTotalMetrics` is non-null and contains at least one value read through the real database/JPA/service path.

**Persistence / side-effect expectation:** The test may seed the summary-metric reference table as test setup, but invoking the Challan Book form GET itself must not persist a new Challan Book.

**Assertions implemented:**
- Correct view name.
- Non-null form request object.
- Non-null total-metrics collection.
- Total-metrics collection size is at least one.

**Executable test method:** `actualJpaMetricReadFeedsTheApprovedRegistrationGet()`

**What this test proves to a reviewer:** STORY-0012 is not validated only with mocks; the metric read path is exercised through Flyway-created PostgreSQL schema, JPA DAO, application service, and controller model preparation.

---

# 5. Data-Driven / Use-Case Test Cases — BL-009

Executable file: `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java`

Test-data catalogue: `BL-009/test-data/STORY-0012.md` and `BL-009/test-data/STORY-0012.csv`

## STORY-0012-TC-01 — Form and all metric groups are available

**Test type:** Data-driven/application-behavior mapping.

**Business objective:** Reconfirm the normal user-facing form preparation using the BL-009 test catalogue representation of the Story.

**Input/setup:** One reusable `SummaryMetricLookupDto` is returned independently for total, active, and unused-page metric lookups.

**Action:** Invoke `showAddBookForm()`.

**Expected result:**
- Correct add-form view.
- Non-null `ingestionRequest`.
- Exactly one item in each of `challanBookTotalMetrics`, `challanBookActiveMetrics`, and `challanBookUnusedMetrics`.

**Executable test method:** `tc001201FormAndMetrics()`

**Traceability purpose:** Maps the positive BL-009 test-data row to executable behavior for STORY-0012.

---

## STORY-0012-TC-02 — Metric failure fallback

**Test type:** Data-driven/application-behavior error-path mapping.

**Business objective:** Verify the catalogue's controlled failure case where summary metrics cannot be fetched but the add form must remain available.

**Input/setup:** `fetchChallanBookTotalMetrics()` throws `RuntimeException("unavailable")`.

**Action:** Invoke `showAddBookForm()`.

**Expected result:**
- Correct add-form view.
- Total, active, and unused metric collections are empty.
- `summaryMetricErrorMessage` equals `Summary metrics are temporarily unavailable.`

**Executable test method:** `tc001202MetricFailureFallback()`

**Traceability purpose:** Maps the BL-009 metric-failure test-data condition to an executable assertion set.

---

# 6. Human-Readable Test Data Coverage

The BL-009 test-data documents contain five catalogued rows covering the approved form behavior and source-bound missing/empty/error/boundary conditions. This BL-011 packet must be read together with those source test-data documents when reviewing the full input matrix. The executable BL-009 Java mapping currently contains the two source-bound behaviors above; additional catalogue rows must not be claimed as executed unless an executable test and durable result exists for them.

---

# 7. End-to-End Business Narrative

**Given** the application has the reference/summary data required by the Challan Book Add screen,

**When** the user opens `GET /logistics/challan-books/add-form`,

**Then** the application prepares `final-version-1/add-challan-book.html`, supplies a blank `ingestionRequest`, provides available summary metric groups, and does not persist a new Challan Book merely from opening the page.

**And when** summary metrics are temporarily unavailable,

**Then** the same form remains available with empty metric groups and the visible message `Summary metrics are temporarily unavailable.` rather than failing the complete page.

---

# 8. Traceability Matrix

| Human-readable case | Layer | Executable implementation | Execution state |
|---|---|---|---|
| STORY-0012-UT-01 | Unit / Controller | `Story0012ChallanBookFormUnitTest#getRendersFormAndMetricGroups` | NOT EXECUTED |
| STORY-0012-UT-02 | Unit / Controller fallback | `Story0012ChallanBookFormUnitTest#metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel` | NOT EXECUTED |
| STORY-0012-IT-01 | Integration / PostgreSQL + Flyway + JPA + Service + Controller | `Story0012ChallanBookFormIntegrationTest#actualJpaMetricReadFeedsTheApprovedRegistrationGet` | NOT EXECUTED |
| STORY-0012-TC-01 | BL-009 positive mapping | `Story0012TestDataDrivenTest#tc001201FormAndMetrics` | NOT EXECUTED |
| STORY-0012-TC-02 | BL-009 error mapping | `Story0012TestDataDrivenTest#tc001202MetricFailureFallback` | NOT EXECUTED |

---

# 9. Execution and Coverage Status

- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- BL-009 application-behavior execution: `NOT EXECUTED`
- Durable JaCoCo coverage evidence: `NONE`
- 100% coverage achievement: `NOT PROVEN`

No test execution or coverage result is inferred from generated source files.

# 10. Packet Quality State

`HUMAN_READABLE_TEST_PACKET_REWORKED_DETAILED_TEST_CASES`

This packet now documents the purpose, setup, action, expected behavior, assertions, persistence expectations, and executable trace for each currently generated STORY-0012 test implementation.

## Production Code Evidence
Source package: verified frozen/recovered Cylinder application source.
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/ChallanBookWebController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0012/Story0012ChallanBookFormUnitTest.java`

```java
    private ChallanBookWebController controller;

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

    @Test
    @DisplayName("STORY-0012 UT-02 metric failure does not turn the read-only GET into a write or failed page")
    void metricFailureRendersEmptyMetricGroupsAndVisibleErrorModel() {
        when(summaryMetricLookupFetchService.fetchChallanBookTotalMetrics())
                .thenThrow(new RuntimeException("metric store unavailable"));

        ModelAndView result = controller.showAddBookForm();
```

The unit-test excerpt above is the executable evidence for mocked/component-level behavior. It must be read with the narrative's positive, negative, boundary and duplicate/idempotency rules where applicable.

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0012/Story0012ChallanBookFormIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0012ChallanBookFormIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
            .withEnv("TZ", "Asia/Kolkata")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", () -> POSTGRES.getJdbcUrl() + "?options=-c%20TimeZone%3DAsia%2FKolkata");
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Configuration
    static class FlywayConfig {
        @Bean(initMethod = "migrate")
        Flyway flyway() {
            return Flyway.configure()
                    .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                    .locations("classpath:db/migration")
                    .load();
```

The integration excerpt shows the real-layer/database/container test implementation where applicable. Generated code does not imply it executed.

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java`

```java
    @InjectMocks ChallanBookWebController controller;

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
}

```

Readable/CSV test data remains governed under `BL-009/test-data/STORY-0012.md` and `BL-009/test-data/STORY-0012.csv` when present.

## Code-path trace
BL-002 approved Story -> frozen production code above -> BL-004 unit code -> BL-005 integration code -> BL-009 data/use-case mapping -> BL-011 reviewer packet.

## Execution and coverage
- Packet/code rework: `COMPLETE`
- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable coverage evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## BL-011 validation
Validated against the code-required `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`. The packet contains actual inline production code and governed BL-004/005/009 code evidence; code presence is not treated as execution evidence.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
