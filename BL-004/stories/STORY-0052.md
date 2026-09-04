# BL-004 / STORY-0052 — Trip Return + Deferred Yard Reconciliation Unit-Test Plan

Source contract: `BL-002/stories/STORY-0052.md`  
Approval: `APPROVED_AFTER_REWORK`  
Development gap: `BL-010 DEV-0006`

## Unit scenarios
1. GET /trip-return loads trip/load/header/challan-book review information without mutating database state.
2. Returned vehicle may physically carry both EMPTY and FULL cylinders collected from Customers and Suppliers.
3. Physical unloading at Yard must not automatically be treated as reconciled system Yard inventory.
4. Next-day Yard Audit becomes the physical source of evidence for cylinders actually present.
5. Audit-before-challan produces a pending/AMBER reconciliation state when the difference is explainable by pending challan entry.
6. Matching later challan entries resolve the audited cylinder identities and allow GREEN.
7. Audited cylinder with no matching later challan remains unexplained and must trigger mismatch notification.
8. Challan cylinder not found in the audit remains a mismatch.
9. Duplicate/conflicting challan explanation remains a mismatch.
10. Pending AMBER beyond the allowed challan-entry window escalates to RED.
11. DEV-0006 must preserve identity-level matching, not only aggregate counts.
12. No post-fix PASS is inferred until DEV-0006 is explicitly approved, implemented and source-read-back is complete.

## Execution
Plan generated. Runtime execution and JaCoCo coverage remain NOT_EXECUTED.
