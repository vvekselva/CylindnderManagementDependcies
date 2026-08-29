# STORY-0132 — Save City

- Release: R1
- Endpoint: `POST /lookupManagement/city/save`
- Controller: `LookupManagementController.saveCity`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Strict field/service contract
The exact handler accepts optional `cityId` (`Long`, `required=false`) and required String parameters `cityName` and `description`. It assigns the ID, stores `cityName.trim()`, preserves description as submitted, wraps `CityDto` in `CityIngestionRequestDto`, and invokes `cityIngestionService.processRequest(req)`. Null or zero ID selects create; otherwise update.

## Success / cache / visible outcome
On success it calls `LookupDataCache.refreshCities()` and sets the appropriate create/update success flash. Both paths redirect to `/lookupManagement?tab=city`.

## Validation/error contract
For a user-input `InvalidInputParameterException` carrying exactly `CityIngestionRequestDto`, the failed DTO and validation errors are retained and the Lookup page is returned directly with the City tab/form open through the common validation-error model builder. Unexpected validation shape falls through to redirect error handling; other exceptions redirect with a City save failure message. The common builder repopulates address types, countries, states and cities.

No client typing debounce/minimum-length and no exact persistence table are proved by this MVC handler; neither is invented.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
