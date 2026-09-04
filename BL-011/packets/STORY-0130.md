# BL-011 Human-Readable Test Packet — STORY-0130 Save Country

## Identity/source/governance
Source `BL-002/stories/STORY-0130.md` is `APPROVED_AFTER_REWORK` with explicit approval evidence. Approved source is `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`, 08:02 ZIP SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`. This fire's recovered 16:33 ZIP has the identical SHA, so production evidence is byte-equivalent. Known update/uniqueness drift remains approval-gated; no application mutation is authorized here.

## Business behavior, preconditions and rules
A Lookup Management operator creates/edits Country. Controller input is optional `countryId`, required `countryName`, required `description`. Country name is trimmed; description is trimmed and uppercased. Null/zero ID denotes create; nonzero denotes update. Service requires a nonblank country name, currently rejects any contains/ignore-case match, maps to `CountryDo`, and persists with `CountryJpaDao.saveAndFlush`. `public.tbl_country.country_name` is unique. On controller success only the Country cache refreshes and UI redirects to the Country tab. Controlled validation returns the Lookup Management view with failed Country data; unexpected failures redirect with an error flash.

Current drift: contains-based duplicate validation does not exclude the submitted ID, so same-row update and substring-distinct names can be falsely rejected. The packet characterizes this; it does not repair it.

## Production Code Evidence
**Path/component/method:** `cylindermanagement.web/.../LookupManagementController.java` — `LookupManagementController.saveCountry`
```java
public ModelAndView saveCountry(Long countryId, String description, String countryName, RedirectAttributes ra) {
    CountryDto countryDto = new CountryDto();
    countryDto.setCountryId(countryId);
    countryDto.setDescription(description.trim().toUpperCase());
    countryDto.setCountryName(countryName.trim());
    CountryIngestionRequestDto req = new CountryIngestionRequestDto();
    req.setCountryDto(countryDto);
    boolean isNew = (countryId == null || countryId == 0L);
    countryIngestionService.processRequest(req);
    lookupDataCache.refreshCountries();
    return new ModelAndView("redirect:/lookupManagement?tab=country");
}
```
**Path/component/method:** `cylindermanagement.custommapper.service/.../CountryIngestionService.java` — `processRequest`
```java
if (countryIngestionRequestDto == null || countryIngestionRequestDto.getCountryDto() == null
        || StringUtils.isBlank(countryIngestionRequestDto.getCountryDto().getCountryName())) {
    validationErrors.add(new ValidationErrorDto(CustomerServiceErrorCodes.REQUEST_NULL, null, null, null));
    InvalidInputParameterException.throwInputValidationFailure(new CountryIngestionRequestDto(),
            CylinderManagementServiceCode.COUNTRY_INGESTION_SERVICE, validationErrors);
} else if (!countryJpaDao.findByCountryNameContainingIgnoreCase(
        countryIngestionRequestDto.getCountryDto().getCountryName()).isEmpty()) {
    ValidationErrorDto e = new ValidationErrorDto(CustomerServiceErrorCodes.COUNTRY_ALREADY_EXISTS, null, null, null);
    validationErrors.add(e);
    countryIngestionRequestDto.addValidationErrorDto(e);
    InvalidInputParameterException.throwInputValidationFailure(countryIngestionRequestDto,
            CylinderManagementServiceCode.COUNTRY_INGESTION_SERVICE, validationErrors);
}
CountryDo entity = countryMapper.mapDtoToDo(countryIngestionRequestDto.getCountryDto());
```

## Unit Test Story — BL-004
### UT-0130-01 — current success contract
**Input:** null ID, `" description "`, `" India "`; mocked service/cache. **Expected UI/API:** `India`, `DESCRIPTION`, redirect Country tab. **Side effects:** service delegation/cache refresh only; DB not proved. **Execution:** `NOT_EXECUTED`.
```java
@Test void currentSuccessContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveCountry(null," description "," India ",mock(RedirectAttributes.class));
 ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName());
 assertEquals("DESCRIPTION",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries();
 assertEquals("redirect:/lookupManagement?tab=country",m.getViewName());
}
```
**UT gaps:** null/blank, exact duplicate, substring nonduplicate, same-row update, other-row duplicate update and persistence failure have no adjacent governed BL-004 executable methods; no PASS is inferred.

## Integration Test Story — BL-005
### IT-0130-01 — successful POST uses PRG
Standalone MockMvc binds the real controller but mocks the service. **Expected:** 3xx Country-tab redirect and cache refresh. **Persistence:** not proved. **Execution:** `NOT_EXECUTED`.
```java
@Test void successfulPostUsesPrg() throws Exception {
 mvc.perform(post("/lookupManagement/country/save").param("countryName","India").param("description","country"))
    .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=country"));
 verify(cache).refreshCountries();
}
```
**IT gaps:** no real database/Testcontainer, unique constraint, rollback/no-row, update identity or controlled-validation persistence-state verification exists in this governed BL-005 executable.

## Test Data Story — BL-009
### TD-0130-01 — normalized create mapping
**Input:** null ID, `country`, `India`. **Expected:** `India`, `COUNTRY`, delegation/cache refresh/redirect. **Execution:** `NOT_EXECUTED`; DB not proved because service is mocked.
```java
@Test void createCurrentContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveCountry(null," country "," India ",mock(RedirectAttributes.class));
 ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName());
 assertEquals("COUNTRY",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries();
 assertEquals("redirect:/lookupManagement?tab=country",m.getViewName());
}
```
The catalogue may describe additional negative/boundary/duplicate rows, but only the executable mapping above is claimed executable here.

## Use-case / End-to-End Story
### E2E-0130-01 — valid Country creation
Given valid Country form input, when saved, controller normalization -> `CountryIngestionService` validation -> `CountryMapper` -> `CountryJpaDao.saveAndFlush` -> `public.tbl_country` -> Country cache refresh -> redirect is the production path. Existing governed tests cover controller/MVC slices but **no single executable traverses real UI/service/database**, so E2E execution is `NOT_EXECUTED` and real-persistence E2E is a test gap.

### E2E-0130-02 — invalid/conflicting Country
Null/blank or current contains-match validation is source-proved before persistence. Expected business outcome is controlled validation and no unintended row. Existing governed executables do not prove database state. Same-row/substr conflict behavior is known drift, not desired future behavior.

## Drift/code-change gate
Exact remediation is restricted to the separately durable STORY-0130 drift manifest: exact normalized uniqueness, update-aware self exclusion, repository support and tests. Existing database uniqueness means no schema migration is required. `application_code_changed=false`; `bl010_created_or_executed=false`; explicit user approval is still required before implementation.

## Traceability / execution / coverage
BL-002 -> frozen production source -> BL-004 `Story0130CountrySaveUnitTest` -> BL-005 `Story0130CountrySaveMvcIntegrationTest` -> BL-009 `Story0130TestDataDrivenTest`/catalogue -> BL-011. All UT/IT/data/E2E execution: `NOT_EXECUTED`. Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`; no percentage inferred.

## Policy validation
Identity/approval/source, business behavior/impact, preconditions/input/rules, production code, each existing executable with adjacent code, expected UI/API/persistence boundaries, negative/boundary/duplicate gaps, E2E trace, BL-002/004/005/009 traceability, execution and coverage separation are present. Missing executable evidence is explicitly a gap.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
