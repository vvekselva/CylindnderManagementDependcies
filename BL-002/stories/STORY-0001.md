# STORY-0001 — Offline Map Status Page

- Release: R2
- Endpoint: `GET /offline-map/status`
- Controller: `OfflineMapController.statusPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Governed evidence

The BL-002 story register identifies this story as R2 `GET /offline-map/status`, controller method `OfflineMapController.statusPage`, with trace chain `Controller -> OfflineVectorTileService -> OfflineMapStatusDto -> OfflineMapProperties -> OfflineMapController`, register review state `READY_FOR_REVIEW`, and note `Generated from BL-001 controller dependency matrix`.

## Exact remaining source-detail gap

The physical Story file was absent. The neighboring governed STORY-0002 proves the JavaScript asset endpoint and STORY-0003 proves the status JSON service path, but those artifacts do not by themselves prove this page handler's exact model attributes, template, visible controls/status fields, browser calls/events, error rendering or dependent endpoint invocation. Frozen authoritative source analysis is still required.

No strict-field/UI completion is claimed. No approval occurred.
