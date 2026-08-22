# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 10
- COMPLETE: 0
- UNRESOLVED: 10
- Not yet examined: 124

## Unresolved paths

| Endpoint | Controller | Last source-proved handoff | State | Missing evidence |
|---|---|---|---|---|
| GET `/search/customer/{searchText}` | RestfulCustomerServices | injected customer search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| GET `/search/product/{searchText}` | RestfulProductServices | injected product search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| GET `/search/addresstype/{searchText}` | RestfulAddressTypeServices | injected address-type search service / `searchWithText(...)` | UNRESOLVED | Concrete Spring implementation, repository/query, final dependency |
| GET `/search/cylinder/{searchText}` | RestfulCylinderServices | `cylinderSerachServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation, repository/query, final dependency |
| POST `/search/cylinder/ownership/by-state` | RestfulCylinderServices | `cylinderCurrentOwnershipByStateSearchService` | UNRESOLVED | Concrete implementation, repository/query, final dependency |
| POST `/search/cylinder/by-state` | RestfulCylinderServices | `availableYardCylinderByStateSearchService` | UNRESOLVED | Concrete implementation, repository/query, final dependency |
| POST `/search/cylinder/by-serial-and-state` | RestfulCylinderServices | `cylinderCurrentOwnershipBySerialAndStateSearchService` | UNRESOLVED | Concrete implementation, repository/query, final dependency |
| POST `/search/cylinder/on-vehicle` | RestfulCylinderServices | `cylindersOnVehicleSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_logistics_execution_line` only as supporting evidence |
| POST `/search/cylinder/by-customer` | RestfulCylinderServices | `cylindersByCustomerSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_party_custody` only as supporting evidence |
| POST `/search/cylinder/by-supplier` | RestfulCylinderServices | `cylindersBySupplierSearchServiceWithOwnershipModel` | UNRESOLVED | Concrete implementation and repository/query proof; controller comment references `tbl_cylinder_party_custody` only as supporting evidence |

## Next action

Resolve the concrete Spring implementations behind the recorded injected search-service qualifiers, trace each through its repository/query layer to its final dependency, then continue the remaining 124 endpoint traces. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
