# STORY-0049 — Upload Challan Page Photo

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/upload`
- Approval: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Endpoint-role evidence: `BL-002/evidence/STORY-0049-local-source-endpoint-role-20260902-1631.yaml`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management form/API client, I want to submit a challan-page photo through the non-AJAX upload endpoint so that the system resolves the selected challan leaf, replaces any previous active evidence for that leaf, stores the newly uploaded evidence and redirects back to the Add Stop flow with a success or error message.

The recovered frozen source proves that this exact endpoint currently has no visible browser control. The active Supplier and Customer stop pages use the AJAX companion endpoint instead. Therefore this Story documents the backend non-AJAX fallback capability exactly as it exists; it does not invent a visible control for an endpoint that the current source does not expose in the UI.

## Exact controller contract

`AddStopController.uploadChallanPagePhoto(...)` is `@PostMapping("/add-stop/challan-page-photo/upload")` and binds:

- `vehicleLoadId` — required `Long`;
- `actionType` — optional `String`, default `SupplierStop`;
- `challanType` — optional `String`;
- `bookCode` — optional `String`;
- `seriesPrefix` — optional `String`;
- `sheetNumber` — optional `Integer` at the MVC boundary;
- `challanPhoto` — required `MultipartFile`;
- `RedirectAttributes` for redirect feedback.

The redirect target is always `/add-stop?vehicleLoadId={vehicleLoadId}&actionType={actionType}`.

`uploadChallanPhotoInternal(...)` rejects a null/empty multipart file with `Please select a challan photo to upload.` It builds `ChallanPagePhotoUploadRequestDto` containing vehicle load, book type/code/series/sheet identity, original filename, content type, content length, raw bytes and remark `Uploaded from Add Stop page` before calling `ChallanPagePhotoUploadService.processRequest(...)`.

## Service validation and persistence

`ChallanPagePhotoUploadService` requires a non-null request, sheet number, a book identity (`bookId` or non-blank `bookCode`), non-empty photo bytes, positive content length, a maximum size of 5 MiB, and one of JPEG/PNG/WEBP/PDF after content-type normalization.

The target challan page is resolved either by book ID + sheet number or by `ChallanPageAuditLedgerJpaDao.findPageByFullNumber(bookType, bookCode, seriesPrefix, sheetNumber)`. The full-number query joins `public.tbl_challan_page_audit_ledger` and `public.tbl_challan_book_registry`. Missing page produces `Challan page is not found for the selected book and sheet number.`

Before saving the new photo, `ChallanPagePhotoJpaDao.deactivateActivePhotosForPage(pageAuditId)` performs `UPDATE public.tbl_challan_page_photo SET active=false` for the same active `fk_page_audit_id`.

The new `ChallanPagePhotoDo` stores the page audit link, vehicle/load/stop references where supplied, original filename, normalized content type, content length, raw PostgreSQL `bytea` photo data, uploader, upload timestamp, `active=true`, and remarks, then persists through `ChallanPagePhotoJpaDao.save(...)`. This path stores the uploaded bytes in the database rather than a filesystem.

## Redirect outcomes

Successful processing sets flash attribute `challanUploadSuccess` to the service response message and redirects to the Add Stop URL.

A governed application validation error sets `challanUploadError` to the service message. An `IOException` sets `Unable to read the uploaded challan photo.` Any other exception sets `Unable to upload challan photo.` All of these redirect back to the same Add Stop URL.

## Browser/UI applicability proof

A source-wide local search of the recovered ZIP proves the exact non-AJAX path occurs only in `AddStopController.java` at the `@PostMapping` declaration. No HTML or JavaScript source references this exact path.

The currently active browser forms are explicitly bound to the AJAX companion endpoint:

- `Customerstopselectionpage-withoutAutoChallanUpdate.html` → `POST /add-stop/challan-page-photo/upload-ajax`;
- `Supplierstopselectionpage.html` → `POST /add-stop/challan-page-photo/upload-ajax`.

Accordingly, the applicable browser/UI contract for this exact non-AJAX endpoint is **no visible client in the current frozen source**. This is a source-proved absence, not an assumption that the AJAX form submits here. No intent beyond current source behavior is asserted.

## Completion and approval gate

The endpoint boundary, parameters, validation, service/DAO/database behavior, redirect outcomes, and exact UI-applicability state are now source-bound from the recovered governed ZIP. STORY-0049 is therefore `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

No approval occurred. No application code was changed and no BL-010 work was created or executed.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
