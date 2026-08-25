# BL-001 Unique-Key Recovery Checkpoint — 2026-08-25 11:59 IST

## Idempotency

Prior worker generation `E2E-STAGED-20260823-161214` is already CLOSED/SYNCHRONIZED. Decision: NOOP_DO_NOT_REPLAY. Workers started: 0. Transient lane logs created: 0.

## Recovery scope

WU-BL001-001 remains reopened only for the exact 11 missing canonical HTTP method/path keys. WU-BL001-002 remains blocked until true unique-key coverage reaches 134/134.

## Revalidated endpoint

`GET /vehicle-load/fetch` was revalidated from durable frozen-source proof at baseline `3ae6e61442132d94a307275b08dd65fcef228d89`.

Source-proved branching chain:

1. `VehicleLoadFetchByIdController.doGet` -> typed `ICylinderManagementApplicationService<VehicleLoadFetchByIdRequestDto, VehicleLoadFetchByIdResponseDto>` -> `VehicleLoadFetchByIdService` -> `VehicleLoadJpaDao.findById` -> `VehicleLoadDo` / `public.tbl_vehicle_load` -> `VehicleTripDo` / `public.tbl_vehicle_trip` -> explicitly dereferenced `DriverDo` / `public.tbl_driver`, `VehicleDo` / `public.tbl_vehicle`, `VehicleTripStopDo` / `public.tbl_vehicle_trip_stop`, `VehicleTripStopTypeDo` / `public.tbl_stop_type` -> `with-menu/Displayvehicleload.html`.
2. Controller status branch -> `TripReturnWorkflowService.getTripStatusByVehicleLoadId` -> `VehicleTripStatusDo` / `public.tbl_trip_status` -> same terminal view.

Durable evidence: `logs/runs/PRODUCTION-FIRE-20260825-005948-SCHEDULER.md` and `backlog/runtime/BL-001/unique-key-recovery-20260825-0809.yaml`.

## Fail-closed projection decision

The endpoint is source-valid and Primary-Orchestrator revalidated, but canonical unique coverage remains 123/134 in this checkpoint. Recovery governance requires `traceability/controller-traceability.md`, unresolved ledger, `matrix-progress.yaml`, `traceability-matrix.json`, `matrix-data.js`, and Level-3 runtime to move together. No partial projection or split-brain count was written.

Next action: perform the required atomic multi-artifact projection for this endpoint, re-read the canonical set, verify 124 unique keys, then continue the remaining ten recovery keys.
