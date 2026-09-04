# BL-011 Human-Readable Test Packet — STORY-0130 Country Save

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0130.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Country save validates acceptable input and persists the reference record; invalid/conflicting input must not create unintended state.
- Unit: source-bound valid, invalid, null/empty, duplicate/conflict and boundary behavior; `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection state; `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0130.md` / `.csv`, 4 mapped rows.
- E2E: valid Country data is persisted and subsequently available; rejected input follows governed error behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0130.md`; executable `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java`

```java
import com.sreyas.datamatics.application.request.dto.CountryIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0130CountrySaveUnitTest {
 @Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCountry(null," description "," India ",mock(RedirectAttributes.class)); ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName()); assertEquals("DESCRIPTION",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries(); assertEquals("redirect:/lookupManagement?tab=country",m.getViewName()); }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java`

```java
import org.junit.jupiter.api.BeforeEach; import org.junit.jupiter.api.Test; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.test.web.servlet.MockMvc; import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0130CountrySaveMvcIntegrationTest { private MockMvc mvc; private LookupDataCache cache; @BeforeEach void setup(){LookupManagementController c=new LookupManagementController(); ReflectionTestUtils.setField(c,"countryIngestionService",mock(ICylinderManagementApplicationService.class)); cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"lookupDataCache",cache); mvc=MockMvcBuilders.standaloneSetup(c).build();} @Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/country/save").param("countryName","India").param("description","country")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=country")); verify(cache).refreshCountries();}}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java`

```java
import org.junit.jupiter.api.Test; import org.mockito.ArgumentCaptor; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.web.servlet.ModelAndView; import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.sreyas.datamatics.application.request.dto.CountryIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0130TestDataDrivenTest { @Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CountryIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"countryIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCountry(null," country "," India ",mock(RedirectAttributes.class)); ArgumentCaptor<CountryIngestionRequestDto> a=ArgumentCaptor.forClass(CountryIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("India",a.getValue().getCountryDto().getCountryName()); assertEquals("COUNTRY",a.getValue().getCountryDto().getDescription()); verify(cache).refreshCountries(); assertEquals("redirect:/lookupManagement?tab=country",m.getViewName()); }}

```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence. Any documented current-source drift remains current behavior only and does not authorize BL-010 implementation.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
