# STORY-0074 — List Delivery Planning Stops

- Release: R2
- Endpoint: `GET /delivery-planning/stops`
- Controller: `DeliveryPlanningApiController.listStops`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This `application/json` GET has no request parameters. The controller directly returns `DeliveryPlanningStopService.list()`. The read-only service calls `DeliveryPlanningStopJpaDao.findByActiveTrueOrderByStopNameAsc()` and returns active `DeliveryPlanningStopDo` entities ordered by stop name. There is no form interaction, debounce, validation branch, DTO remapping, hidden field or persistence mutation in this endpoint. No approval occurred.
