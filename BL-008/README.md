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

## V172 — DATABASE MAPPING CORRECTION APPLIED / COLUMN AUDIT PASS

Migration:

`V172__Add_Party_Asset_Account_To_Identifier_Replacement_Event.sql`

Correction:

- Adds nullable `BIGINT fk_party_asset_account` to `public.tbl_cylinder_identifier_replacement_event`.
- Adds no speculative foreign key because no authoritative party-asset-account master relation exists in the governed migration corpus.
- Modifies no historical migration.

Post-V172 V4 audit result:

- expected relations: **119; failures 0**
- expected explicit columns: **1128; failures 0**
- V4 sequence-ownership check was not a valid JPA sequence-existence test because most application sequences are explicitly named and need not be owned serial sequences.

## V5 sequence-name audit

Corrected V5 direct JPA-sequence lookup passed 66 of 68 distinct declared sequences and identified exactly two remaining mismatches:

1. `public.tbl_yard_inventory_allowed_state_pk_yard_inventory_allowed_state_id_seq`
2. `public.tbl_yard_inventory_source_type_pk_yard_inventory_source_type_id_seq`

Both mappings are declared by the current JPA entity layer. V113 created their PK columns as `BIGSERIAL`. These two Java sequence identifiers exceed PostgreSQL's 63-byte identifier limit, while the BIGSERIAL backing sequences were generated under PostgreSQL's own long-name construction rule, so the JPA-resolved identifiers do not match the existing backing-sequence names.

## V173 — READY FOR EXISTING-DATABASE APPLY

Migration:

`V173__Align_Yard_Inventory_Sequence_Names_With_JPA.sql`

Application-source Git commit containing V173: `f12dcfd5cccf9d53c4e7e564a9e8c8abdaaa9ea7`.

Correction strategy:

- Rename the **existing** BIGSERIAL backing sequences in place.
- Do not create replacement sequences.
- Preserve sequence OIDs, current values, ownership and PK column-default dependencies.
- Rename only to the PostgreSQL-resolved 63-byte identifiers expected by the two JPA `@SequenceGenerator` declarations.

Target resolved names:

- `public.tbl_yard_inventory_allowed_state_pk_yard_inventory_allowed_stat`
- `public.tbl_yard_inventory_source_type_pk_yard_inventory_source_type_id`

## Validation after V173

Use the one-run validation script:

`BL008_V173_Validation_Single_Run.sql`

Acceptance requires:

- Flyway V173 = PASS.
- Both JPA-resolved sequence names exist.
- Each table PK column still resolves through `pg_get_serial_sequence()` to the same sequence OID after rename.
- V172 `fk_party_asset_account BIGINT` remains present.
- Overall result = `BL008_V173_VALIDATION_PASS; failed_checks=0`.

## Current state

- Existing migrations modified: **0**
- New additive migrations in current handoff: **3** (`V171`, `V172`, `V173`)
- V171 database validation: **PASS**
- V172 relation/column compatibility: **PASS**
- Remaining V5 mismatches before V173: **2 sequence-name mismatches**
- V173 state: **WAITING_FOR_USER_EXISTING_DATABASE_FLYWAY_APPLY_AND_VALIDATION**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 waits for the user-returned V173 validation result.
