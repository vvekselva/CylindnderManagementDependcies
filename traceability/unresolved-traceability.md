# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 10
- COMPLETE: 3
- UNRESOLVED: 7
- Not yet examined: 124

## Newly completed in Attempt 15

| Endpoint | Concrete path | Final dependency evidence |
|---|---|---|
| GET `/search/cylinder/{searchText}` | `CylinderSearchServiceWithOwnershipModel` -> `CylinderGlobalSearchViewJpaDao.searchBySerial(...)` | `CylinderGlobalSearchViewDo` -> `public.vw_cylinder_global_search` |
| POST `/search/cylinder/ownership/by-state` | `CylinderCurrentOwnershipByStateSearchService` -> `CylinderGlobalSearchViewJpaDao.searchByStateNames(...)` | `CylinderGlobalSearchViewDo` -> `public.vw_cylinder_global_search` |
| POST `/search/cylinder/by-serial-and-state` | `CylinderCurrentOwnershipBySerialAndStateSearchService` -> `CylinderGlobalSearchViewJpaDao.searchBySerialAndStateNames(...)`; state validation -> `CylinderStateJpaDao.findByCylinderStateIn(...)` | `public.vw_cylinder_global_search`; `CylinderStateDo` -> `public.tbl_cylinder_states` |

## Unresolved paths

| Endpoint | Controller | Last source-proved handoff | State | Missing evidence |
|---|---|---|---|---|
| GET `/search/customer/{searchText}` | RestfulCustomerServices | injected customer search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| GET `/search/product/{searchText}` | RestfulProductServices | injected product search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| GET `/search/addresstype/{searchText}` | RestfulAddressTypeServices | injected address-type search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| POST `/search/cylinder/by-state` | RestfulCylinderServices | `availableYardCylinderByStateSearchService` | UNRESOLVED | Concrete repository/query branches and all final dependencies still require proof |
| POST `/search/cylinder/on-vehicle` | RestfulCylinderServices | `cylindersOnVehicleSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_logistics_execution_line` only as supporting evidence |
| POST `/search/cylinder/by-customer` | RestfulCylinderServices | `cylindersByCustomerSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_party_custody` only as supporting evidence |
| POST `/search/cylinder/by-supplier` | RestfulCylinderServices | `cylindersBySupplierSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_party_custody` only as supporting evidence |

## Next action

Continue the seven recorded UNRESOLVED paths through their concrete implementations and repository/query layers, then examine the remaining 124 endpoints. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
