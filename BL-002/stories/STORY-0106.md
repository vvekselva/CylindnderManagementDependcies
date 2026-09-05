# STORY-0106 — Available Yard Cylinders by State

- Release: R1
- Endpoint: `POST /search/cylinder/by-state`
- Controller: `RestfulCylinderServices.getCylindersByState`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This yard-only POST accepts required JSON `CylinderManagementApplicationRequestDto`, takes state/state-list criteria from `serachQueryData`, creates paging and delegates to `availableYardCylinderByStateSearchService`. Successful processing returns `YardCylinderStockResponseDto`; a governed application exception returns an empty yard-stock response.

The recovered source distinguishes this endpoint from the global ownership-state search: `/by-state` is the available-yard inventory path. Its downstream service reads active yard inventory/cylinder/identifier information and performs no state, custody or inventory mutation.

## Completion and approval gate

The request state criteria, paging, yard-only routing, response/error behavior and read-only business effect are source-bound. STORY-0106 is therefore `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

User approval and fan-out authorization are durably recorded. Application-code mutation remains separately governed by drift/change-manifest approval.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
