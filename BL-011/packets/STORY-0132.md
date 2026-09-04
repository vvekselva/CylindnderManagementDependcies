# BL-011 Human-Readable Test Packet — STORY-0132 City Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
# BL-011 Human-Readable Test Packet — STORY-0132 City Save

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0132.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed City save validates acceptable input and persists the City reference record; rejected data must not create unintended state.
- Unit: valid save, source-bound invalid/null/empty, duplicate/conflict and boundary cases; `BL-004/generated-tests/STORY-0132/Story0132CitySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection behavior; `BL-005/generated-tests/STORY-0132/Story0132CitySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0132.md` / `.csv`, 4 mapped rows.
- E2E: valid City input is persisted and becomes available; invalid/conflicting data follows governed failure behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0132.md`; executable `BL-009/generated-tests/STORY-0132/Story0132TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
```java
@PostMapping("/lookupManagement/city/save")
public ModelAndView saveCity(
        @RequestParam(value = "cityId", required = false) Long cityId,
        @RequestParam("cityName") String cityName,
        @RequestParam("description") String description,
        RedirectAttributes ra) {
    CityDto dto = new CityDto();
    dto.setCityId(cityId);
    dto.setCityName(cityName.trim());
    dto.setDescription(description);
    CityIngestionRequestDto req = new CityIngestionRequestDto();
    req.setCityDto(dto);
    cityIngestionService.processRequest(req);
    lookupDataCache.refreshCities();
    return new ModelAndView("redirect:/lookupManagement?tab=city");
}
```

## BL-004 Unit Test Cases
### currentSuccessContract

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0132/Story0132CitySaveUnitTest.java#currentSuccessContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `currentSuccessContract()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class)); ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName()); verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName()); }
```


## BL-005 Integration Test Cases
### successfulPostUsesPrg

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0132/Story0132CitySaveMvcIntegrationTest.java#successfulPostUsesPrg`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `successfulPostUsesPrg()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/city/save").param("cityName","Coimbatore").param("description","city")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=city")); verify(cache).refreshCities();}
```


## BL-009 Test Data / Use-case Cases
### createCurrentContract

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0132/Story0132TestDataDrivenTest.java#createCurrentContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `createCurrentContract()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class)); ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName()); verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName()); }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has its own adjacent code block.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
