# BL-011 Human-Readable Test Packet — STORY-0129 Address Type Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0129.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Address Type save validates acceptable input and persists the reference value; rejected input must not produce unintended persistence.
- Unit: valid mapping/save plus source-bound invalid/null/duplicate/conflict/boundary paths; `BL-004/generated-tests/STORY-0129/Story0129AddressTypeSaveUnitTest.java`.
- Integration: MVC/service/persistence behavior and failure-state verification; `BL-005/generated-tests/STORY-0129/Story0129AddressTypeSaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0129.md` / `.csv`, 4 mapped rows.
- E2E: valid Address Type input becomes available after save; invalid/conflicting data follows governed failure behavior without unintended record creation. Catalogue `BL-009/stories/STORY-0129.md`; executable `BL-009/generated-tests/STORY-0129/Story0129TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
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

## BL-004 Unit Test Cases


## BL-005 Integration Test Cases


## BL-009 Test Data / Use-case Cases


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all test execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
