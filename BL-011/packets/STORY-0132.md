# BL-011 Human-Readable Test Packet — STORY-0132 Save City

## Identity/source/governance
`BL-002/stories/STORY-0132.md` is `APPROVED_AFTER_REWORK`. Approved source SHA-256 is `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`; the recovered 16:33 ZIP in this fire has the same SHA. Source defects remain governed by `BL-002/evidence/STORY-0132-city-save-drift-review-20260902.yaml`; no application mutation is authorized.

## Business behavior and impact
Lookup Management accepts optional `cityId`, required `cityName` and `description`. Controller trims city name, preserves description, delegates to City ingestion, refreshes City cache and redirects on success. Service validates, checks duplicates, maps to `CityDo`, and `saveAndFlush`s into `public.tbl_city`.

Current defects: null/blank City validation throws a **CountryIngestionRequestDto**, conflicting with the controller's City-specific inline-validation expectation; contains/ignore-case duplicate checking does not exclude current city ID, so same-row update and substring-distinct names can be falsely rejected. These are explicitly current behavior.

## Production Code Evidence
**Controller:** `cylindermanagement.web/.../LookupManagementController.java#saveCity`
```java
@PostMapping("/lookupManagement/city/save")
public ModelAndView saveCity(Long cityId, String cityName, String description, RedirectAttributes ra) {
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
**Service:** `cylindermanagement.custommapper.service/.../CityIngestionService.java#processRequest`
```java
if (cityIngestionRequestDto == null || cityIngestionRequestDto.getCityDto() == null
        || StringUtils.isEmpty(cityIngestionRequestDto.getCityDto().getCityName())) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(CustomerServiceErrorCodes.REQUEST_NULL, null, null, null);
    validationErrors.add(validationErrorDto);
    // CURRENT DEFECT: wrong request DTO type
    InvalidInputParameterException.throwInputValidationFailure(new CountryIngestionRequestDto(),
            CylinderManagementServiceCode.CITY_INGESTION_SERVICE, validationErrors);
    InvalidInputParameterException.throwInputValidationFailure(null,
            CylinderManagementServiceCode.CITY_INGESTION_SERVICE, null);
} else if (!cityJpaDao.findByCityNameContainingIgnoreCase(cityIngestionRequestDto.getCityDto().getCityName()).isEmpty()) {
    ValidationErrorDto e = new ValidationErrorDto(CustomerServiceErrorCodes.CITY_ALREADY_EXISTS, null, null, null);
    validationErrors.add(e);
    InvalidInputParameterException.throwInputValidationFailure(cityIngestionRequestDto,
            CylinderManagementServiceCode.CITY_INGESTION_SERVICE, validationErrors);
}
CityDo entity = cityMapper.mapDtoToDo(cityIngestionRequestDto.getCityDto());
CityDo saved = cityJpaDao.saveAndFlush(entity);
```

## Unit Test Story — BL-004
### UT-0132-01 — current success controller contract
**Input:** null ID, `" Coimbatore "`, `city`; service/cache mocked. **Expected:** trimmed `Coimbatore`, delegation, City cache refresh, City-tab redirect. **Persistence:** not proved. **Execution:** `NOT_EXECUTED`.
```java
@Test void currentSuccessContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class));
 ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName());
 verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName());
}
```
**UT gaps:** null/blank wrong-DTO defect, exact duplicate, substring nonduplicate, same-row update, other-row update conflict and real persistence are not executable-covered by BL-004.

## Integration Test Story — BL-005
### IT-0132-01 — successful POST PRG
Standalone MVC with mocked service/cache. **Expected:** 3xx City-tab redirect and cache refresh. **Database:** not exercised. **Execution:** `NOT_EXECUTED`.
```java
@Test void successfulPostUsesPrg() throws Exception {
 mvc.perform(post("/lookupManagement/city/save").param("cityName","Coimbatore").param("description","city"))
    .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=city"));
 verify(cache).refreshCities();
}
```
**IT gaps:** no Testcontainer/real DB, uniqueness/no-row failure verification, update identity or City-specific inline-validation behavior.

## Test Data Story — BL-009
### TD-0132-01 — create-current-contract executable mapping
The governed BL-009 source contains the following case, intended to use null ID, `Coimbatore`, `city` and assert controller mapping/redirect. **Execution:** `NOT_EXECUTED`.
```java
@Test void createCurrentContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class));
 ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName());
 verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName());
}
```
**Important executable defect:** the actual governed BL-009 file imports `com.sreyas.datamatics.application.dto.CityIngestionRequestDto`, while BL-004 and production use `com.sreyas.datamatics.application.request.dto.CityIngestionRequestDto`. Therefore BL-009 compilation/execution is **NOT_PROVED and likely source-inconsistent** until compilation evidence or correction exists. This packet does not silently fix the test source.

## Use-case / End-to-End Story
### E2E-0132-01 — valid City save
Production path: form -> controller -> `CityIngestionService` -> duplicate query -> `CityMapper` -> `CityJpaDao.saveAndFlush` -> `public.tbl_city` -> cache refresh -> redirect. Existing governed tests are slices; no browser-to-real-database executable exists. `NOT_EXECUTED`.

### E2E-0132-02 — invalid City
Desired outcome: City-specific inline validation and no persistence. Current source sends Country request DTO in the first validation throw; `SOURCE_DRIFT_CHARACTERIZED`, not fixed or executed.

### E2E-0132-03 — duplicate/update
Current contains check can reject self-update/substrings. Database already has exact unique City column. Proposed correction remains approval-gated; no schema migration is expected.

## Drift and test-code governance
Application drift exact locations/current-vs-target/business impact/tests/DB impact remain in the durable STORY-0132 drift review packet. BL-009's incorrect import is a **test artifact conformance gap**, not application-code authorization. No application code and no BL-010 implementation were changed. Any application manifest expansion requires explicit approval.

## Traceability / execution / coverage
BL-002 -> byte-identical frozen source -> BL-004 `Story0132CitySaveUnitTest` -> BL-005 `Story0132CitySaveMvcIntegrationTest` -> BL-009 `Story0132TestDataDrivenTest`/catalogue -> BL-011. UT/IT/E2E execution `NOT_EXECUTED`; BL-009 execution `NOT_EXECUTED / SOURCE_CONFORMANCE_GAP`. Coverage `NO_DURABLE_COVERAGE_EVIDENCE`; no inference.

## Policy validation
Required reviewer narrative, source evidence, per-existing-case adjacent code, expected UI/API/persistence boundaries, negative/boundary/duplicate gaps, drift, test-source defect, E2E trace and BL-002/004/005/009 traceability are explicit. Execution and coverage remain separate.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
