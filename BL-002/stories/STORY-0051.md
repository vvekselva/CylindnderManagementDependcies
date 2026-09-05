# STORY-0051 — Add Stop Interactive Selection Workflow

## Status

- Release: R1
- Endpoint: `GET /add-stop`
- Approval: `REAPPROVAL_REQUIRED_AFTER_MATERIAL_REWORK`
- Review state: `BUSINESS_BEHAVIOR_REWORKED_AWAITING_USER_REAPPROVAL`
- Rework state: `MATERIAL_SCOPE_EXPANSION_2026-09-05`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE_REWORKED`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Prior approval: retained for audit only; it covered the earlier page-load contract and does not automatically approve this expanded workflow.
- Prior post-approval conformance: invalidated for the expanded contract; rerun required after reapproval.
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user working with an active vehicle load, I want the Add Stop workflow to open the correct Customer or Supplier stop page, let me choose the party, show the cylinders relevant to that party together with the cylinders currently on the vehicle, let me select the cylinders participating in the exchange, and then continue into the appropriate submit use case so that the physical cylinder exchange at the stop is captured consistently.

The Story is not limited to rendering the initial page. It covers the complete interactive selection journey from `GET /add-stop` until the user has a valid set of selected identities ready for the downstream stop-submit transaction.

## Entry contract and trip gate

`AddStopController.showStopPage(...)` is `@GetMapping("/add-stop")` and requires:

- `vehicleLoadId: Long`;
- `actionType: String`.

The controller resolves the trip status from the vehicle load. Challan/stop entry is allowed only for the accepted `Returned` or `Proceeding` states. A disallowed or missing state redirects back to the vehicle-load detail flow with the governed error message.

## Customer Stop interactive flow

When `actionType = CustomerStop`, the Customer Stop page is loaded.

After the page is visible, the user can:

1. Search and select a customer using **STORY-0091 — Customer Search**.
2. Preserve the selected persistent customer ID as the identity for all dependent reads.
3. Load the selected customer's current cylinder holdings using **STORY-0096 — Cylinders by Customer**.
4. Load cylinders currently available on the active vehicle/load using **STORY-0107 — Cylinders on Vehicle** where the customer-stop exchange requires vehicle stock.
5. Display the two logical cylinder groups separately so the user can understand:
   - cylinders presently held by the customer that may be picked up/returned;
   - cylinders presently on the vehicle that may be delivered to the customer.
6. Allow the user to select the exact persistent cylinder IDs from either/both groups according to the stop movement being performed.
7. Clear dependent cylinder selections whenever the customer identity changes, so a cylinder selected for one customer cannot leak into another customer's stop.
8. Continue to the customer stop submit use case only after required party/cylinder/challan inputs are present.

### Customer submit handoff

The source-mapped submit operation is:

- **SUC-034 — Delivery Stop Submission**
- **STORY-0085 — POST /stop**

STORY-0085 owns the transaction/persistence effects after the customer, address, movement cylinders, challan leaf/photo and other required stop inputs have been selected.

## Supplier Stop interactive flow

When the Supplier Stop branch is selected, the Supplier Stop page is loaded.

After the page is visible, the user can:

1. Search and select a supplier using **STORY-0102 — Supplier Search**.
2. Preserve the selected persistent supplier ID as the identity for all dependent reads.
3. Load cylinders currently associated with/held by the selected supplier using **STORY-0097 — Cylinders by Supplier** where applicable to the supplier exchange.
4. Load cylinders currently on the active vehicle/load using **STORY-0107 — Cylinders on Vehicle**.
5. Present the supplier-held and vehicle-held cylinders as distinct selectable groups.
6. Allow the user to choose the exact persistent cylinder IDs that are being dropped off to the supplier and/or picked up from the supplier, according to the supported movement.
7. Clear all dependent cylinder selections whenever the supplier identity changes.
8. Continue to the supplier stop submit transaction after the required supplier, movement, cylinder and challan inputs are complete.

### Supplier submit traceability gap

The current BL-002 dependency repository does not yet identify a distinct supplier-stop submit Story/endpoint with durable source evidence. This expanded Story therefore records a **mandatory traceability follow-up**: source-trace the supplier submit handler and attach the exact Story/use-case mapping. Do not invent an endpoint or treat the customer `POST /stop` handler as the supplier submit unless source evidence proves that relationship.

## Challan and photo context

The initial Add Stop page continues to load the stop-specific assigned challan-book/page windows:

- Customer Stop: delivery challan and empty-pickup challan assignments;
- Supplier Stop: filling-note / supplier drop-off challan assignment.

The selected challan leaf and required photo evidence remain inputs to the downstream submit transaction. Photo upload/delete APIs remain separate Stories and do not replace the party/cylinder selection behavior described here.

## Validation and interaction rules

The interactive workflow must maintain these reviewer-visible rules:

- no stop processing without an eligible trip/load state;
- no dependent cylinder search before a valid persistent customer/supplier identity exists;
- party change resets stale address/cylinder/exchange state;
- customer holdings and vehicle stock are not merged into an ambiguous list;
- supplier holdings and vehicle stock are not merged into an ambiguous list;
- exact persistent cylinder IDs are carried into submission;
- duplicate cylinder selection within the same movement is rejected/prevented;
- a cylinder cannot be simultaneously selected for conflicting movements in the same stop;
- empty/no-result API responses produce a visible empty-state message rather than stale previous results;
- API failure must not preserve a prior party's cylinder selections;
- submit is enabled only when all inputs required by the chosen customer/supplier movement are valid.

## Business effect

`GET /add-stop` is the entry point to an interactive exchange workflow. It gates the operation by trip state, selects the correct stop type, loads challan context, lets the user select the customer/supplier, dynamically resolves party-held and vehicle-held cylinders, captures the exact cylinders participating in the stop, and hands the completed selection into the governed submit transaction.

The GET/search portions are read-only. Actual custody/logistics/order/challan mutation occurs only in the downstream stop-submit transaction.

## Traceability

- Customer search: STORY-0091
- Customer-held cylinders: STORY-0096
- Supplier search: STORY-0102
- Supplier-held cylinders: STORY-0097
- Vehicle-held cylinders: STORY-0107
- Customer submit: SUC-034 / STORY-0085 / `POST /stop`
- Challan photo delete/upload: STORY-0048 / STORY-0049 / STORY-0050
- Supplier submit: **SOURCE TRACE REQUIRED — exact Story/use-case mapping not yet durable**

## Approval and conformance gate

This is a material rework of the previously approved STORY-0051 contract. The earlier approval and `CODE_CONFORMANCE_VERIFIED_PASS` remain historical evidence for the old page-load-only scope but **do not approve this expanded interactive workflow**.

Current state:

- `BUSINESS_BEHAVIOR_REWORKED_AWAITING_USER_REAPPROVAL`
- post-approval conformance must be rerun after explicit reapproval;
- BL-004/BL-005/BL-009/BL-011 fan-out for the revised STORY-0051 contract is blocked until reapproval and conformance;
- no application-code mutation is authorized by this Story rewrite.
