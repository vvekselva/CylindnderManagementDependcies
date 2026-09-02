# STORY-0072 — Delivery Planning Demand Bubbles GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/demand-bubbles.geojson`
- Controller: `DeliveryPlanningApiController.demandBubblesGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0072-local-source-business-behavior-20260902-1649.yaml`

The read-only endpoint accepts optional BigDecimal `segmentMeters` and passes it to `DeliveryPlanningMapService.fetchDemandBubblesGeoJson`. Segment size defaults to 5000 when absent, below 500, or above 50000; otherwise the supplied value is used.

The service reads demand bubbles for the effective segment size and maps them to GeoJSON Point features. Properties include customer count, bubble radius score, deterministic/forecast/total demand scores, dominant signal type, yard identity/location and segment details. Marker color is derived from the dominant signal classification.

Metadata identifies source `CMAS_DATABASE_DELIVERY_PLANNING_YARD_DISTANCE_CUSTOMER_DENSITY`, no tile dependency, populationDensityMode=false, effective segmentMeters and pointCount. No database write occurs.

The recovered governed ZIP independently confirms segment normalization, demand-bubble DAO use, GeoJSON/marker mapping and metadata. STORY-0072 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
