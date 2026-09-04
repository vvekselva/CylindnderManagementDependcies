# BL-011 Human-Readable Test Packet — STORY-0129 Address Type Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0129.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Address Type save validates acceptable input and persists the reference value; rejected input must not produce unintended persistence.
- Unit: valid mapping/save plus source-bound invalid/null/duplicate/conflict/boundary paths; `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java`.
- Integration: MVC/service/persistence behavior and failure-state verification; `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0129.md` / `.csv`, 4 mapped rows.
- E2E: valid Address Type input becomes available after save; invalid/conflicting data follows governed failure behavior without unintended record creation. Catalogue `BL-009/stories/STORY-0129.md`; executable `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
```java
@PostMapping("/lookupManagement/addressType/save")
public ModelAndView saveAddressType(
        @RequestParam(value = "addressTypeId", required = false) Long addressTypeId,
        @RequestParam("addressType") String addressType,
        @RequestParam(value = "description", defaultValue = "") String description,
        RedirectAttributes ra) {
    AddressTypeDto dto = new AddressTypeDto();
    dto.setAddressTypeId(addressTypeId);
    dto.setAddressType(addressType.trim().toUpperCase());
    dto.setDescription(description.trim());
    AddressTypeIngestionRequestDto req = new AddressTypeIngestionRequestDto();
    req.setAddressTypeDto(dto);
    addressTypeIngestionService.processRequest(req);
    lookupDataCache.refreshAddressTypes();
    return new ModelAndView("redirect:/lookupManagement?tab=addressType");
}
```

## BL-004 Unit Test Cases
### createNormalizesDelegatesRefreshesAndRedirects

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java#createNormalizesDelegatesRefreshesAndRedirects`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent method contains the authoritative setup, mocks, fixtures and values.  
**Action:** Execute `createNormalizesDelegatesRefreshesAndRedirects()`.  
**Expected result:** The assertions in this method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void createNormalizesDelegatesRefreshesAndRedirects() throws Exception {
        RedirectAttributes ra = mock(RedirectAttributes.class);
        ModelAndView mav = controller.saveAddressType(null, " home ", " residence ", ra);
        ArgumentCaptor<AddressTypeIngestionRequestDto> cap = ArgumentCaptor.forClass(AddressTypeIngestionRequestDto.class);
        verify(service).processRequest(cap.capture());
        assertEquals("HOME", cap.getValue().getAddressTypeDto().getAddressType());
        assertEquals("residence", cap.getValue().getAddressTypeDto().getDescription());
        verify(cache).refreshAddressTypes();
        assertEquals("redirect:/lookupManagement?tab=addressType", mav.getViewName());
    }
```


## BL-005 Integration Test Cases
### successfulPostUsesPrgAndRefreshesAddressTypeCache

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java#successfulPostUsesPrgAndRefreshesAddressTypeCache`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent method contains the authoritative setup, mocks, fixtures and values.  
**Action:** Execute `successfulPostUsesPrgAndRefreshesAddressTypeCache()`.  
**Expected result:** The assertions in this method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void successfulPostUsesPrgAndRefreshesAddressTypeCache() throws Exception {
        mvc.perform(post("/lookupManagement/addressType/save").param("addressType", "home").param("description", "residence"))
            .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=addressType"));
        verify(cache).refreshAddressTypes();
    }
```


## BL-009 Test Data / Use-case Cases
### createCurrentContract

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java#createCurrentContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent method contains the authoritative setup, mocks, fixtures and values.  
**Action:** Execute `createCurrentContract()`.  
**Expected result:** The assertions in this method define the expected result.  
**Persistence / side effects:** Only effects explicitly verified by this code are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<AddressTypeIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"addressTypeIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveAddressType(null," home "," residence ",mock(RedirectAttributes.class)); ArgumentCaptor<AddressTypeIngestionRequestDto> a=ArgumentCaptor.forClass(AddressTypeIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("HOME",a.getValue().getAddressTypeDto().getAddressType()); verify(cache).refreshAddressTypes(); assertEquals("redirect:/lookupManagement?tab=addressType",m.getViewName()); }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
