# BL-008 V173 Existing-Database Validation — PASS

Migration: `V173__Align_Yard_Inventory_Sequence_Names_With_JPA.sql`

Execution target: existing PostgreSQL database.

User-returned consolidated validation result:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_V173 | PASS | V173 recorded successfully |
| 2 | ALLOWED_STATE_JPA_SEQUENCE | PASS | tbl_yard_inventory_allowed_state_pk_yard_inventory_allowed_stat |
| 3 | ALLOWED_STATE_BACKING_SEQUENCE | PASS | backing=public.tbl_yard_inventory_allowed_state_pk_yard_inventory_allowed_stat; jpa_resolved=public.tbl_yard_inventory_allowed_state_pk_yard_inventory_allowed_stat |
| 4 | SOURCE_TYPE_JPA_SEQUENCE | PASS | tbl_yard_inventory_source_type_pk_yard_inventory_source_type_id |
| 5 | SOURCE_TYPE_BACKING_SEQUENCE | PASS | backing=public.tbl_yard_inventory_source_type_pk_yard_inventory_source_type_id; jpa_resolved=public.tbl_yard_inventory_source_type_pk_yard_inventory_source_type_id |
| 6 | V172_COLUMN_REGRESSION | PASS | V172 BIGINT column remains present |
| 99 | BL008_V173_OVERALL_RESULT | PASS | BL008_V173_VALIDATION_PASS; failed_checks=0 |

## Validation conclusion

- Flyway recorded V173 successfully.
- Both PostgreSQL-resolved JPA sequence names exist.
- Both PK columns still resolve to the same backing sequences after rename.
- The V172 `fk_party_asset_account BIGINT` correction remains present.
- Static application-to-database schema reconciliation through V173 is accepted.
- No V174 is justified by the current static schema evidence.
- Next BL-008 phase: application/runtime functional validation against the existing database.
- Database writes by ChatGPT remain 0; the user performed the existing-database Flyway apply.

Status: `STATIC_SCHEMA_RECONCILIATION_COMPLETE_READY_FOR_RUNTIME_VALIDATION`.
