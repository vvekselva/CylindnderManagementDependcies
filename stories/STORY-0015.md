# STORY-0015 — Add a stop to a predefined delivery trip

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /delivery-planning/predefined-trips/add-stop`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`  
**Fingerprint:** `f3257c0ceb6efe789c963ab21bafee297ca9f728c76c3e4fda671ad1ef286860`

## Trigger and context
A caller submits the add-stop POST endpoint to `PredefinedDeliveryTripController.addStop`.

## Received values, normalization and validation
The accepted BL-001 canonical row does not preserve the concrete request field names, types, required/optional semantics, normalization/default behavior, validation order, or invalid-value handling. Those details are therefore **NEEDS_CLARIFICATION** and are not invented here.

## Source-proved ordered component flow
`PredefinedDeliveryTripController.addStop` -> `PredefinedDeliveryTripService.addStop` -> `PredefinedDeliveryTripJpaDao` / `DeliveryPlanningStopJpaDao` / `PredefinedDeliveryTripStopJpaDao` -> `public.tbl_predefined_delivery_trip` / `public.tbl_delivery_planning_stop` / `public.tbl_predefined_delivery_trip_stop`.

## Reads, writes and side effects
The accepted trace proves persistence-layer interaction with all three tables. It does not preserve the exact read-versus-write operation or columns affected for each table. A predefined-trip stop association/planning-stop persistence effect is consistent with the proved chain, but exact state transitions remain unasserted until accepted evidence proves them.

## Alternate and error paths
Missing-record, duplicate-association, invalid-input, exception and response-error behavior are not proved by the accepted row and remain **NEEDS_CLARIFICATION**.

## Output and postconditions
The add-stop service/persistence chain is invoked. Exact redirect/view/status/body semantics and final persisted state are not asserted.

## Evidence
- Canonical matrix row: `POST /delivery-planning/predefined-trips/add-stop`
- `logs/runs/INVOCATION-20260823-160000.md` — LANE-03

## Downstream test assertion
Integration coverage may assert the proved service/repository/table chain. Field-level request and response assertions must wait for clarification.

**Approval:** not eligible until clarified; user approval is never automatic.
