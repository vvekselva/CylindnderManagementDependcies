# STORY-0071 — Delivery Planning Demand Points GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/demand-points.geojson`
- Controller: `DeliveryPlanningApiController.demandPointsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This read-only API accepts optional BigDecimal `centerLatitude`, `centerLongitude`, `radiusMeters` and optional String `signalType`, `forecastWindow`, `demandCategory`. The controller passes all six to `DeliveryPlanningMapService.fetchDemandPointsGeoJson`.

The service requires center latitude/longitude either both absent or both present; latitude must be -90..90, longitude -180..180. Negative radius is rejected. String filters are normalized: null, blank or `ALL` become null; otherwise trimmed uppercase values are passed to `DeliveryPlanningDemandJpaDao.findDemandPoints`.

Each DAO projection becomes a GeoJSON Point `[longitude, latitude]`. Properties include customer/customer-address/product identity, order request counts/quantities and dates, phone verification counts/time, spot-check counts/time, active holdings, closed sample count, consumption/projection fields, forecast/demand classifications, markerColor, priorityRank, demandScore, distanceMeters, and `selectedForPlanning=false`. Metadata identifies source `CMAS_DATABASE_DELIVERY_PLANNING_DEMAND_SIGNAL`, no tile dependency, normalized filters and pointCount.

There is no persistence mutation or local controller error conversion. No approval occurred.
