# BL-008 — Database Migration Authoring / Existing-Database Apply Workflow

Current governed mode: **ChatGPT authors additive Flyway migration deltas; the user applies them to the existing PostgreSQL database and returns one consolidated validation result.**

## Execution boundary

- Existing database data, schema and `flyway_schema_history` are preserved.
- Flyway determines pending migrations from existing history; already-applied migrations are not rerun.
- Delta ZIPs contain only changed/new files, preserving workspace-relative paths.
- GitHub is durable SSOT/version control only; GitHub Actions/runners are not used for orchestration execution.
- `flyway clean`, database recreation, history clearing and re-baselining are forbidden for this handoff.
- Historical migrations are not rewritten unless explicitly approved because an earlier failed migration cannot be repaired by a later migration.

## Current workspace

User workspace snapshot: `Harinandhan-Cylinder-Backup(20260830-100356).zip`.

Migration directory: `cylinder.datascripts/src/main/resources/db/migration`.

## V171 — PASS

`V171__Customer_Order_Request_View_Compatibility.sql`

Existing-database validation: **PASS**.

Evidence: `BL-008/evidence/20260830-v171-existing-database-validation-pass.md`.

V171 added the two Customer Order Request compatibility views required by the current Java mappings. Flyway history, view existence, expected columns and data equivalence all passed.

## Full schema audit after V171

V3 single-output audit result:

- total checks: 1322
- passed: 1313
- failed: 9
- result: `BL008_FULL_SCHEMA_AUDIT_FAIL`

Classification evidence: `BL-008/evidence/20260830-full-schema-audit-v3-classification.md`.

### Genuine schema gap — 1

`tbl_cylinder_identifier_replacement_event.fk_party_asset_account`

This column is mapped by `CylinderIdentifierReplacementEventDo` and referenced by V149 `fn_replace_cylinder_primary_identifier()`, but V144 created the table without it.

### Audit false positives — 8

Six failures came from `@JoinTable` nested join columns being incorrectly attributed to the parent tables. The real columns belong to `tbl_challan_transaction_link` and are created by V93.

Two failures came from direct lookup of very long declared JPA sequence names. The affected tables were created with `BIGSERIAL`; the corrected audit validates sequence ownership with `pg_get_serial_sequence(table,column)` to avoid PostgreSQL identifier-length false positives.

## V172 — READY FOR EXISTING-DATABASE APPLY

Migration:

`V172__Add_Party_Asset_Account_To_Identifier_Replacement_Event.sql`

Correction:

- Adds nullable `BIGINT fk_party_asset_account` to `public.tbl_cylinder_identifier_replacement_event`.
- Adds no speculative foreign key because no authoritative party-asset-account master relation exists in the governed migration corpus.
- Modifies no historical migration.

Application-source Git commit containing V172: `6b746db9369f903eff700e0a7d4caa4f97429328`.

## Validation after V172

Use corrected single-run audit:

`BL008_Full_Schema_Audit_After_V172_V4.sql`

V4 fixes the two audit-model defects:

1. nested `@JoinTable` columns are checked against the join table itself;
2. serial sequence ownership is checked with `pg_get_serial_sequence()` rather than exact long sequence-name lookup.

Decision rule:

- `BL008_FULL_SCHEMA_AUDIT_PASS` -> do not create V173 from static mapping; advance to application/runtime functional smoke testing.
- `BL008_FULL_SCHEMA_AUDIT_FAIL` -> analyze only the remaining proved failures and author the smallest next delta if required.

## Current state

- Existing migrations modified: **0**
- New additive migrations in current handoff: **2** (`V171`, `V172`)
- V171 database validation: **PASS**
- V172 state: **WAITING_FOR_USER_EXISTING_DATABASE_FLYWAY_APPLY_AND_V4_AUDIT**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 waits for the user-returned V172/V4 result.
