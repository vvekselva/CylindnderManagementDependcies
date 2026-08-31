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

Validated source line through V180 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V180 deltas.

Prepared integrated workspace through V181: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181.zip`.

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

Evidence is stored under `BL-008/evidence/`, including `20260831-v180-clean-database-validation-pass.md`.

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

V180 freezes post-registration ownership type, owner supplier/customer and ownership-derived flags, and protects the three governed ownership-type master definitions. `vw_cylinder_ownership_governance_integrity` passed on the fresh database.

### Identifier authority and replacement integrity — V181 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V180 proved four remaining identifier-boundary gaps:

1. `tbl_cylinder_identifier` permits `COMPANY_SERIAL`, `SUPPLIER_SERIAL`, and `CUSTOMER_SERIAL` without tying those ownership-specific serial categories to the logical cylinder ownership type.
2. Existing indexes enforce at most one active primary identifier, but not exactly one; the application and V149 treat this table as the single active physical-identifier authority.
3. An identifier row could be reassigned by UPDATE to another logical cylinder.
4. Replacement-event foreign keys prove that old/new identifier rows exist, but not that both belong to the event's same logical cylinder; replacement history was also mutable.

V181: `V181__Enforce_Cylinder_Identifier_Authority_And_Replacement_Integrity.sql`

V181 adds:

- ownership-specific serial compatibility guard;
- logical-cylinder identifier reassignment rejection;
- deferred transaction-end `exactly one active primary identifier` enforcement on cylinder creation and identifier mutation, compatible with the existing close-old/open-new replacement order;
- replacement-event same-logical-cylinder validation;
- supplier/customer-specific replacement owner-context validation at the event table boundary;
- append-only replacement-event history;
- `vw_cylinder_identifier_integrity` for active-primary, serial-ownership and replacement-context reconciliation.

V181 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

Postponed UI/unit/runtime cases remain in `BL-008/test-case-backlog.csv`. V181 cases cover identifier ownership compatibility, exact-one active primary authority, cross-cylinder replacement rejection and append-only replacement history.

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
- V181: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- UI/runtime testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2 gate: **V181_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180_V181.zip` as migration source.
2. Perform a fresh clean Flyway migration through V181.
3. Run `BL008_Ownership_V181_Identifier_Integrity_Validation.sql`.
4. Return the consolidated V181 result table.
5. After V181 acceptance, continue only with the next source-proved requirement; do not create V182 merely to advance the version.
