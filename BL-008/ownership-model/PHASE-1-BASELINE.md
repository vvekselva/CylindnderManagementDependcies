# BL-008 Ownership Model Migration — Phase 1 Fresh-Migration Baseline

Status: `LEGACY_DATA_AUDIT_RETIRED_FRESH_MIGRATION_SELECTED`

## Governing correction

The populated-database baseline audit was originally used to decide whether existing ownership/identifier rows required corrective backfill before stronger enforcement.

The user subsequently clarified that this is a **fresh application**: the populated application data will be removed and a clean Flyway migration will be performed.

Therefore the populated-database audit is not used as migration input.

## Legacy audit evidence retained for traceability

The earlier audit reported:

- ownership master definitions: PASS;
- ownership type/owner-side rules on the existing rows: PASS;
- 1327 existing cylinders, all `COMPANY_OWNED`;
- 1327 cylinders with zero active primary identifiers.

The zero-identifier finding does **not** require a backfill migration because these application rows will not exist on the fresh target.

## Fresh migration behavior

The current migration chain creates no application `tbl_cylinder` rows. Consequently V144 compatibility statements that backfill ownership/identifier metadata process zero rows during a clean migration and remain harmless no-ops.

New cylinders are created through the current ingestion service, which creates the active primary identifier and normalizes ownership fields.

## First Ownership Model delta

V174 is the first fresh-target Ownership Model correction:

`V174__Enforce_Strict_Cylinder_Ownership_Model.sql`

It strengthens database enforcement for:

### COMPANY_OWNED

- company fleet = TRUE
- external exchangeable = FALSE
- supplier owner = NULL
- customer owner = NULL

### SUPPLIER_OWNED

- company fleet = FALSE
- external exchangeable = TRUE
- supplier owner = NOT NULL
- customer owner = NULL

### CUSTOMER_OWNED

- company fleet = FALSE
- external exchangeable = TRUE
- customer owner = NOT NULL
- supplier owner = NULL

V174 contains no legacy-data backfill.

## Validation gate

Run the complete Flyway chain against a fresh database through V174, then run `BL008_Ownership_V174_Clean_Migration_Validation.sql`.

Only after the clean migration and consolidated validation pass should BL-008 advance to the next Ownership Model lifecycle requirement.
