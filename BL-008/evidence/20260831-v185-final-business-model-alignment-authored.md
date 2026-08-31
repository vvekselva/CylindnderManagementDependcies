# BL-008 V185 Final Business-Model Alignment — AUTHORED

Date: 2026-08-31

Migration: `V185__Align_External_Logical_Physical_Asset_Model.sql`

Status: **AUTHORED_WAITING_FOR_CLEAN_VALIDATION**

## Clarified governed model

- `tbl_cylinder` is the permanent transaction/lifecycle identity.
- Operational tables continue to store only `fk_cylinder`; physical identifiers are never transaction foreign keys.
- `COMPANY_OWNED`: no logical/physical split. `tbl_cylinder.cylinder_serial` is the company/physical identity; no separate active-primary physical identifier row is required.
- `SUPPLIER_OWNED` / `CUSTOMER_OWNED`: logical cylinder remains stable while current/historical physical markings are stored in `tbl_cylinder_identifier`.
- Customer ownership and current customer custody are independent; a customer-owned physical cylinder may be held by another customer with full custody traceability.
- External physical DAMAGED/LOST/DECOMMISSIONED events are logical-count neutral. LOST/DECOMMISSIONED retire the current physical marking and place the logical asset in `AWAITING_REPLACEMENT`.
- Only explicit customer logical relationship closure contributes `CUSTOMER_ASSET_CLOSED = -1`.
- Final logical closure requires return to the permanent owner party and blocks further operational use of the logical ID.

## V185 database corrections

1. Adds external logical lifecycle status: `ASSIGNED`, `AWAITING_REPLACEMENT`, `CLOSED`.
2. Supersedes V176 owner=custody equality while preserving exact custody shape/history.
3. Makes active-primary physical-identifier authority ownership-aware: company=0 separate primary; assigned external=1; awaiting/closed external=0.
4. Adds `fk_party_custody` to identifier replacement history so replacement party is proven by actual custody at replacement time, not permanent owner.
5. Corrects external ledger semantics: physical damage/loss/decommission/replacement = 0; explicit customer close = -1.
6. Makes external asset ledger append-only.
7. External LOST/DECOMMISSIONED retires current physical ID and sets `AWAITING_REPLACEMENT`; DAMAGED remains count-neutral without forcing deletion/replacement.
8. Adds explicit `fn_close_external_logical_asset` with final-owner-return guard and no-reuse semantics.
9. Adds operational-use guards and deferred external-status harmony checks.
10. Makes state-machine recovery ownership-aware: company terminal behavior remains terminal; external DAMAGED/LOST/DECOMMISSIONED may recover only when a usable physical ID has been assigned.
11. Updates display view: company shows one ID; external shows logical + physical/current status.
12. Rebuilds supplier/customer/identifier integrity views and adds `vw_bl008_logical_physical_harmony`.

## Freeze rule

V174-V184 remain immutable historical migrations. Database freeze is **not** declared until clean Flyway through V185 and `BL008_V185_FINAL_DATABASE_HARMONY_PASS; failed_checks=0` are returned.

After V185 PASS, the database line is frozen and BL-008 moves to service/UI source correction and runtime testing only.