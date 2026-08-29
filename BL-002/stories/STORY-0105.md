# STORY-0105 — Ownership Cylinder Search by State

- Release: R1
- Endpoint: `POST /search/cylinder/ownership/by-state`
- Controller: `RestfulCylinderServices.getCylindersByStateUsingOwnershipModel`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and service contract
The controller accepts required JSON `@RequestBody CylinderManagementApplicationRequestDto requestDto`, creates `Pageable` through `PaginationUtils.createPageable(requestDto)`, and delegates unchanged request data to the qualified `cylinderCurrentOwnershipByStateSearchService.searchWithText(requestDto, pageable)`.

## Response/error behavior
Success returns `CylinderSearchResponseDto`. `CylinderManagementApplicationException` is logged and returns a new empty response DTO. This is an ownership-model read path and performs no mutation in the controller.

## UI applicability
The frozen endpoint contract does not itself prove a particular visible control, browser event, debounce, hidden-field propagation, dependent call, button guard, or reset action. Those fields are therefore not invented.

## Approval boundary
Strict contract is complete for all applicable source-proved behavior. Approval remains pending.
