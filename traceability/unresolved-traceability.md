# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 16
- COMPLETE: 16
- UNRESOLVED: 0
- BLOCKED: 0
- FAILED: 0
- Not yet examined: 118

## Resolved in Attempt 22

The three paths that were UNRESOLVED in Attempt 21 are now source-proved COMPLETE:

- `GET /search/product-category/{searchText}` -> `ProductCategorySearchService` -> `ProductCategoryJpaDao.findByProductCategoryContainingIgnoreCase(...)` -> `ProductCategoryDo` -> `public.tbl_product_category`.
- `GET /search/product-uom/{searchText}` -> `ProductUomSearchService` -> `ProductUomJpaDao.findByProductUomContainingIgnoreCase(...)` -> `ProductUomDo` -> `public.tbl_product_uom`.
- `GET /search/state/{searchText}` -> `StateSearchService` -> `StateJpaDao.findByStateNameContainingIgnoreCase(...)` -> `StateDo` -> `public.tbl_state`.

Each promotion to COMPLETE is backed by the concrete Spring service, the invoked Spring Data repository method, and the entity's explicit `@Table` mapping in the frozen source.

## Current unresolved paths

There are currently no UNRESOLVED, BLOCKED or FAILED paths among the 16 examined endpoints.

The remaining 118 endpoints are **NOT YET EXAMINED**, not UNRESOLVED.

## Next action

Continue `WU-BL001-001` across the remaining 118 endpoints. Any path whose final dependency cannot be proved must stop at its last proven component and be recorded here. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
