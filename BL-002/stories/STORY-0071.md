# STORY-0071 — Delivery Planning Demand Points GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/demand-points.geojson`
- Controller: `DeliveryPlanningApiController.demandPointsGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0071-local-source-business-behavior-20260902-1648.yaml`

This read-only API accepts optional BigDecimal `centerLatitude`, `centerLongitude`, `radiusMeters` and optional String `signalType`, `forecastWindow`, `demandCategory`. The controller passes all six to `DeliveryPlanningMapService.fetchDemandPointsGeoJson`.

The service requires center latitude/longitude either both absent or both present, validates latitude -90..90 and longitude -180..180, and rejects negative radius. String filters normalize null, blank or `ALL` to null; otherwise trimmed uppercase values are passed to the demand DAO.

Each DAO projection becomes a GeoJSON Point `[longitude, latitude]` with customer/address/product identities, demand/order/holding/forecast fields, priority/demand scores, distance and selection status. Metadata identifies source `CMAS_DATABASE_DELIVERY_PLANNING_DEMAND_SIGNAL`, no tile dependency, normalized filters and pointCount. No persistence mutation occurs.

The recovered governed ZIP independently confirms the parameter normalization/validation, demand DAO delegation, GeoJSON mapping and read-only response. STORY-0071 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
