# STORY-0132 — Save City

- Release: R1
- Endpoint: `POST /lookupManagement/city/save`
- Controller: `LookupManagementController.saveCity`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The handler accepts optional `cityId`, required `cityName`, and required `description`. It trims city name, preserves description as submitted, wraps `CityDto` in `CityIngestionRequestDto`, and delegates to `cityIngestionService.processRequest`. Null/zero ID selects create. Success refreshes Cities and redirects to the city tab with add/update flash. Expected user-input validation returns the full page with the failed City DTO and open form; other failures use error redirect behavior. Strict promotion is withheld behind STORY-0126; approval remains pending.
