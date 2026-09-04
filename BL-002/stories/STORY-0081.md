# STORY-0081 — Submit Supplier Registration

- Release: R1
- Endpoint: `POST /ingestSupplier`
- Controller: `SupplierIngestionController.doPost`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator, I can submit the Register Supplier form so the application validates supplier identity/contact/address data, resolves selected geography identities, and persists a new active supplier with its address and phone relationship.

The form posts model `supplier` to `/ingestSupplier`. Bound fields are supplier name, GST number, phone number, address lines/landmark, and selected city/state/country IDs and names. Browser autocomplete on the GET page supplies the geography identities; CSRF is included when available.

`SupplierIngestionController.doPost(...)` delegates the bound `SupplierIngestionRequestDto` to the typed application service. `SupplierIngestionService.processRequest(...)` first invokes `SupplierIngestionRequestValidator`. Source-proved validation includes: non-null request/supplier object; nonblank supplier name; GST required, GST regex/state-code validation and duplicate-GST check; phone required, formatting normalization, 10-digit/pattern validation and duplicate-phone check; address/geography validation in the same validator contract. Validation errors are attached to the request/nested DTOs and raise the input-validation flow used by the controller to re-render the form.

On successful validation, the service maps `SupplierDto` to `SupplierDo`, sets `active=true`, maps address and phone entities, resolves City/State/Country by submitted persistent IDs, links supplier↔address and supplier↔phone collections, and calls `SupplierJpaDao.save(supplierDo)`.

`SupplierDo` maps `public.tbl_supplier` with `supplier_name`, `gst_number`, `fk_address`, `fk_phone_number` and active state; linked address/phone entities carry their own persistence identities. The transaction creates the supplier aggregate rather than only validating it.

Success redirects using the configured home/list link. `InvalidInputParameterException` re-renders `with-menu/SupplierIngestion` with validator-annotated DTO data and visible field/card errors. A general `CylinderManagementApplicationException` also re-renders the form; no separate global message is source-proved in the controller.

## Completion and approval gate

The recovered ZIP confirms the full field→validation→geography resolution→entity mapping→repository save path, exact supplier table identity and visible success/error outcomes. STORY-0081 is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with downstream fan-out requested. This approval accepts the source-bound supplier submission/persistence contract as written and does not authorize application-code or BL-010 mutation.
