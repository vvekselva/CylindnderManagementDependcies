# STORY-0094 — Global Cylinder Search

- Release: R1
- Endpoint: `GET /search/cylinder/{searchText}`
- Controller: `RestfulCylinderServices.getCylinders`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 94
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This is the ownership-model global cylinder search. The exact browser/API input is path variable `searchText`. `RestfulCylinderServices.getCylinders` creates `CylinderManagementApplicationRequestDto`, assigns `searchTerm`, and delegates to the bean qualified `cylinderSerachServiceWithOwnershipModel`. The legacy current-status implementation is commented out.

The active service is intended to search globally across Yard, Logistics/Vehicle, Customer custody, Supplier custody and ownership-unknown cases exposed by the ownership-model global search source. The returned contract is `CylinderSearchResponseDto`. A governed application exception is logged and converted to an empty response DTO.

This endpoint is read-only. It resolves matching logical/physical cylinder information under the ownership model but performs no cylinder state, custody, ownership or logistics mutation.

## Completion and approval gate

The canonical Story identity, global ownership-model routing, request/response/error behavior and read-only business effect are source-bound. STORY-0094 is `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

User approval recorded on 2026-09-05. Fan-out is authorized subject to post-approval source/code conformance; runtime execution and coverage remain evidence-based.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
