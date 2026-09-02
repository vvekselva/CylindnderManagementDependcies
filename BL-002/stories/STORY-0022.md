# STORY-0022 — Yard Location Points GeoJSON

- Release: R2
- Endpoint: `GET /yard-location/points.geojson`
- Controller: `CustomerAddressLocationController.yardLocationsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0022-local-source-business-behavior-20260902-1641.yaml`

This is a read-only JSON API with no request parameters and no form submission. `GET /yard-location/points.geojson` is declared with `application/json` production and the controller returns `ResponseEntity.ok(customerAddressLocationOfflineMapService.fetchYardLocationsGeoJson())`; successful service completion therefore returns HTTP 200.

The service reads active yard locations and maps them into yard DTOs. For each active yard it emits one GeoJSON `Feature` with Point geometry `[longitude, latitude]`. Feature properties are `yardLocationId`, `yardId`, `yardCode`, `yardName`, `locationStatus`, `defaultStartPoint`, and constant `markerType=YARD_LOCATION`.

The top-level object is a `FeatureCollection`; metadata is `source=CMAS_DATABASE_YARD_LOCATION`, `tileDependency=NONE_YARD_POINTS_ARE_DATABASE_DRIVEN`, and `pointCount=<number of active yard rows>`.

No browser input, minimum length, debounce, hidden-field propagation, button gate, persistence write, reset behavior or approval applies to this endpoint. Its consumer is the offline-map feature layer.

The recovered governed ZIP independently confirms the controller, active-yard read, GeoJSON structure and metadata. STORY-0022 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
