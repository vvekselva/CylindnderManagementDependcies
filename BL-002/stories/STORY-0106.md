# STORY-0106 — Available Yard Cylinders by State

- Release: R1
- Endpoint: `POST /search/cylinder/by-state`
- Controller: `RestfulCylinderServices.getCylindersByState`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
The endpoint accepts required JSON `CylinderManagementApplicationRequestDto`. The source documents state/state-list criteria in `serachQueryData`; the controller creates paging with `PaginationUtils.createPageable(requestDto)` and delegates to qualified `availableYardCylinderByStateSearchService.searchWithText(requestDto, pageable)`.

## Response/error behavior
Success returns `YardCylinderStockResponseDto`. `CylinderManagementApplicationException` is logged and returns a new empty yard-stock response. The active implementation is a read path; legacy current-status behavior is retained only as comments elsewhere and is not treated as active execution.

## UI applicability
No single frozen caller is asserted here, so browser debounce, hidden selected IDs, button guards and reset semantics are not invented. The request DTO and state criteria are the source-proved API contract.

## Approval boundary
Strict contract is complete for applicable frozen-source behavior. Approval remains pending.
