# STORY-0106 — Available Yard Cylinders by State

- Release: R1
- Endpoint: `POST /search/cylinder/by-state`
- Controller: `RestfulCylinderServices.getCylindersByState`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This yard-only POST accepts required JSON `CylinderManagementApplicationRequestDto`, takes state/state-list criteria from `serachQueryData`, creates paging and delegates to `availableYardCylinderByStateSearchService`. Successful processing returns `YardCylinderStockResponseDto`; a governed application exception returns an empty yard-stock response.

The recovered source distinguishes this endpoint from the global ownership-state search: `/by-state` is the available-yard inventory path. Its downstream service reads active yard inventory/cylinder/identifier information and performs no state, custody or inventory mutation.

## Completion and approval gate

The request state criteria, paging, yard-only routing, response/error behavior and read-only business effect are source-bound. STORY-0106 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
