# STORY-0094 — Yard Cylinders by State

- Release: R1
- Endpoint: `POST /search/cylinder/by-state`
- Controller: `RestfulCylinderServices.getCylindersByState`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only search returns active yard-stock cylinders constrained by requested state names. The recovered ZIP confirms `RestfulCylinderServices.getCylindersByState` → `AvailableYardCylinderByStateSearchService` → yard inventory line repositories for product-wise EMPTY/FULL counts and active cylinder rows, with `YardInventoryLineDo` / `public.tbl_yard_inventory_line`, `CylinderDo` / `public.tbl_cylinder`, and physical identifier resolution through `CylinderIdentifierJpaDao` / `public.tbl_cylinder_identifier`, returning `YardCylinderStockResponseDto`.

The endpoint exposes yard availability and identifier data but performs no inventory/state/custody write. Screen-specific timing or hidden-control behavior is not attributed where no unique consuming screen is part of this endpoint's own source contract.

## Completion and approval gate

The yard-state filter semantics, repository/table/view identities, returned stock/identifier role and read-only effect are source-bound. STORY-0094 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
