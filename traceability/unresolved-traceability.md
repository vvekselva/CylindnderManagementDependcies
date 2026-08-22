# Unresolved Controller Traceability

Status: PARTIAL — Source Check in progress
Backlog Item: BL-001 Controller Traceability
Work Unit: WU-BL001-001 Complete Source Repository Check
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

This artifact records endpoint paths whose final dependency has not yet been source-proved. An entry remains UNRESOLVED until the concrete implementation, repository/query path, and final dependency are evidenced. No repository or database object is inferred from naming alone.

## Current checkpoint

- Total source-proved endpoint inventory: 134
- Explicitly examined for final dependency: 13
- COMPLETE: 13
- UNRESOLVED: 0
- BLOCKED: 0
- FAILED: 0
- Not yet examined: 121

## Resolved in Attempt 20

`GET /search/address/customer-address/{customerId}` is now COMPLETE.

Source-proved path:

`RestfulAddressServices` -> `CustomerAddressFetchByIDService.searchWithText(...)` -> `CustomerAddressJpaDao.findByCustomer_CustomerId(...)` -> `CustomerAddressDo` -> `public.tbl_customer_address`.

The concrete service is an active Spring `@Component`; its query uses `CustomerAddressJpaDao`, which is a `JpaRepository<CustomerAddressDo, Long>`. `CustomerAddressDo` explicitly maps to `@Table(name = "tbl_customer_address", schema = "public")`.

The older `/search/address/customer/{customerId}` method in the same controller remains commented out and is not treated as an active endpoint.

## Current unresolved paths

None among the 13 endpoints examined so far.

The remaining 121 endpoints are **NOT YET EXAMINED**, not UNRESOLVED.

## Next action

Continue `WU-BL001-001` across the remaining 121 endpoints. Any path whose concrete implementation or final dependency cannot be proved must be recorded here at the last source-proved component. Matrix construction and downstream work units remain locked until the Source Check output is complete, contract-valid, closed, and has 100% endpoint trace-result coverage.
