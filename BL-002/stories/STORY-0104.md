# STORY-0104 — Vehicle Fetch by ID

- Release: R1
- Endpoint: `GET /find/Vehicle-by-Id/{vehicleId}`
- Controller: `RestfulVehicleServices.getVehicleById`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only API resolves one vehicle by exact persistent identity. Spring binds required path variable `vehicleId: Long`; `RestfulVehicleServices.getVehicleById` builds `VehicleFetchByIdRequestDto`, sets that ID, and delegates to `vehicleFetchByIdService.processRequest`.

Successful processing returns `VehicleFetchByIdResponseDto`; a governed application exception is logged and converted to an empty response DTO. The endpoint therefore supplies an exact vehicle reference for consuming trip/load workflows without modifying vehicle data.

## Completion and approval gate

The required path identity, request DTO propagation, service/response/error contract and read-only role are source-bound. STORY-0104 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
