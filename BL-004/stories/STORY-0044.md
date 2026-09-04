# BL-004 / STORY-0044 — Vehicle Trip Load Wizard Save Unit-Test Plan

Source contract: `BL-002/stories/STORY-0044.md`  
Approval: `APPROVED_AFTER_REWORK`  
Conformance: `POST_APPROVAL_DRIFT_REVIEW_PENDING_USER_APPROVAL`  
Development backlog: `BL-010 DEV-0005`

## Unit scenarios
1. Valid trip request requires Vehicle, Driver, Customer, Customer Address and starting time.
2. Customer Address must belong to the selected Customer.
3. Driver-ID null handling is treated as fixed-by-user report and requires source read-back verification before execution status can be PASS.
4. Vehicle Load requires loadedBy.
5. quantityFullForDelivery, quantityFullForBuffer and quantityEmptyForSupplier must each be validated independently for null.
6. DEV-0005 specifically exposes the current duplicated quantityFullForDelivery null predicate and missing explicit quantityEmptyForSupplier guard.
7. Each selected cylinder must exist, be active only in Yard and be FULL or EMPTY.
8. FULL allocation honors FULL_FOR_DELIVERY before FULL_FOR_BUFFER.
9. EMPTY allocation honors EMPTY_FOR_SUPPLIER.
10. All four physical challan books and starting sheet numbers are required and must satisfy type/location/page/assignment rules.
11. Successful processing creates trip/load/load-lines, YARD_START stop, four trip-challan assignments, logistics execution/lines and deactivates source Yard lines.
12. Any validation failure must occur before partial transaction effects are committed.

## Execution
Test design is fanned out, but execution remains NOT_EXECUTED. Post-fix expectations for DEV-0005 cannot be classified PASS until the exact manifest is approved, implemented, source-read-back is complete and the faithful runtime executes the tests.
