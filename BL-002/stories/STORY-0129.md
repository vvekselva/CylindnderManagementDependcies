# STORY-0129 — Save Address Type

- Release: R1
- Endpoint: `POST /lookupManagement/addressType/save`
- Controller: `LookupManagementController.saveAddressType`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The handler accepts optional `addressTypeId`, required `addressType`, and optional `description` defaulting to empty. It trims/upper-cases address type, trims description, builds `AddressTypeDto` inside `AddressTypeIngestionRequestDto`, and calls `addressTypeIngestionService.processRequest`. Null/zero ID is create; otherwise update. Success refreshes address-type cache and redirects to `/lookupManagement?tab=addressType` with the matching flash. Expected user-input validation returns the full view directly with `formOpen=true` and `failedAddressTypeDto`; other errors redirect with error flash. No raw SQL occurs in MVC. Strict promotion is withheld behind STORY-0126; approval remains pending.
