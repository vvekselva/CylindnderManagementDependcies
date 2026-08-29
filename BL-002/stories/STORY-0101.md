# STORY-0101 — State Search

- Release: R1
- Endpoint: `GET /search/state/{searchText}`
- Controller: `RestfulStateServices.getStates`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request and controller contract
Spring binds path variable `searchText`. The controller creates `CylinderManagementApplicationRequestDto`, sets its `searchTerm` from that value, and delegates to `stateSearchService.searchWithText(requestDto, null)`.

## Response/error behavior
Success returns `StateSearchResponseDto`. `CylinderManagementApplicationException` is logged and produces a new empty response DTO. No write occurs.

## UI applicability
The endpoint source does not establish browser debounce/minimum-length, selected state ID propagation, dependent calls, button guards, or reset semantics. They are not invented.

## Approval boundary
Strict contract is complete for source-applicable behavior. Approval remains pending.
