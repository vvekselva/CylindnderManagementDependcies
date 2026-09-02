# STORY-0073 — Customer Density Bubbles GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/customer-density-bubbles.geojson`
- Controller: `DeliveryPlanningApiController.customerDensityBubblesGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0073-local-source-business-behavior-20260902-1650.yaml`

This read-only endpoint accepts optional BigDecimal `segmentMeters`. The service normalizes it to 5000 when absent, below 500 or above 50000, then reads customer population-density bubbles for the effective segment size.

After mapping, the service groups bubbles by yard and appends one final zero-customer ring per yard. The synthetic ring starts at the prior final segment end, extends one segment, preserves the yard identity/location and receives the next segment index and source-proved yard-distance label.

GeoJSON Point properties include customer count, population-mode bubble radius score, demand context scores, yard and segment details, purpose `CUSTOMER_POPULATION_DENSITY`, and blue marker color. Metadata identifies source `CMAS_DATABASE_CUSTOMER_POPULATION_YARD_DISTANCE_DENSITY`, no tile dependency, populationDensityMode=true, effective segmentMeters and pointCount. No mutation occurs.

The recovered governed ZIP independently confirms segment normalization, population-density DAO behavior, synthetic final-ring derivation and GeoJSON metadata. STORY-0073 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
