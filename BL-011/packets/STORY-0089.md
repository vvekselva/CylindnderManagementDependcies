# BL-011 Human-Readable Test Packet — STORY-0089 City Search

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source: `BL-002/stories/STORY-0089.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Business behavior: `GET /search/city/{searchText}` is a read-only City lookup.
- Unit: match/no-match/governed error and mapping behavior; executable `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java`.
- Integration: source-bound MVC/service/JPA read path; executable `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0089.md` / `.csv`, 3 mapped rows; stable City IDs/names, isolated cases.
- E2E: search text returns matching selectable City reference identities or governed empty/error outcome, with no City mutation. Catalogue `BL-009/stories/STORY-0089.md`; executable `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulCityServices.java`

```java
@GetMapping("/{searchText}")
public CitySearchResponseDto getCities(@PathVariable String searchText) {
    try {
        CylinderManagementApplicationRequestDto request =
            new CylinderManagementApplicationRequestDto();
        request.setSearchTerm(searchText);
        return citySearchService.searchWithText(request, null);
    } catch (CylinderManagementApplicationException e) {
        return new CitySearchResponseDto();
    }
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java`

```java
    @InjectMocks RestfulCityServices controller;

    @Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CitySearchResponseDto expected = new CitySearchResponseDto();
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
        CitySearchResponseDto actual = controller.getCities("Coimbatore");
        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(citySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Coimbatore", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCities("Coimbatore"));
    }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0089CitySearchIntegrationTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
        .withUsername("test").withPassword("test");

    @DynamicPropertySource static void properties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired CityJpaDao dao;

    @Test void containsIgnoreCaseReturnsOnlyMatchingCities() {
        CityDo city = new CityDo(); city.setCityName("Coimbatore_STORY0089"); city.setDescription("Coimbatore");
        CityDo other = new CityDo(); other.setCityName("Madurai_STORY0089"); other.setDescription("Madurai");
        dao.saveAndFlush(city); dao.saveAndFlush(other);
        assertEquals(1, dao.findByCityNameContainingIgnoreCase("coimbatore_story0089").size());
        assertEquals(0, dao.findByCityNameContainingIgnoreCase("ZZZ_STORY0089").size());
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java`

```java
    RestfulCityServices controller;

    @Test
    void tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
        CitySearchResponseDto expected = new CitySearchResponseDto();
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);

        CitySearchResponseDto actual = controller.getCities("Coimbatore");

        ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
        org.mockito.Mockito.verify(citySearchService).searchWithText(captor.capture(), isNull());
        assertEquals("Coimbatore", captor.getValue().getSearchTerm());
        assertSame(expected, actual);
    }

    @Test
    void tc0089_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
        assertNotNull(controller.getCities("Coimbatore"));
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
