# STORY-0076 — Delivery Planning Customer Coverage GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/customer-coverage.geojson`
- Controller: `DeliveryPlanningApiController.customerCoverageGeoJson`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This read-only JSON GET has no parameters. It calls `DeliveryPlanningStopService.customerCoverageGeoJson()`, which uses a fixed coverage radius of 1000 meters and reads `DeliveryPlanningStopJpaDao.findCustomerCoverage(1000)`.

Rows are first grouped by exact circleCount, then segregated into `UNCOVERED` for 0 circles, `SINGLE_COVERAGE` for 1, and `MULTIPLE_COVERAGE` for more than 1. Every feature is a Point `[longitude, latitude]` with customerId, customerAddressId, customerName, addressText, circleCount and coverageCategory. Metadata contains pointCount, coverageRadiusMeters=1000, categoryCounts for uncovered/singleCoverage/multipleCoverage, and source `CMAS_DELIVERY_PLANNING_CUSTOMER_COVERAGE_HASHMAP_SEGREGATION`.

No mutation, form state, debounce or hidden-field propagation applies. No approval occurred.
