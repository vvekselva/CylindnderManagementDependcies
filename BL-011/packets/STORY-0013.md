# BL-011 Human-Readable Test Packet — STORY-0013 Challan Book Registration Submit

## Rework state
Reworked under the BL-011 code-required policy. Explanation-only or path-only evidence is incomplete.

## Reviewer-readable business/test narrative
## 1. Story, approval, conformance and source
- Source Story: `BL-002/stories/STORY-0013.md`
- Endpoint: `POST /logistics/challan-books/save`
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS` for the approved **current-source behavior**
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Source anchors reverified locally:
  - `ChallanBookWebController.processBookIngestion(...)`
  - `ChallanBookIngestionService.processRequest(...)`
  - `ChallanBookRegistryJpaDao.saveAndFlush(...)`
  - `ChallanBookRegistryJpaDao.findByBookCode(...)`
- Known proposed hardening DEV-0002/0003/0004 remains separately approval-gated and is **not** represented as implemented.

## 2. Business behavior protected
An operator submits a physical Challan Book definition containing book type, unique book code, optional series prefix, starting sheet, ending sheet and storage location. The current service maps the DTO to the registry entity, sets `createdAt`/`updatedAt`, saves through JPA and returns SUCCESS. The controller redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10` with `Challan Book registered successfully!`.

The current source also contains three material gaps that the tests must preserve visibly:
1. null-request/null-book controlled exception is commented out;
2. invalid/missing sheet-range controlled exception is commented out;
3. no explicit `findByBookCode` service pre-check is performed; database uniqueness is the effective duplicate guard.
Per-sheet ledger generation is also commented out, so registration persists the book registry without creating sheet-ledger rows.

## 3. Preconditions and readable input rules
Required current form/entity inputs include book type, book code, start sheet, end sheet and location. Book code is unique and max 30 characters; series prefix is optional and max 10; UI sheet values have minimum 1. Business intent is start <= end, but the service-level throw is currently disabled.

Representative positive data:
- Type `DELIVERY_CHALLAN`, code `DEL-1001`, prefix `DC`, start 1, end 50, location `IN_OFFICE`.
- Optional-prefix scenario: `EMPTY_PICKUP_CHALLAN`, code `EMP-1001`, no prefix, range 1..25.

Negative/current-gap data:
- null request;
- range 50..1;
- duplicate code `DUP-1001`;
- page-ledger expectation on a 1..5 range.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0013/Story0013ChallanBookIngestionServiceTest.java`.

### UT-01 — Valid book persists successfully
Mock mapper/DAO. Submit a valid DTO. Expected: entity receives non-null created/updated timestamps, exactly one `saveAndFlush` occurs, response code is SUCCESS and mapped saved ID is returned.

### UT-02 — Invalid range exposes current gap
Submit start 50/end 1. Because the controlled range throw is commented out, the current-source test expects the service to reach `saveAndFlush`. This is deliberately a defect-characterization test, not approval of the behavior.

### UT-03 — Null request exposes current gap
Calling `processRequest(null)` currently produces `NullPointerException` after the commented-out controlled guard instead of the intended application exception. Expected DAO save count: zero.

### UT-04 — Duplicate service pre-check is absent
Submit code `DUP-CHECK`. Expected: `findByBookCode` is never called before `saveAndFlush`. This proves the service relies on database uniqueness rather than a friendly pre-check.

### UT-05 — No per-sheet ledger generation
Submit range 1..3. Expected: the entity page collection remains empty because page-generation code is commented out.

**Mocked dependencies:** mapper and registry DAO.  
**Mutation expectation:** valid/current-gap paths that reach save perform one registry write in the mocked boundary; null request performs no save.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0013/Story0013ChallanBookIntegrationTest.java`.

Environment: Spring Boot test, PostgreSQL 16 Testcontainers, Flyway enabled, real JPA repositories and service/mapper components.

### IT-01 — Valid registry persistence
Submit `IT-BOOK-001`, range 1..10. Expected: generated Book ID, row retrievable by `findByBookCode`, non-null timestamps, persisted range exactly 1..10.

### IT-02 — Duplicate conflict at database boundary
Persist `IT-DUP-001`, then submit the same code again with a different range. Expected: PostgreSQL/JPA raises `DataIntegrityViolationException`. This is the currently effective duplicate guard; no friendly service pre-check is claimed.

