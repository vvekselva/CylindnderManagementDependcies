# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode: **ChatGPT authors additive Flyway/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.** UI/unit/runtime scenarios may be postponed into the governed test backlog and are non-blocking unless explicitly required by a migration acceptance gate.

## Execution boundary

- Acceptance target: fresh database / normal clean Flyway chain.
- No legacy cylinder/identifier backfill is required.
- Historical migrations remain unchanged by default.
- Delta ZIPs contain changed/new files only and preserve workspace-relative paths.
- GitHub is durable SSOT/version control only; orchestration execution does not use GitHub runners.
- No raw/manual SQL substitutes for Flyway execution.

## Current workspace

Validated source line through V183 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V183 deltas.

Prepared integrated workspace through V184: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182_V183_V184.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Governed ownership types

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

## Accepted clean-database gates

- **V174** strict ownership model — `BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0`
- **V175** supplier-owned asset-count preservation — `BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0`
- **V176** customer owner/custody consistency — `BL008_OWNERSHIP_V176_VALIDATION_PASS; failed_checks=0`
- **V177** cross-table location exclusivity — `BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0`
- **V178** external-asset terminal/accounting integrity — `BL008_OWNERSHIP_V178_VALIDATION_PASS; failed_checks=0`
- **V179** company fleet accounting integrity — `BL008_OWNERSHIP_V179_VALIDATION_PASS; failed_checks=0`
- **V180** ownership identity immutability — `BL008_OWNERSHIP_V180_VALIDATION_PASS; failed_checks=0`
- **V181** identifier authority/replacement integrity — `BL008_OWNERSHIP_V181_VALIDATION_PASS; failed_checks=0`
- **V182** active identifier value uniqueness/history integrity — `BL008_OWNERSHIP_V182_VALIDATION_PASS; failed_checks=0`
- **V183** state-audit history immutability — `BL008_OWNERSHIP_V183_VALIDATION_PASS; failed_checks=0`

Evidence is stored under `BL-008/evidence/`, including `20260831-v183-clean-database-validation-pass.md`.

## Phase 2 ownership lifecycle status

### Location exclusivity — V177 PASS

Transaction-end exclusivity is enforced across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state. Runtime hand-off tests remain postponed.

### Supplier refill identifier exchange — source implemented

Supplier refill can replace the physical identifier while retaining the same supplier-owned logical cylinder. UI/runtime validation remains postponed.

### Customer ownership/custody — V176 PASS

CUSTOMER_OWNED cylinders can enter CUSTOMER custody only at their owner customer; supplier refill custody remains allowed without ownership transfer.

### External/company accounting — V178/V179 PASS

External and company accounting boundaries, terminal idempotence, running totals and ownership-scoped integrity views are validated.

### Ownership identity — V180 PASS

Post-registration ownership type/owner identity is immutable and governed ownership-master semantics are protected.

### Identifier authority/history — V181/V182 PASS

The database enforces ownership-specific serial compatibility, exactly one active primary identifier per logical cylinder at transaction end, same-cylinder replacement history, append-only replacement events, normalized global active-primary value uniqueness, nonblank values, valid active/history windows and immutable identifier history identity fields.

### State-audit history — V183 PASS

V183 makes the authoritative lifecycle event history append-only after INSERT: DELETE and event-identity/source mutation are rejected while remarks-only annotation correction remains allowed. Existing fleet/external accounting, daily-count and current-status projection triggers remain enabled.

### State-audit chain continuity / concurrency — V184 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V183 proved the next database-boundary gap:

1. V183 protects an audit row after INSERT but does not validate the continuity of a newly inserted audit row against the latest prior row for the same cylinder.
2. Two concurrent transactions can both start from the same prior lifecycle state and append competing audit events, creating a fork in the authoritative history.
3. The fresh registration flow already establishes a linear audit chain. Its first event uses a same-state initialization pattern; later rows carry the previous lifecycle state. Same-state note/correction rows are valid when they continue from the latest state.

V184: `V184__Enforce_State_Audit_Chain_Continuity_And_Serialization.sql`

V184 adds:

- a supporting latest-live-audit index;
- `fn_validate_state_audit_chain_continuity()` and BEFORE INSERT trigger;
- per-cylinder transaction advisory serialization for non-legacy state-audit inserts;
- continuity rule: every later non-legacy audit row must declare the immediately prior audit `fk_new_state` as its `fk_previous_state`;
- first-row compatibility with NULL or same-state initialization;
- legacy-import rows deliberately excluded from this live operational chain rule;
- `vw_cylinder_state_audit_chain_integrity` for chain continuity diagnostics.

V184 does **not** introduce a new state-transition legality matrix; existing lifecycle/state-machine behavior remains unchanged.

V184 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

`BL-008/test-case-backlog.csv` now contains **35 non-blocking cases**: 1 `PENDING_EXECUTION`, 1 `PLANNED`, and 33 `POSTPONED_BY_USER`.

V184 adds chain-discontinuity rejection and same-cylinder concurrent audit serialization cases.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174–V183: **CLEAN_DATABASE_VALIDATED_PASS**
- V184: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- UI/runtime test backlog: **35 NON-BLOCKING CASES**
- Phase 2 gate: **V184_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182_V183_V184.zip` as migration source.
2. Perform a fresh clean Flyway migration through V184.
3. Run `BL008_Ownership_V184_State_Audit_Chain_Validation.sql`.
4. Return the consolidated V184 result table.
5. After V184 acceptance, continue only with the next source-proved requirement; do not create V185 merely to advance the version.
