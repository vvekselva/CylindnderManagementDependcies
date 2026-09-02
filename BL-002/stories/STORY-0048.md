# STORY-0048 — Delete Challan Page Photo (AJAX)

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/delete-ajax`
- Approval: `PENDING_USER_APPROVAL`
- Review state: `READY_FOR_USER_REVIEW`
- Rework state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working on a supplier or customer stop, I want to delete/deactivate an uploaded challan-page photo so that an incorrect or obsolete photo is no longer the active photo for that challan page, while the historical database row is retained.

## Exact request and controller behavior

`AddStopController.deleteChallanPagePhotoAjax(...)` handles `POST /add-stop/challan-page-photo/delete-ajax`.

The exact request binding is:

- parameter name: `challanPagePhotoId`
- binding: `@RequestParam("challanPagePhotoId")`
- Java type: `Long`
- requiredness: required by default at the Spring MVC boundary

The controller delegates to `ChallanPagePhotoUploadService.deactivatePhoto(challanPagePhotoId)` through `challanPagePhotoManagementService`.

Visible outcomes are:

- success: HTTP 200 JSON, `success=true`, message `Challan photo deleted. Upload another photo before completing the stop.`
- governed application error: HTTP 400 JSON, `success=false`, service error message
- unexpected error: HTTP 500 JSON, `success=false`, message `Unable to delete challan photo.`

## Exact service guard and persistence transition

`ChallanPagePhotoUploadService.deactivatePhoto(Long challanPagePhotoId)` is transactional and proves the following behavior:

1. null ID -> application/user error `Challan photo id is required.`
2. repository lookup -> `ChallanPagePhotoJpaDao.findById(challanPagePhotoId)`
3. missing row or already inactive row -> application/user error `Active challan photo is not found.`
4. active row -> `photo.setActive(Boolean.FALSE)`
5. persistence -> `challanPagePhotoJpaDao.save(photo)`

`ChallanPagePhotoJpaDao` is the Spring Data JPA persistence boundary for `ChallanPagePhotoDo`.

## Entity and database identity

`ChallanPagePhotoDo` maps `public.tbl_challan_page_photo`.

The relevant exact mappings are:

- `challanPagePhotoId` -> `pk_challan_page_photo_id`
- `active` -> `active`
- page link -> `fk_page_audit_id`
- optional load/trip/stop links -> `fk_vehicle_load`, `fk_vehicle_trip`, `fk_vehicle_trip_stop`
- file data -> `original_file_name`, `content_type`, `content_length`, `photo_data`
- audit fields -> `uploaded_by_user_id`, `uploaded_at`
- optional note -> `remarks`

The deactivation operation therefore updates `public.tbl_challan_page_photo.active` from active/true to false. It does not delete the database row.

The V154 schema evidence retains the one-active-photo-per-page invariant through the partial unique index on `fk_page_audit_id` where `active = TRUE`.

## Browser/UI behavior

### Supplier stop

`with-menu/Supplierstopselectionpage.html` renders an uploaded-photo panel containing `View photo` and a visible `Delete` button. The button invokes `deleteUploadedChallanPhoto()`.

The browser keeps the selected active photo identity in `supplierUploadedPhotoId`. The delete function sends:

`POST /cylindermanagement/add-stop/challan-page-photo/delete-ajax`

with `Content-Type: application/x-www-form-urlencoded`, `X-Requested-With: XMLHttpRequest`, and body field:

`challanPagePhotoId=<supplierUploadedPhotoId>`.

On success it calls `resetSupplierUploadedPhoto()` and shows the returned success message. That reset clears the current photo identity and causes the stop-completion/upload-button state to be recalculated. On failure it displays the returned/fallback error message.

### Customer stop

`with-menu/Customerstopselectionpage-withoutAutoChallanUpdate.html` implements the symmetrical behavior through the visible `Delete` button and `deleteCustomerUploadedChallanPhoto()`, passing `customerUploadedPhotoId` as the same `challanPagePhotoId` request field. Success resets the uploaded customer photo and recalculates completion/upload state; failure surfaces the error message.

## Related retrieval behavior

`GET /challan-page-photo/{challanPagePhotoId}` uses the same identity. Retrieval returns 404 when the row is absent or inactive, otherwise returning the stored content. Therefore deactivation removes the photo from active retrieval while preserving historical storage.

## Completion and approval gate

The exact browser control, request identifier/binding/datatype, service null/missing/already-inactive guards, repository operation, entity mapping, database field transition, and visible success/failure behavior are source-bound.

STORY-0048 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval is inferred. No application code was changed and no BL-010 work was created or executed.
