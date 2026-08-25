# STORY-0044 — Open vehicle-load entry page with vehicle-load purposes

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `d01ddc940d49a4fea56d71956efc9455b3b9f5d63c0a675abdb1cf9569575c96`  
Canonical matrix row: `GET /vehicleLoad`  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

A caller opens `GET /vehicleLoad`. The controller requests vehicle-load purposes from `LookupDataCache`. When the cache already contains values, that in-memory list is used directly. When the cached list is empty, the cache refresh path calls `VehicleLoadPurposeFetchAllService.processRequest`, which reads through `VehicleLoadPurposeJpaDao.findAll` and `VehicleLoadPurposeDo` from `public.tbl_vehicle_load_purpose`, then refreshes the in-memory purpose list. The controller renders `with-menu/Uc02-Phase01-VehicleLoadView`.

No required caller input or caller-input validation is proved for this GET path. Flash attributes from a prior redirect may populate model values, but the accepted trace proves they do not introduce another database lookup. No vehicle-load persistence write occurs in this GET flow. No unproved error behavior is added.

## Ordered component flow

`Uc02Phase01VehicleLoadController.doGet` → `LookupDataCache.getVehicleLoadPurposes` → cache hit **or** `LookupDataCache.refreshVehicleLoadPurpose` → `VehicleLoadPurposeFetchAllService.processRequest` → `VehicleLoadPurposeJpaDao.findAll` → `VehicleLoadPurposeDo` → `public.tbl_vehicle_load_purpose` → in-memory cache → `with-menu/Uc02-Phase01-VehicleLoadView`.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-083401.md`

User approval is still required before this Story becomes downstream-authoritative.
