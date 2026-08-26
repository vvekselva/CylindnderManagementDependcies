# BL-008 Neon Target Verification — 26 Aug 2026

## Purpose

Re-check the previously recorded blocker that the required Neon TEST branch `main` was not visible, and determine whether BL-008 can proceed to initial Flyway requirement selection.

## Live verified target

| Field | Verified value |
|---|---|
| Project | `neon-for-cylinder-db` |
| Project ID | `small-bread-22546365` |
| Required branch | `main` |
| Main branch ID | `br-delicate-mountain-ayzs1f3l` |
| Database | `neondb` |
| Current user | `neondb_owner` |
| PostgreSQL server version | `18.6` |
| Public tables | `0` |
| `flyway_schema_history` exists | `false` |

## Decision

`BLK-BL008-006 / BLOCKED_REQUIRED_MAIN_BRANCH_NOT_VISIBLE` is **RESOLVED**.

The required `main` branch now exists and the exact permitted database is reachable. The database is a fresh empty target: there are zero public tables and no `flyway_schema_history` table. This is not a failure; it means the initial Flyway baseline has not yet been applied.

## Safety evidence

- Neon branches created during verification: **0**
- Database writes during verification: **0**
- Manual SQL substitution: **0**
- Production branch used as a substitute: **NO**
- External production deployment: **NO**

## New BL-008 state

`READY_TARGET_VERIFIED`

BL-008 is not complete. The next governed action is to select the initial authoritative Flyway requirement from `vvekselva/CylinderManagement` at frozen commit `3ae6e61442132d94a307275b08dd65fcef228d89`, prove its version/order/checksum/prerequisites, validate against the verified Neon `main` / `neondb` target, apply exactly one requirement through Flyway, and then verify `flyway_schema_history` plus schema/ownership/data integrity before selecting the next requirement.
