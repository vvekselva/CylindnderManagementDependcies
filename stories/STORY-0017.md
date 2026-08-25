# STORY-0017 — Deactivate a predefined delivery trip

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /delivery-planning/predefined-trips/remove`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`  
**Fingerprint:** `4b3a60fa24615938fa4b1161b274a8c4266f6113840d7e4950c5a962aad9e29e`

## Trigger and context
A caller submits the remove endpoint to `PredefinedDeliveryTripController.remove`.

## Received values, normalization and validation
The accepted canonical row does not preserve the concrete identifier field, type, required/optional semantics, normalization/default behavior, identifier validation, state eligibility rules, or invalid-value handling. These remain **NEEDS_CLARIFICATION**.

## Source-proved ordered component flow
`PredefinedDeliveryTripController.remove` -> `PredefinedDeliveryTripService.deactivate` -> `PredefinedDeliveryTripJpaDao` -> `PredefinedDeliveryTripDo` -> `public.tbl_predefined_delivery_trip`.

## Business rule and persistence effect
The accepted trace explicitly identifies the service operation as **deactivate**. It does not prove physical deletion. The exact active/inactive field, predicates, eligibility conditions, field mutations, cascade behavior and any audit effects are not preserved, so they are not invented.

## Alternate and error paths
Already-inactive, not-found, invalid-input and repository exception behavior are not proved by the accepted row.

## Output and postconditions
The deactivation persistence chain reaches `public.tbl_predefined_delivery_trip`. Exact redirect/view/status/body semantics and final field values remain unasserted.

## Evidence
- Canonical matrix row: `POST /delivery-planning/predefined-trips/remove`
- `logs/runs/INVOCATION-20260823-160000.md` — LANE-03

## Downstream test assertion
Integration coverage may assert the proved deactivate service/repository/table chain and must not treat it as a physical delete unless later accepted evidence proves that behavior.

**Approval:** not eligible until clarified; user approval is never automatic.
