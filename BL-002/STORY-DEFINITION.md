# BL-002 Human-Readable Story Definition

This file defines the canonical human-readable story for every row in `story-register.csv`.

The story register is the 134-row SSOT. A story is materialized deterministically from its row; therefore no historical story wording or approval is inferred.

## Story rendering rule

For a `GET` row:

> As an authorized Cylinder Management user or system consumer, I want to view or retrieve **{functional_area}** through **{http_method} {path}** so that the corresponding business operation is available through the application.

For a `POST` row:

> As an authorized Cylinder Management user or system consumer, I want to submit or execute **{functional_area}** through **{http_method} {path}** so that the corresponding business operation is performed through the application.

The placeholders are taken directly from the same row in `story-register.csv`.

## Common acceptance contract for every story

Before a story can be approved, review must confirm against the exact BL-001 method/path trace that:

1. Request inputs and parameters are represented correctly.
2. Controller entry and validation behavior are represented correctly.
3. Controller-to-service and intermediate dependency flow is represented correctly.
4. Repository/DAO/query/persistence behavior is represented correctly when present.
5. Terminal database/read/write effects are represented correctly when present.
6. Response, redirect, view/model, and error behavior are represented correctly.
7. No behavior absent from the trace is invented.

## Review states

- `READY_FOR_USER_REVIEW` means BL-001 has a complete traced chain and the deterministic draft may be reviewed.
- `NEEDS_CLARIFICATION` means the BL-001 trace itself is incomplete and the missing dependency behavior must be resolved before approval.
- `PENDING_USER_APPROVAL` means no acceptance decision has been made by the user.

## Clarification-required stories

The canonical BL-001 matrix identifies exactly three `PARTIAL_INTERMEDIATE_HOPS` rows:

- `STORY-0011` — `POST /complete-trip`
- `STORY-0035` — `GET /customer-spot-cylinder-check/fetch`
- `STORY-0036` — `GET /yard-audit-dashboard`

These stories remain `NEEDS_CLARIFICATION`. Their missing intermediate behavior is not guessed.

## Release/review order

- R1 stories: review priority `1` — 88 stories.
- R2 stories: review priority `2` — 46 stories.
- Use-case grouping remains blocked until stories are explicitly approved.
