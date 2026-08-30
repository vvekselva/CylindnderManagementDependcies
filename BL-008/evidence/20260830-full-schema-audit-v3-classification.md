# BL-008 Full Schema Audit V3 — Failure Classification

Existing database audit result after V171: `BL008_FULL_SCHEMA_AUDIT_FAIL` with 1313 PASS and 9 FAIL checks.

## Classification

### Genuine schema gap — 1

`tbl_cylinder_identifier_replacement_event.fk_party_asset_account`

Evidence:
- `CylinderIdentifierReplacementEventDo` maps this column.
- V149 `fn_replace_cylinder_primary_identifier()` inserts into this column.
- V144 creates `tbl_cylinder_identifier_replacement_event` without this column.
- No authoritative `tbl_party_asset_account` master relation exists in the governed migration corpus, so no foreign key can be added without inventing schema semantics.

Correction: V172 adds only nullable `BIGINT fk_party_asset_account`.

### Audit false positives — 6 JoinTable columns

The following are not columns of the parent entity tables:
- `tbl_empty_pickup.fk_linked_business_job_id`
- `tbl_empty_pickup.fk_page_audit_id`
- `tbl_order.fk_linked_business_job_id`
- `tbl_order.fk_page_audit_id`
- `tbl_supplier_trip.fk_linked_business_job_id`
- `tbl_supplier_trip.fk_page_audit_id`

They originate from `@JoinTable(name="tbl_challan_transaction_link", ...)`. The actual columns are correctly owned by `public.tbl_challan_transaction_link`, created by V93.

### Audit false positives — 2 serial sequences

The long declared JPA sequence identifiers for:
- `tbl_yard_inventory_allowed_state.pk_yard_inventory_allowed_state_id`
- `tbl_yard_inventory_source_type.pk_yard_inventory_source_type_id`

exceed PostgreSQL's identifier-length boundary and direct textual `to_regclass()` checks are not a valid compatibility test. Both tables were created with `BIGSERIAL` in V113. The corrected audit validates sequence ownership with `pg_get_serial_sequence(table,column)` instead of comparing the long declared identifier literally.

## Result

- Genuine migration correction required: 1
- Audit false positives: 8
- Next migration: `V172__Add_Party_Asset_Account_To_Identifier_Replacement_Event.sql`
- Next validation: corrected V4 full schema audit with JoinTable-aware column ownership and serial-sequence ownership resolution.
