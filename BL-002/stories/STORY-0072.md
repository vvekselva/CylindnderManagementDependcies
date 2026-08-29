# STORY-0072 — Delivery Planning Demand Bubbles GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/demand-bubbles.geojson`
- Controller: `DeliveryPlanningApiController.demandBubblesGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The read-only endpoint accepts optional BigDecimal `segmentMeters` and passes it to `DeliveryPlanningMapService.fetchDemandBubblesGeoJson`. Segment size defaults to 5000 when absent, below 500, or above 50000; otherwise the supplied value is used. The service reads `DeliveryPlanningDemandJpaDao.findDemandBubbles(effectiveSegmentMeters)` and maps projection rows to bubble DTOs.

Each response feature is GeoJSON Point `[longitude, latitude]`. Properties include customerCount; bubbleRadiusScore as max(customerCount,totalDemandScore); deterministic/forecast/total demand scores; dominantSignalType; yard identity/location; segment size/index/grid indices/start/end/label; purpose `DELIVERY_PLANNING_SEGMENTED_CUSTOMER_DENSITY`; and markerColor resolved as red for DETERMINISTIC_DOMINANT, amber for FORECAST_DOMINANT, blue for CUSTOMER_DENSITY_ONLY/POPULATION_ONLY, otherwise gray.

Metadata identifies source `CMAS_DATABASE_DELIVERY_PLANNING_YARD_DISTANCE_CUSTOMER_DENSITY`, no tile dependency, descriptive purpose, populationDensityMode=false, effective segmentMeters and pointCount. No database write occurs. No approval occurred.
