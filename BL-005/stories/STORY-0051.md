# BL-005 / STORY-0051 — Add Stop Page Integration-Test Plan

Source contract: `BL-002/stories/STORY-0051.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Integration scenarios
1. Returned trip + CustomerStop renders the customer stop selection page.
2. Proceeding trip + CustomerStop is also allowed.
3. Non-Returned/Proceeding trip redirects to the vehicle-load detail page with error.
4. Customer page receives only assigned DELIVERY_CHALLAN and EMPTY_PICKUP_CHALLAN books for the selected vehicle load.
5. Supplier page receives only assigned FILLING_NOTE books.
6. Heat-map page windows and active-photo state come from the governed assignment/audit/photo persistence path.
7. Missing/invalid vehicle load propagates through the governed exception path.
8. GET /add-stop produces no inserts/updates to trip, load, challan, stop, logistics or Yard state.

## Runtime
JUnit 5 + Spring MVC; PostgreSQL Testcontainers/Flyway/JPA where persistence-backed heat-map/status behavior is exercised. Execution and coverage remain NOT_EXECUTED.
