# STORY-0076 — Delivery Planning Customer Coverage GeoJSON

- Release: R2
- Endpoint: `GET /delivery-planning/customer-coverage.geojson`
- Controller: `DeliveryPlanningApiController.customerCoverageGeoJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0076-local-source-business-behavior-20260902-1653.yaml`

This read-only JSON GET has no parameters. It calls `DeliveryPlanningStopService.customerCoverageGeoJson()`, which uses a fixed coverage radius of 1000 meters and reads customer coverage from the delivery-planning stop DAO.

Rows are grouped by exact circleCount and segregated into `UNCOVERED` for 0 circles, `SINGLE_COVERAGE` for 1, and `MULTIPLE_COVERAGE` for more than 1. Every feature is a Point `[longitude, latitude]` with customer/address identity, customer name/address text, circle count and coverage category.

Metadata contains pointCount, coverageRadiusMeters=1000, category counts and source `CMAS_DELIVERY_PLANNING_CUSTOMER_COVERAGE_HASHMAP_SEGREGATION`. No mutation occurs.

The recovered governed ZIP independently confirms the fixed radius, grouping/segregation and GeoJSON result. STORY-0076 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
