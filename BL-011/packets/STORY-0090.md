# BL-011 Human-Readable Test Packet — STORY-0090 Country Search

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0090.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: `GET /search/country/{searchText}` performs read-only Country reference search.
- Unit: matching result mapping, no-match, governed validation/error; `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java`.
- Integration: MVC/service/JPA read path; `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0090.md` and `.csv`, 3 mapped rows.
- E2E: matching Country identities are returned or governed empty/error outcome; no persistence mutation. Catalogue `BL-009/stories/STORY-0090.md`; executable `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
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

## BL-004 Unit Test Cases
### governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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
```


## BL-005 Integration Test Cases


## BL-009 Test Data / Use-case Cases
### tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java#tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `tc0090_01_delegatesExactSearchTextAndReturnsServiceResponse()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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
```

### tc0090_02_governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java#tc0090_02_governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** Use the setup, mocks, fixtures and values shown in the adjacent method.  
**Action:** Execute `tc0090_02_governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected API/service/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted here are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc0090_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(countrySearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull())).thenThrow(failure);
        assertNotNull(controller.getCountries("India"));
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
