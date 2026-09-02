# STORY-0105 — Ownership Cylinder Search by State

- Release: R1
- Endpoint: `POST /search/cylinder/ownership/by-state`
- Controller: `RestfulCylinderServices.getCylindersByStateUsingOwnershipModel`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This ownership-model POST accepts required JSON `CylinderManagementApplicationRequestDto`, creates paging with `PaginationUtils.createPageable`, and passes the unchanged request to `cylinderCurrentOwnershipByStateSearchService.searchWithText`. The response is `CylinderSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO.

The endpoint is the global ownership-aware by-state search path, separate from the yard-only `/search/cylinder/by-state` endpoint. It reads current ownership/location/state information for cylinders matching the requested state criteria and performs no cylinder mutation.

## Completion and approval gate

The request/paging/service routing, ownership-aware scope, response/error behavior and read-only effect are source-bound. STORY-0105 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
