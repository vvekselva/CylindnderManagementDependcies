# STORY-0022 — Yard Location Points GeoJSON

- Release: R2
- Endpoint: `GET /yard-location/points.geojson`
- Controller: `CustomerAddressLocationController.yardLocationsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This is a read-only JSON API with no request parameters and no form submission. `GET /yard-location/points.geojson` is declared with `application/json` production and the controller returns `ResponseEntity.ok(customerAddressLocationOfflineMapService.fetchYardLocationsGeoJson())`; successful service completion therefore returns HTTP 200.

The service reads `YardLocationJpaDao.findActiveYardLocations()` and maps every projection row through `YardLocationMapper`. The DAO query is native SQL over `public.tbl_yard_location yl` joined to `public.tbl_yard_inventory y` on `y.pk_yard_inventory_id = yl.fk_yard`, filters `yl.is_active = true`, and orders default-start points first then yard name. The exact projected/read identities are `pk_yard_location_id` as yardLocationId, `pk_yard_inventory_id` as yardId, yardCode, yardName, latitude, longitude, locationStatus and defaultStartPoint. `YardLocationMapper` copies those fields into `YardLocationDto` without mutation.

For each active yard, the service emits one GeoJSON `Feature`. Geometry type is `Point` and coordinates are exactly `[longitude, latitude]`. Feature properties are exactly `yardLocationId`, `yardId`, `yardCode`, `yardName`, `locationStatus`, `defaultStartPoint`, and `markerType` with constant `YARD_LOCATION`. The top-level object is `FeatureCollection`; metadata is exactly `source=CMAS_DATABASE_YARD_LOCATION`, `tileDependency=NONE_YARD_POINTS_ARE_DATABASE_DRIVEN`, and `pointCount=<number of mapped active yard rows>`.

No browser input, minimum length, debounce, hidden-field propagation, button gate, persistence write, reset behavior or approval applies to this endpoint. Its visible consumer is the offline-map feature set, but this story itself performs only the database read and JSON response. No approval occurred.
