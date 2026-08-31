# STORY-0015 — Challan Heatmap

- Release: R1
- Endpoint: `GET /challan-heatmap`
- Functional area: Challan Monitoring
- Approval: NOT_APPROVED
- Business-behavior rework: IN_PROGRESS_SOURCE_DETAIL_GAP
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Canonical identity repair

The canonical BL-002 Story register defines STORY-0015 as R1 `GET /challan-heatmap`. The previous physical Story incorrectly described R2 `POST /system-settings`; that identity is superseded and has been removed.

## Current source evidence

A repository search for the exact canonical route did not resolve a source binding through the accessible application search index during this Production Fire. The orchestrator therefore does not invent a controller, template, service or database source.

## Required business-behavior trace

Before revised completion, frozen source must prove:

`GET /challan-heatmap -> exact controller -> request/filter inputs -> DTO/model -> service -> repository/DAO/view/entity -> exact heatmap reads/calculation -> rendering/template -> visible heatmap cells/metrics/empty/error behavior`.

If the route cannot be found in the governed frozen application source, the discrepancy must remain an explicit source-integrity gap.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: exact canonical route/source binding is unresolved. No automatic Story approval occurs and downstream revised testing remains unauthorized.
