# STORY-0036 — Yard Audit

- Release: R1
- Endpoint: `GET /yard-audit-dashboard`
- Functional area: Yard Audit
- Approval: PENDING_USER_APPROVAL
- Review state: NEEDS_CLARIFICATION
- Traceability state: PARTIAL_INTERMEDIATE_HOPS
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user or system consumer, I want to view or retrieve **Yard Audit** through **GET /yard-audit-dashboard** so that the corresponding business operation is available through the application.

## Governed evidence

The canonical BL-002 story register identifies STORY-0036 as R1 priority 1, endpoint `GET /yard-audit-dashboard`, functional area `Yard Audit`, review state `NEEDS_CLARIFICATION`, approval `PENDING_USER_APPROVAL`, and traceability `PARTIAL_INTERMEDIATE_HOPS`.

## Exact remaining source-detail gap

The physical Story artifact is materialized, but the canonical trace does not yet prove the complete intermediate dependency behavior. Strict completion requires frozen-source proof of the controller entry, page/template/model and visible audit controls, request/browser behavior where applicable, service/DAO/entity/database read identities, validation/branch behavior, and visible empty/error/success outcomes.

The missing intermediate behavior is not guessed. No strict-field/UI completion is claimed. No approval occurred.
