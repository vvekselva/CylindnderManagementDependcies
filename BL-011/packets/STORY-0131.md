# BL-011 Human-Readable Test Packet — STORY-0131 State Save

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0131.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed State save validates acceptable input and persists the State reference record; rejected data must not create unintended state.
- Unit: source-bound valid save, invalid/null/empty, duplicate/conflict and boundary cases; `BL-004/generated-tests/STORY-0131/Story0131StateSaveUnitTest.java`.
- Integration: MVC/service/persistence save and failure-state behavior; `BL-005/generated-tests/STORY-0131/Story0131StateSaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0131.md` / `.csv`, 4 mapped rows.
- E2E: valid State input becomes persisted/available; invalid or conflicting data follows governed rejection without unintended persistence. Catalogue `BL-009/stories/STORY-0131.md`; executable `BL-009/generated-tests/STORY-0131/Story0131TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

```java
@PostMapping("/lookupManagement/state/save")
public ModelAndView saveState(
        @RequestParam(value = "stateId", required = false) Long stateId,
        @RequestParam("stateName") String stateName,
        @RequestParam("description") String description,
        RedirectAttributes ra) {
    StateDto dto = new StateDto();
    dto.setStateId(stateId);
    dto.setStateName(stateName.trim());
    dto.setDescription(description);
    StateIngestionRequestDto req = new StateIngestionRequestDto();
    req.setStateDto(dto);
    stateIngestionService.processRequest(req);
    lookupDataCache.refreshStates();
    return new ModelAndView("redirect:/lookupManagement?tab=state");
}
```

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0131/Story0131StateSaveUnitTest.java`

```java
import com.sreyas.datamatics.application.request.dto.StateIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0131StateSaveUnitTest {
 @Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class)); ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName()); verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName()); }
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0131/Story0131StateSaveMvcIntegrationTest.java`

```java
import org.junit.jupiter.api.BeforeEach; import org.junit.jupiter.api.Test; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.test.web.servlet.MockMvc; import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0131StateSaveMvcIntegrationTest { private MockMvc mvc; private LookupDataCache cache; @BeforeEach void setup(){LookupManagementController c=new LookupManagementController(); ReflectionTestUtils.setField(c,"stateIngestionService",mock(ICylinderManagementApplicationService.class)); cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"lookupDataCache",cache); mvc=MockMvcBuilders.standaloneSetup(c).build();} @Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/state/save").param("stateName","Tamil Nadu").param("description","state")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=state")); verify(cache).refreshStates();}}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0131/Story0131TestDataDrivenTest.java`

```java
import org.junit.jupiter.api.Test; import org.mockito.ArgumentCaptor; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.web.servlet.ModelAndView; import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.sreyas.datamatics.application.request.dto.StateIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0131TestDataDrivenTest { @Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class)); ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName()); verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName()); }}

```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence. Any documented current-source drift remains current behavior only and does not authorize BL-010 implementation.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
