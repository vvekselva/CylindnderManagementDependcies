# STORY-0075 — Nearby Customers for Planning Stop

- Release: R2
- Endpoint: `GET /delivery-planning/stops/{stopId}/nearby-customers`
- Controller: `DeliveryPlanningApiController.nearbyCustomers`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The JSON GET requires Long path variable `stopId` and required BigDecimal query parameter `radiusMeters`. The controller passes both to `DeliveryPlanningStopService.nearby(stopId,radiusMeters)`.

The service loads the stop by ID and requires it to be active; otherwise it throws `Planning stop not found.` The effective distance is the supplied radius, or the stop's default radius if the service receives null. Effective distance must be greater than zero or `Distance must be greater than zero.` is thrown. The DAO then executes `findNearby(stop.latitude, stop.longitude, effectiveRadius)` and returns `DeliveryPlanningStopCustomerProjectionDo` rows directly.

The endpoint is read-only; there is no entity mutation or local controller exception conversion. No approval occurred.
