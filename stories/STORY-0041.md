# STORY-0041 — List all vehicle loads

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `afefdf00a259b69dd171bcc0a1463448d5dde5614b0c44e374290a1f45b65ccb`  
**Matrix row:** `GET /vehicle-loads/all-list`

`VehicleLoadByPageController.listAllVehicleLoads` invokes `VehicleLoadFetchByPageService`, which reads `VehicleLoadDo` through `VehicleLoadJpaDao` from `public.tbl_vehicle_load`. The proved mapping uses related trip, driver and vehicle data and a trip-status helper before rendering the VehicleLoad list view. No write is asserted.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the proved load/related-data/status reads and list rendering.

Pending explicit user approval for the exact fingerprint above.
