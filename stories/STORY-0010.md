# STORY-0010 — Retrieve an offline vector map tile

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `e45db69767cee472b169e95c8d4319293c29e521f734ce95631b589bb457241e`

A caller requests `GET /offline-map/vector-tiles/{z}/{x}/{y}.pbf` with the tile coordinates `z`, `x`, and `y` in the path. The request reaches the `OfflineMapController` vector-tile path and invokes `OfflineVectorTileService.fetchTile(...)`.

The accepted BL-001 chain reads the configured MBTiles filesystem file, queries SQLite `tiles` for tile data, and reads SQLite `metadata` used by the tile format path. No coordinate validation, write operation, state transition, or audit side effect is asserted because the canonical evidence does not prove one.

The caller-visible outcome is the source-proved vector-tile HTTP response. No persistence mutation is expected from this read path.

Evidence: canonical BL-001 row `GET /offline-map/vector-tiles/{z}/{x}/{y}.pbf`; `logs/runs/INVOCATION-20260823-160000.md` / LANE-02.

Approval is pending explicit user decision for the exact fingerprint above.
