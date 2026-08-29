# STORY-0113 — Save Vehicle

- Release: R1
- Endpoint: `POST /domainLookup/vehicle/save`
- Controller: `DomainLookupController.saveVehicle`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen/request contract
This operation is the Vehicle-tab form submission on Domain Lookup. The GET serves the visible Vehicle collection from `LookupDataCache.getVehicles()`. The save path is a normal form POST; no source-proved asynchronous typing/debounce contract applies.

## Mapping and application-service path
The handler receives the Vehicle fields declared by `saveVehicle`, maps them into `VehicleDto`, wraps the DTO in `VehicleIngestionRequestDto`, and delegates to `vehicleIngestionService.processRequest`. The submitted vehicle identity distinguishes create/update behavior; the MVC layer does not directly mutate the database.

## Cache invalidation and visible outcome
After successful ingestion the controller performs the targeted Vehicle cache refresh, then follows PRG to the Vehicle tab with a success flash distinguishing the create/update outcome. The next GET therefore reads refreshed Vehicle state.

## Validation/error branches
An expected user-input `InvalidInputParameterException` carrying `VehicleIngestionRequestDto` returns the complete Domain Lookup ModelAndView directly with the failed Vehicle DTO and open-form state, retaining inline validation. Unexpected validation payloads and general exceptions follow the error-flash redirect path.

## Persistence/read boundary
The durable write identity is carried by the Vehicle DTO inside the ingestion request to the application service; visible reads are sourced from the refreshed Vehicle cache. No additional database behavior is asserted without frozen-source proof.

## Approval boundary
The applicable strict field/UI contract is complete. Approval remains PENDING_USER_APPROVAL; no automated approval was performed.
