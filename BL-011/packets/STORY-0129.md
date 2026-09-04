# BL-011 Human-Readable Test Packet — STORY-0129 Save Address Type

## Identity, approval, source and conformance
- Source Story: `BL-002/stories/STORY-0129.md` — `APPROVED_AFTER_REWORK`; explicit approval evidence `BL-002/approval-evidence/STORY-0129-approval-20260902.md`.
- Approved frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`, package `Harinandhan-Cylinder-Backup(20260902-080237).zip`, SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.
- This fire recovered `Harinandhan-Cylinder-Backup(20260902-163304).zip`; its SHA-256 is the same `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`, so production excerpts below are source-equivalent to the approved package.
- Conformance: approved current behavior is source-proved. A known update/uniqueness drift remains separately approval-gated in `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml`; BL-011 does not authorize that application mutation.

## Business behavior
An operator creates or edits an Address Type through `POST /lookupManagement/addressType/save`. The controller trims and uppercases the address type, trims description, carries optional `addressTypeId`, delegates to `AddressTypeIngestionService`, refreshes only the Address Type cache on success, and redirects back to the Address Type tab. The service rejects null/blank input and currently rejects any nonempty `findByAddressTypeContainingIgnoreCase` result before mapping and `saveAndFlush`.

Business impact: successful saves make the classification persistently available to lookup consumers. Controlled validation must not create unintended rows. The existing type-ahead helps detect likely duplicates, but the authoritative service currently has a defect: same-row updates and substring-distinct values can be falsely rejected as duplicates. That defect is characterized, not silently corrected.

## Preconditions, inputs and rules
- Actor: Lookup Management operator.
- Create: `addressTypeId` null/zero. Update: nonzero ID.
- Required business input: nonblank address type. Description defaults to empty text at the controller.
- Normalization: address type -> trimmed uppercase; description -> trimmed.
- Current duplicate rule: any contains/ignore-case repository match is rejected. This is current-state behavior, not the approved remediation target.
- Persistence: `AddressTypeMapper` -> `AddressTypeDo` -> `AddressTypeJpaDao.saveAndFlush` -> `public.tbl_address_type`.
- Persistence exceptions are converted by the service to FAILURE response; successful save returns SUCCESS.

## Production Code Evidence
**Repository/source:** recovered byte-identical application package.  
**Path:** `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/LookupManagementController.java`  
**Component/method:** `LookupManagementController.saveAddressType`
```java
@PostMapping("/lookupManagement/addressType/save")
public ModelAndView saveAddressType(@RequestParam(value = "addressTypeId", required = false) Long addressTypeId,
        @RequestParam("addressType") String addressType,
        @RequestParam(value = "description", defaultValue = "") String description, RedirectAttributes ra) {
    AddressTypeDto addressTypeDto = new AddressTypeDto();
    addressTypeDto.setAddressTypeId(addressTypeId);
    addressTypeDto.setAddressType(addressType.trim().toUpperCase());
    addressTypeDto.setDescription(description.trim());
    AddressTypeIngestionRequestDto req = new AddressTypeIngestionRequestDto();
    req.setAddressTypeDto(addressTypeDto);
    boolean isNew = (addressTypeId == null || addressTypeId == 0L);
    addressTypeIngestionService.processRequest(req);
    lookupDataCache.refreshAddressTypes();
    ra.addFlashAttribute("successMessage",
        isNew ? "Address type \"" + addressTypeDto.getAddressType() + "\" added successfully."
              : "Address type \"" + addressTypeDto.getAddressType() + "\" updated successfully.");
    return new ModelAndView("redirect:/lookupManagement?tab=addressType");
}
```

**Path:** `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/AddressTypeIngestionService.java`  
**Component/method:** `AddressTypeIngestionService.processRequest`
```java
if (addressTypeIngestionRequestDto == null || addressTypeIngestionRequestDto.getAddressTypeDto() == null
        || StringUtils.isBlank(addressTypeIngestionRequestDto.getAddressTypeDto().getAddressType())) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(CustomerServiceErrorCodes.REQUEST_NULL, null, null, null);
    validationErrors.add(validationErrorDto);
    InvalidInputParameterException.throwInputValidationFailure(new AddressTypeIngestionRequestDto(),
            CylinderManagementServiceCode.ADDRESS_TYPE_INGESTION_SERVICE, validationErrors);
} else if (!addressTypeRepository.findByAddressTypeContainingIgnoreCase(
        addressTypeIngestionRequestDto.getAddressTypeDto().getAddressType()).isEmpty()) {
    ValidationErrorDto validationErrorDto = new ValidationErrorDto(
            CustomerServiceErrorCodes.ADDRESS_TYPE_ALREADY_EXISTS, null, null, null);
    validationErrors.add(validationErrorDto);
    addressTypeIngestionRequestDto.addValidationErrorDto(validationErrorDto);
    InvalidInputParameterException.throwInputValidationFailure(addressTypeIngestionRequestDto,
            CylinderManagementServiceCode.ADDRESS_TYPE_INGESTION_SERVICE, validationErrors);
}
AddressTypeDo addressTypeDo = addressTypeMapper.mapDtoToDo(addressTypeIngestionRequestDto.getAddressTypeDto());
try {
    addressTypeRepository.saveAndFlush(addressTypeDo);
    responseDto.setResponseCode(CylinderManagementApplicationResponseCode.SUCCESS.ordinal());
} catch (Exception exception) {
    responseDto.setResponseCode(CylinderManagementApplicationResponseCode.FAILURE.ordinal());
}
```

## Unit Test Story — BL-004
### UT-0129-01 — create normalizes, delegates, refreshes and redirects
**Objective:** prove controller create mapping and observable success-side effects.  
**Preconditions/input:** new row (`addressTypeId=null`), `" home "`, `" residence "`; service/cache mocked.  
**Action:** call controller method.  
**Expected API/UI:** request passed as `HOME` / `residence`; redirect `/lookupManagement?tab=addressType`.  
**Expected persistence/side effects:** service invoked once and cache refreshed; this controller unit test does not prove a database write.  
**Executable:** `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java#createNormalizesDelegatesRefreshesAndRedirects`.  
**Execution:** `NOT_EXECUTED`.
```java
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
```

