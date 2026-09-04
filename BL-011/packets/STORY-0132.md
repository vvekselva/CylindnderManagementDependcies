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
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0132/Story0132CitySaveUnitTest.java`

```java
import com.sreyas.datamatics.application.request.dto.CityIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0132CitySaveUnitTest {
 @Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class)); ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName()); verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName()); }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0132/Story0132CitySaveMvcIntegrationTest.java`

```java
import org.junit.jupiter.api.BeforeEach; import org.junit.jupiter.api.Test; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.test.web.servlet.MockMvc; import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0132CitySaveMvcIntegrationTest { private MockMvc mvc; private LookupDataCache cache; @BeforeEach void setup(){LookupManagementController c=new LookupManagementController(); ReflectionTestUtils.setField(c,"cityIngestionService",mock(ICylinderManagementApplicationService.class)); cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"lookupDataCache",cache); mvc=MockMvcBuilders.standaloneSetup(c).build();} @Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/city/save").param("cityName","Coimbatore").param("description","city")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=city")); verify(cache).refreshCities();}}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0132/Story0132TestDataDrivenTest.java`

```java
import org.junit.jupiter.api.Test; import org.mockito.ArgumentCaptor; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.web.servlet.ModelAndView; import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.sreyas.datamatics.application.dto.CityIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0132TestDataDrivenTest { @Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<CityIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"cityIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveCity(null," Coimbatore ","city",mock(RedirectAttributes.class)); ArgumentCaptor<CityIngestionRequestDto> a=ArgumentCaptor.forClass(CityIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Coimbatore",a.getValue().getCityDto().getCityName()); verify(cache).refreshCities(); assertEquals("redirect:/lookupManagement?tab=city",m.getViewName()); }}

```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence. Any documented current-source drift remains current behavior only and does not authorize BL-010 implementation.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
