# BL-005 / STORY-0052 — Trip Return / Yard Audit / Challan Reconciliation Integration-Test Plan

Source contract: `BL-002/stories/STORY-0052.md`  
Approval: `APPROVED_AFTER_REWORK`  
Development gap: `BL-010 DEV-0006`

## Required runtime
JUnit 5 + Spring MVC + PostgreSQL Testcontainers + Flyway/JPA.

## Integration scenarios
1. Trip returns with a known set of EMPTY and FULL cylinders collected from Customers/Suppliers.
2. Confirm Trip Return does not prematurely create reconciled Yard inventory for those physical returns.
3. Next-day Yard Stock Check scans those exact cylinder identities.
4. Before challan entry, create/observe the governed AMBER pending-entry condition.
5. Enter matching challan transactions and verify all cylinder identities reconcile and the gate becomes GREEN.
6. Omit one audited cylinder from challan entry and verify the gate remains mismatch/notified.
7. Add one challan cylinder that was not found by the Yard Audit and verify mismatch/notified.
8. Enter a conflicting/duplicate explanation and verify it is not silently accepted.
9. Let the pending-entry window expire and verify RED escalation.
10. Verify Reconciliation/Yard Audit dashboard surfaces the unresolved identities and reason.
11. Verify no manual SQL; any schema change required by DEV-0006 is Flyway-managed.

## Execution
Generated plan is not PASS evidence. DEV-0006 implementation and faithful runtime execution are still required.
