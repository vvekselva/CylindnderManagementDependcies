# BL-008 — DATABASE FROZEN / SERVICE-UI ACCEPTANCE PHASE

Date: **2026-08-31**

Current status: **V185 CLEAN_DATABASE_VALIDATED_PASS — DATABASE FROZEN AT V185**

## Final database result

The final business-model alignment migration `V185__Align_External_Logical_Physical_Asset_Model.sql` has passed the clean-database harmony validator with:

`BL008_V185_FINAL_DATABASE_HARMONY_PASS; failed_checks=0`

Accepted database migration line:

`V174 -> V185 = CLEAN_DATABASE_VALIDATED_PASS`

No active database migration gate remains.

## Frozen governed model

### Transaction identity

All business/operational relations use only the stable logical `tbl_cylinder.pk_cylinder_id` through `fk_cylinder`. Physical cylinder identifiers are never operational foreign keys.

### Company-owned

- No logical/physical split.
- `tbl_cylinder.cylinder_serial` is the company cylinder identity.
- Separate active-primary physical identifier rows required: **0**.

### Supplier/customer-owned

- `tbl_cylinder` is the stable logical asset.
- `tbl_cylinder_identifier` stores current/historical physical identifiers.
- `ASSIGNED` = exactly one active-primary physical identifier.
- `AWAITING_REPLACEMENT` = zero active-primary physical identifiers and no active physical location/custody.
- `CLOSED` = zero active-primary physical identifiers; no further operational use.

### Ownership and custody

Ownership and custody are separate. A CUSTOMER_OWNED logical asset may be held by its owner customer or another customer. Custody history records the actual holder. Physical replacement is validated against the actual custody/refill context at replacement time.

### Physical condition and logical accounting

For external assets, physical DAMAGED/LOST/DECOMMISSIONED events do not automatically close or reduce the logical asset. LOST/DECOMMISSIONED retires the current physical identifier and places the logical asset into `AWAITING_REPLACEMENT`. Only explicit `CUSTOMER_ASSET_CLOSED` reduces the customer logical active-asset balance by one. Supplier logical close remains count-neutral under the governed supplier model.

### Recovery

Company terminal states remain terminal. Supplier/customer logical assets may recover from physical DAMAGED/LOST/DECOMMISSIONED only after a usable replacement physical identifier is assigned.

### Display

- Company: `COMP-00125`
- Supplier: `LS-00100 / SUP-7788`
- Customer: `LC-00025 / CUST-250`

The logical ID always remains the transaction key.

## Validation evidence

V185 clean validation confirmed:

- logical-ID-only operational storage;
- external logical-asset status controls;
- customer ownership/custody separation;
- ownership-aware physical identifier authority;
- replacement custody traceability;
- external logical-count accounting semantics;
- append-only external ledger;
- explicit customer logical closure;
- operational guards for CLOSED/AWAITING_REPLACEMENT;
- ownership-aware recovery;
- logical + physical display view;
- final BL-008 harmony view;
- regressions for accepted prior migrations.

Evidence: `BL-008/evidence/20260831-v185-final-database-harmony-pass.md`.

## Database freeze rule

**The database is frozen at V185.**

Do not create V186 or modify the schema unless:

1. a new approved business requirement is introduced, or
2. a service/UI/runtime regression test proves a genuine database defect.

Application/service/UI defects must be corrected in application code first when the frozen database model is already correct.

## Current BL-008 phase

Database/schema work: **COMPLETE**.

Next phase: **service and UI corrections/testing against the frozen V185 database**.

The service/UI acceptance scope includes:

- company registration without a separate physical identifier;
- supplier/customer logical + physical registration;
- logical ID retained in all internal transactions;
- cross-customer custody with ownership unchanged;
- supplier/customer physical loss/damage and replacement;
- current-custodian replacement semantics;
- final customer return and explicit logical closure;
- CLOSED logical asset cannot be reused;
- company display as one ID;
- supplier/customer display as logical ID + physical ID;
- search results must never replace the logical transaction ID with the physical display ID;
- existing ownership/location/accounting/state-history regressions.

## Next action

Freeze V185 as the database baseline and proceed with service/UI testing and corrections only. BL-008 final closure occurs after those acceptance results are recorded.
