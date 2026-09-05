# STORY-0050 — Upload Challan Page Photo via AJAX

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/upload-ajax`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working on a supplier or customer stop, I want to upload a photo/PDF for the selected physical challan leaf without leaving the stop page so that the selected challan page receives one active evidence attachment and I can continue only after the required evidence is present.

## Exact browser behavior

The current visible stop pages use the AJAX endpoint directly.

### Supplier stop

`with-menu/Supplierstopselectionpage.html` contains `challanPhotoUploadForm` with:

- action `/add-stop/challan-page-photo/upload-ajax`;
- multipart POST submission intercepted by `uploadChallanPhotoAjax(event)`;
- hidden `vehicleLoadId`;
- hidden `actionType=SupplierStop`;
- hidden `challanType=FILLING_NOTE`;
- hidden `bookCode`, `seriesPrefix`, and `sheetNumber` synchronized from the selected challan leaf;
- file input `challanPhoto` accepting `image/jpeg,image/png,image/webp,application/pdf`.

The Upload button is disabled until a challan number is selected, a book code exists, a file is selected, and the current supplier-stop state requires/permits challan evidence. While uploading, the button text changes to `Uploading...` and the browser sends `FormData` with `X-Requested-With: XMLHttpRequest`.

On success the page shows the returned message, stores `challanPagePhotoId` and `originalFileName` through `setSupplierUploadedPhoto(...)`, clears the file input, exposes the uploaded-photo state, and recalculates completion/upload-button eligibility. On failure it displays the returned/fallback error without replacing the active-photo state.

### Customer stop

`with-menu/Customerstopselectionpage-withoutAutoChallanUpdate.html` implements the symmetrical flow through `customerChallanPhotoUploadForm` and `uploadCustomerChallanPhotoAjax(event)`. It sends the selected customer challan identity and `customerChallanPhoto`, stores the returned photo identity through `setCustomerUploadedPhoto(...)`, clears the file input on success, and recalculates customer-stop completion/upload eligibility.

## Exact controller request contract

`AddStopController.uploadChallanPagePhotoAjax(...)` is `@PostMapping("/add-stop/challan-page-photo/upload-ajax")` and binds:

- `vehicleLoadId` — required `Long`;
- `actionType` — optional `String`, default `SupplierStop`;
- `challanType` — optional `String`;
- `bookCode` — optional `String`;
- `seriesPrefix` — optional `String`;
- `sheetNumber` — optional `Integer` at the MVC boundary but required by service validation;
- `challanPhoto` — required `MultipartFile`.

The controller delegates to `uploadChallanPhotoInternal(...)`. That helper rejects a null/empty multipart file with `Please select a challan photo to upload.`, then builds `ChallanPagePhotoUploadRequestDto` with vehicle load, book type/code/series/sheet identity, original filename, content type, content length, raw bytes and the remark `Uploaded from Add Stop page`.

## Service validation and page resolution

`ChallanPagePhotoUploadService.processRequest(...)` validates:

1. request must not be null;
2. `sheetNumber` is required;
3. either `bookId` or non-blank `bookCode` is required;
4. `photoData` must be present and non-empty;
5. `contentLength` must be positive;
6. maximum content length is 5 MiB;
7. allowed normalized content types are JPEG, PNG, WEBP and PDF.

The service resolves the target page using `findByBookIdAndSheetNumber(...)` when `bookId` is supplied, otherwise `ChallanPageAuditLedgerJpaDao.findPageByFullNumber(bookType, bookCode, seriesPrefix, sheetNumber)`. The full-number query joins `public.tbl_challan_page_audit_ledger` to `public.tbl_challan_book_registry`, matching book type, sheet number, normalized book code and normalized optional series prefix. No page produces the user error `Challan page is not found for the selected book and sheet number.`

## Persistence behavior and exact columns

Before inserting the new evidence, `ChallanPagePhotoJpaDao.deactivateActivePhotosForPage(pageAuditId)` performs a native update on `public.tbl_challan_page_photo`, setting `active=false` for any currently active rows belonging to the same `fk_page_audit_id`.

The service then creates `ChallanPagePhotoDo` and persists:

- `pageAuditLedger` -> `fk_page_audit_id`;
- `vehicleLoadId` -> `fk_vehicle_load`;
- optional `vehicleTripId` -> `fk_vehicle_trip`;
- optional `vehicleTripStopId` -> `fk_vehicle_trip_stop`;
- trimmed `originalFileName` -> `original_file_name`;
- normalized content type -> `content_type`;
- content length -> `content_length`;
- raw bytes -> PostgreSQL `bytea` column `photo_data`;
- optional uploader -> `uploaded_by_user_id`;
- `LocalDateTime.now()` -> `uploaded_at`;
- `active=true` -> `active`;
- trimmed remarks -> `remarks`.

The new row is saved through `ChallanPagePhotoJpaDao.save(...)`. This is database-backed binary storage; no filesystem storage is used by this path.

## Exact AJAX response behavior

On success the controller returns HTTP 200 JSON containing `success=true`, service message, `pageAuditId`, `sheetNumber`, `challanPagePhotoId`, `originalFileName`, and `photoUrl=/cylindermanagement/challan-page-photo/{id}`.

A `CylinderManagementApplicationException` or uploaded-file `IOException` returns HTTP 400 JSON with `success=false` and the applicable message. Any other exception returns HTTP 500 JSON with `success=false` and `Unable to upload challan photo.`

## Business invariant

The operation replaces the active evidence for the selected challan page rather than accumulating multiple active photos. Existing active rows are retained historically but deactivated, and the newly saved row becomes the active photo.

## Completion and approval gate

The visible supplier/customer controls, browser enablement/submission behavior, exact multipart fields and requiredness, validation rules, page-resolution query, prior-photo deactivation, binary persistence columns, response payload, and visible success/error handling are source-bound from the recovered governed ZIP.

STORY-0050 is therefore `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

No approval is inferred. No application code was changed and no BL-010 work was created or executed.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
