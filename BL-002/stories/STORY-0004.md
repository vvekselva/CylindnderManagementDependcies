# STORY-0004 — Offline Map Style JSON

- Release: R2
- Endpoint: `GET /offline-map/style.json`
- Controller: `OfflineMapController.styleJson`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0004-local-source-business-behavior-20260902-1634.yaml`

This read-only JSON GET accepts no explicit request parameter or path variable. The controller receives `HttpServletRequest`, derives the application base URL from request scheme, server name, server port and context path, omitting port 80 for HTTP and 443 for HTTPS, then calls `OfflineMapStyleService.buildStyleJson(baseUrl)`.

The service trims trailing slashes and constructs a MapLibre style version 8. The vector source URL is exactly `<base>/offline-map/vector-tiles/{z}/{x}/{y}.pbf`; glyphs use `<base>/vendor/maplibre/fonts/{fontstack}/{range}.pbf`. Center longitude/latitude, default zoom and tile-source attribution come from `OfflineMapProperties`; a null zoom falls back to 12. The generated source is `cmas-offline`, vector type, minzoom 0/maxzoom 14. Source-proved layers include background, landcover, landuse, water, waterway, boundary, buildings, road layers, place labels, road names, building names, house numbers and POIs. Text labels use `Noto Sans Regular` and source-proved name fallback expressions.

There is no form interaction, validation branch, hidden field, database read/write, entity mapping or mutation. The response is `application/json` and the constructed style string is returned directly. The applicable UI contract is API JSON with no Thymeleaf template.

The recovered governed ZIP independently confirms the controller URL construction and exact MapLibre style-generation behavior. STORY-0004 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
