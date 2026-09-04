# BL-011 Human-Readable Test Packet — STORY-0087 Address Type Search

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
## Story and governed behavior
Source: `BL-002/stories/STORY-0087.md`; approval `APPROVED_AFTER_REWORK`; conformance `CODE_CONFORMANCE_VERIFIED_PASS`; frozen SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.

`GET /search/addresstype/{searchText}` is a read-only Address Type reference lookup. `RestfulAddressTypeServices.getAddressTypes` delegates through `AddressTypeSearchService`, validation and `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase`. Matching `AddressTypeDo` rows from `public.tbl_address_type` are mapped to the response. Application-service failure is converted to the governed empty response. No Address Type row is written.

## Preconditions and test data
Use an isolated synthetic Address Type matching a search fragment for the positive case; a fragment matching no row for the negative case; a governed validation/application-error condition for the error case; and different letter case/minimal source-valid text for contains-ignore-case/boundary verification. No standalone debounce/minimum-length/hidden-ID rule is invented.

## Production Code Evidence
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

## BL-004 Unit Test Cases
### governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0087/Story0087AddressTypeSearchUnitTest.java#governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** The mocks, fixtures, parameters and data in the adjacent method are the source-bound setup.  
**Action:** Execute `governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected service/API/UI/database result.  
**Persistence / side effects:** Only writes/interactions explicitly asserted by this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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
```


## BL-005 Integration Test Cases


## BL-009 Test Data / Use-case Cases
### tc0087_01_delegatesExactSearchTextAndReturnsServiceResponse

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java#tc0087_01_delegatesExactSearchTextAndReturnsServiceResponse`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** The mocks, fixtures, parameters and data in the adjacent method are the source-bound setup.  
**Action:** Execute `tc0087_01_delegatesExactSearchTextAndReturnsServiceResponse()`.  
**Expected result:** The assertions in this method define the expected service/API/UI/database result.  
**Persistence / side effects:** Only writes/interactions explicitly asserted by this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
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
```

### tc0087_02_governedServiceFailureReturnsEmptyResponseObject

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java#tc0087_02_governedServiceFailureReturnsEmptyResponseObject`  
**Business objective:** Verify the governed behavior represented by this exact executable case.  
**Preconditions / input:** The mocks, fixtures, parameters and data in the adjacent method are the source-bound setup.  
**Action:** Execute `tc0087_02_governedServiceFailureReturnsEmptyResponseObject()`.  
**Expected result:** The assertions in this method define the expected service/API/UI/database result.  
**Persistence / side effects:** Only writes/interactions explicitly asserted by this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
    @Test
    void tc0087_02_governedServiceFailureReturnsEmptyResponseObject() throws Exception {
        CylinderManagementApplicationException failure = mock(CylinderManagementApplicationException.class);
        when(addressTypeSearchService.searchWithText(any(CylinderManagementApplicationRequestDto.class), isNull()))
                .thenThrow(failure);

        assertNotNull(controller.getAddressTypes("HOME"));
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
