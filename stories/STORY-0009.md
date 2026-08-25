# STORY-0009 — Inspect offline map availability and metadata status

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `5d111354ae77e342dec07b2eb1c127eba3b363e7e8fb19a5fa06e3aa98c4e3d1`

A caller requests `GET /offline-map/status`. The request reaches the `OfflineMapController` status path, which invokes `OfflineVectorTileService.fetchStatus()`. The accepted BL-001 chain inspects the configured MBTiles filesystem path, reads SQLite `metadata`, and checks the required MapLibre/glyph classpath resources.

No request parameter, persistence write, state transition, audit side effect, or additional business validation is asserted because the accepted trace does not prove one. The caller-visible outcome is the source-proved offline-map status result derived from those file, SQLite, and classpath dependencies.

Evidence: canonical BL-001 row `GET /offline-map/status`; `logs/runs/INVOCATION-20260823-160000.md` / LANE-02.

Approval is pending explicit user decision for the exact fingerprint above.
