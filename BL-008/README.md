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

Validated source line through V182 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V182 deltas.

Prepared integrated workspace through V183: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182_V183.zip`.

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

Evidence is stored under `BL-008/evidence/`, including `20260831-v182-clean-database-validation-pass.md`.

The first V182 validator reported only the normalized unique-index check as FAIL even though the returned PostgreSQL definition showed the correct UNIQUE expression/predicate. This was a validator text-deparsing false negative. Validation v2 used catalog semantics and V182 passed all checks.

## Phase 2 ownership lifecycle status

### Location exclusivity — V177 PASS

Transaction-end exclusivity is enforced across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state. Runtime hand-off tests remain postponed.

### Supplier refill identifier exchange — source implemented

Supplier refill can replace the physical identifier while retaining the same supplier-owned logical cylinder. UI/runtime validation remains postponed.

### Customer ownership/custody — V176 PASS

CUSTOMER_OWNED cylinders can enter CUSTOMER custody only at their owner customer; supplier refill custody remains allowed without ownership transfer.

### External/company accounting — V178/V179 PASS

External and company accounting boundaries, terminal idempotence, running totals, and ownership-scoped integrity views are validated.

### Ownership identity — V180 PASS

Post-registration ownership type/owner identity is immutable and governed ownership master semantics are protected.

### Identifier authority/history — V181/V182 PASS

The database now enforces ownership-specific serial compatibility, exactly one active primary identifier per logical cylinder at transaction end, same-cylinder replacement history, append-only replacement events, normalized global active-primary value uniqueness, nonblank values, valid active/history windows, and immutable identifier history identity fields.

### State-audit history integrity — V183 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V182 proved the next database-boundary gap:

- `tbl_cylinder_state_audit` is an authoritative lifecycle stream consumed by INSERT-only downstream projections/triggers including fleet/external accounting, daily counts and the legacy current-status mirror; V177 also relies on state audit for terminal-location integrity.
- The JPA repository exposes UPDATE and DELETE, and its existing integration tests explicitly expect remarks update and audit-row deletion to work.
- Rewriting event identity or deleting an already-consumed audit event can therefore make the audit stream disagree with downstream histories because those INSERT-time side effects are not reversed/recomputed.

V183: `V183__Protect_Cylinder_State_Audit_History.sql`

V183 adds:

- DELETE rejection for `tbl_cylinder_state_audit`;
- immutability of cylinder, previous/new state, order, changed_at and legacy source identity after INSERT;
- remarks-only correction remains allowed;
- `vw_cylinder_state_audit_history_integrity` as a structural/history diagnostic view without introducing a new current-status authority.

V183 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

`BL-008/test-case-backlog.csv` now contains **33 deferred/pending cases**: 1 `PENDING_EXECUTION`, 1 `PLANNED`, and 31 `POSTPONED_BY_USER`. All are marked `blocking=NO`.

V183 adds cases for audit DELETE rejection, event-identity mutation rejection, and remarks-only correction.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174–V182: **CLEAN_DATABASE_VALIDATED_PASS**
- V183: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- UI/runtime test backlog: **33 NON-BLOCKING CASES**
- Phase 2 gate: **V183_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182_V183.zip` as migration source.
2. Perform a fresh clean Flyway migration through V183.
3. Run `BL008_Ownership_V183_State_Audit_History_Validation.sql`.
4. Return the consolidated V183 result table.
5. After V183 acceptance, continue only with the next source-proved requirement; do not create V184 merely to advance the version.
