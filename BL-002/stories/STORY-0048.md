# STORY-0048 — Delete Challan Page Photo (AJAX)

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/delete-ajax`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`, plus retained V154 source patch evidence
- Story auto-approval: forbidden
- Enrichment state: `SOURCE_DETAIL_REVIEW_REQUIRED`

## Human-readable story

As an authorized Cylinder Management user working with a delivery-stop challan, I want to deactivate an active challan-page photo through the AJAX delete operation so that an incorrect or no-longer-current photo is no longer treated as the active photo for that challan page while the historical record remains under application control.

## Source-proved execution flow

1. The request is handled by `AddStopController.deleteChallanPagePhotoAjax`.
2. The controller invokes `ChallanPagePhotoUploadService.deactivatePhoto`.
3. The service uses `ChallanPagePhotoJpaDao.findById / save`.
4. The persisted entity is `ChallanPagePhotoDo`.
5. The database dependency is `public.tbl_challan_page_photo`.
6. Successful processing terminates as HTTP 200 JSON with `success=true`.
7. An application-level error terminates as HTTP 400 JSON with `success=false`.
8. An unexpected error terminates as HTTP 500 JSON with `success=false`.

## Persistence identity and exact source-proved fields

Retained V154 source evidence proves `public.tbl_challan_page_photo` contains:

- primary key `pk_challan_page_photo_id BIGINT GENERATED ALWAYS AS IDENTITY`;
- required page link `fk_page_audit_id` to `tbl_challan_page_audit_ledger(pk_page_audit_id)`;
- optional vehicle/load/stop links `fk_vehicle_load`, `fk_vehicle_trip`, `fk_vehicle_trip_stop`;
- file metadata/content columns `original_file_name`, `content_type`, `content_length`, `photo_data`;
- audit columns `uploaded_by_user_id`, `uploaded_at`;
- lifecycle column `active BOOLEAN NOT NULL DEFAULT TRUE`;
- optional `remarks`.

`ChallanPagePhotoDo` maps the same table and maps `challanPagePhotoId` to `pk_challan_page_photo_id` and `active` to the physical `active` column. The V154 schema also defines a partial unique index `uq_challan_page_photo_one_active_per_page` on `fk_page_audit_id` where `active = TRUE`, proving the business invariant that at most one photo is active per challan page.

The canonical delete trace proves the selected `ChallanPagePhotoDo` is loaded by ID and saved through `ChallanPagePhotoJpaDao`, and the business effect is deactivation. Therefore the exact physical deactivation field is now source-proved as `public.tbl_challan_page_photo.active` changing from active to inactive/false while the row remains present.

## Related retrieval behavior

Retained source evidence for `GET /challan-page-photo/{challanPagePhotoId}` proves retrieval uses the same `challanPagePhotoId` identity, returns HTTP 404 when the row is missing or `active=false`, and otherwise returns the stored binary inline. This reinforces that deactivation removes the photo from active retrieval without deleting its historical database row.

## Validation and error behavior

The canonical trace proves three externally visible outcomes: success (HTTP 200 JSON), application error (HTTP 400 JSON), and unexpected error (HTTP 500 JSON).

The exact POST request parameter/body field used by `deleteChallanPagePhotoAjax`, its annotation/datatype/requiredness, the exact null/missing-photo guards inside `deactivatePhoto`, and the visible browser control/event that issues this AJAX request are not yet source-proved from the retained evidence available to this run. They are therefore not invented.

## Exact remaining source-detail gap

Strict Business Behavior completion remains blocked until frozen authoritative source proves:

1. the exact delete request identifier name and binding (`@RequestParam`, path/body field, datatype and requiredness);
2. the exact service guards for null/missing/already-inactive photo identity;
3. the exact visible page/control and browser event that invokes `POST /add-stop/challan-page-photo/delete-ajax` and how the selected photo ID is propagated.

No approval occurred. No application code was changed. No BL-010 work was created or executed.
