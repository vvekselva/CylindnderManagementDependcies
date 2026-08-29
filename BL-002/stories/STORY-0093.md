# STORY-0093 — Cylinder by Serial and State

- Release: R1
- Endpoint: `POST /search/cylinder/by-serial-and-state`
- Controller: `RestfulCylinderServices.getCylinderBySerialAndState`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
Canonical trace proves two source branches. State validation flows through `CylinderCurrentOwnershipBySerialAndStateSearchService.searchWithText` -> `CylinderStateJpaDao.findByCylinderStateIn` -> `CylinderStateDo` -> `public.tbl_cylinder_states`. Identifier/state matching then uses `CylinderGlobalSearchViewJpaDao.searchBySerialAndStateNames` -> `CylinderGlobalSearchViewDo` -> `public.vw_cylinder_global_search` -> `CylinderSearchResponseDto`.

This is a read-only ownership-aware cylinder lookup. The endpoint's strict applicable contract includes validating requested state names before querying global identifier/state data. No screen-specific browser event, debounce, minimum length, button guard or hidden-field propagation is proven for this endpoint in the frozen source evidence, so none is invented.

## Approval boundary
Strict source contract is complete. Approval remains pending; no use-case/testing readiness is promoted.
