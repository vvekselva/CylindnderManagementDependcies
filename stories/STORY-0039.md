# STORY-0039 — List suppliers with mapped contact and location data

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `2da4c54055aa1ca3bc0ec88c1c3b8ec178cb955d2c03b2a7071fd6726279e352`  
**Matrix row:** `GET /fetchSupplierByPage`

The controller invokes `SupplierFetchByPageService`, which reads `SupplierDo` through `SupplierJpaDao` from `public.tbl_supplier` and maps the source-proved address, phone, city, state and country relations required by the listing. The terminal path is the supplier-list view or the accepted handled redirect. Exact pagination/search parameter names and redirect trigger text are not asserted.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the proved supplier/contact/location reads and list rendering.

Pending explicit user approval for the exact fingerprint above.
