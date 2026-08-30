# BL-008 — Database Migration / Ownership Model Workflow

Current governed mode for the Ownership Model phase: **ChatGPT authors additive Flyway migration/source deltas; the user performs clean Flyway migration/validation on a fresh PostgreSQL database and returns consolidated results.** UI/runtime tests may be deferred into the governed test-case backlog and do not block independent migration/source work unless a specific acceptance gate requires them.

## Execution boundary

- Ownership acceptance target: fresh database / normal clean Flyway chain.
- Prior populated application rows are not migration input.
- No legacy cylinder/identifier backfill is required.
- Historical migrations remain unchanged by default.
- Delta ZIPs contain changed/new files only and preserve workspace-relative paths.
- GitHub is durable SSOT/version control only; orchestration execution remains outside GitHub runners.
- No raw/manual SQL substitutes for Flyway migration execution.

## Current workspace

Validated source line through V178 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176, V177 and V178 deltas.

Prepared integrated workspace through V179: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179.zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## Ownership Model Migration — ACTIVE

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Historical V144 introduced the ownership schema. V149 made lifecycle/ledger behavior ownership-aware. V174 enforces strict owner/type/flag consistency. V175 preserves supplier-owned logical asset count. V176 enforces customer-owned owner/custody consistency. V177 enforces database-wide location exclusivity. V178 hardens external-asset accounting. V179 is the next additive migration and hardens company-fleet accounting.

## Accepted clean-database gates

- **V174** `V174__Enforce_Strict_Cylinder_Ownership_Model.sql` — `BL008_OWNERSHIP_V174_VALIDATION_PASS; failed_checks=0`
- **V175** `V175__Preserve_Supplier_Owned_Asset_Count.sql` — `BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0`
- **V176** `V176__Enforce_Customer_Owned_Custody_Consistency.sql` — `BL008_OWNERSHIP_V176_VALIDATION_PASS; failed_checks=0`
- **V177** `V177__Enforce_Cross_Table_Cylinder_Location_Exclusivity.sql` — `BL008_OWNERSHIP_V177_VALIDATION_PASS; failed_checks=0`
- **V178** `V178__Harden_External_Asset_Terminal_Accounting.sql` — `BL008_OWNERSHIP_V178_VALIDATION_PASS; failed_checks=0`

Evidence:

- `BL-008/evidence/20260830-v174-clean-database-validation-pass.md`
- `BL-008/evidence/20260830-v175-clean-database-validation-pass.md`
- `BL-008/evidence/20260830-v176-clean-database-validation-pass.md`
- `BL-008/evidence/20260831-v177-clean-database-validation-pass.md`
- `BL-008/evidence/20260831-v178-clean-database-validation-pass.md`

## Phase 2 — Supplier/Customer/Company Ownership Lifecycle — ACTIVE

### Location exclusivity — application + database enforcement complete

The application Yard -> Vehicle precondition evaluates Yard, Vehicle logistics, Customer custody, Supplier custody and Decommissioned. V177 provides deferred database enforcement across the same authoritative buckets. Runtime hand-off cases remain in the postponed test backlog.

### Supplier refill physical-identifier exchange — source implemented

Supplier refill may optionally replace the physical identifier while retaining the same logical supplier-owned cylinder. V175 keeps the supplier logical asset balance count-neutral. UI/runtime execution remains postponed and non-blocking.

### Customer-owned owner/custody consistency — V176 PASS

A CUSTOMER_OWNED cylinder can open CUSTOMER custody only at its owner customer. Supplier refill custody remains allowed without changing ownership.

### External-asset accounting — V178 PASS

V178 now enforces external-ledger owner shape and validates event family, ownership type, owner party and product against the referenced external cylinder. Customer terminal shrink across CLOSED/LOST/DECOMMISSIONED is one-time/idempotent, and `vw_customer_owned_asset_count_integrity` reconciles active customer external-asset balance. Supplier-owned accounting remains governed by V175 and its stable logical-count integrity view.

### Company-fleet accounting — V179 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V178 proved three remaining company-side accounting gaps:

1. `tbl_cylinder_fleet_ledger` had no one-time terminal-shrink guard, so repeated LOST/DECOMMISSIONED audit bookkeeping could reduce the same COMPANY_OWNED logical cylinder more than once.
2. The running `fleet_count_before/fleet_count_after` calculation was not serialized across concurrent company fleet events.
3. The original V58 `vw_cylinder_fleet_summary` still counted all current-status cylinders after V149 moved supplier/customer-owned assets out of the company fleet ledger; additionally, LOST has a historical `Customer Location` state and could inflate active customer-location counts after fleet shrink.

V179: `V179__Harden_Company_Fleet_Accounting_Integrity.sql`

V179 adds:

- exact company fleet event/delta semantics (`COMMISSIONED=+1`, `DECOMMISSIONED/LOST_CONFIRMED=-1`);
- one COMMISSIONED event and at most one terminal shrink per logical company cylinder;
- `fn_validate_company_fleet_ledger_insert()` with COMPANY_OWNED context validation, transaction-advisory serialization, running-total recalculation and duplicate-terminal idempotence;
- append-only UPDATE/DELETE protection for `tbl_cylinder_fleet_ledger`;
- `vw_company_fleet_accounting_integrity` reconciling logical company assets, terminal states, ledger balance and current fleet count;
- corrected `vw_cylinder_fleet_summary` scoped only to active COMPANY_OWNED fleet assets while preserving its existing nine-column JPA contract and excluding terminal LOST/DECOMMISSIONED from active physical-location totals.

V179 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

Postponed UI/unit/runtime cases remain explicit in `BL-008/test-case-backlog.csv` and are non-blocking for clean migration gates. The backlog now includes V179 terminal idempotence, concurrent fleet accounting, mixed-ownership dashboard scope and append-only ledger mutation cases.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- V178: **CLEAN_DATABASE_VALIDATED_PASS**
- V179: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- Location exclusivity: **APPLICATION_AND_DATABASE_ENFORCEMENT_COMPLETE / RUNTIME_TEST_BACKLOG**
- Supplier refill identifier exchange: **IMPLEMENTED / UI_RUNTIME_TEST_POSTPONED**
- Customer-owned custody consistency: **V176_PASS / UI_RUNTIME_TEST_POSTPONED**
- External-asset accounting: **V178_PASS / RUNTIME_TEST_BACKLOG**
- Company-fleet accounting: **V179_AUTHORED / CLEAN_VALIDATION_PENDING / RUNTIME_TEST_BACKLOG**
- UI/runtime testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2 gate: **V179_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179.zip` as the migration source.
2. Perform a fresh clean Flyway migration through V179.
3. Execute `BL008_Ownership_V179_Company_Fleet_Accounting_Validation.sql` and return its consolidated result table.
4. Keep V179 runtime/concurrency/dashboard scenarios postponed in the governed backlog.
5. After V179 acceptance, continue only with the next source-proved Ownership Model requirement; do not create V180 merely to advance the version.
