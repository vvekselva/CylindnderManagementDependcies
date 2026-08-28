# STORY-0048 — Delete Challan Page Photo (AJAX)

## Status

- Release: R1
- Endpoint: `POST /add-stop/challan-page-photo/delete-ajax`
- Approval: `PENDING_USER_APPROVAL`
- Source basis: canonical BL-001 traceability matrix at frozen source commit `3ae6e61442132d94a307275b08dd65fcef228d89`
- Story auto-approval: forbidden

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

## Persistence effect

The source-proved business effect is deactivation of the selected active challan-page photo through the challan-page-photo persistence path. The canonical trace proves the table dependency `public.tbl_challan_page_photo` and the DAO `findById / save` path. It does not, by itself, prove the exact physical column names changed by `deactivatePhoto`; those column-level details must be bound from exact source before this story is treated as field-contract complete.

## Validation and error behavior

The canonical trace proves three externally visible outcomes: success (HTTP 200 JSON), application error (HTTP 400 JSON), and unexpected error (HTTP 500 JSON). The exact request-field name, null/blank checks, ownership/authorization checks, and detailed validation message text are not asserted here because they are not proved by the canonical trace excerpt used for this enrichment.

## Review contract

Before user approval, exact source review must confirm any request parameter/body field used to identify the photo, its datatype and requiredness, the precise active/deactivation fields persisted in `public.tbl_challan_page_photo`, and any validation guards not represented in the canonical chain. No missing behavior may be invented.

## Acceptance evidence already proved

- Controller-to-service-to-DAO-to-entity-to-table chain is complete.
- Success/error terminal classes are represented.
- Database dependency is identified.
- No approval is granted by this enrichment step.
