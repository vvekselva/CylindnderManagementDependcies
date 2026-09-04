# BL-011 Human-Readable Test Packet — STORY-0090 Country Search

## Identity, approval, source and conformance
- Source Story: `BL-002/stories/STORY-0090.md`.
- Approval: `APPROVED_AFTER_REWORK`; explicit approval evidence is recorded by BL-002.
- Approved endpoint: `GET /search/country/{searchText}` handled by `RestfulCountryServices.getCountries`.
- Frozen approved source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`, SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
- This fire could not recover the named 08:02 Library object, but recovered `Harinandhan-Cylinder-Backup(20260902-163304).zip`; its locally computed SHA-256 is exactly the approved SHA above, so production excerpts below are from byte-identical source evidence.
- Conformance: `PASS` for the approved STORY-0090 contract. No application-code mutation is authorized or performed.

## Business behavior and impact
Country Search is a read-only reference-data lookup. The REST endpoint receives the exact `searchText` path variable, puts it into `CylinderManagementApplicationRequestDto.searchTerm`, and delegates to `CountrySearchService.searchWithText(request, null)`. The service validates the request, performs a case-insensitive `contains` query through `CountryJpaDao`, maps `CountryDo` rows to `CountryDto`, and returns them with success response code. A governed `CylinderManagementApplicationException` is caught by the REST controller and converted to a new, non-null `CountrySearchResponsesDto` rather than being propagated.

Business impact: callers can resolve country reference values without modifying country data. A matching substring may return one or more countries; no match produces an empty mapped result from the service. Service-layer governed failure is intentionally hidden behind an empty response object at this controller boundary.

## Preconditions, inputs and validation rules
- Actor/caller: HTTP client or consuming UI calling `/search/country/{searchText}`.
- Input: non-null path variable `searchText`; representative values are `India`, `ind`, and a no-match token such as `ZZZ_STORY0090`.
- The controller creates the request DTO and copies `searchText` unchanged into `searchTerm`.
- `SearchRequestValidator.validate(request, COUNTRY_SEARCH_SERVICE)` rejects a null request. If `searchTermRequiredForFiltering` is true, blank search text is accumulated as `SEARCH TERM REQUIRED` and raised as an input-validation failure.
- Country Search is not state-dependent, so the validator does not require a `state` query-data entry.
- Repository rule: `findByCountryNameContainingIgnoreCase(searchTerm)` is substring and case insensitive.
- Duplicate/conflict/idempotency: the endpoint is read-only. Repeating the same request has no intended persistence side effect. Duplicate Country rows, if present in persisted data, are not de-duplicated by this query; no duplicate-prevention behavior is claimed by this Story.

## Production Code Evidence
**Recovered byte-identical application source:** `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulCountryServices.java` — `RestfulCountryServices.getCountries`.
```java
@RestController
@RequestMapping("/search/country")
public class RestfulCountryServices {
    @Autowired
    private ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CountrySearchResponsesDto> countrySearchService;

    @GetMapping("/{searchText}")
    public CountrySearchResponsesDto getCountries(@PathVariable String searchText) {
        CountrySearchResponsesDto response;
        try {
            CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
            request.setSearchTerm(searchText);
            response = countrySearchService.searchWithText(request, null);
        } catch (CylinderManagementApplicationException e) {
            response = new CountrySearchResponsesDto();
        }
        return response;
    }
}
```

**Service:** `cylindermanagement.custommapper.service/.../CountrySearchService.java` — `searchWithText`.
```java
validator.validate(cylinderManagementApplicationRequestDto,
        CylinderManagementServiceCode.COUNTRY_SEARCH_SERVICE);
List<CountryDo> countries = countryJpaDao
        .findByCountryNameContainingIgnoreCase(cylinderManagementApplicationRequestDto.getSearchTerm());
List<CountryDto> countryDtos = countries.stream()
        .map(countryMapper::mapDoToDto).collect(Collectors.toList());
