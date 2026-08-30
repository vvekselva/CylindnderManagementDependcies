# STORY-0021 — Save Yard Location

- Release: R2
- Endpoint: `POST /yard-location/upload`
- Controller: `CustomerAddressLocationController.saveYardLocation`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user submits the `Upload Yard Location` form with the visible `Save Yard Location` submit button. The form posts to `/yard-location/upload` and binds `yardLocation` into `YardLocationDto`. Its source-proved fields are required HTML Yard select `yardId`, source-location text `sourceReference`, Status `locationStatus`, and checkbox `defaultStartPoint`; manual coordinates are separate optional request parameters named exactly `latitudeText` and `longitudeText`. The submit button has no source-defined enable/disable rule. Browser HTML requires the Yard select for a normal form submit; latitude, longitude and source text have no HTML `required` attribute. The offline-preview JavaScript is independent of submit and defines no debounce/minimum-length gate.

The controller accepts `@ModelAttribute("yardLocation") YardLocationDto request`, optional `latitudeText`, optional `longitudeText`, and redirect attributes. If DTO latitude is null and trimmed `latitudeText` is non-empty it converts that text to `BigDecimal`; longitude follows the same rule. A non-numeric manual coordinate therefore fails through the controller's `RuntimeException` catch. The controller then invokes `CustomerAddressLocationOfflineMapService.saveYardLocation(request)`.

The service rejects a null request or null `yardId` with `Yard is required for location capture.` It starts with the DTO latitude/longitude. If either coordinate is missing and `sourceReference` is non-null, it attempts to extract the first coordinate pair from the source text; a valid parsed pair becomes the working latitude and longitude. Coordinates must both exist, latitude must be -90 through 90, and longitude -180 through 180; exact validation messages are `Latitude and longitude are required.`, `Latitude must be between -90 and 90.`, and `Longitude must be between -180 and 180.` The yard identity is resolved by `YardInventoryJpaDao.findById(request.getYardId())`; absence fails as `Yard not found: <yardId>`.

The persisted default-start branch is exact: `defaultStartPoint` evaluates true when the request value is null or true, and false when explicitly false. When true, the service looks for the newest active default location for the same yard using `findFirstByYardYardInventoryIdAndActiveTrueAndDefaultStartPointTrueOrderByYardLocationIdDesc`. If found, that prior row is changed to inactive, `locationStatus=SUPERSEDED`, `defaultStartPoint=false`, `updatedAt=now`, and saved before the replacement row.

A new `YardLocationDo` is then persisted through `YardLocationJpaDao.save`. The entity maps to `public.tbl_yard_location`: generated `pk_yard_location_id` from sequence `public.pk_yard_location_id_serial`; non-null `fk_yard`; non-null decimal `latitude` and `longitude`; non-null `location_status`; non-null `is_default_start_point`; non-null `is_active`; non-null `created_at`; optional `updated_at`. New rows are active, `createdAt=now`, and `locationStatus` defaults to `VERIFIED` when the request value is null/blank. The DTO `sourceReference` is used as coordinate-source evidence but `YardLocationDo` has no source-reference column, so that text is not persisted by this path.

On successful save the controller sets flash `successMessage` to `Yard location saved successfully.` and redirects to `/yard-location/upload?yardId=<yardId>`. On any caught runtime failure it sets flash `errorMessage` to the exception message and redirects to the same GET, using an empty yardId value when the submitted yardId is null. The GET screen conditionally renders these flash messages visibly. No approval occurred.
