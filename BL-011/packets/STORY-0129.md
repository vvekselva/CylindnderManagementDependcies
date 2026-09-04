# BL-011 Human-Readable Test Packet — STORY-0129 Address Type Save

## Rework state
Reworked under the BL-011 code-required policy.

## Reviewer-readable business/test narrative
- Source `BL-002/stories/STORY-0129.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Address Type save validates acceptable input and persists the reference value; rejected input must not produce unintended persistence.
- Unit: valid mapping/save plus source-bound invalid/null/duplicate/conflict/boundary paths; `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java`.
- Integration: MVC/service/persistence behavior and failure-state verification; `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0129.md` / `.csv`, 4 mapped rows.
- E2E: valid Address Type input becomes available after save; invalid/conflicting data follows governed failure behavior without unintended record creation. Catalogue `BL-009/stories/STORY-0129.md`; executable `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java`

```java
    }

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
}

```

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java`

```java
        mvc = MockMvcBuilders.standaloneSetup(c).build();
    }
    @Test void successfulPostUsesPrgAndRefreshesAddressTypeCache() throws Exception {
        mvc.perform(post("/lookupManagement/addressType/save").param("addressType", "home").param("description", "residence"))
            .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=addressType"));
        verify(cache).refreshAddressTypes();
    }
}

```

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java`

```java
import org.junit.jupiter.api.Test; import org.mockito.ArgumentCaptor; import org.springframework.test.util.ReflectionTestUtils; import org.springframework.web.servlet.ModelAndView; import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.sreyas.datamatics.application.request.dto.AddressTypeIngestionRequestDto; import com.sreyas.datamatics.application.service.ICylinderManagementApplicationService; import com.sreyas.datamatics.cylindermanagement.misc.cache.LookupDataCache;
class Story0129TestDataDrivenTest { @Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<AddressTypeIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"addressTypeIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveAddressType(null," home "," residence ",mock(RedirectAttributes.class)); ArgumentCaptor<AddressTypeIngestionRequestDto> a=ArgumentCaptor.forClass(AddressTypeIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("HOME",a.getValue().getAddressTypeDto().getAddressType()); verify(cache).refreshAddressTypes(); assertEquals("redirect:/lookupManagement?tab=addressType",m.getViewName()); }}

```

## Code-path trace
BL-002 -> frozen production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet/code rework: `COMPLETE`; unit/integration/application execution: `NOT EXECUTED`; durable coverage evidence: `NONE`; coverage percentage: `NOT INFERRED`.

## BL-011 validation
Validated against the code-required README and policy. Inline production, unit, integration and BL-009 code is present and remains separate from execution evidence. Any documented current-source drift remains current behavior only and does not authorize BL-010 implementation.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
