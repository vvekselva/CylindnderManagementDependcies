# STORY-0074 — List Delivery Planning Stops

- Release: R2
- Endpoint: `GET /delivery-planning/stops`
- Controller: `DeliveryPlanningApiController.listStops`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0074-local-source-business-behavior-20260902-1651.yaml`

This `application/json` GET has no request parameters. The controller directly returns `DeliveryPlanningStopService.list()`. The read-only service calls `DeliveryPlanningStopJpaDao.findByActiveTrueOrderByStopNameAsc()` and returns active delivery-planning stops ordered by stop name.

There is no form interaction, debounce, validation branch, DTO remapping, hidden-field propagation or persistence mutation in this endpoint. The recovered governed ZIP independently confirms the controller/service/repository read path.

STORY-0074 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
