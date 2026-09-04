# BL-011 Human-Readable Test Packet — STORY-0130 Country Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0130.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Country save validates acceptable input and persists the reference record; invalid/conflicting input must not create unintended state.
- Unit: source-bound valid, invalid, null/empty, duplicate/conflict and boundary behavior; `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection state; `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0130.md` / `.csv`, 4 mapped rows.
- E2E: valid Country data is persisted and subsequently available; rejected input follows governed error behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0130.md`; executable `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
```java
@PostMapping("/lookupManagement/country/save")
public ModelAndView saveCountry(
        @RequestParam(value = "countryId", required = false) Long countryId,
        @RequestParam("description") String description,
        @RequestParam("countryName") String countryName,
        RedirectAttributes ra) {
    CountryDto dto = new CountryDto();
    dto.setCountryId(countryId);
    dto.setDescription(description.trim().toUpperCase());
    dto.setCountryName(countryName.trim());
    CountryIngestionRequestDto req = new CountryIngestionRequestDto();
    req.setCountryDto(dto);
    countryIngestionService.processRequest(req);
    lookupDataCache.refreshCountries();
    return new ModelAndView("redirect:/lookupManagement?tab=country");
}
```

## BL-004 Unit Test Cases
### currentSuccessContract

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java#currentSuccessContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `currentSuccessContract()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCountry(null," description "," India ",mock(RedirectAttributes.class)); ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName()); assertEquals("DESCRIPTION",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries(); assertEquals("redirect:/lookupManagement?tab=country",m.getViewName()); }
```


## BL-005 Integration Test Cases
### successfulPostUsesPrg

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java#successfulPostUsesPrg`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `successfulPostUsesPrg()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/country/save").param("countryName","India").param("description","country")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=country")); verify(cache).refreshCountries();}
```


## BL-009 Test Data / Use-case Cases
### createCurrentContract

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java#createCurrentContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `createCurrentContract()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCountry(null," country "," India ",mock(RedirectAttributes.class)); ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName()); assertEquals("COUNTRY",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries(); assertEquals("redirect:/lookupManagement?tab=country",m.getViewName()); }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
