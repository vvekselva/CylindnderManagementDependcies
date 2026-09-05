# STORY-0085 — Delivery Stop

- Release: R1
- Endpoint: `POST /stop`
- Controller: `CustomerStopSelectionController.processStopIngestion`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

The recovered ZIP confirms the governed customer-stop flow already detailed by this Story: entry through `/add-stop` after Returned/Proceeding trip-state gating; 280 ms customer search with persistent customer ID; dependent customer-address lookup; vehicle/customer cylinder searches; selected delivery/pickup cylinder IDs; assigned challan leaf and mandatory active uploaded photo; and browser submit enablement only after customer, address, movement, challan and photo requirements are satisfied.

`CustomerStopSelectionController.processStopIngestion` binds the stop request and customer-stop photo flag, maps the stop type, delegates to transactional `VehicleTripStopIngestionService`, and redirects to the appropriate Add Stop/load detail page according to the controller branch. The service validates the request, resolves vehicle load/stop type/customer/address, creates order/delivery and empty-pickup persistence/logistics effects for selected cylinders, persists the ARRIVED trip stop, moves the trip to Proceeding when required, and consumes/links supplied challan data.

The exact selected identities, browser invalidation/reset behavior, service/DAO chain and visible terminal navigation are source-bound. No code change is implied by documenting this current behavior.

## Completion and approval gate

STORY-0085 is `APPROVED_AFTER_REWORK`. The user explicitly approved SUC-034 and authorized fan-out on 2026-09-05; no application-code mutation is implied by this approval.

## Approval and fan-out disposition

- User decision: **SUC-034 APPROVED AND FAN OUT**
- Story consequence: **STORY-0085 APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
