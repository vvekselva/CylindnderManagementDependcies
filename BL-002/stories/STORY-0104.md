# STORY-0104 — Vehicle Fetch by ID

- Release: R1
- Endpoint: `GET /find/Vehicle-by-Id/{vehicleId}`
- Controller: `RestfulVehicleServices.getVehicleById`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Exact request identity
Spring binds required path variable `vehicleId` as `Long`. The controller creates `VehicleFetchByIdRequestDto`, calls `setVehicleId(vehicleId)`, then invokes `vehicleFetchByIdService.processRequest(requestDto)`. Thus the selected/read identity propagated into the service is the exact vehicle primary identifier supplied in the path.

## Response/error behavior
Success returns `VehicleFetchByIdResponseDto`. `CylinderManagementApplicationException` is logged and converted to a new empty response DTO. The endpoint is read-only.

## UI applicability
No endpoint-local typing/debounce, hidden-field, dependent-call, button-state or reset behavior is established by this controller; these are not invented.

## Approval boundary
Strict contract is complete for all applicable frozen-source behavior. Approval remains pending.
