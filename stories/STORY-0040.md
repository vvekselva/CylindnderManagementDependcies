# STORY-0040 — List active vehicle loads and trip status

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `55c311333b6383bb6a828c324d4a0bf2501d7f8a2613c0b0541383d1cfd81c45`  
**Matrix row:** `GET /vehicle-loads/list`

`VehicleLoadByPageController.listVehicleLoads` invokes `VehicleActiveTripFetchByPageService`. `VehicleActiveTripJpaDao` reads `VehicleActiveTripDo` from `public.vw_active_trips`; the mapping uses trip/load/vehicle/driver data, and `TripReturnWorkflowService.getTripStatusByVehicleLoadIds` adds the proved status data. The controller renders the VehicleLoad list view. No write is asserted.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the active-trip view/status helper reads and VehicleLoad list rendering.

Pending explicit user approval for the exact fingerprint above.
