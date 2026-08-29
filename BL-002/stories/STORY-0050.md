# STORY-0050 — Upload Challan Page Photo via AJAX

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/upload-ajax`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working with a delivery-stop challan, I want to upload a challan-page photo through the AJAX endpoint so that the system can resolve the intended challan page, replace the currently active photo evidence for that page, persist the new photo, and return a machine-readable success or error result to the page without changing the accepted business flow.

## Source-proved execution flow

1. The request is handled by `AddStopController.uploadChallanPagePhotoAjax`, which delegates through `uploadChallanPhotoInternal`.
2. The controller invokes `ChallanPagePhotoUploadService.processRequest`.
3. The service resolves the challan page by full number through `ChallanPageAuditLedgerJpaDao.findPageByFullNumber`.
4. The resolved ledger entity is `ChallanPageAuditLedgerDo`, backed by `public.tbl_challan_page_audit_ledger`; the chain also depends on `public.tbl_challan_book_registry`.
5. Any previous active photo for the resolved page is deactivated through `ChallanPagePhotoJpaDao.deactivateActivePhotosForPage` against `public.tbl_challan_page_photo`.
6. The uploaded photo is persisted through `ChallanPagePhotoJpaDao.save` as `ChallanPagePhotoDo` in `public.tbl_challan_page_photo`.
7. Successful processing terminates with HTTP 200 JSON containing `success=true`.
8. Application or I/O error processing terminates with HTTP 400 JSON containing `success=false`.
9. An unexpected error terminates with HTTP 500 JSON containing `success=false`.

## Persistence effect

The source-proved effects are resolution of the target challan page, deactivation of any previous active photo for that page, and persistence of the newly uploaded photo in `public.tbl_challan_page_photo`. The canonical trace also proves dependencies on `public.tbl_challan_page_audit_ledger` and `public.tbl_challan_book_registry`. Exact physical column names, uploaded-file storage representation, and field-level transformations are not asserted because they are not proved by the canonical BL-001 trace used for this enrichment.

## Validation and error behavior

The canonical trace proves the three terminal response classes: HTTP 200 with `success=true`, HTTP 400 with `success=false` for application or I/O errors, and HTTP 500 with `success=false` for unexpected errors. It does not by itself prove the exact multipart parameter names, datatype/size/content-type constraints, null/blank checks, ownership checks, or exact JSON error-message text. Those details remain source-detail review items and must not be invented.

## Unique-key proof

The BL-002 register identifies STORY-0050 as `POST /add-stop/challan-page-photo/upload-ajax`. The canonical BL-001 matrix contains the exact same HTTP method and path and identifies `AddStopController.uploadChallanPagePhotoAjax` as the controller method. No endpoint remapping is required.

## Review contract

Before user approval, exact source review must confirm multipart/request field names, requiredness, datatype and file constraints, exact persisted photo/active-state columns, any filesystem/blob-storage behavior, and validation guards not represented in the canonical chain. No missing behavior may be invented.

## Acceptance evidence already proved

- Story unique key matches canonical BL-001 exactly.
- Controller-to-service-to-DAO/entity/table chains are represented.
- Prior-photo deactivation and new-photo persistence paths are represented.
- HTTP 200, HTTP 400, and HTTP 500 JSON terminal classes are represented.
- No approval is granted by this enrichment step.
