# STORY-0130 — Save Country

- Release: R1
- Endpoint: `POST /lookupManagement/country/save`
- Controller: `LookupManagementController.saveCountry`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The handler accepts optional `countryId` and required `description` and `countryName`. It sets ID, trims/upper-cases description, trims country name, wraps `CountryDto` in `CountryIngestionRequestDto`, and calls `countryIngestionService.processRequest`. Null/zero ID selects create. Success refreshes Countries and PRG redirects to the country tab with add/update flash. Expected user-input validation returns the full view with `failedCountryDto`; other failures redirect with error flash. Strict promotion is withheld behind STORY-0126; approval remains pending.
