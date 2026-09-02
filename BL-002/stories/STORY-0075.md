# STORY-0075 — Nearby Customers for Planning Stop

- Release: R2
- Endpoint: `GET /delivery-planning/stops/{stopId}/nearby-customers`
- Controller: `DeliveryPlanningApiController.nearbyCustomers`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0075-local-source-business-behavior-20260902-1652.yaml`

The JSON GET requires Long path variable `stopId` and BigDecimal query parameter `radiusMeters`. The controller passes both to `DeliveryPlanningStopService.nearby(stopId, radiusMeters)`.

The service loads the stop by ID and requires it to be active or throws `Planning stop not found.` The effective distance is the supplied radius, or the stop's default radius if the service receives null. Effective distance must be greater than zero or `Distance must be greater than zero.` is thrown. The DAO then reads nearby customer projections using the stop latitude/longitude and effective radius.

The endpoint is read-only; there is no entity mutation or local controller exception conversion. The recovered governed ZIP independently confirms the exact parameter/guard/read path. STORY-0075 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
