# STORY-0095 — Cylinder by Serial and State

- Release: R1
- Endpoint: `POST /search/cylinder/by-serial-and-state`
- Controller: `RestfulCylinderServices.getCylinderBySerialAndState`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 95
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This ownership-model POST accepts `CylinderManagementApplicationRequestDto`; serial/search text is carried in `requestDto.searchTerm` and state or STATES in `requestDto.serachQueryData`. The controller creates paging with `PaginationUtils.createPageable` and delegates to `cylinderCurrentOwnershipBySerialAndStateSearchService`.

The recovered ZIP confirms the legacy current-status serial/state implementation is commented out and the active route uses the ownership model. The service validates requested state names through persisted cylinder-state data before querying the global ownership search view for matching serial/identifier and current state, returning `CylinderSearchResponseDto`. A governed application exception returns an empty response DTO.

The endpoint is read-only: it does not alter state, ownership, custody or identifiers.

## Completion and approval gate

The canonical Story identity, request payload, ownership-model routing, state validation/global search behavior and read-only effect are source-bound. STORY-0095 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
