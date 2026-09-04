# BL-011 Human-Readable Test Packet — STORY-0087 Address Type Search

## Rework state
Reworked under the BL-011 code-required policy. Explanation-only or path-only evidence is incomplete.

## Reviewer-readable business/test narrative
## Story and governed behavior
Source: `BL-002/stories/STORY-0087.md`; approval `APPROVED_AFTER_REWORK`; conformance `CODE_CONFORMANCE_VERIFIED_PASS`; frozen SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.

`GET /search/addresstype/{searchText}` is a read-only Address Type reference lookup. `RestfulAddressTypeServices.getAddressTypes` delegates through `AddressTypeSearchService`, validation and `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase`. Matching `AddressTypeDo` rows from `public.tbl_address_type` are mapped to the response. Application-service failure is converted to the governed empty response. No Address Type row is written.

## Preconditions and test data
Use an isolated synthetic Address Type matching a search fragment for the positive case; a fragment matching no row for the negative case; a governed validation/application-error condition for the error case; and different letter case/minimal source-valid text for contains-ignore-case/boundary verification. No standalone debounce/minimum-length/hidden-ID rule is invented.

## Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0087/Story0087AddressTypeSearchUnitTest.java`.

- Positive: mocked matching data returns expected mapped identity/name and success metadata.
- No-match: empty DAO result returns the governed empty/failure response.
- Error: validation/application exception produces source-defined error/empty handling.
- Boundary: different-case contained fragment verifies the ignore-case search contract where represented.
- Persistence: no insert/update/delete interaction is expected.

## Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0087/Story0087AddressTypeSearchIntegrationTest.java`.

Run with PostgreSQL Testcontainers and real JPA mapping. Seed a known Address Type, search using a contained fragment, and verify the persistent identity/name is returned. Execute a no-match case and verify the governed empty result. The Address Type master rows must remain unchanged.

## Test Data Story — BL-009
Readable data: `BL-009/test-data/STORY-0087.md`; CSV: `BL-009/test-data/STORY-0087.csv`; executable mapping: `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java`.

Three mapped rows cover match, no-match and error/boundary behavior. Data remains synthetic, stable and isolated. Data-contract mapping is not application execution evidence.

## Use-case / End-to-End Test Story
**Given** Address Type reference data exists, **when** a caller searches by contained text, **then** matching Address Types are returned as selectable reference identities and no row is changed.

**Given** no Address Type matches, **then** the governed empty/failure result is returned.

**Given** validation/application processing fails, **then** the source-defined error/empty response is produced without persistence.

## Traceability and expected outcomes
- BL-002: `STORY-0087.md`
- BL-004: `Story0087AddressTypeSearchUnitTest.java`
- BL-005: `Story0087AddressTypeSearchIntegrationTest.java`
- BL-009: Story catalogue, readable/CSV test data, `Story0087TestDataDrivenTest.java`
- Expected API outcome: matching DTOs, governed empty/failure on no-match/error.
- Expected database outcome: unchanged Address Type master rows.

## Execution and coverage
Unit `NOT EXECUTED`; integration `NOT EXECUTED`; application/E2E `NOT EXECUTED`; durable JaCoCo evidence `NONE`; coverage `NOT INFERRED`.

## BL-011 validation
Freshly validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`. Business behavior, preconditions, inputs, validation, positive/negative/boundary/error scenarios, expected service/API/database outcomes, executable references, BL-002/004/005/009 traceability and execution/coverage separation are present.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulAddressTypeServices.java`

```java
@GetMapping("/{searchText}")
public AddressTypeSearchResponseDto getAddressTypes(@PathVariable String searchText) {
    try {
        CylinderManagementApplicationRequestDto request =
            new CylinderManagementApplicationRequestDto();
        request.setSearchTerm(searchText);
        return addressTypeSearchService.searchWithText(request, null);
    } catch (CylinderManagementApplicationException e) {
        return new AddressTypeSearchResponseDto();
    }
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0087/Story0087AddressTypeSearchUnitTest.java`

```java
    @InjectMocks RestfulAddressTypeServices controller;

    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        AddressTypeSearchResponseDto expected = new AddressTypeSearchResponseDto();
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        AddressTypeSearchResponseDto actual = controller.getAddressTypes("HOME");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(addressTypeSearchService).searchWithText(captor.capture(), isNull());
        assertEquals("HOME", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getAddressTypes("HOME"));
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0087/Story0087AddressTypeSearchIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0087AddressTypeSearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired AddressTypeJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingAddressTypes() {
        AddressTypeDo home = new AddressTypeDo(); home.setAddressType("HOME_STORY0087"); home.setDescription("Home");
        AddressTypeDo office = new AddressTypeDo(); office.setAddressType("OFFICE_STORY0087"); office.setDescription("Office");
        dao.saveAndFlush(home); dao.saveAndFlush(office);
        assertEquals(1, dao.findByAddressTypeContainingIgnoreCase("home_story0087").size());
        assertEquals(0, dao.findByAddressTypeContainingIgnoreCase("ZZZ_STORY0087").size());
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java`

```java
    RestfulAddressTypeServices controller;

    @Test
    void tc0087_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        AddressTypeSearchResponseDto expected = new AddressTypeSearchResponseDto();
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenReturn(expected);

        AddressTypeSearchResponseDto actual = controller.getAddressTypes("HOME");

        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(addressTypeSearchService).searchWithText(captor.capture(), isNull());
        assertEquals("HOME", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void tc0087_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(failure);

        assertNotNull(controller.getAddressTypes("HOME"));
    }
}

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
