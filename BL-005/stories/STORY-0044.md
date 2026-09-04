# BL-005 / STORY-0044 — Vehicle Trip Load Wizard Save Integration-Test Plan

Source contract: `BL-002/stories/STORY-0044.md`  
Approval: `APPROVED_AFTER_REWORK`  
Conformance: `POST_APPROVAL_DRIFT_REVIEW_PENDING_USER_APPROVAL`  
Development backlog: `BL-010 DEV-0005`

## Required runtime
JUnit 5 + Spring MVC + PostgreSQL Testcontainers + Flyway/JPA.

## Integration scenarios
1. Valid POST /wizard/vehicle-trip-load/save persists one Vehicle Trip and one Vehicle Load.
2. Verify load lines and load purposes for FULL_FOR_DELIVERY, FULL_FOR_BUFFER and EMPTY_FOR_SUPPLIER.
3. Verify YARD_START stop and transition from Started to Loaded.
4. Verify four physical trip challan assignments with selected starting unused pages.
5. Verify OPEN logistics execution and active logistics lines are created.
6. Verify previously active Yard Inventory lines become inactive.
7. Verify invalid Customer/Address relationship produces no partial writes.
8. Verify null quantityEmptyForSupplier is rejected with no trip/load/challan/logistics/yard mutation after DEV-0005 is implemented.
9. Verify the three quantity null checks are independent and no duplicate predicate remains.
10. Verify Driver-ID guard behavior against the source revision that contains the user-reported fix.
11. Verify transaction rollback on any downstream validation/persistence exception.

## Execution
NOT_EXECUTED. The DEV-0005 post-fix cases remain blocked until exact drift-manifest approval and implementation.
