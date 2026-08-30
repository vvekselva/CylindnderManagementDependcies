# STORY-0023 — Customer Address Location Upload Screen

- Release: R2
- Endpoint: `GET /customer-address-location/upload`
- Controller: `CustomerAddressLocationController.showUpload`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user enters the customer-location capture screen through `GET /customer-address-location/upload`. The only request parameter is optional `customerAddressId` (`Long`, `required=false`). The controller creates a new `CustomerAddressLocationDto`, copies that optional ID into `customerAddressId`, defaults `locationSource` to `WHATSAPP_COPY_PASTE`, defaults `locationStatus` to `VERIFIED`, adds the DTO to the model as `location`, and renders `with-menu/CustomerAddressLocationUpload`. This GET performs no database write.

The visible page is titled `Upload Customer Location` / `Upload Customer Address Location` and explains that a WhatsApp/Google Maps location link can be pasted or latitude/longitude entered manually. Its POST form targets `/customer-address-location/upload` and binds to `location`. Visible controls are: required numeric `customerAddressId`; `sourceReference` textarea; separate `latitudeText` and `longitudeText` inputs; `locationSource` select with exact values `WHATSAPP_COPY_PASTE`, `MANUAL_ENTRY`, `WHATSAPP_EXPORT_IMPORT`, and `MOBILE_SCREENSHOT_ENTRY`; `locationStatus` select with `VERIFIED` and `PENDING_REVIEW`; `capturedByEmployeeName`; `capturedByMobileNumber`; `remarks`; `Preview Location on Offline Map`; the offline-map preview container; and `Save Location`. An `errorMessage` area is rendered conditionally.

On DOMContentLoaded the page retries discovery of `CmasOfflineVectorMap` up to 20 times with 100 ms delay. When loaded, `setupLocationUploadPreview` binds the source text, latitude, longitude, preview button and preview-note elements. The shared helper recognizes Google Maps `?q=lat,lng`, Google Maps `@lat,lng`, `geo:lat,lng`, and plain `lat,lng`; a valid parsed source propagates into the latitude/longitude inputs. Latitude must be -90 through 90 and longitude -180 through 180. Source-reference `blur` recalculates the current point; latitude/longitude `change` invokes preview; preview-button `click` prevents default and invokes preview. There is no minimum-length or debounce rule.

Invalid preview coordinates produce the visible no-valid-coordinate fallback and no persistence request. Valid coordinates render one customer-location marker centered at `[longitude, latitude]` with zoom 15 through local offline-map assets. If the helper script never loads, the note becomes `Offline map script did not load. Check /offline-map/js/cmas-offline-vector-map.js` and is marked as an error. The `Save Location` submit remains a separate action handled by STORY-0024; no source-defined button enable/disable guard beyond the browser-required customer-address ID exists. No approval occurred.
