# STORY-0105 — Ownership Cylinder Search by State

- Release: R1
- Endpoint: `POST /search/cylinder/ownership/by-state`
- Controller: `RestfulCylinderServices.getCylindersByStateUsingOwnershipModel`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This ownership-model POST accepts required JSON `CylinderManagementApplicationRequestDto`, creates paging with `PaginationUtils.createPageable`, and passes the unchanged request to `cylinderCurrentOwnershipByStateSearchService.searchWithText`. The response is `CylinderSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO.

The endpoint is the global ownership-aware by-state search path, separate from the yard-only `/search/cylinder/by-state` endpoint. It reads current ownership/location/state information for cylinders matching the requested state criteria and performs no cylinder mutation.

## Completion and approval gate

The request/paging/service routing, ownership-aware scope, response/error behavior and read-only effect are source-bound. STORY-0105 is therefore `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

User approval and fan-out authorization are durably recorded. Application-code mutation remains separately governed by drift/change-manifest approval.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
