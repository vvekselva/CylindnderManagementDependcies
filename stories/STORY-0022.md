# STORY-0022 — Save a yard location

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `4c8b35e999cc711389c52a633e9e1e93010a4f29071cd265b81c493ab6289057`

A caller submits `POST /yard-location/upload`. The request reaches `CustomerAddressLocationController.saveYardLocation`, which invokes `CustomerAddressLocationOfflineMapService.saveYardLocation`. The accepted trace proves a yard lookup through `YardInventoryJpaDao.findById -> YardInventoryDo -> public.tbl_yard_inventory`, followed by the yard-location branch `YardLocationJpaDao.findFirstByYardYardInventoryIdAndActiveTrueAndDefaultStartPointTrueOrderByYardLocationIdDesc / save -> YardLocationDo -> public.tbl_yard_location`.

The accepted evidence proves success/error redirects back to `/yard-location/upload`. It does not prove the exact submitted field names, requiredness, formatting rules, validation messages, ownership rules or geographic rules, so none are invented here.

Postcondition: on the proved save path, the yard-location state is persisted in `public.tbl_yard_location` and the caller is redirected back to the yard-location upload route.

Evidence: canonical BL-001 row `POST /yard-location/upload`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
