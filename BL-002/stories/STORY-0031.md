# STORY-0031 — Ownership Obligation Dashboard

- Release: R1
- Endpoint: `GET /ownership-obligation-dashboard`
- Functional area: Ownership Obligation
- Approval: NOT_APPROVED
- Business-behavior rework: BLOCKED_SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Canonical identity repair

The canonical `BL-002/story-register.csv` defines STORY-0031 as R1 `GET /ownership-obligation-dashboard`. The previous physical Story incorrectly described R2 `GET /product`. That Product identity is superseded for STORY-0031 and is not used as evidence for this Story.

## Current source evidence

An exact repository code search for `ownership-obligation-dashboard` returned `total_count=0` with `incomplete_results=true`. This cannot prove the route is absent from the governed frozen source, and therefore the orchestrator does not invent a controller, template, service, obligation calculation, repository/view or database identity.

## Required business-behavior trace

Before revised completion, complete frozen-source proof must establish the deepest applicable path:

`GET /ownership-obligation-dashboard -> exact controller -> filters/model inputs -> ownership/obligation service calculations -> repository/DAO/view/entity -> exact database reads and status/aging rules -> rendered dashboard/template -> visible totals, rows, empty and error states`.

If complete frozen-tree proof establishes that the canonical endpoint is absent, classify a source-integrity/trace gap instead of borrowing behavior from the previous `/product` Story.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: canonical identity is repaired but exact frozen route/source binding remains unresolved. No automatic Story approval occurs and no revised BL-004/BL-005/BL-009 fan-out is authorized.
