# STORY-0095 — Cylinders by Supplier

- Release: R1
- Endpoint: `POST /search/cylinder/by-supplier`
- Controller: `RestfulCylinderServices.getCylindersBySupplier`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
Canonical trace proves the ownership-model path `RestfulCylinderServices.getCylindersBySupplier` -> `CylindersBySupplierSearchServiceWithOwnershipModel.searchWithText` -> `SupplierHeldCylinderSearchJpaDao.findActiveSupplierHeldCylinders` -> `public.vw_cylinder_party_custody_with_identifiers`, resolving cylinder/product data from `public.tbl_cylinder` and `public.tbl_product`, returning `CylinderSearchResponseDto`.

The operation is read-only and represents active supplier custody. Its governing identity is the supplier supplied in the search request; returned cylinder identities are not mutated by this endpoint. No standalone screen event/debounce/hidden-field contract is proven in the frozen evidence, so none is asserted.

## Approval boundary
Strict applicable contract is complete. Approval remains pending and testing readiness is unchanged.
