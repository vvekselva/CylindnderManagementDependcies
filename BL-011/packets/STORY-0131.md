# BL-011 Human-Readable Test Packet — STORY-0131 Save State

## Identity/source/governance
`BL-002/stories/STORY-0131.md` is `APPROVED_AFTER_REWORK` with explicit approval evidence. Approved source package SHA-256 is `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`; this fire recovered the 16:33 ZIP with the identical SHA, so source evidence is equivalent. Two source defects are governed by `BL-002/evidence/STORY-0131-state-save-drift-review-20260902.yaml`; application mutation remains unapproved.

## Business behavior and impact
A Lookup Management operator creates/edits State using optional `stateId`, required `stateName` and `description`. Controller trims state name, preserves description, delegates to `StateIngestionService`, refreshes State cache on success and redirects to State tab. Service validates request/state/name, checks duplicates, maps and `saveAndFlush`s to `public.tbl_state`.

Impact of current defects: invalid State input is thrown with a **CountryIngestionRequestDto**, so the controller's State-specific inline-validation branch may not receive the expected DTO; duplicate validation uses contains/ignore-case and does not exclude the current state ID, causing possible self-update and substring false positives. These are current behavior, not approved implementation changes.

## Production Code Evidence
**Controller:** `cylindermanagement.web/.../LookupManagementController.java#saveState`
```java
@PostMapping("/lookupManagement/state/save")
public ModelAndView saveState(Long stateId, String stateName, String description, RedirectAttributes ra) {
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
**Service:** `cylindermanagement.custommapper.service/.../StateIngestionService.java#processRequest`
```java
if (stateIngestionRequestDto == null || stateIngestionRequestDto.getStateDto() == null
        || StringUtils.isEmpty(stateIngestionRequestDto.getStateDto().getStateName())) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(CustomerServiceErrorCodes.REQUEST_NULL, null, null, null);
    validationErrors.add(validationErrorDto);
    // CURRENT DEFECT: wrong request DTO type for State validation
    InvalidInputParameterException.throwInputValidationFailure(new CountryIngestionRequestDto(),
            CylinderManagementServiceCode.STATE_INGESTION_SERVICE, validationErrors);
    InvalidInputParameterException.throwInputValidationFailure(null,
            CylinderManagementServiceCode.STATE_INGESTION_SERVICE, null);
} else if (!stateJpaDao.findByStateNameContainingIgnoreCase(
        stateIngestionRequestDto.getStateDto().getStateName()).isEmpty()) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(CustomerServiceErrorCodes.STATE_ALREADY_EXISTS, null, null, null);
    validationErrors.add(validationErrorDto);
    InvalidInputParameterException.throwInputValidationFailure(stateIngestionRequestDto,
            CylinderManagementServiceCode.STATE_INGESTION_SERVICE, validationErrors);
}
StateDo entity = stateMapper.mapDtoToDo(stateIngestionRequestDto.getStateDto());
StateDo saved = stateJpaDao.saveAndFlush(entity);
```

## Unit Test Story — BL-004
### UT-0131-01 — current successful controller contract
**Input:** null ID, `" Tamil Nadu "`, `state`; mocked service/cache. **Expected:** trimmed `Tamil Nadu`, service called, State cache refreshed, State-tab redirect. **Persistence:** not proved. **Execution:** `NOT_EXECUTED`.
```java
@Test void currentSuccessContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class));
 ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName());
 verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName());
}
```
**UT gaps:** wrong-DTO validation defect, null/empty, exact duplicate, substring nonduplicate, same-row update, other-row duplicate update and persistence behavior have no governed BL-004 executable case.

## Integration Test Story — BL-005
### IT-0131-01 — successful POST PRG
Real MVC binding/controller; mocked service/cache. **Expected:** 3xx State-tab redirect, cache refresh. **Database:** not exercised. **Execution:** `NOT_EXECUTED`.
```java
@Test void successfulPostUsesPrg() throws Exception {
 mvc.perform(post("/lookupManagement/state/save").param("stateName","Tamil Nadu").param("description","state"))
    .andExpect(status().is3xxRedirection()).andExpect(redirectedUrl("/lookupManagement?tab=state"));
 verify(cache).refreshStates();
}
```
**IT gaps:** no real service/database/Testcontainer; therefore no proof of `tbl_state`, uniqueness, no-row-on-validation, or the wrong-DTO inline-validation UI effect.

## Test Data Story — BL-009
### TD-0131-01 — current create mapping
**Input:** null ID, `Tamil Nadu`, `state`. **Expected:** trimmed name, service delegation, cache refresh and redirect. **Execution:** `NOT_EXECUTED`; persistence not proved.
```java
@Test void createCurrentContract() throws Exception {
 LookupManagementController c=new LookupManagementController();
 ICylinderManagementApplicationService<StateIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
 LookupDataCache cache=mock(LookupDataCache.class);
 ReflectionTestUtils.setField(c,"stateIngestionService",s); ReflectionTestUtils.setField(c,"lookupDataCache",cache);
 ModelAndView m=c.saveState(null," Tamil Nadu ","state",mock(RedirectAttributes.class));
 ArgumentCaptor<StateIngestionRequestDto> a=ArgumentCaptor.forClass(StateIngestionRequestDto.class);
 verify(s).processRequest(a.capture()); assertEquals("Tamil Nadu",a.getValue().getStateDto().getStateName());
 verify(cache).refreshStates(); assertEquals("redirect:/lookupManagement?tab=state",m.getViewName());
}
```
Negative/boundary/duplicate catalogue intent is not claimed executable where no adjacent governed method exists.

## Use-case / End-to-End Story
### E2E-0131-01 — valid State save
Given valid State input, production path is Lookup Management form -> controller normalization -> `StateIngestionService` -> duplicate check -> `StateMapper` -> `StateJpaDao.saveAndFlush` -> `public.tbl_state` -> State cache refresh -> redirect. Existing tests cover controller/MVC slices only. Full real-database/browser execution: `NOT_EXECUTED`; executable E2E gap recorded.

### E2E-0131-02 — invalid State
Expected desired UI behavior is inline State validation with no persistence. Current source instead supplies `CountryIngestionRequestDto` on the first validation throw, which conflicts with the controller's expected State DTO branch. This is **SOURCE_DRIFT_CHARACTERIZED / NOT_FIXED / NOT_EXECUTED**.

### E2E-0131-03 — duplicate/update conflict
Current contains-based check can reject substring-distinct values and same-row update. Database has exact unique `state_name`; no schema change is needed for proposed correction. This remains approval-gated and unexecuted.

## Exact drift/code-change governance
Current vs target and exact locations are already durable in `BL-002/evidence/STORY-0131-state-save-drift-review-20260902.yaml`: State service validation DTO correction; update-aware exact uniqueness in service/repository; regression tests. Business impact is inline validation reliability and correct update/uniqueness behavior. DB impact: no migration expected. **No application code or BL-010 change was made.** Any manifest expansion requires new approval.

## Traceability/status
BL-002 -> byte-identical frozen source -> BL-004 `Story0131StateSaveUnitTest` -> BL-005 `Story0131StateSaveMvcIntegrationTest` -> BL-009 `Story0131TestDataDrivenTest`/catalogue -> BL-011. UT/IT/data/E2E: `NOT_EXECUTED`. Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`, not inferred.

## Policy validation
Reviewer-readable business behavior, preconditions/input, source code, each existing test case with immediately adjacent executable code, UI/API/persistence expectations, negative/boundary/duplicate gaps, explicit source drift, E2E trace, BL-002/004/005/009 linkage and execution/coverage separation are present.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
