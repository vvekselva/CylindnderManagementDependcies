# BL-008 — REOPENED FOR FINAL DATABASE HARMONY

Date: **2026-08-31**

Current status: **V185 AUTHORED / WAITING_FOR_CLEAN_VALIDATION**

## Why BL-008 was reopened

After the earlier V184 closure, the business model was clarified further. The core V144 architecture was already correct: `tbl_cylinder` is the stable transaction/lifecycle identity; yard, logistics, custody, orders and pickups use only `fk_cylinder`; current/historical physical markings are resolved through `tbl_cylinder_identifier` and views.

Four later assumptions were too restrictive and are corrected by V185:

1. CUSTOMER_OWNED custody does **not** have to equal the permanent owner customer. The physical cylinder may be held by another customer; custody must record the holder/history.
2. COMPANY_OWNED has no logical/physical split. `tbl_cylinder.cylinder_serial` is itself the company physical identity; a separate active-primary physical identifier is not required.
3. CUSTOMER_OWNED physical LOST/DECOMMISSIONED is not automatic logical-asset closure. External physical condition events are count-neutral; only explicit logical relationship closure reduces the customer active logical balance.
4. Physical replacement party is the actual current custodian/refill party, not necessarily the permanent owner. Replacement history now retains custody evidence.

## Accepted historical migration line

The following remain immutable and previously clean-database validated PASS:

- V174 strict ownership model
- V175 supplier logical asset-count preservation
- V176 customer custody boundary (owner-equality semantics superseded by V185)
- V177 cross-table location exclusivity
- V178 external accounting (terminal-shrink semantics superseded by V185)
- V179 company fleet accounting
- V180 ownership identity immutability
- V181 identifier authority/replacement integrity (universal exact-one/owner-context semantics superseded by V185)
- V182 identifier value/history integrity
- V183 state-audit history immutability
- V184 state-audit chain continuity/serialization

`V174 -> V184 = HISTORICAL CLEAN_DATABASE_VALIDATED_PASS`

## V185 final governed model

### Transaction identity

All business/operational relations continue using only the logical `tbl_cylinder.pk_cylinder_id` (`fk_cylinder`). Physical identifier values are not transaction foreign keys.

### Company-owned

- No logical/physical separation.
- `cylinder_serial` is the company cylinder identity displayed and transacted.
- Expected separate active-primary physical identifiers: **0**.

### Supplier/customer-owned

- `tbl_cylinder` = stable logical asset.
- `tbl_cylinder_identifier` = current/historical physical markings.
- `ASSIGNED` = exactly one active-primary physical ID.
- `AWAITING_REPLACEMENT` = zero active-primary physical IDs and no active physical location/custody.
- `CLOSED` = zero active-primary physical IDs; final custody remains only with permanent owner; no further operational use.

### Custody

Ownership and custody are separate. CUSTOMER_OWNED may be held by owner customer or another customer. Supplier/customer replacement uses the actual custody row valid at replacement time.

### Physical condition/accounting

External DAMAGED/LOST/DECOMMISSIONED events are logical-count neutral. LOST/DECOMMISSIONED retire the current physical marking and put the logical asset into `AWAITING_REPLACEMENT`. Explicit `CUSTOMER_ASSET_CLOSED` alone contributes `-1` to the customer logical active-asset balance. Supplier close remains count-neutral under the governed supplier logical-count model.

### Recovery

Company terminal states remain terminal. Supplier/customer logical assets may recover from physical DAMAGED/LOST/DECOMMISSIONED only after a usable physical ID is assigned; service/location rules determine the exact operational recovery flow.

### Display

- Company: `COMP-00125`
- Supplier: `LS-00100 / SUP-7788`
- Customer: `LC-00025 / CUST-250`

The logical ID remains the transaction key even when the physical ID is displayed alongside it.

## Current database gate

Migration: `V185__Align_External_Logical_Physical_Asset_Model.sql`

Validator: `BL008_Ownership_V185_Final_Harmony_Validation.sql`

Expected final line:

`BL008_V185_FINAL_DATABASE_HARMONY_PASS; failed_checks=0`

**Database freeze is not declared until V185 returns that clean PASS.**

## After V185 PASS

1. Freeze the database migration line at V185.
2. Do not create V186 unless a new approved requirement proves a database defect.
3. Correct service code to preserve logical IDs internally, remove separate company physical-ID creation, and use current-custodian replacement semantics.
4. Correct UI/search output to show logical + physical IDs for external cylinders and only one ID for company cylinders.
5. Execute service, DB-runtime and UI regression cases against the frozen database.
6. Close BL-008 only after those service/UI corrections and acceptance tests are completed.

Evidence: `BL-008/evidence/20260831-v185-final-business-model-alignment-authored.md`.
