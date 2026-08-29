# STORY-0059 — Supplier Lookup Page

- Release: R1
- Endpoint: `GET /fetchSupplierByPage`
- Controller: `SupplierFetchByPageController.doGet`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`SupplierFetchByPageController.doGet` invokes `SupplierFetchByPageService.processRequest`, which reads suppliers through `SupplierJpaDao` / `SupplierDo` from `public.tbl_supplier` and mapped address, phone, city, state and country relations backed by `public.tbl_address`, `public.tbl_phone_number`, `public.tbl_city`, `public.tbl_state` and `public.tbl_country`. The success terminal is `final-version-1/SupplierListPage`; BL-001 also records a handled redirect back to `/fetchSupplierByPage?...`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining exact proof includes page/search request parameter names/defaults, supplier row IDs and links, relation rendering rules, active-only behavior if any, pagination/sort semantics, browser search events, and exact empty/error redirect/message behavior.

No missing behavior is inferred.
