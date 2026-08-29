# STORY-0130 — Save Country

- Release: R1
- Endpoint: `POST /lookupManagement/country/save`
- Controller: `LookupManagementController.saveCountry`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Strict field/service contract
The handler accepts optional `countryId` (`Long`, `required=false`) and required String fields `description` and `countryName`. It assigns the ID, stores `description.trim().toUpperCase()`, stores `countryName.trim()`, wraps `CountryDto` in `CountryIngestionRequestDto`, and invokes `countryIngestionService.processRequest(req)`. Null or zero ID is classified as create; otherwise update.

## Success / refresh / visible outcome
After service success the controller calls `LookupDataCache.refreshCountries()`. Create flashes `Country "<countryName>" added successfully.` and update flashes the corresponding `updated successfully.` message. Both use PRG redirect `/lookupManagement?tab=country`.

## Validation/error contract
A user-input `InvalidInputParameterException` carrying exactly `CountryIngestionRequestDto` returns the full Lookup view directly via `buildValidationErrorMav("country", "failedCountryDto", failedRequestDto.getCountryDto())`; the helper keeps `formOpen=true`, restores all lookup collections and exposes the failed DTO for inline validation. Other validation failures redirect to the country tab with `Validation error saving country: ...`. Other exceptions redirect with `Failed to save country: ...`.

No browser debounce/minimum-length or raw SQL behavior is proved by this handler, so none is invented. The exact database table behind the injected application service is not asserted without source proof.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
