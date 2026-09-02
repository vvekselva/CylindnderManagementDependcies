# STORY-0119 — Delivery Planning Stop Management

- Release: R2
- Endpoint: `GET /delivery-planning/stops/manage`
- Controller: `DeliveryPlanningStopManagementController.showStopManagementPage`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0119-local-source-business-behavior-20260902-1654.yaml`

The handler accepts optional `editStopId` Long and renders `with-menu/DeliveryPlanningStopManagement`. It reads `DeliveryPlanningStopService.listWithCustomerCounts()` and `coverageKpis()`, exposes them as `stops` and `coverageKpis`, preserves `editStopId`, and exposes constant default radius 5000 meters.

This GET is read-only; optional editStopId selects edit context but causes no mutation. The recovered governed ZIP independently confirms the handler, service reads and model values. STORY-0119 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
