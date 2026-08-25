# BL-001 Primary Orchestrator — Targeted Unique-Key Recovery Checkpoint

Checkpoint start: 2026-08-25T13:00:58+05:30  
Checkpoint evidence time: 2026-08-25T13:09:55+05:30  
Backlog: BL-001 / WU-BL001-001  
Frozen source: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Control branch: `chore/rename-dependency-files`

## Idempotency

The prior local worker generation `E2E-STAGED-20260823-161214` remains CLOSED/SYNCHRONIZED. It was NOOP and was not replayed. No worker lane was started in this checkpoint. Residual transient lane logs remain 0.

## Recovery inventory integrity correction

The live matrix still has 123 unique `(HTTP method,path)` rows. The reopened recovery plan still requires 11 missing keys, but exact frozen-source reads proved that several route names in the prior recovery inventory were stale and did not correspond to actual Spring mappings. They were rejected rather than traced as nonexistent routes.

### ReconciliationDashboardController

Frozen controller blob: `fec84449c72e5240ea5f9f53db79e55760c742e3`.

Actual routes:

- `GET /reconciliation-dashboard`
- `POST /reconciliation-dashboard/search`

Rejected stale alternatives include `POST /reconciliation-dashboard` and `POST /reconciliation-dashboard/refresh`.

Both actual routes call `ReconciliationDashboardService.processRequest`. Frozen service blob `c0817301fa57492da946b23674c28a0af1642c2a` calls `ReconciliationCheckpointJpaDao.findByCheckpointDate`; DAO blob `824f29c1b66f7c58de28a9cbf9962262e1c63e4e` targets `ReconciliationCheckpointDo`; entity blob `c9855d934dfa12b01f7ed2787d660cc978092b6c` maps `public.tbl_reconciliation_checkpoint`. Both routes terminate in `final-version-1/reconciliation_checkpoint_dashboard`.

State: **FULL_CHAIN_SOURCE_PROVED_READY_FOR_ATOMIC_PROJECTION** for 2 keys. They are deliberately not counted yet because Markdown, unresolved ledger, matrix-progress, Explorer JSON/browser data and runtime must move atomically.

### LookupManagementController

Frozen controller blob: `a23814eb9c1f155779a3d51e67e16ac0ee9d2436`.

The controller exposes exactly these six missing routes for this recovery family:

- `GET /lookup`
- `GET /lookupManagement`
- `POST /lookupManagement/addressType/save`
- `POST /lookupManagement/country/save`
- `POST /lookupManagement/state/save`
- `POST /lookupManagement/city/save`

The prior generic `/lookup/management...` and `saveCylinder*` / `saveVehicleTrip*` keys do not match the frozen controller source and are rejected. `LookupDataCache` was also source-verified; it performs lazy/refresh fetches through exact generic fetch-service bindings. Downstream binding/table validation for the four save routes remains in progress, so no lookup endpoint was promoted in this checkpoint.

### VehicleTripIngestionController

Frozen controller blob: `26f887d731fd58a28c2a76240bd3d2b7ee02fb69`.

- `GET /addVechileTrip` is source-proved as a terminal view path to `with-menu/VehicleTripIngestion`.
- `POST /addVechileTrip` binds by generic signature to `VehicleTripIngestionServiceImpl`, frozen blob `34683207750da12cd72d0c6c76e7ceade792e9a8`. The implementation validates the request, reads Vehicle/Driver/Customer/CustomerAddress/TripStatus records, persists `VehicleTripDo`, maps the response and the controller redirects to `/vehicleLoad`. Full entity/table validation is still being completed before acceptance.

### VehicleLoadFetchByIdController

Frozen controller blob: `7ac5d84933d4841be17b2ff8110797051085f3f7` confirms `GET /vehicle-load/fetch`. Prior durable full-chain proof remains available at `logs/runs/PRODUCTION-FIRE-20260825-005948-SCHEDULER.md`. Reopened WU-BL001-001 revalidation remains active; it is not silently promoted from deferred evidence.

## Canonical state preserved

- materialized unique matrix rows: 123 / 134
- exact pending recovery keys: 11, now corrected to frozen-source route identities
- unresolved: 0
- worker lanes fired: 0 / 10
- residual transient lane logs: 0
- WU-BL001-001: IN_PROGRESS_TARGETED_UNIQUE_KEY_RECOVERY
- WU-BL001-002: BLOCKED_WAITING_FOR_TRUE_UNIQUE_SOURCE_CHECK_COMPLETION
- BL-001 close allowed: false

## Durable changes in this checkpoint

- corrected `backlog/runtime/BL-001/unique-key-recovery-20260825-0809.yaml` from exact frozen controller mappings;
- synchronized `backlog/runtime/BL-001/work-unit-status.yaml` with corrected inventory and source-proof progress;
- synchronized `backlog/runtime/BL-001/gate-status.yaml` with two full-chain recovery keys ready for atomic projection;
- no matrix row was invented and no endpoint count was incremented without the required atomic projection.

## Next action

Atomically promote the two fully source-proved reconciliation-dashboard routes, then continue exact downstream chain validation for the six corrected LookupManagement routes, POST `/addVechileTrip`, and the revalidation of GET `/vehicle-load/fetch`. Resume WU-BL001-002 only when exactly 134 unique `(HTTP method,path)` rows are materially represented once each.