### UT gap — negative/boundary/duplicate/update behavior
The governed BL-004 executable currently contains only UT-0129-01. Null/blank input, exact duplicate, substring nonduplicate, same-row update, other-row duplicate update, and repository failure are **not executable-covered by this BL-004 file**. These are explicit test gaps; they are not inferred PASS. The update/uniqueness cases are also tied to the separately approval-gated drift manifest and must characterize current behavior until code-change approval exists.

## Integration Test Story — BL-005
### IT-0129-01 — successful POST uses PRG and refreshes cache
**Objective:** exercise the Spring MVC endpoint binding and redirect contract with the application service mocked.  
**Preconditions/input:** standalone `MockMvc`; mocked ingestion service/cache; `addressType=home`, `description=residence`.  
**Action:** POST to `/lookupManagement/addressType/save`.  
**Expected API/UI:** 3xx redirect to `/lookupManagement?tab=addressType`.  
**Expected persistence:** none proved: service is mocked and no real database/Testcontainer participates.  
**Executable:** `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java#successfulPostUsesPrgAndRefreshesAddressTypeCache`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void successfulPostUsesPrgAndRefreshesAddressTypeCache() throws Exception {
    mvc.perform(post("/lookupManagement/addressType/save")
            .param("addressType", "home").param("description", "residence"))
       .andExpect(status().is3xxRedirection())
       .andExpect(redirectedUrl("/lookupManagement?tab=addressType"));
    verify(cache).refreshAddressTypes();
}
```

### IT gap — real persistence and failure-state verification
The current BL-005 executable is MVC integration with mocked service, not database integration. It does **not** prove `saveAndFlush`, unique constraint behavior, rollback/no-row behavior for validation, update identity handling, or repository failure. Those remain integration-test gaps and execution remains NOT_EXECUTED.

## Test Data Story / BL-009 executable mapping
Governed data intent includes create plus negative/duplicate/boundary/update scenarios, but the available BL-009 executable maps only the current create contract below. No additional row is claimed executable without adjacent governed code.

### TD-0129-01 — normalized create contract
**Input:** null ID, `" home "`, `" residence "`.  
**Expected:** normalized `HOME`, service delegation, Address Type cache refresh and PRG redirect.  
**Persistence expectation:** a valid service implementation would persist after validation; this executable mocks the service, so persistence is not proven.  
**Executable:** `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java#createCurrentContract`.  
**Execution:** `NOT_EXECUTED`.
```java
@Test void createCurrentContract() throws Exception {
    LookupManagementController c=new LookupManagementController();
    ICylinderManagementApplicationService<AddressTypeIngestionRequestDto,?> s=mock(ICylinderManagementApplicationService.class);
    LookupDataCache cache=mock(LookupDataCache.class);
    ReflectionTestUtils.setField(c,"addressTypeIngestionService",s);
    ReflectionTestUtils.setField(c,"lookupDataCache",cache);
    ModelAndView m=c.saveAddressType(null," home "," residence ",mock(RedirectAttributes.class));
    ArgumentCaptor<AddressTypeIngestionRequestDto> a=ArgumentCaptor.forClass(AddressTypeIngestionRequestDto.class);
    verify(s).processRequest(a.capture());
    assertEquals("HOME",a.getValue().getAddressTypeDto().getAddressType());
    verify(cache).refreshAddressTypes();
    assertEquals("redirect:/lookupManagement?tab=addressType",m.getViewName());
}
```

