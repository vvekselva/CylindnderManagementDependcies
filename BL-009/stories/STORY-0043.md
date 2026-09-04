# BL-009 / STORY-0043 — Vehicle Trip Load Wizard GET Test Catalogue

- Source Story: `BL-002/stories/STORY-0043.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0043.csv`

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0043-01 | Open wizard | Initialized VehicleTrip/VehicleLoad request model |
| TC-0043-02 | Check back link | /vehicle-loads/list is exposed |
| TC-0043-03 | Vehicle Load Purpose reference | Purpose data is available |
| TC-0043-04 | Product reference | Product data is available under current paged cache behavior |
| TC-0043-05 | Delivery challan books | Active DELIVERY_CHALLAN books returned |
| TC-0043-06 | Empty pickup books | Active EMPTY_PICKUP_CHALLAN books returned |
| TC-0043-07 | Filling note books | Active FILLING_NOTE books returned |
| TC-0043-08 | Spot-check books | Active CUSTOMER_SPOT_CYLINDER_CHECK books returned |
| TC-0043-09 | Customer/address dependency | Address identity is dependent on Customer |
| TC-0043-10 | GET no mutation | No Trip/Load/Challan/Logistics/Yard mutation |
| TC-0043-11 | Product filtered-search limitation | Nonblank product term does not prove filtered DAO behavior |
| TC-0043-12 | Product page-size limitation | Cache path does not prove full catalog in one call |

Execution and coverage remain NOT_EXECUTED.
