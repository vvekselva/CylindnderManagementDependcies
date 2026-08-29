# STORY-0103 — Vehicle Search

- Release: R1
- Endpoint: `GET /search/vehicle/{searchText}`
- Controller: `RestfulVehicleServices.getVehicles`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
The endpoint binds required path variable `searchText` and is documented as registration-number search. The controller creates `CylinderManagementApplicationRequestDto`, sets `searchTerm`, creates paging with `PaginationUtils.createPageable`, then delegates to `vehicleSearchService.searchWithText(requestDto, pageable)`.

## Response/error behavior
Success returns `VehicleSearchResponseDto`. `CylinderManagementApplicationException` is logged and converted to a new empty response DTO. The search itself is read-only.

## UI applicability
The endpoint does not define browser debounce/minimum length, selected vehicle ID propagation, hidden fields, dependent calls, button guards, or reset behavior; these require a concrete caller and are not inferred.

## Approval boundary
Strict contract is complete for the applicable frozen-source behavior. Approval remains pending.
