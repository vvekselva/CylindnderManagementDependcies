# BL-001 Primary Orchestrator — Targeted Unique-Key Recovery Advance

Checkpoint time: 2026-08-25T10:48:00+05:30  
Backlog: BL-001 / reopened WU-BL001-001  
Frozen source: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Control branch: `chore/rename-dependency-files`

## Idempotency

The prior worker generation `E2E-STAGED-20260823-161214` remains CLOSED/SYNCHRONIZED. Decision: NOOP for that generation, then continue eligible targeted recovery. Workers started: 0. Residual transient lane logs: 0.

## Frozen-source validation performed

### Reconciliation dashboard

Revalidated exact controller blob `fec84449c72e5240ea5f9f53db79e55760c742e3`, service blob `c0817301fa57492da946b23674c28a0af1642c2a`, DAO blob `824f29c1b66f7c58de28a9cbf9962262e1c63e4e`, and entity blob `c9855d934dfa12b01f7ed2787d660cc978092b6c`.

Both exact keys are full-chain source-proved:

- `GET /reconciliation-dashboard`
- `POST /reconciliation-dashboard/search`

Chain for each: `ReconciliationDashboardController` handler -> `ReconciliationDashboardService.processRequest` -> `ReconciliationCheckpointJpaDao.findByCheckpointDate` -> `ReconciliationCheckpointDo` -> `public.tbl_reconciliation_checkpoint` -> `final-version-1/reconciliation_checkpoint_dashboard`.

### Lookup legacy redirect

Frozen `LookupManagementController` blob `a23814eb9c1f155779a3d51e67e16ac0ee9d2436` proves:

- `GET /lookup` -> `LookupManagementController.legacyRedirect` -> terminal redirect `redirect:/lookupManagement`.

There is no service, DAO, repository, entity, or database dependency on this route. It is FULL and ready for atomic projection.

The separate `GET /lookupManagement` route is not promoted: it calls `LookupDataCache` getters whose lazy refresh paths must still be source-proved through the exact fetch services and persistence dependencies.

### Vehicle trip GET

Frozen `VehicleTripIngestionController` blob `26f887d731fd58a28c2a76240bd3d2b7ee02fb69` proves:

- `GET /addVechileTrip` -> `VehicleTripIngestionController.doGet` -> terminal view `with-menu/VehicleTripIngestion`.

There is no service/DAO/database call in `doGet`; only DTO/model preparation occurs. The POST route remains separate and is still under full branching source validation.

## Recovery-ready set

Four exact missing canonical keys now have complete frozen-source evidence and are ready for the required atomic canonical projection:

1. `GET /reconciliation-dashboard`
2. `POST /reconciliation-dashboard/search`
3. `GET /lookup`
4. `GET /addVechileTrip`

Canonical matrix coverage is intentionally unchanged at 123 / 134 because WF-002 requires Markdown, unresolved ledger, matrix-progress, structured Explorer JSON, browser data and runtime state to move together. No partial count increment was written.

## Current fail-closed state

- unique target: 134
- materialized unique rows: 123
- exact pending recovery keys: 11
- fully source-proved awaiting atomic projection: 4
- unresolved: 0
- worker replay: 0
- WU-BL001-001: IN_PROGRESS_TARGETED_UNIQUE_KEY_RECOVERY
- WU-BL001-002: BLOCKED_WAITING_FOR_TRUE_UNIQUE_SOURCE_CHECK_COMPLETION
- BL-001 close allowed: false

## Next action

Complete the remaining LookupManagement cache/fetch and ingestion persistence chains, finish POST `/addVechileTrip`, and revalidate the durable full chain for GET `/vehicle-load/fetch`. Atomically project only when the complete canonical structured model can be regenerated without losing existing accepted ordered-delta history.
