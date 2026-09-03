# STORY-0103 Code Drift Review Packet — Vehicle Search Service Code

Run: `CYLINDER-PRODUCTION-FIRE-20260903-143500-IST-RUN-008`
Approval required before application-code mutation: **YES**

## Current vs approved behavior

Approved STORY-0103 behavior is the read-only vehicle-registration search path `GET /search/vehicle/{searchText}` through `RestfulVehicleServices.getVehicles` -> `VehicleSearchService.searchWithText` -> `VehicleJpaDao.findByVehicleNumberContainingIgnoreCase`.

Current source conforms to the controller, paging, DAO search, mapping and response behavior, but `VehicleSearchService.searchWithText()` calls `SearchRequestValidator.validate(...)` with `CylinderManagementServiceCode.PRODUCT_UOM_SEARCH_SERVICE`. There is no `VEHICLE_SEARCH_SERVICE` enum member in the current frozen source.

## Business impact

Vehicle-search validation is attributed to the Product UOM search service. Validation/error context and diagnostics can therefore identify the wrong business service, weakening traceability and potentially causing vehicle-search failures to be classified or reported under the wrong service identity. The data-read path itself still queries vehicle registration numbers and does not mutate vehicle data.

## Exact proposed code-change manifest

Repository/ref: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89` as identified by the approved Story baseline and frozen ZIP fingerprint `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`.

1. File: `framework/src/main/java/com/sreyas/datamatics/cylinder/management/service/code/CylinderManagementServiceCode.java`
   - Component: `CylinderManagementServiceCode`
   - Source anchor: enum entries around `DRIVER_SEARCH_SERVICE` / lines ~45-49.
   - Proposed change: add `VEHICLE_SEARCH_SERVICE` as a dedicated enum constant near the other search-service codes.
   - Reason: provide the correct governed service identity for vehicle-search validation.

2. File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/VehicleSearchService.java`
   - Class: `VehicleSearchService`
   - Method: `searchWithText(...)`
   - Source anchor: `validator.validate(...)` around lines 48-49.
   - Current code identity: `CylinderManagementServiceCode.PRODUCT_UOM_SEARCH_SERVICE`.
   - Proposed change: replace with `CylinderManagementServiceCode.VEHICLE_SEARCH_SERVICE`.
   - Reason: validation and exception metadata must identify the vehicle-search service, not Product UOM search.

No other application-code locations are approved by this packet. If implementation requires expansion beyond these two locations, stop and request new explicit approval.

## Tests impact

Add/update unit coverage for `VehicleSearchService.searchWithText()` to verify `SearchRequestValidator.validate(requestDto, VEHICLE_SEARCH_SERVICE)` is invoked. Retain positive DAO/mapping/pagination coverage and negative validation coverage for invalid/missing search input. Integration/API tests should confirm `/search/vehicle/{searchText}` remains read-only and returns vehicle-search responses/error handling unchanged apart from correct service identity.

## Database impact

None. No Flyway migration, schema, table, view, function, trigger, or data rewrite is proposed.

## Gate

Status: `WAITING_FOR_EXPLICIT_EXACT_DRIFT_MANIFEST_APPROVAL`.
No application code was changed and no BL-010 code rework was created or executed by this run.
