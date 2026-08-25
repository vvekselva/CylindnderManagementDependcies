# BL-001 Primary Orchestrator — All Missing Unique Keys Source-Proved

Checkpoint time: 2026-08-25T08:11Z  
Backlog: BL-001 / reopened WU-BL001-001  
Frozen source: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Control branch: `chore/rename-dependency-files`

## Idempotency first

Prior worker generation `E2E-STAGED-20260823-161214` is CLOSED/SYNCHRONIZED. It was not replayed. Workers started: 0. Residual transient lane logs: 0.

## Recovery result

Exact frozen-source validation is now complete for all 11 missing canonical HTTP method/path keys. No route name was inferred and no final table was reached by naming convention.

Fully proved families:

- ReconciliationDashboardController: 2 keys through `ReconciliationDashboardService -> ReconciliationCheckpointJpaDao -> ReconciliationCheckpointDo -> public.tbl_reconciliation_checkpoint -> dashboard view`.
- VehicleLoadFetchByIdController: 1 key, revalidated against the durable full branching proof in `PRODUCTION-FIRE-20260825-005948-SCHEDULER.md` and exact frozen controller blob.
- LookupManagementController: all 6 exact keys. `GET /lookup` is redirect-only. `GET /lookupManagement` includes cache-hit and four lazy-refresh fetch-service/DAO/entity/table branches. Each POST save route includes its exact ingestion service persistence branch, success cache refresh branch, and validation-error page rebuild cache branches.
- VehicleTripIngestionController: both keys. GET is a terminal view path. POST is source-proved through the exact generic service implementation and typed validator into Vehicle/Driver/Customer/CustomerAddress/TripStatus lookups, `VehicleTripJpaDao.save`, `VehicleTripDo -> public.tbl_vehicle_trip`, with success redirect and validation/system-error view terminals.

The complete ordered recovery candidate is persisted at `backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml`.

## Canonical count remains fail-closed

The canonical matrix remains 123 / 134 unique rows. Source proof completeness is now 11 / 11 for the recovery gap, but WF-002 requires the Markdown matrix, unresolved ledger, matrix-progress, consolidated structured Explorer JSON, browser `matrix-data.js`, and Level-3 runtime to move together.

The existing Explorer is currently represented as an early base JSON plus a long ordered-delta history. Rewriting only the base or adding counts without first consolidating the accepted deltas would risk dropping already accepted chains and would violate QG-TRC-012. Therefore no partial canonical promotion is made in this checkpoint.

## Current state

- target unique keys: 134
- canonical materialized unique keys: 123
- recovery gap: 11
- recovery keys with complete frozen-source proof: 11
- unresolved: 0
- worker replay: 0
- WU-BL001-001: atomic projection pending
- WU-BL001-002: blocked until true 134/134 materialization
- BL-001 close allowed: false

## Next action

Consolidate the current base-plus-ordered-delta Explorer projection into one accepted 123-row structured model, merge the 11 recovery records, regenerate `traceability-matrix.json` and `matrix-data.js`, update `controller-traceability.md`, unresolved/progress/runtime in the same commit, verify exactly 134 unique method/path keys and zero duplicates, then resume WU-BL001-002.