### IT-03 — Invalid range currently persists
Submit `IT-RANGE-GAP`, start 50/end 1. Expected current-source database state: row exists with start 50 and end 1. This is a governed defect-characterization case pending explicit code-change approval.

### IT-04 — No generated sheet-ledger rows
Submit `IT-NO-LEDGER`, range 1..3. Expected: registry row persists and its page collection size remains zero.

## 6. Test Data Story — BL-009
Human-readable data: `BL-009/test-data/STORY-0013.md`; structured CSV: `BL-009/test-data/STORY-0013.csv`; executable mapping: `BL-009/generated-tests/STORY-0013/Story0013TestDataDrivenTest.java`.

Ten governed rows cover:
- valid save;
- valid save without optional prefix;
- null-guard current gap;
- reversed-range current gap;
- duplicate conflict with DB uniqueness and no service pre-check;
- timestamps assigned;
- correct registry-table identity;
- no per-sheet ledger generation;
- controller success redirect;
- controller `CylinderManagementApplicationException` redisplay branch.

The data-driven Java verifies that each case ID remains mapped to the exact current-source classification. It does **not** execute the application behavior itself.

## 7. Controller/UI outcome story
On service SUCCESS, `processBookIngestion` redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`, adds `successMessage = Challan Book registered successfully!`, and exposes saved `bookDetails`.

If a `CylinderManagementApplicationException` reaches the controller, it redisplays `final-version-1/add-challan-book`, restores `ingestionRequest`, repopulates summary metrics and sets `errorMessage = Error: <message>`.

Important: the null/range conditions are **not currently proven to reach this friendly exception branch** because the corresponding service throws are commented out.

## 8. Use-case / End-to-End Test Story
**Given** a valid, unique Challan Book request, **when** the operator submits the form, **then** one registry record is created with generated identity and timestamps, the saved details are returned, and the browser receives the governed success redirect/message.

**Given** the same book code already exists, **when** another record with that code is submitted, **then** the current implementation relies on the database unique constraint and may raise a persistence exception; a friendly pre-check is not claimed.

**Given** start sheet exceeds end sheet, **when** the request is processed by the current source, **then** the current service may persist that invalid range because the intended application exception is commented out. This remains a drift/development concern, not an approved future behavior.

**Given** a valid sheet range, **when** registration completes, **then** no per-sheet audit ledger rows are generated by this current code path.

## 9. Traceability
- BL-002: `BL-002/stories/STORY-0013.md`
- BL-004: `Story0013ChallanBookIngestionServiceTest.java`
- BL-005: `Story0013ChallanBookIntegrationTest.java`
- BL-009: `BL-009/test-data/STORY-0013.md`, `STORY-0013.csv`, `Story0013TestDataDrivenTest.java`, Story catalogue
- BL-010 references: DEV-0002, DEV-0003, DEV-0004 are approval-gated and not executed here.

## 10. Execution and coverage status
- Unit execution: `NOT EXECUTED`
- PostgreSQL/Testcontainers integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable coverage evidence: `NONE`
- Coverage percentage: `NOT INFERRED`
Packet rework does not imply BL-004/005/009 execution.

## 11. BL-011 validation outcome
Validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`. The packet explicitly covers business behavior, preconditions, inputs, validation rules, happy path, negative/current-gap paths, boundary/range case, duplicate conflict, controller/API/UI/database outcomes, executable references, backlog traceability and separated execution/coverage state.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/ChallanBookWebController.java`

```java
@PostMapping("/save")
public ModelAndView processBookIngestion(
        @ModelAttribute("ingestionRequest") ChallanBookIngestionRequestDto requestDto) {
    try {
        ChallanBookIngestionResponseDto responseDto =
            challanBookIngestionService.processRequest(requestDto);
        ModelAndView mav =
            new ModelAndView("redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10");
        mav.addObject("successMessage", "Challan Book registered successfully!");
        mav.addObject("bookDetails", responseDto.getIngestedChallanBook());
        return mav;
    } catch (CylinderManagementApplicationException exception) {
        ModelAndView mav = new ModelAndView("final-version-1/add-challan-book");
        mav.addObject("errorMessage", "Error: " + exception.getMessage());
        mav.addObject("ingestionRequest", requestDto);
        populateSummaryMetrics(mav);
        return mav;
    }
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0013/Story0013ChallanBookIngestionServiceTest.java`

```java
    private ChallanBookIngestionService service;

    @Test
    @DisplayName("STORY-0013 UT-01 valid book is timestamped persisted and returned as SUCCESS")
    void validBookIsTimestampedPersistedAndReturnedAsSuccess() throws Exception {
        ChallanBookRegistryDto dto = book("BOOK-001", 1, 10);
        ChallanBookIngestionRequestDto request = request(dto);
        ChallanBookRegistryDo entity = new ChallanBookRegistryDo();
        ChallanBookRegistryDo saved = new ChallanBookRegistryDo();
        saved.setBookId(101L);
        ChallanBookRegistryDto savedDto = new ChallanBookRegistryDto();
        savedDto.setBookId(101L);

        when(mapper.mapDtoToDo(dto)).thenReturn(entity);
        when(dao.saveAndFlush(entity)).thenReturn(saved);
        when(mapper.mapDoToDto(saved)).thenReturn(savedDto);

        ChallanBookIngestionResponseDto response = service.processRequest(request);

        ArgumentCaptor<ChallanBookRegistryDo> persisted = ArgumentCaptor.forClass(ChallanBookRegistryDo.class);
        verify(dao, times(1)).saveAndFlush(persisted.capture());
        assertNotNull(persisted.getValue().getCreatedAt());
        assertNotNull(persisted.getValue().getUpdatedAt());
        assertEquals(CylinderManagementApplicationResponseCode.SUCCESS.ordinal(), response.getResponseCode());
        assertEquals(101L, response.getIngestedChallanBook().getBookId());
    }

    @Test
```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0013/Story0013ChallanBookIntegrationTest.java`

```java
 * Normal Flyway/JPA initialization is required; no H2/manual-SQL substitution is allowed.
 */
@Testcontainers
@SpringBootTest(classes = Story0013ChallanBookIntegrationTest.TestApplication.class)
class Story0013ChallanBookIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void postgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "none");
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private ChallanBookIngestionService service;

    @Autowired
    private ChallanBookRegistryJpaDao dao;

    @Test
    void validBookPersistsWithGeneratedIdentityAndTimestamps() throws Exception {
        var response = service.processRequest(request("IT-BOOK-001", 1, 10));

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0013/Story0013TestDataDrivenTest.java`

```java
    }

    @ParameterizedTest(name = "{1} - {0}")
    @MethodSource("canonicalRows")
    void everyApprovedCatalogueCaseHasExecutableMapping(
            String dataId,
            String testCaseId,
            String bookType,
            String bookCode,
            String seriesPrefix,
            String startSheet,
            String endSheet,
            String currentLocation,
            String expectedCurrentSource) {

        assertNotNull(dataId);
        assertNotNull(testCaseId);
        assertNotNull(expectedCurrentSource);

        switch (testCaseId) {
            case "TC-0013-01" -> assertEquals("SAVE_SUCCESS", expectedCurrentSource);
            case "TC-0013-02" -> assertEquals("SAVE_SUCCESS_OPTIONAL_PREFIX", expectedCurrentSource);
            case "TC-0013-03" -> assertEquals("CURRENT_GAP_NULL_GUARD_NOT_CONTROLLED", expectedCurrentSource);
            case "TC-0013-04" -> assertEquals("CURRENT_GAP_RANGE_THROW_COMMENTED", expectedCurrentSource);
            case "TC-0013-05" -> assertEquals("DB_UNIQUE_EFFECTIVE_GUARD_NO_SERVICE_PRECHECK", expectedCurrentSource);
            case "TC-0013-06" -> assertEquals("TIMESTAMPS_ASSIGNED", expectedCurrentSource);
            case "TC-0013-07" -> assertEquals("TBL_CHALLAN_BOOK_REGISTRY_IDENTITY", expectedCurrentSource);
            case "TC-0013-08" -> assertEquals("NO_PER_SHEET_LEDGER_GENERATION", expectedCurrentSource);
```

## Code-path trace
BL-002 approved Story -> frozen production code -> BL-004 unit code -> BL-005 integration code -> BL-009 data/use-case mapping -> BL-011 packet.

## Execution and coverage
- Packet/code rework: `COMPLETE`
- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable coverage evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present. Code presence is not execution evidence.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
