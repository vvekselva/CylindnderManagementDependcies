# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 10
- COMPLETE: 10
- UNRESOLVED: 0
- Not yet examined: 124

## Completed examined paths

| Endpoint | Concrete path | Final dependency evidence |
|---|---|---|
| GET `/search/cylinder/{searchText}` | `CylinderSearchServiceWithOwnershipModel` -> `CylinderGlobalSearchViewJpaDao.searchBySerial(...)` | `public.vw_cylinder_global_search` |
| POST `/search/cylinder/ownership/by-state` | `CylinderCurrentOwnershipByStateSearchService` -> `CylinderGlobalSearchViewJpaDao.searchByStateNames(...)` | `public.vw_cylinder_global_search` |
| POST `/search/cylinder/by-serial-and-state` | `CylinderCurrentOwnershipBySerialAndStateSearchService` -> `CylinderGlobalSearchViewJpaDao.searchBySerialAndStateNames(...)`; state validation -> `CylinderStateJpaDao.findByCylinderStateIn(...)` | `public.vw_cylinder_global_search`; `public.tbl_cylinder_states` |
| GET `/search/customer/{searchText}` | `CustomerSearchService` -> `CustomerJpaDao.findByCustomerNameContainingIgnoreCase(...)` | `public.tbl_customer` |
| GET `/search/product/{searchText}` | `ProductSearchService` -> `ProductJpaDao.findByProductNameContainingIgnoreCase(...)` | `public.tbl_product` |
| GET `/search/addresstype/{searchText}` | `AddressTypeSearchService` -> `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(...)` | `public.tbl_address_type` |
| POST `/search/cylinder/by-state` | `AvailableYardCylinderByStateSearchService` -> `YardInventoryLineJpaDao` query branches; identifier lookup via `CylinderIdentifierJpaDao` | `public.tbl_yard_inventory_line`, `public.tbl_cylinder`, `public.tbl_product`, `public.tbl_cylinder_states`, `public.tbl_cylinder_identifier` |
| POST `/search/cylinder/on-vehicle` | `CylindersOnVehicleSearchServiceWithOwnershipModel` -> `CylinderLogisticsExecutionLineJpaDao.findActiveVehicleContents(...)`; identifier lookup via `CylinderIdentifierJpaDao` | `public.tbl_cylinder_logistics_execution_line`, `public.tbl_cylinder_logistics_execution`, `public.tbl_vehicle_load`, `public.tbl_cylinder`, `public.tbl_product`, `public.tbl_cylinder_states`, `public.tbl_cylinder_identifier` |
| POST `/search/cylinder/by-customer` | `CylindersByCustomerSearchServiceWithOwnershipModel` -> `CustomerHeldCylinderSearchJpaDao.findActiveCustomerHeldCylinders(...)` | `public.vw_cylinder_party_custody_with_identifiers`, `public.tbl_cylinder`, `public.tbl_product` |
| POST `/search/cylinder/by-supplier` | `CylindersBySupplierSearchServiceWithOwnershipModel` -> `SupplierHeldCylinderSearchJpaDao.findActiveSupplierHeldCylinders(...)` | `public.vw_cylinder_party_custody_with_identifiers`, `public.tbl_cylinder`, `public.tbl_product` |

## Unresolved paths

None among the 10 endpoints examined so far.

The remaining 124 endpoints are **NOT YET EXAMINED**, not UNRESOLVED. They must each be traced before Source Check completion and matrix construction can be unlocked.

## Next action

Continue `WU-BL001-001` across the remaining 124 endpoints. For each endpoint, prove the concrete implementation, repository/query path and final dependency, or explicitly record UNRESOLVED/BLOCKED/FAILED with evidence. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
