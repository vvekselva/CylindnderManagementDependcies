# STORY-0003 — Offline Map Status JSON

- Release: R2
- Endpoint: `GET /offline-map/status-json`
- Controller: `OfflineMapController.statusJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0003-local-source-business-behavior-20260902-1635.yaml`

This read-only endpoint takes no parameters, form fields or path variables. `OfflineMapController.statusJson()` is `@ResponseBody` and directly returns `offlineVectorTileService.fetchStatus()` as `OfflineMapStatusDto`; there is no browser form event, local validation, debounce, hidden field, DTO remapping, button state, or database mutation in this handler.

`fetchStatus()` reads the configured offline-map enabled flag and MBTiles path, checks bundled MapLibre JS/CSS and glyph resources, tests whether the configured MBTiles file exists, and—when enabled and present—opens the file through read-only SQLite `jdbc:sqlite:<mbtiles path>`. It reads `select name, value from metadata`, maps format/bounds/minzoom/maxzoom/center/name into the status DTO and marks it readable. Disabled configuration, missing file, and SQLite failure return source-proved error states/messages rather than inventing success. The exact read identity is the configured local MBTiles file, its SQLite `metadata` rows, and classpath frontend resources; there is no PostgreSQL persistence path.

The HTTP outcome is the status DTO serialized by Spring. Unlike STORY-0002, no Thymeleaf screen is rendered, so the applicable UI contract is API JSON with no visible template.

The recovered governed ZIP independently confirms this exact controller/service/read-only behavior. STORY-0003 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
