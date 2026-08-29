# STORY-0122 — Save Selected Delivery Planning Points

- Release: R2
- Endpoint: `POST /delivery-planning/stops/manage/save-selected`
- Controller: `DeliveryPlanningStopManagementController.saveSelectedPoints`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The POST requires parallel list parameters `pointName`, `pointLatitude`, `pointLongitude`, `pointRadiusMeters`, and `pointRemarks`. The controller copies those lists into `DeliveryPlanningStopBatchSaveRequestDto` and calls `DeliveryPlanningStopMediator.saveSelectedPoints(request)`. The returned list size becomes `savedCount` and localized flash message key `DELIVERY_PLANNING_STOP_BATCH_SAVE_SUCCESS` is rendered with that count.

For `InvalidInputParameterException` carrying a failed batch DTO with validation errors, the first `ValidationErrorDto` supplies the localized error code and optional value argument. Otherwise generic key `DELIVERY_PLANNING_STOP_VALIDATION_FAILED` is used. Unexpected exceptions use `DELIVERY_PLANNING_STOP_SAVE_FAILED`. Every branch redirects to `/delivery-planning/stops/manage`. No raw SQL/deeper table is invented. Approval remains pending.
