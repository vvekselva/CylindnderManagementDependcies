# BL-005 / STORY-0041 — Customer Registration Integration-Test Plan

Source contract: `BL-002/stories/STORY-0041.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Integration scenarios
1. GET /registerCustomer returns the configured registration view with a fresh customer model and Address Type options.
2. Type-ahead Country/State/City dependencies resolve against the real application context.
3. Valid embedded registration submission exercises controller -> mediator -> CustomerIngestionService -> JPA persistence against PostgreSQL Testcontainers/Flyway/JPA.
4. Verify customer, addresses and phone relationships round-trip through the mapped tables.
5. Verify invalid input redisplays the registration view with validation feedback and no unintended persistence.
6. Explicitly verify current frozen-source behavior for the Address Type persistence omission instead of assuming the target behavior is implemented.

## Runtime
JUnit 5 + Spring test + PostgreSQL Testcontainers + Flyway/JPA. Execution and coverage remain NOT_EXECUTED until the faithful runtime is available.
