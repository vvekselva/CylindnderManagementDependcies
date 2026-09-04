# BL-011 Human-Readable Testing Packet — STORY-0089 City Search

## Identity, approval, conformance and frozen source
- Source Story: `BL-002/stories/STORY-0089.md`.
- Approved contract: `APPROVED_AFTER_REWORK`; approval evidence is referenced by BL-002 as `BL-002/approval-evidence/STORY-0089-approval-20260902.md`.
- Conformance: PASS for the approved read-only City-search behavior.
- Approved source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`, SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
- Recovery evidence this fire: Library 08:02 package was not retrievable; `Harinandhan-Cylinder-Backup(20260902-163304).zip` was materialized and independently fingerprinted to the identical SHA-256 above, therefore the analyzed bytes are source-equivalent to the approved binding.

## Business behavior, actor and impact
A caller sends `GET /search/city/{searchText}`. `RestfulCityServices.getCities` copies the exact path value into `CylinderManagementApplicationRequestDto.searchTerm` and delegates to `CitySearchService`. The service validates the request, performs a case-insensitive contains query through `CityJpaDao.findByCityNameContainingIgnoreCase`, maps matching `CityDo` rows to DTOs and returns `SUCCESS`. A governed `CylinderManagementApplicationException` is caught at the REST boundary and converted to an empty `CitySearchResponseDto`. The path is read-only: no City mutation is part of the approved behavior.

Business impact: users/components can resolve City reference data without modifying master data; search failures are contained at this REST boundary rather than propagated as an unhandled application exception.

## Preconditions, input and rules
- Endpoint path is `/search/city/{searchText}`; caller supplies the path variable.
- Search semantics are case-insensitive `contains`, not exact-match semantics.
- `SearchRequestValidator` rejects a null request. A blank search term is rejected only when `isSearchTermRequiredForFiltering()` is true; this packet does not invent a minimum browser search length.
- Successful service output sets City DTOs and `CylinderManagementApplicationResponseCode.SUCCESS.ordinal()`.
- Duplicate/conflict/idempotency: this is a read-only lookup, so write conflicts and duplicate-write idempotency are not applicable. Multiple matching City rows may legitimately be returned by contains semantics.

## Production Code Evidence
Source-equivalent recovered application ZIP, `cylindermanagement.web/.../RestfulCityServices.java`, class `RestfulCityServices`, method `getCities`:
```java
@GetMapping("/{searchText}")
public CitySearchResponseDto getCities(@PathVariable String searchText) {
    CitySearchResponseDto response;
    try {
        CylinderManagementApplicationRequestDto request = new CylinderManagementApplicationRequestDto();
        request.setSearchTerm(searchText);
        response = citySearchService.searchWithText(request, null);
    } catch (CylinderManagementApplicationException e) {
        response = new CitySearchResponseDto();
    }
    return response;
}
```

Source-equivalent recovered application ZIP, `cylindermanagement.custommapper.service/.../CitySearchService.java`, class `CitySearchService`, method `searchWithText`:
```java
validator.validate(cylinderManagementApplicationRequestDto, CylinderManagementServiceCode.CITY_SEARCH_SERVICE);
List<CityDo> cities = cityJpaDao
    .findByCityNameContainingIgnoreCase(cylinderManagementApplicationRequestDto.getSearchTerm());
List<CityDto> cityDtos = cities.stream().map(cityMapper::mapDoToDto).collect(Collectors.toList());
CitySearchResponseDto response = new CitySearchResponseDto();
response.setCityDtos(cityDtos);
response.setResponseCode(CylinderManagementApplicationResponseCode.SUCCESS.ordinal());
return response;
```

Source-equivalent recovered application ZIP, `cylindermanagement.custommapper.service/.../SearchRequestValidator.java`, method `validate`:
```java
if (requestDto == null) {
    throw new InvalidInputParameterException();
}
if (requestDto.isSearchTermRequiredForFiltering() && StringUtils.isBlank(requestDto.getSearchTerm())) {
    validationErrors.add(new ValidationErrorDto("SEARCH TERM REQUIRED", "Cylinder serial is missing", null, null));
}
```

## Unit Test Story — BL-004
Mocked dependency: City search service. Real behavior under test: REST-controller request construction/delegation/error containment. Execution status for every case below: `NOT_EXECUTED`; code presence is not execution proof.

### UT-0089-01 — exact path text is delegated and service response preserved
**Preconditions/input:** controller with mocked search service; `searchText="Coimbatore"`. **Action:** call `getCities`. **Expected API/service result:** request passed to service has search term `Coimbatore`; returned object is the exact service response. **Database/UI:** no database is exercised; no UI behavior claimed. **Side effect:** none expected.

Executable: `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java#delegatesExactSearchTextAndReturnsServiceResponse`.
```java
@Test void delegatesExactSearchTextAndReturnsServiceResponse() throws Exception {
    CitySearchResponseDto expected = new CitySearchResponseDto();
    when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenReturn(expected);
    CitySearchResponseDto actual = controller.getCities("Coimbatore");
    ArgumentCaptor<CylinderManagementApplicationRequestDto> captor = ArgumentCaptor.forClass(CylinderManagementApplicationRequestDto.class);
    org.mockito.Mockito.verify(citySearchService).searchWithText(captor.capture(), isNull());
    assertEquals("Coimbatore", captor.getValue().getSearchTerm());
    assertSame(expected, actual);
}
```

