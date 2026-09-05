# STORY-0016 — Challan Page Photo Retrieval

- Release: R1
- Endpoint: `GET /challan-page-photo/{challanPagePhotoId}`
- Functional area: Challan Monitoring
- Controller: `ChallanPagePhotoController.retrieveChallanPagePhoto(...)`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Business-behavior rework: APPROVED_AFTER_REWORK
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This operation lets a browser/user display the evidence photo stored for a specific Challan page. The caller supplies the Challan Page Photo record ID, and the application returns the stored image/file bytes only when that record exists and is active. This supports visual verification of challan-page evidence from monitoring and operational screens.

## Input and validation

The only input is path variable `challanPagePhotoId`, the database identity of the photo record. Spring binds it as `Long`; a value that cannot be converted to Long is rejected by normal request binding before the controller method can perform the lookup.

The controller calls `ChallanPagePhotoJpaDao.findById(challanPagePhotoId)`. If no row exists, or the row exists but `active = false`, the response is HTTP `404 NOT_FOUND` with no photo body. There is no substitution of an older/inactive photo.

## Exact read identity

`ChallanPagePhotoDo` maps to `public.tbl_challan_page_photo` with generated primary key `pk_challan_page_photo_id`. The stored record links to a Challan page audit row through `fk_page_audit_id` and can also carry vehicle load/trip/stop identities. The file metadata includes original file name, content type, content length, binary `photo_data`, uploader, upload time, active flag and remarks. `photo_data` is stored as PostgreSQL `bytea`. fileciteturn121file0L2-L2

## What happens on success

For an active photo:

1. Content-Type is taken from the persisted `content_type`.
2. Content-Length uses persisted `content_length`; if that Java value is null, the controller falls back to the actual byte-array length.
3. Content-Disposition is `inline`, so a compatible browser can display the content instead of forcing a download.
4. The persisted original file name is used. If absent, the fallback name is `challan-page-photo`.
5. The response body is the persisted `photo_data` byte array and HTTP status is `200 OK`.

The controller method is `@Transactional(readOnly = true)`, and this GET performs no database mutation. fileciteturn119file0L2-L2

## User-visible outcome and errors

An active record returns the actual stored content inline. Missing or inactive records return 404. There is no Thymeleaf page and no page-local friendly error message for this endpoint; the HTTP response itself is the behavior.

The controller does not perform a separate ownership/authorization check in the frozen source. This Story therefore does not claim one. Any security applied elsewhere in the application stack would require separate source evidence.

## Selector UX review

This binary-resource endpoint has no Customer/Product/Supplier/Vehicle/Driver/Address or other selectable reference control, so search-box conversion is not applicable.

## Business impact

The operation preserves the rule that only the currently active photo record can be shown through this URL, while inactive historical records remain unavailable from this direct endpoint. It is a read-only evidence retrieval capability; photo upload/replacement/deactivation belongs to separate operations.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval gate: mandatory source/code conformance must pass before downstream executable generation/execution is treated as eligible
- Fan-out targets after conformance: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence

This approval does not authorize application-code mutation. If post-approval conformance detects drift, prepare the governed exact drift/code-change manifest for explicit user approval before any BL-010 or application-source change.
