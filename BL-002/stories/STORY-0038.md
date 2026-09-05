# STORY-0038 — Cylinder Delivery — SUPERSEDED

- Release: R1
- Endpoint: `POST /cylinderDelivery`
- Functional area: Legacy Cylinder Delivery
- Lifecycle: `SUPERSEDED_NOT_NEEDED`
- Approval: `NOT_REQUIRED_SUPERSEDED`
- Review state: `SUPERSEDED_RETAINED_FOR_AUDIT`
- Replacement: `STORY-0051` + `STORY-0085`
- Canonical replacement flow: Add Stop customer-delivery workflow
- Historical frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Supersession decision

On 2026-09-05 the user confirmed that the legacy Cylinder Delivery controller represented by this Story has been replaced by `AddStopController` and the active Add Stop customer-delivery workflow.

The active replacement is:

- **STORY-0051 — Add Stop Interactive Selection Workflow** for customer/party selection, customer-held and vehicle-held cylinder selection, challan context and transaction handoff.
- **STORY-0085 — Delivery Stop / `POST /stop`** for the customer delivery-stop transaction through `CustomerStopSelectionController.processStopIngestion` and `VehicleTripStopIngestionService`.

## Governance consequence

This Story is retained only as historical/audit evidence. It is excluded from:

- user approval/reapproval;
- post-approval code conformance;
- BL-004 unit-test fan-out;
- BL-005 integration-test fan-out;
- BL-009 test-case/test-data fan-out; and
- BL-011 human-readable testing packet eligibility.

Do not restore this Story to active work merely because the historical endpoint/controller remains visible in an older frozen source. A new explicit business decision would be required to reactivate the legacy flow.
