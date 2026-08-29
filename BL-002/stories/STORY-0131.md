# STORY-0131 — Save State

- Release: R1
- Endpoint: `POST /lookupManagement/state/save`
- Controller: `LookupManagementController.saveState`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Strict field/service contract
The handler accepts optional `stateId` (`Long`, `required=false`) and required String parameters `stateName` and `description`. It assigns the ID, stores `stateName.trim()`, preserves `description` as submitted, wraps `StateDto` in `StateIngestionRequestDto`, and calls `stateIngestionService.processRequest(req)`. Null or zero state ID means create; otherwise update.

## Success / cache / visible outcome
After successful application processing it calls `LookupDataCache.refreshStates()`. Create and update set the corresponding `State "<stateName>" added successfully.` / `updated successfully.` flash and redirect to `/lookupManagement?tab=state`.

## Validation/error contract
For a user-input `InvalidInputParameterException` carrying exactly `StateIngestionRequestDto`, the controller logs validation DTOs and directly returns the Lookup page using `buildValidationErrorMav("state", "failedStateDto", failedRequestDto.getStateDto())`. The helper keeps the form open and restores lookup collections. A validation exception outside that expected DTO branch redirects with `Validation error saving state: ...`; any other exception redirects with `Failed to save state: ...`.

No client debounce/minimum-length or exact database table is established by this handler and none is invented.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
