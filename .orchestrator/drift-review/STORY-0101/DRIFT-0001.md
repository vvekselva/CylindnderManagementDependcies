# STORY-0101 — Code Drift Review Packet

- Review packet: `DRIFT-0001`
- Story: `STORY-0101 — State Search`
- Status: `AWAITING_EXPLICIT_USER_APPROVAL`
- Prepared by run: `CYLINDER-PRODUCTION-FIRE-II-20260903-032808-IST-RUN-001`
- Governed repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Requested source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Local analysis basis: freshly extracted byte-identical source at `/mnt/data/cylinder-orchestrator-run009`
- Application-code mutation performed: **NO**
- BL-010 rework created/executed: **NO**

## Approved behavior

`GET /search/state/{searchText}` is an independent, read-only State reference lookup. The controller copies the path variable into `CylinderManagementApplicationRequestDto.searchTerm`; the State search service validates the request, performs a case-insensitive containing search by State name, maps the results, and returns `StateSearchResponseDto`. This endpoint does **not** require a cylinder-state filter entry in `serachQueryData` and performs no State mutation.

## Current source behavior / drift

### Drift A — wrong service identity passed by StateSearchService

Current local source:

- Repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/StateSearchService.java`
- Class: `StateSearchService`
- Method: `searchWithText(...)`
- Approximate source anchor: lines **47–48**, call to `validator.validate(...)`
- Current behavior: passes `CylinderManagementServiceCode.PRODUCT_UOM_SEARCH_SERVICE` while executing the State search service.

Impact: validation/error attribution can be reported under the Product-UOM service identity instead of State search. Future validation logic keyed by service code can therefore apply the wrong contract to State lookup.

### Drift B — over-broad state-filter classification

Current local source:

- Repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/validator/SearchRequestValidator.java`
- Class: `SearchRequestValidator`
- Method: `isStateRequiredService(...)`
- Approximate source anchor: lines **81–84**
- Current behavior: returns true for the two cylinder state-filter services **or any service-code name containing `STATE`**.

Impact: correcting Drift A to use the existing `CYLINDER_STATE_SEARCH_SERVICE` without narrowing this helper would incorrectly make the independent State reference lookup require `serachQueryData['state']`, contradicting the approved STORY-0101 contract.

## Exact proposed code-change manifest

Implementation is **not approved by this packet**. The following is the maximum proposed scope that requires explicit user approval before any code mutation.

1. **StateSearchService service identity correction**
   - Repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
   - File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/StateSearchService.java`
   - Class/method: `StateSearchService.searchWithText(...)`
   - Anchor: current `validator.validate(... PRODUCT_UOM_SEARCH_SERVICE)` around lines 47–48.
   - Proposed change: replace `PRODUCT_UOM_SEARCH_SERVICE` with the existing `CYLINDER_STATE_SEARCH_SERVICE`.
   - Reason: identify validation and exceptions as State search rather than Product-UOM search.

2. **SearchRequestValidator state-filter whitelist correction**
   - Repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
   - File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/validator/SearchRequestValidator.java`
   - Class/method: `SearchRequestValidator.isStateRequiredService(...)`
   - Anchor: boolean expression around lines 81–84.
   - Proposed change: remove the catch-all `serviceCode.name().contains("STATE")`; keep state-map requirement explicitly limited to `CYLINDER_ASSOCIATED_WITH_SERIAL_AND_STATE_SEARCH_SERVICE` and `CYLINDER_ASSOCIATED_WITH_STATE_SEARCH_SERVICE` unless a separately approved Story adds another state-filter service.
   - Reason: reference-data State search must not be confused with cylinder searches that require a state filter.

3. **Unit-test coverage for the approved boundary**
   - Repository/ref: same governed ref; test code to be added only after approval.
   - Proposed test file: `cylindermanagement.custommapper.service/src/test/java/com/sreyas/datamatics/cylinder/management/search/services/StateSearchServiceTest.java`
   - Proposed tests: verify `searchWithText(...)` invokes validation with `CYLINDER_STATE_SEARCH_SERVICE`; verify a valid `searchTerm` does not require a `state` entry in query data; verify response mapping remains unchanged.
   - Proposed validator test file: `cylindermanagement.custommapper.service/src/test/java/com/sreyas/datamatics/cylinder/management/search/validator/SearchRequestValidatorTest.java`
   - Proposed tests: the two cylinder-associated state-search service codes require `KEY_STATE`; `CYLINDER_STATE_SEARCH_SERVICE` does not; unrelated service codes remain unaffected.

## Database / migration impact

- Schema change: **NONE**
- Flyway migration: **NONE**
- Data migration/backfill: **NONE**
- DAO query change: **NONE**

## Regression scope

After approval and implementation, execute the State-search unit tests plus regression tests for cylinder-by-state and cylinder-by-serial-and-state validation. Integration execution remains subject to a faithful Maven/runtime environment.

## Approval gate

No application code may be changed and no BL-010 implementation/rework may be created or executed until the user explicitly approves this exact manifest. If implementation discovers any additional production-code, template, migration, DAO, API, or test scope beyond what is listed above, stop that scope and obtain a new explicit approval.
