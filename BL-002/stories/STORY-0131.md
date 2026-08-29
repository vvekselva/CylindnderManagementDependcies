# STORY-0131 — Save State

- Release: R1
- Endpoint: `POST /lookupManagement/state/save`
- Controller: `LookupManagementController.saveState`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The handler accepts optional `stateId`, required `stateName`, and required `description`. It trims state name, preserves description as submitted, wraps `StateDto` in `StateIngestionRequestDto`, and delegates to `stateIngestionService.processRequest`. Null/zero ID selects create. Success refreshes States and redirects to the state tab with add/update flash. Expected user-input validation returns the full page with `failedStateDto`; other failures use the error redirect. Strict promotion is withheld behind STORY-0126; approval remains pending.
