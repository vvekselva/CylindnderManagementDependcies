# STORY-0020 — Yard Location Upload Screen

- Release: R2
- Endpoint: `GET /yard-location/upload`
- Controller: `CustomerAddressLocationController.showYardLocationUpload`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0020-local-source-business-behavior-20260902-1645.yaml`

The user enters the Yard Location capture screen with `GET /yard-location/upload`. The only request parameter is optional `yardId` (`Long`, `required=false`). The controller creates a new `YardLocationDto`, copies the optional `yardId` into `yardId`, defaults `locationStatus` to `VERIFIED`, defaults `defaultStartPoint` to `true`, adds it to the model as `yardLocation`, reads active yards through `CustomerAddressLocationOfflineMapService.fetchActiveYardsForLocationCapture()`, adds those rows as `yards`, and renders `with-menu/YardLocationUpload`. The active-yard lookup is read-only and delegates to `YardInventoryJpaDao.findByActiveTrueOrderByYardNameAsc()`; this GET does not persist or mutate a database row.

The rendered screen title is `Upload Yard Location` with the stated intent to save the default yard start point for the offline planning map. The form posts to `/yard-location/upload` and binds to model object `yardLocation`. Visible controls are: required Yard select bound to `yardId`, source-location textarea bound to `sourceReference`, manual `latitudeText`, manual `longitudeText`, Status select bound to `locationStatus` with exact options `VERIFIED` and `PENDING_REVIEW`, checkbox bound to `defaultStartPoint`, a `Preview Yard on Offline Map` button, an offline-map preview container, and a `Save Yard Location` submit button. The screen conditionally renders flash-model `successMessage` and `errorMessage` areas.

On DOMContentLoaded the page retries initialization of `CmasOfflineVectorMap` up to 20 times at 100 ms intervals. If the script becomes available it binds source reference, latitude, longitude, preview button and preview note to `setupLocationUploadPreview`; if it never loads, the visible note becomes `Offline map script did not load. Check /offline-map/js/cmas-offline-vector-map.js` and is marked as an error. The preview helper parses supported coordinate text, propagates valid coordinates to the latitude/longitude fields, validates latitude/longitude ranges, and rerenders from source blur, coordinate change, or preview-button click. No debounce or minimum-length rule is defined.

The recovered governed ZIP independently confirms the controller defaults, active-yard lookup, exact visible controls and preview-event behavior. STORY-0020 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
