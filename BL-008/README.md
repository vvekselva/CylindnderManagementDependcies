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

V171 added the Customer Order Request compatibility views required by the current Java mappings. Flyway history, view existence, expected columns and data equivalence passed.

## V172 — PASS

`V172__Add_Party_Asset_Account_To_Identifier_Replacement_Event.sql`

V172 added nullable `BIGINT fk_party_asset_account` to `public.tbl_cylinder_identifier_replacement_event` without inventing a speculative foreign key.

Post-V172 static audit established:

- expected relations: **119; failures 0**
- expected explicit mapped columns: **1128; failures 0**

## V173 — PASS

`V173__Align_Yard_Inventory_Sequence_Names_With_JPA.sql`

V173 renamed the two existing yard-inventory BIGSERIAL backing sequences in place to the PostgreSQL-resolved 63-byte names expected by the current JPA `@SequenceGenerator` mappings. Sequence OIDs, values, ownership and column-default dependencies were preserved.

User-returned V173 validation:

- Flyway V173: **PASS**
- allowed-state JPA-resolved sequence: **PASS**
- allowed-state backing-sequence identity: **PASS**
- source-type JPA-resolved sequence: **PASS**
- source-type backing-sequence identity: **PASS**
- V172 column regression check: **PASS**
- overall: **BL008_V173_VALIDATION_PASS; failed_checks=0**

Evidence: `BL-008/evidence/20260830-v173-existing-database-validation-pass.md`.

## Static schema reconciliation conclusion

The current source-to-database static reconciliation is accepted through V173:

- all audited runtime/JPA relations exist;
- all audited explicit mapped columns exist;
- the remaining JPA sequence-name mismatches were corrected and validated;
- V171, V172 and V173 are all successfully applied to the existing database;
- no V174 is justified by the current static schema evidence.

## Next BL-008 phase — application/runtime validation

Do not create another migration merely to advance the version number. The next phase is to start the application against the existing database and validate runtime behavior. Any future V174 must be driven by a concrete runtime/source-proved database defect.

Runtime validation should capture application startup, Hibernate/JPA initialization, repository/DAO query execution and focused smoke tests for the database paths corrected in V171-V173.

## Current state

- Existing migrations modified: **0**
- New additive migrations in current handoff: **3** (`V171`, `V172`, `V173`)
- V171 database validation: **PASS**
- V172 relation/column compatibility: **PASS**
- V173 sequence compatibility: **PASS**
- Static schema reconciliation: **COMPLETE**
- Current state: **STATIC_SCHEMA_RECONCILIATION_COMPLETE_READY_FOR_RUNTIME_VALIDATION**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 proceeds through runtime validation.
