# STORY-0016 — Challan Page Photo

- Release: R1
- Endpoint: `GET /challan-page-photo/{challanPagePhotoId}`
- Functional area: Challan Monitoring
- Approval: NOT_APPROVED
- Business-behavior rework: BLOCKED_SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Canonical identity repair

The canonical `BL-002/story-register.csv` defines STORY-0016 as R1 `GET /challan-page-photo/{challanPagePhotoId}`. The previous physical Story incorrectly described R2 `GET /customer-address-location/upload`. That prior identity is superseded for STORY-0016 and is not used as evidence for this Story.

## Current source evidence

An exact repository code search for `challan-page-photo` returned `total_count=0` with `incomplete_results=true`. That result is insufficient to prove the route is absent from the governed frozen source, so the orchestrator does not invent or substitute a controller, service, template, storage path or photo-record identity.

## Required business-behavior trace

Before revised completion, complete frozen-source proof must establish the deepest applicable path:

`GET /challan-page-photo/{challanPagePhotoId} -> exact controller -> path-variable validation -> exact photo metadata/storage lookup -> authorization/not-found branches -> content type/content disposition/response body -> visible/download behavior and error handling`.

If complete frozen-tree proof establishes that the canonical route is absent, that discrepancy must be classified as a source-integrity/trace gap rather than borrowing behavior from `/customer-address-location/upload` or another photo endpoint.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: canonical identity is repaired, but the exact frozen route/source binding is unresolved. No automatic Story approval occurs and no revised downstream testing fan-out is authorized.
