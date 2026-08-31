# STORY-0014 — Challan Entry Aging Dashboard

- Release: R1
- Endpoint: `GET /challan-entry-aging-dashboard`
- Functional area: Challan Monitoring
- Approval: NOT_APPROVED
- Business-behavior rework: IN_PROGRESS_SOURCE_DETAIL_GAP
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Canonical identity repair

The canonical BL-002 Story register defines STORY-0014 as R1 `GET /challan-entry-aging-dashboard`. The previous physical Story incorrectly described R2 `GET /system-settings`; that identity is superseded by the canonical register and has been removed from this Story.

## Current source evidence

A repository search for the exact canonical route did not return a source binding in the accessible application search index during this Production Fire. The orchestrator therefore does not guess a controller, template, service or database path.

## Required business-behavior trace

Before this Story can be marked revised business-behavior complete, frozen source must prove the deepest applicable path:

`GET /challan-entry-aging-dashboard -> exact controller method -> model/DTO -> service -> repository/DAO/view/entity -> exact aging data reads -> filters/thresholds/branches -> rendered dashboard/template -> visible rows/metrics/empty/error states`.

If the route is absent from the governed frozen application source, that absence must be recorded as a source-integrity/trace gap rather than substituting another endpoint.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: exact frozen controller/source binding for the canonical endpoint is unresolved. No automatic Story approval occurs and no downstream revised testing fan-out is authorized.
