# STORY-0005 — Offline Vector Tile Fetch

- Release: R2
- Endpoint: `GET /offline-map/vector-tiles/{z}/{x}/{y}.pbf`
- Controller: `OfflineMapController.vectorTile`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The browser/map renderer requests an exact tile through integer path variables `z`, `x`, and `y`. There are no query/form fields, typing/debounce behavior, hidden fields or persistence mutation.

`OfflineMapController.vectorTile(z,x,y)` calls `OfflineVectorTileService.fetchTile(z,x,y)`. The service first rejects the request as empty when offline maps are disabled or the configured MBTiles path is not a file. It converts XYZ Y to TMS row using `((1 << z) - 1) - y`, opens the configured MBTiles file read-only through SQLite, and executes `select tile_data from tiles where zoom_level = ? and tile_column = ? and tile_row = ?`, binding z, x and converted TMS Y. No row or SQL failure returns `Optional.empty()`.

For a found row, the service reads `tile_data`, reads MBTiles metadata to obtain `format`, maps PNG to `image/png` and all other/null formats to `application/x-protobuf`, and detects gzip by the first two bytes `1f 8b`. The controller returns 404 when the Optional is empty. A found tile returns HTTP 200 with the tile bytes, the source-proved content type, `Cache-Control: no-cache`, and `Content-Encoding: gzip` only when gzip was detected.

The exact read identity is the local MBTiles `tiles` row keyed by zoom_level/tile_column/tile_row plus its metadata format. There is no PostgreSQL/entity write path. No approval occurred.
