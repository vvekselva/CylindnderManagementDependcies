# STORY-0103 — Vehicle Search

- Release: R1
- Endpoint: `GET /search/vehicle/{searchText}`
- Controller: `RestfulVehicleServices.getVehicles`
- Approval: APPROVED_AFTER_REWORK
- Review state: USER_APPROVED
- Rework state: APPROVED_AND_FAN_OUT
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Post-approval conformance: CODE_DRIFT_REVIEW_PACKET_PENDING_EXPLICIT_APPROVAL
- Drift packet: `BL-002/review-packets/STORY-0103-VEHICLE-SEARCH-SERVICE-CODE-DRIFT-20260903.md`
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`

## Business behavior

This read-only vehicle lookup accepts required path variable `searchText`, documented as vehicle registration-number search. `RestfulVehicleServices.getVehicles` places the value in `CylinderManagementApplicationRequestDto.searchTerm`, creates paging with `PaginationUtils.createPageable`, and delegates to `vehicleSearchService.searchWithText`.

Successful processing returns `VehicleSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO. Returned vehicle IDs/numbers are reference identities for consuming trip/load screens, but this API performs no vehicle mutation. Screen-specific debounce/selected-ID/reset behavior is documented with the consuming screen where source-proved.

## Post-approval conformance drift

The controller, paging, DAO query `VehicleJpaDao.findByVehicleNumberContainingIgnoreCase`, mapping and response behavior conform. The frozen source currently validates `VehicleSearchService.searchWithText()` using `CylinderManagementServiceCode.PRODUCT_UOM_SEARCH_SERVICE`; a dedicated `VEHICLE_SEARCH_SERVICE` enum constant is absent. This is held for explicit exact-manifest approval before any application-code mutation.

## Completion and approval gate

Explicit user approval of the Story was recorded on 2026-09-02 21:59 IST. Story approval remains valid; only code-drift remediation is gated. No application-code or BL-010 mutation occurred.
