# BL-008 V175 Clean Database Validation — PASS

Date: 2026-08-30

Migration: `V175__Preserve_Supplier_Owned_Asset_Count.sql`

User executed a clean Flyway migration and the consolidated V175 validation script on the fresh PostgreSQL database.

Result: **PASS**

Validated checks:

- Flyway V175 recorded successfully.
- Fresh database contained zero cylinder rows before application test data.
- `uq_external_asset_ledger_registration_per_cylinder` exists.
- External asset ledger delta semantics are enforced.
- `vw_supplier_owned_asset_count_integrity` exists with the expected columns.
- Supplier replacement is guarded by owner-supplier equality.
- Supplier lifecycle terminal events are count-neutral.
- `SUPPLIER_ASSET_REGISTERED` with `delta=+1` is accepted.
- `SUPPLIER_ASSET_IDENTIFIER_REPLACED` with `delta=0` is accepted.
- `SUPPLIER_ASSET_DECOMMISSIONED` with `delta=0` is accepted.
- Supplier decommission with `delta=-1` is rejected.
- Existing customer-owned terminal semantics remain accepted.
- Fresh supplier integrity view returns zero failures.

Overall result returned by the validation script:

`BL008_OWNERSHIP_V175_VALIDATION_PASS; failed_checks=0`

Acceptance state: `V175_CLEAN_DATABASE_VALIDATED_PASS`.

The later supplier-refill physical-identifier exchange UI/runtime validation is intentionally deferred to the BL-008 test-case backlog and is not a blocker for continuing source/migration work.
