# BL-011 Human-Readable Test Packet — STORY-0089 City Search

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source: `BL-002/stories/STORY-0089.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Business behavior: `GET /search/city/{searchText}` is a read-only City lookup.
- Unit: match/no-match/governed error and mapping behavior; executable `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java`.
- Integration: source-bound MVC/service/JPA read path; executable `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0089.md` / `.csv`, 3 mapped rows; stable City IDs/names, isolated cases.
- E2E: search text returns matching selectable City reference identities or governed empty/error outcome, with no City mutation. Catalogue `BL-009/stories/STORY-0089.md`; executable `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
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

## BL-004 Unit Test Cases
### delegatesExactSearchTextAndReturnsServiceResponse

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java#delegatesExactSearchTextAndReturnsServiceResponse`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code contains the authoritative setup and values.  
**Action:** Execute `delegatesExactSearchTextAndReturnsServiceResponse()`.  
**Expected result:** The assertions in this exact method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

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

### governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code contains the authoritative setup and values.  
**Action:** Execute `governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this exact method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
            .thenThrow(mock(CylinderManagementApplicationException.class));
        assertNotNull(controller.getCities("Coimbatore"));
    }
```


## BL-005 Integration Test Cases
### containsIgnoreCaseReturnsOnlyMatchingCities

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java#containsIgnoreCaseReturnsOnlyMatchingCities`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code contains the authoritative setup and values.  
**Action:** Execute `containsIgnoreCaseReturnsOnlyMatchingCities()`.  
**Expected result:** The assertions in this exact method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void containsIgnoreCaseReturnsOnlyMatchingCities() {
        CityDo city = new CityDo(); city.setCityName("Coimbatore_STORY0089"); city.setDescription("Coimbatore");
        CityDo other = new CityDo(); other.setCityName("Madurai_STORY0089"); other.setDescription("Madurai");
        dao.saveAndFlush(city); dao.saveAndFlush(other);
        assertEquals(1, dao.findByCityNameContainingIgnoreCase("coimbatore_story0089").size());
        assertEquals(0, dao.findByCityNameContainingIgnoreCase("ZZZ_STORY0089").size());
    }
```


## BL-009 Test Data / Use-case Cases
### tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java#tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code contains the authoritative setup and values.  
**Action:** Execute `tc0089_01_delegatesExactSearchTextAndReturnsServiceResponse()`.  
**Expected result:** The assertions in this exact method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

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

### tc0089_02_governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java#tc0089_02_governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code contains the authoritative setup and values.  
**Action:** Execute `tc0089_02_governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this exact method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    void tc0089_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(citySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
        assertNotNull(controller.getCities("Coimbatore"));
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
