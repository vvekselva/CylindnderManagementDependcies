# BL-005 / STORY-0080 — Supplier Registration Form Integration-Test Plan

Source contract: `BL-002/stories/STORY-0080.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Integration scenarios
1. GET /ingestSupplier returns the configured supplier registration view with the initialized nested model graph.
2. Verify the response model supports all visible supplier, phone, address and geography fields without null-binding failures.
3. Verify Country/State/City autocomplete dependencies resolve through the real Spring application context.
4. Verify the page form action targets POST /ingestSupplier while the GET itself remains read-only.
5. Verify dependent geography selections are cleared when the upstream selection changes.
6. Verify no database row is inserted or updated merely by opening the supplier registration form.

## Runtime
JUnit 5 + Spring MVC integration runtime. PostgreSQL/Testcontainers may be used to prove absence of mutation where needed. Execution and coverage remain NOT_EXECUTED.
