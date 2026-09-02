# STORY-0049 — Upload Challan Page Photo

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/upload`
- Approval: `PENDING_USER_APPROVAL`
- Rework state: `SOURCE_DETAIL_REVIEW_REQUIRED`
- Enrichment state: `SOURCE_DETAIL_REVIEW_REQUIRED`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user or compatible form client, I want to submit a challan-page photo through the non-AJAX upload endpoint so that the system resolves the selected challan leaf, replaces any previous active evidence for that leaf, stores the newly uploaded evidence and redirects back to the Add Stop flow with a success or error message.

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

## Browser/UI source review

The recovered source contains the non-AJAX controller endpoint, but the current visible Supplier and Customer stop templates do **not** submit to this endpoint. Their actual upload forms point to `POST /add-stop/challan-page-photo/upload-ajax` and intercept submission with JavaScript (`STORY-0050`). A source-wide local search of the recovered ZIP found no HTML/JS reference that submits to the non-AJAX `/upload` path.

Therefore the backend non-AJAX contract is fully source-proved, but the strict BL-002 visible-control/browser-event contract for this exact endpoint is not. Treating the AJAX form as if it submitted here would invent behavior.

## Exact remaining source-detail gap

Strict completion requires either:

1. authoritative source proving a visible/browser form or other governed client that submits to `POST /add-stop/challan-page-photo/upload`; or
2. governed confirmation that this endpoint is intentionally a non-visible fallback/API endpoint for which no browser control is applicable.

Until that is established, STORY-0049 remains `SOURCE_DETAIL_REVIEW_REQUIRED` rather than being promoted to business-behavior complete.

No approval occurred. No application code was changed and no BL-010 work was created or executed.
