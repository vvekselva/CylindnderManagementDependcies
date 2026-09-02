# STORY-0093 — Cylinder by Serial and State

- Release: R1
- Endpoint: `POST /search/cylinder/by-serial-and-state`
- Controller: `RestfulCylinderServices.getCylinderBySerialAndState`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This is an ownership-aware, read-only cylinder lookup combining a cylinder serial/identifier search with requested cylinder-state constraints. The recovered ZIP confirms the controller and two material branches: state validation through `CylinderCurrentOwnershipBySerialAndStateSearchService` / `CylinderStateJpaDao.findByCylinderStateIn` against `public.tbl_cylinder_states`, then identifier/state matching through `CylinderGlobalSearchViewJpaDao.searchBySerialAndStateNames` over `public.vw_cylinder_global_search`, returning `CylinderSearchResponseDto`.

Requested state names are therefore validated against persisted state identities before the global cylinder view search. The endpoint performs no cylinder state/custody/ownership mutation. No particular browser event or timing rule is attributed where the endpoint is consumed generically rather than by one source-proved screen.

## Completion and approval gate

The request semantics, state-validation path, ownership-aware view query and read-only business effect are source-bound. STORY-0093 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
