# STORY-0016 — Remove and resequence a stop from a predefined delivery trip

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /delivery-planning/predefined-trips/remove-stop`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`  
**Fingerprint:** `89c281cd0521fa14a683cd68c35d4cee8230a31de50555deb7f45bfd700c77df`

## Trigger and context
A caller submits the remove-stop POST endpoint to `PredefinedDeliveryTripController.removeStop`.

## Received values, normalization and validation
Concrete identifiers, types, required/optional semantics, normalization/default behavior and validation order are not preserved in the accepted canonical row. Invalid identifier, missing association and exception behavior therefore remain **NEEDS_CLARIFICATION**.

## Source-proved ordered component flow
`PredefinedDeliveryTripController.removeStop` -> `PredefinedDeliveryTripService.removeStop/resequence` -> `PredefinedDeliveryTripStopJpaDao` -> `PredefinedDeliveryTripStopDo` -> `public.tbl_predefined_delivery_trip_stop`.

## Business rule and persistence effects
The accepted evidence proves that remove-stop processing includes resequencing and reaches the predefined-trip-stop table. It does not preserve the ordering algorithm, exact rows selected, delete-versus-update semantics, mutated columns or resulting sequence values. Those details are intentionally not inferred.

## Alternate and error paths
Not-found, invalid-sequence, repository exception and response-error behavior are not proved by the accepted matrix row.

## Output and postconditions
The remove/resequence persistence path is invoked. Exact redirect/view/status/body semantics and final ordering remain unasserted.

## Evidence
- Canonical matrix row: `POST /delivery-planning/predefined-trips/remove-stop`
- `logs/runs/INVOCATION-20260823-160000.md` — LANE-03

## Downstream test assertion
Integration coverage may assert the proved service/repository/table chain and that resequencing is part of the accepted flow. Exact ordering assertions must wait for clarification.

**Approval:** not eligible until clarified; user approval is never automatic.
