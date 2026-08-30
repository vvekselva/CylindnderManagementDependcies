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

## V172 — PASS

`V172__Add_Party_Asset_Account_To_Identifier_Replacement_Event.sql`

Post-V172 static audit established 119/119 relations and 1128/1128 explicit mapped columns compatible.

## V173 — PASS

`V173__Align_Yard_Inventory_Sequence_Names_With_JPA.sql`

User-returned V173 validation passed all sequence/backing-sequence checks and the V172 regression check.

Evidence: `BL-008/evidence/20260830-v173-existing-database-validation-pass.md`.

## Static schema reconciliation conclusion

Static application-to-database reconciliation through V173 is complete and accepted.

## Current BL-008 phase — Ownership Model Migration

The user explicitly directed BL-008 to resume the **Ownership Model Migration immediately**. General runtime validation is therefore not the next lane.

Phase 1 is a read-only existing-database ownership baseline before any further ownership migration is authored.

Governed ownership types:

- `COMPANY_OWNED`
- `SUPPLIER_OWNED`
- `CUSTOMER_OWNED`

Source review found that historical V144 added ownership metadata and a broad `chk_cylinder_owner_party_consistency` check, but the check does not itself enforce the full type-specific ownership rules. The current application ingestion service applies stronger type-specific normalization. Therefore existing data must first be measured against those rules before enabling stronger database enforcement.

Phase-1 control document:

`BL-008/ownership-model/PHASE-1-BASELINE.md`

Phase-1 user handoff script:

`BL008_Ownership_Model_Phase1_Baseline_Audit.sql`

## Current state

- Existing migrations modified: **0**
- Additive migrations already applied in this handoff: **V171, V172, V173**
- V171 database validation: **PASS**
- V172 relation/column compatibility: **PASS**
- V173 sequence compatibility: **PASS**
- Static schema reconciliation: **COMPLETE**
- Ownership Model Migration: **STARTED**
- Ownership Model Phase 1: **WAITING_FOR_USER_BASELINE_AUDIT_RESULT**
- V174: **NOT YET AUTHORED; requires Phase-1 evidence**
- Database apply target: **EXISTING DATABASE**
- Existing Flyway history: **PRESERVE**
- Database writes by ChatGPT: **0**

BL-002 remains independently eligible while BL-008 waits for the Phase-1 ownership baseline result.
