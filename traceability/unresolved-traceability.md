# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 22
- COMPLETE: 19
- UNRESOLVED: 3
- BLOCKED: 0
- FAILED: 0
- Not yet examined: 112

## Current unresolved paths

### `GET /search/challantype/{searchText}`

Last proven component: injected `challanTypeSearchService` typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ChallanTypeSearchResponseDto>`.

Missing evidence: concrete Spring implementation selected for this injection, invoked repository/query, entity/view mapping, and final dependency.

Next investigation step: resolve the concrete Challan Type search bean and follow its persistence/query path from the frozen source.

### `GET /search/city/{searchText}`

Last proven component: injected `citySearchService` typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CitySearchResponseDto>`.

Missing evidence: concrete Spring implementation selected for this injection, invoked repository/query, entity/view mapping, and final dependency.

Next investigation step: resolve the concrete City search bean and follow its persistence/query path from the frozen source.

### `GET /search/country/{searchText}`

Last proven component: injected `countrySearchService` typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, CountrySearchResponsesDto>`.

Missing evidence: concrete Spring implementation selected for this injection, invoked repository/query, entity/view mapping, and final dependency.

Next investigation step: resolve the concrete Country search bean and follow its persistence/query path from the frozen source.

## Evidence discipline

The active controller mappings and generic search-service calls are proved from the frozen source. These paths are deliberately not marked COMPLETE until the concrete implementation and final dependency are source-proved.

## Next action

Resolve these three generic search-service implementations, then continue `WU-BL001-001` across the remaining 112 not-yet-examined endpoints. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
