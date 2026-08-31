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

Validated source line through V181 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V181 deltas.

Prepared integrated workspace through V182: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182.zip`.

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
- **V181** identifier authority and replacement integrity — `BL008_OWNERSHIP_V181_VALIDATION_PASS; failed_checks=0`

Evidence is stored under `BL-008/evidence/`, including `20260831-v181-clean-database-validation-pass.md`.

## Phase 2 ownership lifecycle status

### Location exclusivity — complete at application/database boundary

V177 enforces transaction-end exclusivity across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state. Runtime hand-off tests remain postponed in the backlog.

### Supplier refill physical identifier exchange — source implemented

Supplier refill can replace the physical identifier while retaining the same logical supplier-owned cylinder. V175 keeps supplier logical asset count stable. UI/runtime validation remains postponed.

### Customer-owned owner/custody consistency — V176 PASS

CUSTOMER_OWNED cylinders can enter CUSTOMER custody only at their owner customer; supplier refill custody remains allowed without ownership transfer.

### External-asset accounting — V178 PASS

External-ledger event family, ownership type, owner party and product are validated against the referenced cylinder. Customer terminal shrink is one-time/idempotent and customer active external balance has an integrity view.

### Company-fleet accounting — V179 PASS

V179 validates company event/delta semantics, one-time commission/terminal shrink, serialized running totals, append-only fleet history, company fleet integrity, and company-only dashboard scope while preserving the existing nine-column summary contract.

### Ownership identity immutability — V180 PASS

V180 freezes post-registration ownership type, owner supplier/customer and ownership-derived flags, and protects the three governed ownership-type master definitions.

### Identifier authority and replacement integrity — V181 PASS

V181 now enforces ownership-specific serial compatibility, identifier logical-cylinder immutability, exactly one active primary identifier per logical cylinder at transaction end, same-logical-cylinder replacement-event context, owner-specific supplier/customer replacement context, append-only replacement history, and `vw_cylinder_identifier_integrity`.

### Active identifier value uniqueness / history integrity — V182 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V181 proved the next database-boundary gap:

1. `CylinderIngestionService` rejects an already-active primary identifier case-insensitively, and the supplier replacement validator rejects values already active on another logical cylinder using `LOWER(BTRIM(identifier_value))`.
2. The database previously had only non-unique lookup indexes for identifier values, so concurrent transactions could bypass the application pre-check and commit the same normalized active primary physical identifier to different logical cylinders.
3. `tbl_cylinder_identifier` structurally allowed blank/whitespace values, active rows with `valid_to`, and inactive historical rows with `valid_to IS NULL`.
4. Identifier rows are historical objects referenced by replacement-event ids, but identifier type/value/valid_from/source metadata could still be rewritten after INSERT.

V182: `V182__Enforce_Active_Identifier_Value_Uniqueness_And_History_Integrity.sql`

V182 adds:

- nonblank physical identifier value constraint;
- exact active/history validity-window consistency (`active => valid_to NULL`, `inactive => valid_to NOT NULL`);
- globally unique normalized active-primary physical identifier value using `LOWER(BTRIM(identifier_value))`, matching application collision semantics;
- immutable identifier history identity fields after INSERT while preserving governed closure fields (`is_active`, `is_primary`, `valid_to`, `remarks`, `updated_at`);
- `vw_cylinder_identifier_value_history_integrity` for normalized value, temporal history and collision reconciliation.

V182 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

Postponed UI/unit/runtime cases remain in `BL-008/test-case-backlog.csv`. V182 cases cover concurrent/case-and-trim normalized identifier collision, validity-window rejection, and identifier history identity immutability while preserving governed closure behavior.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- V178: **CLEAN_DATABASE_VALIDATED_PASS**
- V179: **CLEAN_DATABASE_VALIDATED_PASS**
- V180: **CLEAN_DATABASE_VALIDATED_PASS**
- V181: **CLEAN_DATABASE_VALIDATED_PASS**
- V182: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- UI/runtime testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2 gate: **V182_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182.zip` as migration source.
2. Perform a fresh clean Flyway migration through V182.
3. Run `BL008_Ownership_V182_Identifier_Value_History_Validation.sql`.
4. Return the consolidated V182 result table.
5. After V182 acceptance, continue only with the next source-proved requirement; do not create V183 merely to advance the version.
