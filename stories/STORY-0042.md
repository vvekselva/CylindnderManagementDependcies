# STORY-0042 — List vehicle trips

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `6d9cadbabdc18aabd256d86cc14d81fa20331861b7db71772bb82936fa3f7679`  
**Matrix row:** `GET /vehicle-trips/list`

`VehicleTripController.listVehicleTrips` invokes `VehicleTripFetchByPageService`, which reads `VehicleTripDo` through `VehicleTripJpaDao` from `public.tbl_vehicle_trip`. The response mapping uses the source-proved vehicle and driver relations before rendering `tst/trip-list`. No write is asserted.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the proved trip/vehicle/driver reads and `tst/trip-list` rendering.

Pending explicit user approval for the exact fingerprint above.
