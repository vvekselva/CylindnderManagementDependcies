# BL-005 / STORY-0081 — Supplier Registration PostgreSQL Integration-Test Plan

Source contract: `BL-002/stories/STORY-0081.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Required runtime
JUnit 5 + Spring test + PostgreSQL Testcontainers + Flyway/JPA.

## Integration scenarios
1. Submit a valid supplier through POST /ingestSupplier and verify the supplier aggregate persists.
2. Verify supplier_name, gst_number, active state, linked address and linked phone are stored through the governed JPA mappings.
3. Verify selected City/State/Country IDs are resolved and persisted through the linked address.
4. Duplicate GST is rejected and does not create a second supplier.
5. Invalid or duplicate phone is rejected without persistence.
6. Invalid/missing address or geography values are rejected without persistence.
7. InvalidInputParameterException re-renders the supplier form with entered values and validation errors.
8. A successful persistence path redirects through the configured home/list outcome.
9. Verify real PostgreSQL/Flyway/JPA behavior rather than mocks, H2, or manual SQL.

## Execution
Generated plan is not PASS evidence. Runtime execution and JaCoCo coverage remain NOT_EXECUTED.