CountrySearchResponsesDto response = new CountrySearchResponsesDto();
response.setCountryDtos(countryDtos);
response.setResponseCode(CylinderManagementApplicationResponseCode.SUCCESS.ordinal());
return response;
```

**DAO:** `cylinder.management.dao/.../CountryJpaDao.java`.
```java
public interface CountryJpaDao extends JpaRepository<CountryDo, Long> {
    List<CountryDo> findByCountryNameContainingIgnoreCase(String countryName);
    Page<CountryDo> findByCountryNameContainingIgnoreCase(String countryName, Pageable pageable);
}
```

## Unit Test Story — BL-004
The unit layer protects controller delegation and controller error conversion. `countrySearchService` is mocked; therefore these cases do not prove validator, mapper, JPA, database, HTTP serialization, or PostgreSQL behavior.

### UT-0090-01 — exact path text is delegated and returned
**Objective:** prove `India` is copied exactly into `request.searchTerm`, the service is invoked with null pageable, and the exact service response object is returned.  
**Preconditions/input:** mocked service returns a known `CountrySearchResponsesDto`; input `India`.  
**Action:** call `controller.getCountries("India")`.  
**Expected API/service result:** captured request search term equals `India`; controller returns the same response instance.  
**Persistence/side effect:** none proven; service is mocked.  
**Executable:** `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java#delegatesExactSearchTextAndReturnsServiceResponse`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
    CountrySearchResponsesDto expected = new CountrySearchResponsesDto();
    when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
        .thenReturn(expected);
    CountrySearchResponsesDto actual = controller.getCountries("India");
    ArgumentCaptor<CylinderManagementApplicationRequestDto> captor =
        ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
    org.mockito.Mockito.verify(countrySearchService).searchWithText(captor.capture(), isNull());
    assertEquals("India", captor.getValue().getSearchTerm());
    assertSame(expected, actual);
}
```

### UT-0090-02 — governed service failure becomes non-null empty response object
**Objective:** protect the controller's governed exception boundary.  
**Preconditions/input:** service throws `CylinderManagementApplicationException`; input `India`.  
**Action:** call controller.  
**Expected API/service result:** no exception is propagated by this method; result is non-null. The current executable does not assert internal DTO fields, so an empty payload beyond non-nullness is not execution-proven.  
**Persistence/side effect:** none proven.  
**Executable:** `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
    when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
        .thenThrow(mock(CylinderManagementApplicationException.class));
    assertNotNull(controller.getCountries("India"));
}
```

**Unit gaps:** no executable BL-004 case currently proves service validation, mapper behavior, no-match list contents, blank-term validation, case-insensitive DAO semantics, boundary length, or duplicate rows.

## Integration Test Story — BL-005
The governed integration artifact uses a real Spring Data JPA repository and PostgreSQL Testcontainers (`postgres:16`). It proves repository persistence plus case-insensitive contains lookup. It does **not** invoke the REST controller or `CountrySearchService`, so it is DAO/database integration evidence rather than full endpoint integration.

### IT-0090-01 — PostgreSQL contains-ignore-case returns matching Country only
**Objective:** persist representative Country rows and prove a lowercase substring matches the intended row while an impossible token returns none.  
**Preconditions/data:** `India_STORY0090` and `Nepal_STORY0090` are inserted with `saveAndFlush`.  
**Action:** query `india_story0090` and `ZZZ_STORY0090`.  
**Expected database result:** first query size `1`; second query size `0`.  
**Persistence/side effect:** test setup inserts two Country rows in the test transaction; production endpoint itself remains read-only.  
**Executable:** `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java#containsIgnoreCaseReturnsOnlyMatchingCountries`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void containsIgnoreCaseReturnsOnlyMatchingCountries() {
    CountryDo india = new CountryDo();
    india.setCountryName("India_STORY0090"); india.setDescription("India");
    CountryDo nepal = new CountryDo();
    nepal.setCountryName("Nepal_STORY0090"); nepal.setDescription("Nepal");
    dao.saveAndFlush(india); dao.saveAndFlush(nepal);
    assertEquals(1, dao.findByCountryNameContainingIgnoreCase("india_story0090").size());
    assertEquals(0, dao.findByCountryNameContainingIgnoreCase("ZZZ_STORY0090").size());
}
```

**Integration gaps:** no BL-005 executable currently proves controller-to-service-to-validator-to-mapper-to-DAO wiring, HTTP status/body, service success response code, blank validation, duplicate-row semantics, or an empty result DTO through the full service path.

## Test Data Story — BL-009
Governed data matrix: `BL-009/test-data/STORY-0090.csv`; readable explanation: `BL-009/test-data/STORY-0090.md`.

| Case | Input | Governed purpose | Expected outcome |
|---|---|---|---|
| TC-0090-01 | `India` | positive controller delegation | same service response; exact request search term `India` |
| TC-0090-02 | `India` + governed exception | negative/error | non-null new response DTO |
| TC-0090-03 | `ind` | lowercase substring | read-only contains-ignore-case search path |

### TC-0090-01 — data-driven positive delegation
**Expected service/API result:** exact search text reaches service and returned object is preserved.  
**Persistence:** none; mocked service.  
**Executable:** `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java#tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test
void tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
    CountrySearchResponsesDto expected = new CountrySearchResponsesDto();
    when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
        .thenReturn(expected);
    CountrySearchResponsesDto actual = controller.getCountries("India");
    ArgumentCaptor<CylinderManagementApplicationRequestDto> captor =
        ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
    org.mockito.Mockito.verify(countrySearchService).searchWithText(captor.capture(), isNull());
    assertEquals("India", captor.getValue().getSearchTerm());
    assertSame(expected, actual);
}
```

### TC-0090-02 — data-driven governed failure
**Expected service/API result:** controller returns non-null response instead of propagating the governed application exception.  
**Persistence:** none; mocked service.  
**Executable:** `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java#tc0090_02_governedServiceFailureReturnsEmptyResponseObject`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test
void tc0090_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
    CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
    when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
        .thenThrow(failure);
    assertNotNull(controller.getCountries("India"));
}
```

### TC-0090-03 — lowercase contains-search data case
**Objective:** document `ind` as a representative partial lowercase search.  
**Expected result:** repository/service semantics are case-insensitive contains and read-only.  
**Executable adjacency:** `NO_DEDICATED_BL-009_EXECUTABLE_METHOD`. The CSV row exists, but the governed BL-009 Java artifact contains only TC-0090-01 and TC-0090-02.  
**Execution:** `NOT_EXECUTED`; this row is **not claimed executable or passed**.
```csv
TC-0090-03,ind,SUCCESS,READ_ONLY_CONTAINS_IGNORE_CASE_SEARCH_PATH
```

## Use-case / End-to-End Test Story
**Given** Country reference rows exist and a caller supplies `searchText`, **when** `GET /search/country/{searchText}` reaches `RestfulCountryServices`, **then** the controller builds the request, `CountrySearchService` validates it, `CountryJpaDao` performs case-insensitive contains lookup, `countryMapper` maps rows, and `CountrySearchResponsesDto` returns the mapped countries with success code. If the service throws a governed application exception, the controller returns a new Country response DTO. No production persistence mutation is expected.

Code-path trace: `GET /search/country/{searchText}` -> `RestfulCountryServices.getCountries` -> `CountrySearchService.searchWithText` -> `SearchRequestValidator.validate(...COUNTRY_SEARCH_SERVICE)` -> `CountryJpaDao.findByCountryNameContainingIgnoreCase` -> `CountryDo`/Country persistence -> mapper -> `CountrySearchResponsesDto`.

**E2E executable status:** `NO_FULL_ENDPOINT_E2E_EXECUTABLE_EVIDENCE`. BL-004 and BL-009 exercise the controller with a mocked service; BL-005 exercises JPA/PostgreSQL directly. They collectively provide layer evidence but must not be described as an executed full E2E flow.

## Scenario coverage assessment
- Positive exact delegation: specified and executable-generated; `NOT_EXECUTED`.
- Negative governed service exception: specified and executable-generated; `NOT_EXECUTED`.
- No-match repository result: assertion exists inside IT-0090-01; `NOT_EXECUTED`.
- Case-insensitive matching: assertion exists inside IT-0090-01; `NOT_EXECUTED`.
- Partial lowercase `ind`: data row exists; no dedicated BL-009 executable method.
- Blank/null request validation: production rule identified; no Story-specific executable evidence.
- Boundary length/special characters: no governed Story-specific executable evidence.
- Duplicate/conflict: not a mutation concern; duplicate-result behavior is not explicitly tested.
- Idempotency: read-only by design; no persistence mutation expected, but no repeated-call executable assertion exists.

## Traceability
- BL-002: `BL-002/stories/STORY-0090.md` — approved business contract and frozen source identity.
- BL-004: `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java` — controller unit cases.
- BL-005: `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java` — JPA/PostgreSQL repository case.
- BL-009: `BL-009/test-data/STORY-0090.md`, `STORY-0090.csv`, and `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java` — readable data plus mapped executable cases.

## Execution and coverage separation
- Packet generation/rework: `COMPLETE_AND_VALIDATED_THIS_FIRE`.
- BL-004 execution: `NOT_EXECUTED` — source presence is not execution evidence.
- BL-005 execution: `NOT_EXECUTED` — Testcontainers source presence is not container execution evidence.
- BL-009 executable execution: `NOT_EXECUTED`.
- Full use-case/E2E execution: `NOT_EXECUTED / NO_FULL_ENDPOINT_E2E_EXECUTABLE_EVIDENCE`.
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`; no percentage inferred.

## README / policy validation
PASS for packet structure and evidence honesty: identity/approval/source, business behavior/impact, preconditions/input/validation, production code excerpts, per-case adjacent BL-004/BL-005/BL-009 code, test-data matrix, E2E code-path trace, BL-002/004/005/009 traceability, scenario/gap disclosure, and execution/coverage separation are present. Missing executable coverage is explicitly reported rather than inferred.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
