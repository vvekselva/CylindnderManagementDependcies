# STORY-0002 — Display the customer address planning map

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `a92084eb69e026bf18431514c19bed9472bae66254eeff4bc0c3772b2f2a3276`  
**Matrix row:** `GET /customer-address-location/planning-map`  
**Controller:** `CustomerAddressLocationController.showPlanningMap`

## Story

When a caller requests `GET /customer-address-location/planning-map`, the request is handled by `CustomerAddressLocationController.showPlanningMap`. The accepted BL-001 trace proves a direct terminal-view flow to `with-menu/CustomerAddressPlanningMap`. No service, DAO, database, file or external API dependency is proved for this endpoint.

No request value, normalization rule, validation rule, persistence operation, state transition or alternate branch is asserted because the accepted evidence does not prove one for this flow.

## Main flow

1. A caller sends `GET /customer-address-location/planning-map`.
2. `CustomerAddressLocationController.showPlanningMap` handles the request.
3. The planning-map view is returned.

## Data effects

None proved.

## Output and postcondition

The caller receives `with-menu/CustomerAddressPlanningMap`. No persistence-side postcondition is proved.

## Evidence

- `traceability/controller-traceability.md` — `GET /customer-address-location/planning-map`
- `logs/runs/PRODUCTION-FIRE-20260824-013546.md`

## Candidate downstream assertion

`UNIT_CANDIDATE`: the endpoint resolves to the planning-map view without a proved persistence dependency.

User approval is required before this Story becomes `APPROVED`.
