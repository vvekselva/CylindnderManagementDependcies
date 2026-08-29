# STORY-0019 — Customer Address Points GeoJSON

- Release: R2
- Endpoint: `GET /customer-address-location/points.geojson`
- Controller: `CustomerAddressLocationController.customerAddressPointsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The endpoint accepts optional BigDecimal query parameters `centerLatitude`, `centerLongitude`, `radiusMeters`, and optional boolean `pendingOnly` defaulting to false. The planning-map screen supplies visible center latitude, center longitude, radius and pending-only controls to its map setup; this endpoint is the source-proved database point API.

The controller passes the four values unchanged to `fetchCustomerAddressMapPointsGeoJson`. The service first validates optional center coordinates: both may be null, but if either is supplied both are required; latitude must be -90..90 and longitude -180..180. A negative radius is rejected with `Radius must be zero or greater.` It calls `CustomerAddressLocationJpaDao.findCustomerAddressMapPoints(centerLatitude, centerLongitude, radiusMeters, pendingOnly)` and maps projection rows into DTOs.

Each GeoJSON feature is Point geometry with coordinates `[longitude, latitude]`. Properties are exact: customerAddressId, customerId, customerName, gstNumber, addressText, locationStatus, pendingRequestCount, pendingRequestedCylinderCount, distanceMeters, and markerType (default `CUSTOMER_LOCATION`). Response metadata contains source `CMAS_DATABASE_CUSTOMER_ADDRESS_LOCATION`, tileDependency `NONE_CUSTOMER_POINTS_ARE_DATABASE_DRIVEN`, all four filter values and pointCount. The controller returns HTTP 200 with `application/json` on successful service return. This is read-only; no entity is mutated. No approval occurred.
