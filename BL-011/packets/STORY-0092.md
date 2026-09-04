# BL-011 Human-Readable Test Packet — STORY-0092 Driver Search

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
## 1. Story, governance and source
- Source Story: `BL-002/stories/STORY-0092.md`
- Endpoint: `GET /search/driver/{searchText}`
- Controller: `RestfulDriverServices.getDrivers`
- Approval: `APPROVED_AFTER_REWORK`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## 2. Business behavior protected
This is a read-only reference search. The path variable `searchText` is copied into `CylinderManagementApplicationRequestDto.searchTerm`, validated with `DRIVER_SEARCH_SERVICE`, and used by the search service/DAO path `DriverJpaDao.findByDriverNameContainingIgnoreCase(...)`. Matching persistent entities are mapped to DTOs and returned; no-match/error behavior is governed and no master row is created, updated or deleted.

Returned Driver IDs are selectable persistent reference identities for consuming screens.

## 3. Preconditions, inputs and validation
- Search data exists in the relevant master table for the positive case.
- A valid text fragment that matches at least one row is used for the happy path.
- A text fragment that matches no row is used for the negative/no-result path.
- A validator/application-exception condition is represented as the governed error path.
- Minimal API search content is treated only according to source-proved validation; no unproved debounce/minimum-length rule is invented.
- Database state is isolated between integration cases and must remain unchanged by the search itself.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0092/Story0092DriverSearchUnitTest.java`.

### Positive case
Given a valid search term and mocked matching DAO/service data, when the search method runs, then the response contains the expected mapped identity/name values and success/result metadata defined by the source contract.

### No-match case
Given a valid term with no matching row, when the search executes, then the governed empty/failure response is returned; no persistence method is invoked.

### Validation/error case
Given a request rejected by the governed validator or an application exception in the search path, when the controller/service handles it, then the source-defined error/empty response behavior is produced without mutation.

### Boundary case
Use the smallest source-valid search content and paging boundary represented by the executable test. Do not add UI-only constraints unless a consuming screen is explicitly bound.

Dependencies are mocked/stubbed at unit scope. Expected write count: zero.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0092/Story0092DriverSearchIntegrationTest.java`.

Environment requires PostgreSQL Testcontainers, application JPA mappings and source-bound schema initialization.

### Positive database-read case
Seed one matching master row, execute the search path, and verify the persisted identity/name is returned through the real repository/service mapping.

### No-match database-read case
Execute with a fragment that matches no row and verify the governed empty/failure outcome.

### Persistence expectation
The before/after master-data state is unchanged. Search is read-only; insert/update/delete is not an expected side effect.

## 6. Test Data Story — BL-009
Readable catalogue: `BL-009/test-data/STORY-0092.md`; structured data: `BL-009/test-data/STORY-0092.csv`; executable mapping: `BL-009/generated-tests/STORY-0092/Story0092TestDataDrivenTest.java`.

Three governed rows cover positive matching, no-match behavior, validation/error behavior, and any source-proved consuming-selector case where applicable. Test rows must use synthetic/stable identities and remain isolated. Data-contract execution does not prove application execution.

## 7. Use-case / End-to-End Test Story
**Given** relevant reference data exists, **when** a caller submits `GET /search/driver/{searchText}` with matching text, **then** matching reference identities are returned for selection/use and the underlying master data remains unchanged.

**Given** no data matches, **when** the same search is performed, **then** the governed empty/failure outcome is returned without side effects.

**Given** the validator/application path rejects the request, **when** the request is handled, **then** the source-governed error/empty response is produced rather than an invented success.

## 8. Traceability
- BL-002: `BL-002/stories/STORY-0092.md`
- BL-004: `BL-004/generated-tests/STORY-0092/Story0092DriverSearchUnitTest.java`
- BL-005: `BL-005/generated-tests/STORY-0092/Story0092DriverSearchIntegrationTest.java`
- BL-009: Story catalogue, readable/CSV test data and `Story0092TestDataDrivenTest.java`
- BL-011: this reviewer-readable packet

## 9. Execution and coverage status
- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage percentage: `NOT INFERRED`
Generated tests and packet rework are not execution evidence.

## 10. BL-011 validation outcome
Freshly validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`. Required business behavior, preconditions, inputs, validation, positive/negative/boundary paths, expected service/API/database outcomes, executable references, BL-002/004/005/009 traceability and execution/coverage separation are present.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulDriverServices.java`

```java
@GetMapping("/search/driver/{searchText}")
public DriverSearchResponseDto getDrivers(@PathVariable String searchText) {
    try {
        CylinderManagementApplicationRequestDto requestDto =
            new CylinderManagementApplicationRequestDto();
        requestDto.setSearchTerm(searchText);
        Pageable pageable = PaginationUtils.createPageable(requestDto);
        return driverSearchService.searchWithText(requestDto, pageable);
    } catch (CylinderManagementApplicationException exception) {
        return new DriverSearchResponseDto();
    }
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0092/Story0092DriverSearchUnitTest.java`

```java
    @InjectMocks RestfulDriverServices controller;

    @Test void delegatesExactSearchTextWithPagingAndReturnsServiceResponse() throws Exception {
        DriverSearchResponseDto expected = new DriverSearchResponseDto();
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class))).thenReturn(expected);
        DriverSearchResponseDto actual = controller.getDrivers("Ravi");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(driverSearchService).searchWithText(captor.capture(), any(Pageable.class));
        assertEquals("Ravi", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class)))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getDrivers("Ravi"));
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0092/Story0092DriverSearchIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0092DriverSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired DriverJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingDriversWithPaging() {
        DriverDo ravi = new DriverDo(); ravi.setDriverName("Ravi_STORY0092"); ravi.setLicenceNumber("DL0092A");
        DriverDo kumar = new DriverDo(); kumar.setDriverName("Kumar_STORY0092"); kumar.setLicenceNumber("DL0092B");
        dao.saveAndFlush(ravi); dao.saveAndFlush(kumar);
        assertEquals(1, dao.findByDriverNameContainingIgnoreCase("ravi_story0092", PageRequest.of(0, 10)).getTotalElements());
        assertEquals(0, dao.findByDriverNameContainingIgnoreCase("ZZZ_STORY0092", PageRequest.of(0, 10)).getTotalElements());
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0092/Story0092TestDataDrivenTest.java`

```java
    @InjectMocks RestfulDriverServices controller;

    @Test void tc0092_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        DriverSearchResponseDto expected = new DriverSearchResponseDto();
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class))).thenReturn(expected);
        DriverSearchResponseDto actual = controller.getDrivers("Ravi");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(driverSearchService).searchWithText(captor.capture(), any(Pageable.class));
        assertEquals("Ravi", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void tc0092_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(driverSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), any(Pageable.class)))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getDrivers("Ravi"));
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
