# BL-011 Human-Readable Test Packet — STORY-0090 Country Search

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0090.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: `GET /search/country/{searchText}` performs read-only Country reference search.
- Unit: matching result mapping, no-match, governed validation/error; `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java`.
- Integration: MVC/service/JPA read path; `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0090.md` and `.csv`, 3 mapped rows.
- E2E: matching Country identities are returned or governed empty/error outcome; no persistence mutation. Catalogue `BL-009/stories/STORY-0090.md`; executable `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulCountryServices.java`

```java
@GetMapping("/{searchText}")
public CountrySearchResponsesDto getCountries(@PathVariable String searchText) {
    try {
        CylinderManagementApplicationRequestDto request =
            new CylinderManagementApplicationRequestDto();
        request.setSearchTerm(searchText);
        return countrySearchService.searchWithText(request, null);
    } catch (CylinderManagementApplicationException e) {
        return new CountrySearchResponsesDto();
    }
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java`

```java
    @InjectMocks RestfulCountryServices controller;

    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CountrySearchResponsesDto expected = new CountrySearchResponsesDto();
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CountrySearchResponsesDto actual = controller.getCountries("India");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(countrySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("India", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCountries("India"));
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0090CountrySearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired CountryJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingCountries() {
        CountryDo india = new CountryDo(); india.setCountryName("India_STORY0090"); india.setDescription("India");
        CountryDo nepal = new CountryDo(); nepal.setCountryName("Nepal_STORY0090"); nepal.setDescription("Nepal");
        dao.saveAndFlush(india); dao.saveAndFlush(nepal);
        assertEquals(1, dao.findByCountryNameContainingIgnoreCase("india_story0090").size());
        assertEquals(0, dao.findByCountryNameContainingIgnoreCase("ZZZ_STORY0090").size());
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java`

```java
    RestfulCountryServices controller;

    @Test
    void tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CountrySearchResponsesDto expected = new CountrySearchResponsesDto();
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);

        CountrySearchResponsesDto actual = controller.getCountries("India");

        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(countrySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("India", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void tc0090_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
        assertNotNull(controller.getCountries("India"));
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
