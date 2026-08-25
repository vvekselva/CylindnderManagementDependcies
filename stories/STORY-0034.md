# STORY-0034 — Return a trip and its challan books

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `bd7b92c5b62ff888ee6e701053e6d8d8d4c287d620bb03d0eee23dcf93b2fcf3`  
**Matrix row:** `POST /trip-return`

## Purpose
Persist the source-proved trip-return updates for challan pages, challan-book assignments/registry and vehicle-trip status, then return the caller to the vehicle-load list.

## Trigger and inputs
A caller submits `POST /trip-return`. The accepted evidence proves trip/load/challan context is consumed, but not the exact request-field names/defaults.

## Validations and flow
1. `TripReturnController.returnTripAndBooks` receives the request.
2. The workflow operates on the existing trip/challan return state.
3. It updates challan page-ledger state.
4. It updates trip challan-book assignment and challan-book registry state.
5. It updates vehicle trip/status.
6. Success redirects to `/vehicle-loads/list`.

## Data effects
The source-proved flow updates the challan page ledger, trip challan-book assignment, challan-book registry, and vehicle-trip/status records.

## Alternate/error flows
Handled errors reload the trip-return review view. Exact messages/status codes are not asserted because they are not enumerated in accepted evidence.

## Evidence
- `traceability/controller-traceability.md` — `POST /trip-return`
- `logs/runs/PRODUCTION-FIRE-20260824-181810.md`

## Downstream test assertion
Integration: a successful return must exercise the proved challan/trip persistence updates and redirect to `/vehicle-loads/list`.

## Approval
Pending explicit user approval for the exact fingerprint above.
