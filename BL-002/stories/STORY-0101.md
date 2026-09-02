# STORY-0101 — State Search

- Release: R1
- Endpoint: `GET /search/state/{searchText}`
- Controller: `RestfulStateServices.getStates`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0101-approval-20260902.md`
- Fan-out: REQUESTED
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only state-reference lookup accepts exact path variable `searchText`. The recovered ZIP confirms `RestfulStateServices.getStates` copies it into `CylinderManagementApplicationRequestDto.searchTerm`, delegates to the state search service and returns `StateSearchResponseDto`; a governed application exception returns an empty response DTO.

Consuming address forms can use the returned persistent State identity and name for typeahead selection/dependent City behavior, but timing/clearing rules are recorded with those specific screens. This API itself performs no State mutation.

## Completion and approval gate

The request/service/response/error contract and read-only reference-data role are source-bound. STORY-0101 is `APPROVED_AFTER_REWORK` by explicit user instruction dated 2026-09-02, and downstream testing/test-data fan-out is requested.

The approval applies to the documented Story contract only.
