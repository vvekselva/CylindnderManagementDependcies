# STORY-0096 — Cylinders by Customer

- Release: R1
- Endpoint: `POST /search/cylinder/by-customer`
- Controller: `RestfulCylinderServices.getCylindersByCustomer`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 96
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This ownership-model POST returns cylinders currently held by the customer identified in the request. `RestfulCylinderServices.getCylindersByCustomer` accepts required JSON `CylinderManagementApplicationRequestDto`, creates paging, and delegates to `cylindersByCustomerSearchServiceWithOwnershipModel`; the legacy current-status service is commented out.

The recovered source binds this search to active CUSTOMER custody rows and the current ownership/custody model. In the Customer Stop screen the request carries `CUSTOMER_ID`, requested EMPTY/FULL states and page 1/50. Returned cylinder IDs become pickup candidates and are later submitted as repeated `emptyCylinderIdForYard` values. A governed search exception returns an empty response DTO.

This API is read-only; custody/logistics movement is performed only by the downstream stop transaction.

## Completion and approval gate

The canonical Story identity, customer request/paging contract, ownership-model custody search, selectable persistent cylinder IDs and read-only effect are source-bound. STORY-0096 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

User approval recorded on 2026-09-05. Fan-out is authorized subject to post-approval source/code conformance; runtime execution and coverage remain evidence-based.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
