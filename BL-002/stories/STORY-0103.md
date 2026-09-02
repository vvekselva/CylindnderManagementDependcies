# STORY-0103 — Vehicle Search

- Release: R1
- Endpoint: `GET /search/vehicle/{searchText}`
- Controller: `RestfulVehicleServices.getVehicles`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only vehicle lookup accepts required path variable `searchText`, documented as vehicle registration-number search. `RestfulVehicleServices.getVehicles` places the value in `CylinderManagementApplicationRequestDto.searchTerm`, creates paging with `PaginationUtils.createPageable`, and delegates to `vehicleSearchService.searchWithText`.

Successful processing returns `VehicleSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO. Returned vehicle IDs/numbers are reference identities for consuming trip/load screens, but this API performs no vehicle mutation. Screen-specific debounce/selected-ID/reset behavior is documented with the consuming screen where source-proved.

## Completion and approval gate

The request, paging/service delegation, response/error behavior and read-only reference role are source-bound. STORY-0103 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
