# STORY-0021 — Save Yard Location

- Release: R2
- Endpoint: `POST /yard-location/upload`
- Controller: `CustomerAddressLocationController.saveYardLocation`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0021-local-source-business-behavior-20260902-1647.yaml`

The user submits the `Upload Yard Location` form with the visible `Save Yard Location` submit button. The form posts to `/yard-location/upload` and binds `yardLocation` into `YardLocationDto`. Its source-proved fields are required HTML Yard select `yardId`, source-location text `sourceReference`, Status `locationStatus`, and checkbox `defaultStartPoint`; manual coordinates are separate optional request parameters named exactly `latitudeText` and `longitudeText`. The submit button has no source-defined enable/disable rule.

The controller converts non-empty manual latitude/longitude text to `BigDecimal` when the DTO coordinates are absent, then invokes `CustomerAddressLocationOfflineMapService.saveYardLocation(request)`. The service rejects a null request or null yard, can parse coordinates from `sourceReference` when needed, requires both coordinates, enforces latitude -90..90 and longitude -180..180, and resolves the yard by ID.

When `defaultStartPoint` is null or true, the newest existing active default location for the same yard is superseded by setting it inactive, `locationStatus=SUPERSEDED`, `defaultStartPoint=false`, and `updatedAt=now`. A new `YardLocationDo` is then saved to `public.tbl_yard_location` with active=true, location status defaulting to `VERIFIED`, and createdAt=now. `sourceReference` is not persisted by this entity path.

On success the controller flashes `Yard location saved successfully.` and redirects to `/yard-location/upload?yardId=<yardId>`. Runtime failures are caught, exposed as `errorMessage`, and redirected back to the GET.

The recovered governed ZIP independently confirms the coordinate conversion/validation, default-location supersession, entity/table persistence and visible success/error behavior. STORY-0021 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