### UT-0089-02 — governed service failure becomes an empty response object
**Preconditions/input:** service throws `CylinderManagementApplicationException`. **Action:** call `getCities("Coimbatore")`. **Expected API result:** non-null empty response object rather than propagation of the governed application exception. **Persistence:** none.

Executable: `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`.
```java
@Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
    when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
        .thenThrow(mock(CylinderManagementApplicationException.class));
    assertNotNull(controller.getCities("Coimbatore"));
}
```

**Unit-test gap:** BL-004 does not directly exercise `CitySearchService` validation/mapping, blank-term boundary behavior, or DAO matching; those behaviors must not be inferred as unit-test executed coverage.

## Integration Test Story — BL-005
Real dependency: PostgreSQL 16 Testcontainer + Spring Data JPA `CityJpaDao`. This verifies database query semantics, not the complete MVC/service chain. Execution status: `NOT_EXECUTED`.

### IT-0089-01 — contains-ignore-case finds matching City and excludes no-match text
**Preconditions/data:** persist `Coimbatore_STORY0089` and `Madurai_STORY0089`. **Action:** query lowercase `coimbatore_story0089`, then `ZZZ_STORY0089`. **Expected database result:** first query returns exactly one matching row; second returns zero. **API/UI:** not exercised. **Persistence effect:** test setup inserts rows; search itself is read-only.

Executable: `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java#containsIgnoreCaseReturnsOnlyMatchingCities`.
```java
@Test void containsIgnoreCaseReturnsOnlyMatchingCities() {
    CityDo city = new CityDo(); city.setCityName("Coimbatore_STORY0089"); city.setDescription("Coimbatore");
    CityDo other = new CityDo(); other.setCityName("Madurai_STORY0089"); other.setDescription("Madurai");
    dao.saveAndFlush(city); dao.saveAndFlush(other);
    assertEquals(1, dao.findByCityNameContainingIgnoreCase("coimbatore_story0089").size());
    assertEquals(0, dao.findByCityNameContainingIgnoreCase("ZZZ_STORY0089").size());
}
```

**Boundary/duplicate note:** current governed integration code proves case-insensitive match and no-match only. Blank, wildcard-like text, multiple matching rows, duplicate City-name constraints, and full service mapping are not executed by this test and are not claimed as PASS.

## Test Data Story / executable mapping — BL-009
Mapped inputs: `Coimbatore` for success/delegation and governed-exception containment. The executable mapping mirrors the two controller cases. Execution status: `NOT_EXECUTED`.

### TD-0089-01 — successful City search mapping
**Input:** `Coimbatore`. **Expected:** exact request text delegated and exact mocked response returned. **Persistence:** none.

Executable: `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java#tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse`.
```java
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
```

### TD-0089-02 — governed failure mapping
**Input:** `Coimbatore`; mocked service throws governed application exception. **Expected:** non-null empty response object; no database side effect.

Executable: `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java#tc0089_02_governedServiceFailureReturnsEmptyResponseObject`.
```java
@Test
void tc0089_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
    CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
    when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
    assertNotNull(controller.getCities("Coimbatore"));
}
```

## Use-case / End-to-End Test Story
**Given** City reference rows exist and a caller has search text, **when** the caller invokes `GET /search/city/{searchText}`, **then** the controller builds the request, `CitySearchService` validates it, `CityJpaDao` performs case-insensitive contains lookup, matching `CityDo` rows are mapped to City DTOs, and a successful `CitySearchResponseDto` is returned. If a governed application exception reaches the REST controller, the controller returns an empty response DTO. The lookup itself performs no City write.

Code trace: `RestfulCityServices.getCities` -> `CitySearchService.searchWithText` -> `SearchRequestValidator.validate` -> `CityJpaDao.findByCityNameContainingIgnoreCase` -> `CityDo/public.tbl_city` -> mapper -> `CitySearchResponseDto`.

**E2E execution status:** `NOT_EXECUTED`. BL-009 controller-level mapping and BL-005 DAO Testcontainer coverage are separate artifacts; together they do not prove that a full deployed HTTP-to-database E2E test ran.

## Traceability
- BL-002: approved STORY-0089 contract and frozen-source SHA.
- BL-004: two controller unit cases above.
- BL-005: PostgreSQL/Testcontainers DAO search case above.
- BL-009: two executable test-data/controller mappings plus governed catalogue linkage.
- BL-011: this reviewer-readable, source-bound packet.

## Execution and coverage status
- BL-004 execution: `NOT_EXECUTED`.
- BL-005 execution: `NOT_EXECUTED`.
- BL-009 application/E2E execution: `NOT_EXECUTED`.
- JaCoCo/coverage: `NO_DURABLE_COVERAGE_EVIDENCE`; no percentage inferred.
- Packet rework is evidence-generation only and does not mutate application code.

## Policy validation
Validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`: identity/source/approval, business behavior/impact, preconditions/input/rules, positive/negative/boundary/duplicate applicability, API/UI/database outcomes, production code, BL-004/005/009 traceability, per-case adjacent executable code, execution separation and coverage separation are present. Known test gaps are stated rather than inferred.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
