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

Validated source line through V179 is based on `Harinandhan-Cylinder-Backup(20260830-140843).zip` plus integrated V176–V179 deltas.

Prepared integrated workspace through V180: `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180.zip`.

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

Evidence is stored under `BL-008/evidence/`, including `20260831-v179-clean-database-validation-pass.md`.

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

### Ownership identity immutability — V180 AUTHORED / CLEAN VALIDATION PENDING

Source analysis after V179 proved the next database-boundary gap:

- V174 validates whether a proposed ownership shape is valid, but still permits a later UPDATE from one valid ownership identity to another valid ownership identity.
- The application registration flow establishes ownership before the first `tbl_cylinder` INSERT and no governed ownership-transfer workflow exists.
- V149/V175/V178/V179 accounting/history is written according to the ownership identity existing when those events occur. A later direct ownership mutation would detach the logical cylinder from that immutable history.
- The three governed rows in `tbl_asset_ownership_type` also had no protection against code rename, delete, or semantic flag mutation.

V180: `V180__Freeze_Cylinder_Ownership_Identity.sql`

V180 adds:

- exact semantic constraint for `COMPANY_OWNED`, `SUPPLIER_OWNED`, and `CUSTOMER_OWNED` master rows;
- protection against deletion or code rename of those governed ownership types;
- `fn_prevent_cylinder_ownership_identity_mutation()` plus trigger blocking post-registration changes to ownership type, supplier owner, customer owner and ownership-derived flags;
- no-op updates remain allowed;
- `vw_cylinder_ownership_governance_integrity` to verify master/cylinder ownership semantics remain aligned.

No ownership-transfer workflow is invented. Any future ownership transfer must be introduced as an explicit governed workflow with accounting/history semantics.

V180 status: **AUTHORED / WAITING_FOR_CLEAN_FLYWAY_VALIDATION**.

## Test policy / backlog

Postponed UI/unit/runtime cases remain in `BL-008/test-case-backlog.csv`. V180 cases now cover ownership identity mutation rejection, no-op update acceptance and governed ownership-master protection.

## Current state

- Ownership Model Migration: **ACTIVE**
- Target: **FRESH DATABASE / CLEAN FLYWAY MIGRATION**
- V174: **CLEAN_DATABASE_VALIDATED_PASS**
- V175: **CLEAN_DATABASE_VALIDATED_PASS**
- V176: **CLEAN_DATABASE_VALIDATED_PASS**
- V177: **CLEAN_DATABASE_VALIDATED_PASS**
- V178: **CLEAN_DATABASE_VALIDATED_PASS**
- V179: **CLEAN_DATABASE_VALIDATED_PASS**
- V180: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**
- UI/runtime testing: **POSTPONED_BY_USER / NON_BLOCKING / TRACKED_IN_TEST_CASE_BACKLOG**
- Phase 2 gate: **V180_CLEAN_VALIDATION_GATE**
- Database writes by ChatGPT: **0**

## Next action

1. Use `Harinandhan-Cylinder-Backup(20260830-140843)_WITH_V176_V177_V178_V179_V180.zip` as migration source.
2. Perform a fresh clean Flyway migration through V180.
3. Run `BL008_Ownership_V180_Ownership_Identity_Immutability_Validation.sql`.
4. Return the consolidated V180 result table.
5. After V180 acceptance, continue only with the next source-proved requirement; do not create V181 merely to advance the version.
