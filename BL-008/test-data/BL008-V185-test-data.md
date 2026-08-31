# BL-008 V185 Test Data — Human-Readable Guide

The database is frozen at V185. Operational transactions use the logical cylinder ID only.

## Parties
- SUP-OWNER-A: permanent owner supplier
- SUP-SERVICE-B: non-owner refill/custodian supplier
- SUP-UNRELATED-C: negative supplier context
- CUST-OWNER-A: permanent owner customer
- CUST-HOLDER-B: valid non-owner holder
- CUST-HOLDER-C: second valid holder
- CUST-UNRELATED-X: negative customer context

## Primary cylinders
- Company: `COMP-TST-001`, `COMP-TST-002` — one identity only.
- Supplier: `LS-TST-001 / SUP-PHY-1001`, `LS-TST-002 / SUP-PHY-1002`.
- Customer: `LC-TST-001 / CUST-PHY-2001`, `LC-TST-002 / CUST-PHY-2002`, `LC-TST-003 / CUST-PHY-2003`, `LC-TST-004 / CUST-PHY-2004`.

## Replacement values
- `SUP-PHY-1001` -> `SUP-PHY-9001`
- `CUST-PHY-2001` -> `CUST-PHY-9001`
- `CUST-PHY-2004` -> `CUST-PHY-9004`

## Negative normalized collisions
- ` sup-phy-1001 ` must collide with `SUP-PHY-1001`.
- ` cust-phy-2002 ` must collide with `CUST-PHY-2002`.

## Rules to validate
1. Physical IDs never become transaction foreign keys.
2. Company cylinders have no separate active-primary physical identifier.
3. External ASSIGNED assets have exactly one current physical identifier.
4. Customer owner and customer holder are separate.
5. Physical loss/replacement never changes the logical cylinder ID.
6. External LOST/DECOMMISSIONED is logical-count neutral.
7. Customer logical count reduces only on explicit `CUSTOMER_ASSET_CLOSED`.
8. Closure requires final return to owner and blocks future use.
9. Company display is one ID; external display is logical ID + physical ID.
