# BL-011 Human-Readable Test Packet — STORY-0131 State Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
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

## BL-004 Unit Test Cases
### currentSuccessContract

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0131/Story0131StateSaveUnitTest.java#currentSuccessContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `currentSuccessContract()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void currentSuccessContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class)); ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName()); verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName()); }
```


## BL-005 Integration Test Cases
### successfulPostUsesPrg

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0131/Story0131StateSaveMvcIntegrationTest.java#successfulPostUsesPrg`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `successfulPostUsesPrg()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void successfulPostUsesPrg() throws Exception {mvc.perform(post("/lookupManagement/state/save").param("stateName","Tamil Nadu").param("description","state")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=state")); verify(cache).refreshStates();}
```


## BL-009 Test Data / Use-case Cases
### createCurrentContract

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0131/Story0131TestDataDrivenTest.java#createCurrentContract`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The setup, mocks, fixtures and values are shown in the adjacent code.  
**Action:** Execute `createCurrentContract()`.  
**Expected result:** The assertions in this exact method define the expected service/API/UI/database outcome.  
**Persistence / side effects:** Only effects explicitly asserted in this method are claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test void createCurrentContract() throws Exception { LookupManagementController c=new LookupManagementController(); ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class); LookupDataCache cache=mock(LookupDataCache.class); ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache); ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class)); ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class); verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName()); verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName()); }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has its own adjacent code block.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
