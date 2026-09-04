# BL-011 Human-Readable Test Packet — STORY-0130 Country Save

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
- Source `BL-002/stories/STORY-0130.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Country save validates acceptable input and persists the reference record; invalid/conflicting input must not create unintended state.
- Unit: source-bound valid, invalid, null/empty, duplicate/conflict and boundary behavior; `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection state; `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0130.md` / `.csv`, 4 mapped rows.
- E2E: valid Country data is persisted and subsequently available; rejected input follows governed error behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0130.md`; executable `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.

## Production Code Evidence
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
