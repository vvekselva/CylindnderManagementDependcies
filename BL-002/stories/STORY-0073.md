# STORY-0073 — Customer Density Bubbles GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/customer-density-bubbles.geojson`
- Controller: `DeliveryPlanningApiController.customerDensityBubblesGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This read-only endpoint accepts optional BigDecimal `segmentMeters`. The service normalizes it to 5000 when absent, below 500 or above 50000, then reads `DeliveryPlanningDemandJpaDao.findCustomerPopulationDensityBubbles(effectiveSegmentMeters)`.

After mapping, the service groups bubbles by yard and appends one final zero-customer ring per yard. The synthetic ring starts at the prior final segment end, extends one segment, has zero customer/demand scores, dominantSignalType `CUSTOMER_DENSITY_ONLY`, preserves yard identity/location, and receives the next segment index and a source-proved yard distance label.

GeoJSON Point properties include customerCount, bubbleRadiusScore equal to customerCount in population mode, demand context scores, yard and segment details, purpose `CUSTOMER_POPULATION_DENSITY`, and blue markerColor. Metadata identifies source `CMAS_DATABASE_CUSTOMER_POPULATION_YARD_DISTANCE_DENSITY`, no tile dependency, populationDensityMode=true, effective segmentMeters and pointCount. No mutation occurs. No approval occurred.
