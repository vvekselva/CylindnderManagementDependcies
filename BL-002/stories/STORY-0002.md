# STORY-0002 — Offline Map Status

- Release: R2
- Endpoint: `GET /offline-map/status`
- Controller: `OfflineMapController.showStatus`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0002-local-source-business-behavior-20260902-1633.yaml`

## User intent and screen entry
The user opens the Offline Map Status page to inspect whether the local vector-map runtime is usable. This is a read-only GET; the page has no form input, typing event, debounce, hidden field, button mutation, or persistence action.

## Exact request and controller contract
`GET /offline-map/status` takes no request parameters or path variables. `OfflineMapController.showStatus()` creates `ModelAndView("with-menu/OfflineMapStatus")`, calls `offlineVectorTileService.fetchStatus()`, and exposes the returned `OfflineMapStatusDto` under model key `status`.

## Service/read path and guards
`OfflineVectorTileService.fetchStatus()` reads `OfflineMapProperties`: configured enabled flag and MBTiles path. It also checks classpath presence of MapLibre JS, MapLibre CSS, the `Noto Sans Regular` glyph directory, and sample `0-255.pbf`; `glyphsReady` requires both glyph directory and sample glyph.

The service tests the configured MBTiles path as a local file. If offline maps are disabled it returns immediately with `Offline map is disabled through cmas.offline-map.enabled=false.` If the file does not exist it returns with `MBTiles file was not found at the configured path.` Otherwise it opens `jdbc:sqlite:<configured mbtiles path>` using a read-only SQLite configuration and reads `select name, value from metadata`. Successful access sets readable=true and maps metadata values `format`, `bounds`, `minzoom`, `maxzoom`, `center`, and `name` into the DTO. SQL failure sets readable=false and exposes the exception message as the error message. The metadata helper itself records a `metadata_error` entry when its query fails.

There is no PostgreSQL/entity mutation path for this story; its data identity is the configured local MBTiles file plus its SQLite `metadata` rows and bundled frontend resources.

## Visible outcome
`with-menu/OfflineMapStatus` renders `READY` only when `enabled && mbtilesFileExists && readable`; otherwise it renders `NOT READY`. Any service error message is shown. The screen displays Enabled, Exists, Readable, configured Path, map Name/Format/Bounds/Center/Zoom, and PRESENT/MISSING pills for MapLibre JavaScript, MapLibre CSS, glyph folder, and sample glyph range. When glyphs are not ready it warns that labels will not display; when the MBTiles source is unreadable it warns that the source must be converted/placed at the configured path. Raw metadata key/value rows are rendered from `status.metadata`.

## Completion and approval gate
The recovered governed ZIP independently confirms the controller, service, read-only SQLite metadata path, bundled-resource checks, and visible READY/NOT READY rendering contract. STORY-0002 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
