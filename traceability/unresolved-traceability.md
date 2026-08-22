# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 16
- COMPLETE: 13
- UNRESOLVED: 3
- BLOCKED: 0
- FAILED: 0
- Not yet examined: 118

## Unresolved in Attempt 21

### `GET /search/product-category/{searchText}`

Source-proved path so far:

`RestfulProductCategoryServices` -> injected `productCategorySearchService.searchWithText(...)`.

Last proven component: `productCategorySearchService`, typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ProductCategorySearchResponseDto>`.

Missing evidence: the concrete Spring implementation selected for this injection, its repository/query path, and its final persistence or external dependency.

Next investigation: resolve the injected bean from the frozen source configuration/components, then follow the actual DAO/repository/query to the final dependency.

### `GET /search/product-uom/{searchText}`

Source-proved path so far:

`RestfulProductUomServices` -> injected `productUomSearchService.searchWithText(...)`.

Last proven component: `productUomSearchService`, typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, ProductUomSearchResponseDto>`.

Missing evidence: the concrete Spring implementation selected for this injection, its repository/query path, and its final persistence or external dependency.

Next investigation: resolve the injected bean from the frozen source configuration/components, then follow the actual DAO/repository/query to the final dependency.

### `GET /search/state/{searchText}`

Source-proved path so far:

`RestfulStateServices` -> injected `stateSearchService.searchWithText(...)`.

Last proven component: `stateSearchService`, typed as `ICylinderManagementApplicationSearchService<CylinderManagementApplicationRequestDto, StateSearchResponseDto>`.

Missing evidence: the concrete Spring implementation selected for this injection, its repository/query path, and its final persistence or external dependency.

Next investigation: resolve the injected bean from the frozen source configuration/components, then follow the actual DAO/repository/query to the final dependency.

## Current unresolved paths

Three endpoints are UNRESOLVED, all at a source-proved generic search-service handoff. They are not BLOCKED or FAILED because the next investigation step is available.

The remaining 118 endpoints are **NOT YET EXAMINED**, not UNRESOLVED.

## Next action

Resolve the three concrete generic search-service implementations while continuing `WU-BL001-001` across independent remaining endpoints. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
