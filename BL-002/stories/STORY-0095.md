# STORY-0095 — Cylinders by Supplier

- Release: R1
- Endpoint: `POST /search/cylinder/by-supplier`
- Controller: `RestfulCylinderServices.getCylindersBySupplier`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This ownership-aware search returns cylinders currently held by the supplier identified in the request. The recovered ZIP confirms `RestfulCylinderServices.getCylindersBySupplier` → `CylindersBySupplierSearchServiceWithOwnershipModel` → `SupplierHeldCylinderSearchJpaDao.findActiveSupplierHeldCylinders` over `public.vw_cylinder_party_custody_with_identifiers`, resolving cylinder/product data from `public.tbl_cylinder` and `public.tbl_product`, and returning `CylinderSearchResponseDto`.

The search represents active supplier custody and is read-only. Returned persistent cylinder identities can be used by later movement operations, but this endpoint does not alter custody, ownership, state or logistics records.

## Completion and approval gate

The supplier search identity, ownership/custody projection path, returned cylinder role and read-only business effect are source-bound. STORY-0095 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
