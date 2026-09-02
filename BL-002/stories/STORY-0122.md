# STORY-0122 — Save Selected Delivery Planning Points

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/save-selected`
- Controller: `DeliveryPlanningStopManagementController.saveSelectedPoints`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0122-local-source-business-behavior-20260902-1657.yaml`

The POST requires parallel list parameters `pointName`, `pointLatitude`, `pointLongitude`, `pointRadiusMeters`, and `pointRemarks`. The controller copies those lists into `DeliveryPlanningStopBatchSaveRequestDto` and calls `DeliveryPlanningStopMediator.saveSelectedPoints(request)`. The returned list size becomes the saved count and is used in the localized success message.

For `InvalidInputParameterException` carrying a failed batch DTO with validation errors, the first validation error supplies the localized error code and optional value argument. Otherwise the generic validation-failed key is used; unexpected exceptions use the save-failed key. Every branch redirects to `/delivery-planning/stops/manage`.

The recovered governed ZIP independently confirms the exact list bindings, batch DTO construction, mediator invocation and success/error redirect behavior. STORY-0122 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
