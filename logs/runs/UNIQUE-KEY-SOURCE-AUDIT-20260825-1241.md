# BL-001 Unique-Key Source Audit — 2026-08-25 12:41 IST

## Invocation result

- Primary Orchestrator applied execution-journal idempotency first.
- Prior worker generation `E2E-STAGED-20260823-161214` is already CLOSED/SYNCHRONIZED and was not replayed.
- Workers started: 0.
- Transient lane logs created: 0.
- Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`.
- Canonical materialized unique-key count remains 123/134; no increment was applied.

## Source-key audit findings

### Reconciliation dashboard

Frozen `ReconciliationDashboardController` blob `fec84449c72e5240ea5f9f53db79e55760c742e3` proves:

- `GET /reconciliation-dashboard`
- `POST /reconciliation-dashboard/search`

The recovery ledger currently asks for `POST /reconciliation-dashboard/reconcile`. That key does not match this frozen controller mapping and is therefore fail-closed. The canonical endpoint inventory must be re-derived before any promotion of that key.

### Lookup management

Frozen `LookupManagementController` blob `a23814eb9c1f155779a3d51e67e16ac0ee9d2436` uses camel-case `/lookupManagement` routes, including GET `/lookupManagement` and save handlers such as `/lookupManagement/country/save`. The recovery ledger contains kebab-case `/lookup-management/*/update` keys. Those keys are not promoted until their exact frozen-source mappings are independently proved.

### Vehicle trip ingestion

Frozen `VehicleTripIngestionController` blob `26f887d731fd58a28c2a76240bd3d2b7ee02fb69` proves both:

- `GET /addVechileTrip`
- `POST /addVechileTrip`

These remain valid targeted-recovery candidates; POST still requires its complete service → DAO/repository → entity → DB chain before canonical promotion.

## Decision

The recovery ledger itself contains source-key drift. Continue targeted recovery by exact frozen mappings, not by ledger spelling. No worker replay and no canonical counter increment are permitted from mismatched keys.
