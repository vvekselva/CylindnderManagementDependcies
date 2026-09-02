# STORY-0123 — Remove Delivery Planning Stop

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/remove`
- Controller: `DeliveryPlanningStopManagementController.removeStop`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0123-local-source-business-behavior-20260902-1657.yaml`

The POST requires `stopId` as Long. The controller calls `DeliveryPlanningStopService.deactivate(stopId)`, so the proved removal semantics are deactivation rather than a physical delete. It flashes `Planning stop removed successfully.` and redirects to `/delivery-planning/stops/manage`. No other request field or local controller error branch exists.

The recovered governed ZIP independently confirms the exact stop identity, soft-deactivation service operation and visible success redirect. STORY-0123 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
