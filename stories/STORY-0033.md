# STORY-0033 — Display the trip-return challan-book review page

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `adafc2b8f7da95ddb52f40abe8c129dd0746cb1218f75685452c4765d1f5b32d`  
**Matrix row:** `GET /trip-return`

## Purpose
Display the source-proved trip-return review state for a vehicle load, including trip, vehicle, driver, challan-book assignment, page-ledger and photo information.

## Trigger and inputs
A caller opens `GET /trip-return`. The accepted trace proves a vehicle-load context is consumed by `TripReturnWorkflowService.loadReturnPage`; exact request parameter names/defaults are not enumerated, so none are invented.

## Validations and flow
1. `TripReturnController.showReturnPage` receives the request.
2. `TripReturnWorkflowService.loadReturnPage` resolves vehicle load and related trip/status data.
3. It reads vehicle and driver details plus challan-book assignment, page-ledger and photo state.
4. The controller renders `final-version-1/TripReturnChallanBookReview`.

## Ordered component flow
`TripReturnController.showReturnPage` → `TripReturnWorkflowService.loadReturnPage` → `VehicleLoadJpaDao / VehicleLoadDo / public.tbl_vehicle_load` → `VehicleTripDo / public.tbl_vehicle_trip` → `VehicleTripStatusDo / public.tbl_trip_status` → vehicle/driver data → challan assignment/page-ledger/photo state → review view.

## Data effects
This GET path is read-only in the accepted trace. No persistence write is asserted.

## Alternate/error flows
Exact missing-load/error status behaviour is not enumerated in the accepted trace and remains unspecified.

## Output/postconditions
The trip-return challan-book review view is rendered with the source-proved review data.

## Evidence
- `traceability/controller-traceability.md` — `GET /trip-return`
- `logs/runs/PRODUCTION-FIRE-20260824-181810.md`

## Downstream test assertion
Integration: the endpoint must load the proved trip/load/challan review dependencies and render the proved review view.

## Approval
Pending explicit user approval for the exact fingerprint above.
