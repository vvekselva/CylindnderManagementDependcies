# STORY-0123 — Remove Delivery Planning Stop

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/remove`
- Controller: `DeliveryPlanningStopManagementController.removeStop`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The POST requires `stopId` as Long. The controller calls `DeliveryPlanningStopService.deactivate(stopId)`, so the proved removal semantics are deactivation rather than an invented physical delete. It flashes `Planning stop removed successfully.` and redirects to `/delivery-planning/stops/manage`. No explicit controller error branch or other request field exists. No approval occurred.