## Use-case / End-to-End Test Story
### E2E-0129-01 — operator creates a valid Address Type
**Given** an operator is on Lookup Management and supplies a new nonblank Address Type, **when** the form posts the save endpoint, **then** the controller normalizes the values, the service validates and maps them, `AddressTypeJpaDao.saveAndFlush` is the production persistence path, the Address Type cache refreshes, and the UI returns to the Address Type tab.

**Code path trace:** `LookupManagement.html` -> `LookupManagementController.saveAddressType` -> `AddressTypeIngestionService.processRequest` -> `AddressTypeMapper` -> `AddressTypeJpaDao.saveAndFlush` -> `public.tbl_address_type` -> `LookupDataCache.refreshAddressTypes` -> redirect.  
**Executable evidence:** BL-004/BL-005/BL-009 snippets above cover controller mapping/PRG only; there is no single governed executable that traverses the complete browser-to-real-database path.  
**Execution:** `NOT_EXECUTED`; **E2E completeness:** `EXECUTABLE_GAP_REAL_DATABASE_AND_BROWSER_FLOW`.

### E2E-0129-02 — invalid or conflicting input does not create unintended state
Production source proves null/blank and contains-match validation branches occur before mapping/save. The intended reviewer scenario is no unintended row plus same-tab controlled validation. Current governed executables do not prove the complete failure flow or database state. Exact duplicate/update semantics are additionally affected by the known drift.  
**Execution:** `NOT_EXECUTED`; **status:** `TEST_GAP_AND_DRIFT_CHARACTERIZED`.

## Duplicate/conflict/boundary governance and drift review
Current behavior uses `findByAddressTypeContainingIgnoreCase` and does not exclude the submitted ID. Approved target behavior is exact normalized business-key uniqueness, excluding the current row on update while preserving contains-search for type-ahead suggestions. Proposed locations are limited to `AddressTypeIngestionService.processRequest`, `AddressTypeJpaDao` exact lookup support, service tests, and Lookup Management regression tests. Database schema change is not required because `public.tbl_address_type.address_type` is already UNIQUE. **No application code or BL-010 work is authorized or performed by this packet.** Any expansion requires new explicit approval.

## Traceability
- BL-002: `BL-002/stories/STORY-0129.md`; approval and drift evidence as identified above.
- BL-004: `Story0129AddressTypeSaveUnitTest.java` — one current executable case; gaps explicitly recorded.
- BL-005: `Story0129AddressTypeSaveMvcIntegrationTest.java` — one mocked-service MVC case; real DB gap explicitly recorded.
- BL-009: `Story0129TestDataDrivenTest.java` plus governed Story/test-data catalogue; executable mapping shown above.
- BL-011: this reviewer-readable packet.

## Execution and coverage status
- Packet generation/rework: `COMPLETE_AND_POLICY_VALIDATED`.
- BL-004 unit execution: `NOT_EXECUTED`.
- BL-005 integration execution: `NOT_EXECUTED`.
- BL-009 data-driven execution: `NOT_EXECUTED`.
- Full E2E execution: `NOT_EXECUTED`.
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`; no percentage inferred.

## Validation against BL-011 policy
Required identity/source, business behavior/impact, preconditions/inputs/rules, source-bound production code, UT/IT/test-data/E2E stories, per-existing-executable adjacent code, API/UI/database outcomes, negative/boundary/duplicate gaps, BL-002/004/005/009 traceability, execution separation and coverage separation are present. Missing executable coverage is reported as a gap rather than hidden.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
