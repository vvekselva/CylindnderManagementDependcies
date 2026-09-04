# BL-005 / STORY-0043 — Vehicle Trip Load Wizard GET Integration-Test Plan

Source contract: `BL-002/stories/STORY-0043.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Integration scenarios
1. GET /wizard/vehicle-trip-load returns the configured wizard template and initialized nested model.
2. Verify Vehicle Load Purpose and Product reference data through the real Spring application context.
3. Verify the four active challan-book collections are resolved from `vw_active_challan_books_for_trip_load` by book type.
4. Verify model contains the expected back link and source-bound selector data.
5. Verify the GET request performs no insert/update to vehicle trip, vehicle load, trip challan assignment, logistics execution or yard-inventory state.
6. Verify current Product reference behavior without assuming filtered search or complete full-catalog loading from one request.
7. Keep POST /wizard/vehicle-trip-load/save mutation verification under STORY-0044.

## Runtime
JUnit 5 + Spring MVC integration runtime; PostgreSQL Testcontainers/Flyway/JPA may be used where reference-data/view behavior or no-mutation proof requires it. Execution and coverage remain NOT_EXECUTED.
