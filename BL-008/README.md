# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode: **ChatGPT authors additive Flyway/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.** UI/unit/runtime scenarios may be postponed into the governed test backlog and are non-blocking unless explicitly required by an acceptance gate.

## Execution boundary

- Acceptance target: fresh database / normal clean Flyway chain.
- No legacy cylinder/identifier backfill is required.
- Historical migrations remain unchanged by default.
- Delta ZIPs contain changed/new files only and preserve workspace-relative paths.
- GitHub is durable SSOT/version control only; orchestration execution does not use GitHub runners.
- No raw/manual SQL substitutes for Flyway execution.
- No migration is created merely to advance a version number.

## Current workspace

Validated source line through V184 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V184 deltas.

Validated integrated workspace: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181_V182_V183_V184.zip`.

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
- **V184** state-audit chain continuity/serialization — `BL008_OWNERSHIP_V184_VALIDATION_PASS; failed_checks=0`

Evidence is stored under `BL-008/evidence/`, including `20260831-v184-clean-database-validation-pass.md`.

## Phase 2 ownership lifecycle status

### Location exclusivity — V177 PASS

Transaction-end exclusivity is enforced across Yard, Logistics, Customer custody, Supplier custody and Decommissioned state. Runtime hand-off tests remain postponed.

### Supplier refill identifier exchange — source implemented

Supplier refill can replace the physical identifier while retaining the same supplier-owned logical cylinder. UI/runtime validation remains postponed.

### Customer ownership/custody — V176 PASS

CUSTOMER_OWNED cylinders can enter CUSTOMER custody only at their owner customer; supplier refill custody remains allowed without ownership transfer.

### External/company accounting — V178/V179 PASS

External and company accounting boundaries, terminal idempotence, serialized company-fleet running totals and ownership-scoped integrity views are validated.

### Ownership identity — V180 PASS

Post-registration ownership type/owner identity is immutable and governed ownership-master semantics are protected.

### Identifier authority/history — V181/V182 PASS

The database enforces ownership-specific serial compatibility, exactly one active primary identifier per logical cylinder at transaction end, same-cylinder replacement history, append-only replacement events, normalized global active-primary value uniqueness, nonblank values, valid active/history windows and immutable identifier-history identity fields.

### State-audit history / chain — V183/V184 PASS

The authoritative lifecycle audit stream is append-only after INSERT; event identity cannot be rewritten or deleted; remarks-only correction remains allowed. Non-legacy lifecycle audit INSERTs are serialized per logical cylinder and later rows must continue from the immediately preceding audit new-state. First-row NULL/same-state initialization and legacy-import compatibility are preserved.

## Post-V184 source trace

No additional database migration requirement was proved in the immediate post-V184 trace, so **V185 is not created**.

A dormant/test fleet-dashboard source path still contains a direct `tbl_cylinder_current_status` state-breakdown query, but both its controller and service activation annotations are disabled. It is therefore source-cleanup/test-backlog material rather than a clean-migration blocker. The authoritative V179 company-fleet summary view remains validated.

## Test policy / backlog

`BL-008/test-case-backlog.csv` contains **35 non-blocking cases**:

- 1 `PENDING_EXECUTION`: BL008-TC-001 focused location-exclusivity unit test.
- 1 `PLANNED`: BL008-TC-016 reserved CUSTOMER_ASSET_CLOSED case, pending a governed CLOSED producer.
- 33 `POSTPONED_BY_USER`: UI/runtime/DB-runtime/concurrency cases for the accepted ownership rules.

All backlog cases have `blocking=NO`.

## Current state

- Ownership Model Migration: **V174–V184 CLEAN_DATABASE_VALIDATED_PASS**
- Active clean-migration gate: **NONE**
- V185: **NOT CREATED — NO SOURCE-PROVED DATABASE GAP**
- Target database validation: **COMPLETE THROUGH V184**
- UI/runtime test backlog: **35 NON-BLOCKING CASES**
- Next executable backlog item: **BL008-TC-001 Location Exclusivity UNIT**
- Database writes by ChatGPT: **0**

## Next action

1. Keep V174–V184 frozen as the accepted clean-migration line.
2. Execute `BL008-TC-001` in a normal Maven/Eclipse-capable environment when available.
3. Keep the 33 explicitly postponed UI/runtime/DB-runtime cases deferred until the consolidated test phase.
4. Do not create V185 unless a new source-proved database requirement is identified.
5. After the unit/runtime backlog is accepted, close the Ownership Model phase and advance BL-008 to the next governed backlog work item.
