# BL-008 Ownership Model Migration — Phase 1 Baseline

Status: `OWNERSHIP_MODEL_MIGRATION_STARTED_WAITING_FOR_PHASE1_BASELINE_RESULT`

## Objective

Resume BL-008 with the Ownership Model Migration immediately after V173 static schema reconciliation.

The governed ownership types are:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

## Source-proved current schema state

Production V144 introduced `tbl_asset_ownership_type` and ownership metadata on `tbl_cylinder`: `fk_asset_ownership_type`, `fk_owner_supplier`, `fk_owner_customer`, `is_company_fleet_asset`, and `is_external_exchangeable`.

V144 also created `chk_cylinder_owner_party_consistency`, but that check only distinguishes:

- company-fleet rows: both owner FKs must be NULL; or
- non-company rows: at least one owner FK must be populated.

That historical check does **not** prove the stronger type-specific rules required by the current ownership model. In particular, it does not by itself reject both owners being populated, a `SUPPLIER_OWNED` row carrying only a customer owner, a `CUSTOMER_OWNED` row carrying only a supplier owner, or disagreement between `fk_asset_ownership_type` and `is_company_fleet_asset`.

The current application ingestion service normalizes ownership fields by ownership type and sets `is_company_fleet_asset` / `is_external_exchangeable` from the ownership-type master, so direct/migration writes should be audited against the same semantics before adding stronger database enforcement.

## Phase 1

Run one read-only existing-database baseline audit before authoring the next Flyway migration.

Audit acceptance rules:

### COMPANY_OWNED

- `is_company_fleet_asset = TRUE`
- `fk_owner_supplier IS NULL`
- `fk_owner_customer IS NULL`

### SUPPLIER_OWNED

- `is_company_fleet_asset = FALSE`
- `fk_owner_supplier IS NOT NULL`
- `fk_owner_customer IS NULL`

### CUSTOMER_OWNED

- `is_company_fleet_asset = FALSE`
- `fk_owner_customer IS NOT NULL`
- `fk_owner_supplier IS NULL`

Additional checks:

- both owner FKs are never populated together;
- ownership type is one of the three governed active types;
- cylinder ownership flags agree with the ownership-type master;
- every logical cylinder has exactly one active primary identifier;
- counts by ownership type, supplier owner, and customer owner are reported for reconciliation.

## Next migration decision

Do not create V174 merely to advance the version.

- If Phase 1 passes, author the smallest additive database-enforcement migration for the type-specific ownership invariants and validate it.
- If Phase 1 finds invalid existing data, classify the rows first and author a corrective data migration before enabling enforcement.

Database target remains the existing PostgreSQL database. Existing data and Flyway history must be preserved. No `flyway clean`, database recreation, history clearing, or re-baselining.
