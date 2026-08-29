# STORY-0129 — Save Address Type

- Release: R1
- Endpoint: `POST /lookupManagement/addressType/save`
- Controller: `LookupManagementController.saveAddressType`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Field / controller contract
The exact POST handler accepts optional `addressTypeId` (`Long`, `required=false`), required `addressType` (`String`), and `description` (`String`) defaulting to empty. The controller trims and upper-cases `addressType`, trims `description`, places those values plus the optional ID into `AddressTypeDto`, wraps it in `AddressTypeIngestionRequestDto`, and calls `addressTypeIngestionService.processRequest(req)`.

Create/update branch is exact: `addressTypeId == null || addressTypeId == 0L` means new; any other supplied ID follows update semantics. MVC contains no raw SQL and no unproved table identity is asserted.

## Success, cache invalidation and visible outcome
After service success, `LookupDataCache.refreshAddressTypes()` is called. A create produces flash `Address type "<NORMALIZED_VALUE>" added successfully.`; update produces `... updated successfully.`. Both redirect to `/lookupManagement?tab=addressType`.

## Validation/error contract
For `InvalidInputParameterException`, when `getUserInputError()` is true and the carried application DTO is exactly `AddressTypeIngestionRequestDto`, the failed request's validation errors are logged and the same Lookup view is returned directly through `buildValidationErrorMav`. That helper sets `activeTab=addressType`, `formOpen=true`, `failedAddressTypeDto`, and repopulates all four lookup collections so inline errors survive without redirect. If the validation exception carries the wrong DTO type, an error flash is set and the request redirects to the addressType tab. Any other exception also redirects there with `Failed to save address type: ...`.

No typing debounce/minimum-length behavior is proved or required by this server POST handler; no such behavior is invented.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
