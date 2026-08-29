# STORY-0049 — Upload Challan Page Photo

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/upload`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working with a delivery-stop challan, I want to upload a photo for a challan page so that the system can associate the current uploaded evidence with the resolved challan page and retain that photo through the governed challan-photo persistence path.

## Source-proved execution flow

1. The request is handled by `AddStopController.uploadChallanPagePhoto`, which delegates through `uploadChallanPhotoInternal`.
2. The controller invokes `ChallanPagePhotoUploadService.processRequest`.
3. The service resolves the challan page by full number through `ChallanPageAuditLedgerJpaDao.findPageByFullNumber`.
4. The resolved ledger entity is `ChallanPageAuditLedgerDo`, backed by `public.tbl_challan_page_audit_ledger`; the chain also depends on `public.tbl_challan_book_registry`.
5. Any previous active photo for the page is deactivated through `ChallanPagePhotoJpaDao.deactivateActivePhotosForPage` against `public.tbl_challan_page_photo`.
6. The uploaded photo is persisted through `ChallanPagePhotoJpaDao.save` as `ChallanPagePhotoDo` in `public.tbl_challan_page_photo`.
7. Successful processing redirects to `/add-stop?vehicleLoadId=...&actionType=...` with flash success.
8. Error processing redirects to the same add-stop flow with flash error.

## Persistence effect

The source-proved effects are resolution of the target challan page, deactivation of any previous active photo for that page, and persistence of the uploaded photo in `public.tbl_challan_page_photo`. The canonical trace also proves dependencies on `public.tbl_challan_page_audit_ledger` and `public.tbl_challan_book_registry`. Exact physical column names, uploaded-file storage representation, and field-level transformations are not asserted here because they are not proved by the canonical BL-001 trace used for this enrichment.

## Validation and error behavior

The canonical trace proves both success and error redirect terminals. It does not by itself prove the exact multipart parameter names, datatype/size/content-type constraints, null/blank checks, ownership checks, or precise validation-message text. Those details remain source-detail review items and must not be invented.

## Unique-key reconciliation

The BL-002 register identifies STORY-0049 as `POST /add-stop/challan-page-photo/upload`. The canonical BL-001 matrix contains the same HTTP method and path and identifies `AddStopController.uploadChallanPagePhoto` as the controller method. Therefore the previously recorded `STORY-0049_UNIQUE_KEY_MISMATCH` is resolved by exact authoritative method+path identity; no remapping to another endpoint was performed.

## Review contract

Before user approval, exact source review must confirm multipart/request field names, requiredness, datatype and file constraints, exact persisted photo/active-state columns, any filesystem/blob-storage behavior, and validation guards not represented in the canonical chain. No missing behavior may be invented.

## Acceptance evidence already proved

- Story unique key matches canonical BL-001 exactly.
- Controller-to-service-to-DAO/entity/table chains are represented.
- Prior-photo deactivation and new-photo persistence paths are represented.
- Success/error redirect terminal classes are represented.
- No approval is granted by this enrichment step.
