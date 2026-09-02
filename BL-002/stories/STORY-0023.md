# STORY-0023 — Customer Address Location Upload Screen

- Release: R2
- Endpoint: `GET /customer-address-location/upload`
- Controller: `CustomerAddressLocationController.showUpload`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0023-local-source-business-behavior-20260902-1642.yaml`

The user enters the customer-location capture screen through `GET /customer-address-location/upload`. The only request parameter is optional `customerAddressId` (`Long`, `required=false`). The controller creates a new `CustomerAddressLocationDto`, copies that optional ID into `customerAddressId`, defaults `locationSource` to `WHATSAPP_COPY_PASTE`, defaults `locationStatus` to `VERIFIED`, adds the DTO to the model as `location`, and renders `with-menu/CustomerAddressLocationUpload`. This GET performs no database write.

The visible page explains that a WhatsApp/Google Maps location link can be pasted or latitude/longitude entered manually. Its POST form targets `/customer-address-location/upload`. Visible controls include required customerAddressId, sourceReference, latitudeText, longitudeText, locationSource, locationStatus, captured employee/mobile fields, remarks, Preview Location on Offline Map, the preview container, and Save Location.

On DOMContentLoaded the page retries discovery of `CmasOfflineVectorMap` up to 20 times with 100 ms delay. When loaded, `setupLocationUploadPreview` binds the source text, latitude, longitude, preview button and preview-note elements. The shared helper recognizes supported Google Maps/geo/plain coordinate forms, propagates valid parsed coordinates into the latitude/longitude inputs, validates latitude -90..90 and longitude -180..180, and rerenders on source blur, coordinate change and preview-button click. There is no minimum-length or debounce rule.

The recovered governed ZIP independently confirms the controller defaults, exact form controls and local preview behavior. STORY-0023 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
