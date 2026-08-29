# STORY-0114 — Save Driver

- Release: R1
- Endpoint: `POST /domainLookup/driver/save`
- Controller: `DomainLookupController.saveDriver`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen/request contract
This is the Driver-tab save operation on Domain Lookup. The screen GET serves `drivers` from `LookupDataCache.getDrivers()`. Submission is a normal form POST; there is no source-proved typing-time lookup or debounce path applicable to this endpoint.

## DTO and service propagation
`DomainLookupController.saveDriver` receives the handler-declared Driver form parameters, maps the submitted values into `DriverDto` (including the source-declared phone-number representation where applicable), wraps it in `DriverIngestionRequestDto`, and delegates to `driverIngestionService.processRequest`. Create/update branching follows the submitted Driver identity. The controller does not execute SQL directly.

## Refresh and visible result
Successful ingestion triggers the targeted Driver lookup-cache refresh before the PRG redirect. The redirected Driver tab consequently reads refreshed Driver state and receives the source-defined success flash for add/update.

## Validation/error behavior
Expected user-input validation carrying the Driver ingestion request returns the full Domain Lookup ModelAndView directly with the failed Driver DTO and form-open state so inline validation survives. Unexpected validation payloads and other exceptions use the error-flash redirect branch.

## Persistence/read boundary
The source-proved write boundary is the Driver DTO inside `DriverIngestionRequestDto` passed to the application service; the visible read path is the refreshed Driver cache. No missing behavior is inferred.

## Approval boundary
The applicable strict field/UI contract is complete from frozen authoritative source. Approval remains pending; no auto-approval occurred.
