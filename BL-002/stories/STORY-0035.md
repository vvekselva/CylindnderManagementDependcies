# STORY-0035 — Customer Spot Cylinder Check

- Release: R2
- Endpoint: `GET /customer-spot-cylinder-check/fetch`
- Controller: `CustomerSpotCylinderCheckController.fetch`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0035-local-source-business-behavior-20260902-1647.yaml`

## Human-readable story

As an authorized Cylinder Management user, I open the Customer Spot Cylinder Check entry page for a specific vehicle load so that I can record the cylinders physically observed at a customer and submit that validation through STORY-0034.

## Exact entry contract

`GET /customer-spot-cylinder-check/fetch` requires request parameter `vehicleLoadId` as `Long`. `CustomerSpotCylinderCheckController.fetch(vehicleLoadId)` creates a fresh `CustomerSpotCylinderCheckRequestDto`, writes the submitted vehicle-load identity into the nested `CustomerSpotCylinderCheckDto`, ensures that the line collection contains at least 10 empty entry rows, and delegates to `buildMav(...)`.

`buildMav` renders `final-version-1/CustomerSpotCylinderCheck` with model key `spotCheckRequest`. It also loads `activeSpotCheckBooks` through `CustomerSpotCylinderCheckService.findActiveSpotCheckBooksForLoad(vehicleLoadId)`. That service reads active assigned challan books for the same vehicle load and book type `CUSTOMER_SPOT_CYLINDER_CHECK`; this GET does not create or consume a challan page.

The initial entry page therefore carries the exact vehicle-load identity into the form, provides at least 10 cylinder-observation rows, and supplies the active spot-check challan-book choices required by the submit flow. `successMessage` and `errorMessage` are null on this fresh GET.

## Persistence and visible outcome

This GET performs no customer/cylinder/challan mutation. Its persistence interaction is read-only assignment lookup for the active spot-check books. The visible outcome is the prepared Customer Spot Cylinder Check entry page; the actual validation/persistence/challan consumption is the separate POST flow in STORY-0034.

## Completion and approval gate

The recovered governed ZIP proves the exact request parameter, controller initialization, minimum line-row behavior, active-book read and rendered model/view. STORY-0035 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
