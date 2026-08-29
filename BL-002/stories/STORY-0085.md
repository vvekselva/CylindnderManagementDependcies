# STORY-0085 — Delivery Stop

- Release: R1
- Endpoint: `POST /stop`
- Register controller group: `Delivery Stop`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source field contract: NOT_STRICT_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Governed reconciliation
The canonical BL-002 register proves this R1 story is `POST /stop` and labels it Delivery Stop. The current strict-enrichment pass attempted frozen-source discovery through the available GitHub source interface, but the exact controller method/template/service source for this endpoint was not retrievable with sufficient precision during this invocation.

## Specific remaining source-detail gap
Strict completion requires source-proved evidence for the applicable visible stop-entry controls, exact submitted form/request names and requiredness, browser interaction/validation, controller binding, DTO/service mapping, branch/guard predicates, persistence identity/table path, success/error terminal and visible screen outcome. None of these are inferred from the endpoint label or from other stop workflows.

## Trace evidence boundary
BL-001 remains canonically complete and read-only. Its trace matrix is reusable as dependency evidence when an exact endpoint record can be resolved, but trace-chain-only evidence cannot promote this story to strict field/UI completion.

## Approval boundary
This materialization records the precise unresolved source-detail boundary. It does **not** count as strict complete, does not change approval, and cannot advance the strict R1 cursor past STORY-0085.
