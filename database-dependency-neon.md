# CylinderManagement Database Dependency

This file is the authoritative database requirements, environment, migration-status and database-change ledger for CylinderManagement.

> **Repository scope:** Flyway SQL migration scripts remain only in `vvekselva/CylinderManagement`. This dependency repository records requirements and validation evidence; it does not duplicate migration SQL.

## 1. Current BL-008 Database Policy

The user-approved policy as of 2026-08-26 is:

- Neon is a **separate TEST environment** for CylinderManagement database migration work.
- BL-008 uses the Neon branch **`main` only**.
- BL-008 must **not create additional Neon branches**.
- A change applied to Neon does **not** mean that an external/real production database has been changed.
- Database work is executed **one requirement at a time**.
- The current requirement must be source-proved, Flyway-applied, validated and durably recorded before the next requirement is selected.
- A failed or ambiguous current requirement blocks advancement to later requirements.
- Manual SQL substitution for Flyway is **not allowed**.

Historical references to a Neon `production` branch are retained only as audit history and are **superseded for BL-008 execution** by the main-only policy above.

## 2. Flyway Source

| Item | Current value |
|---|---|
| Flyway source repository | `vvekselva/CylinderManagement` |
| Current authoritative source branch | `main` |
| Current authoritative source commit | `3ae6e61442132d94a307275b08dd65fcef228d89` |
| Migration path | `cylinder.datascripts/src/main/resources/db/migration/` |
| Migration tree SHA | `c2b6e219cfc8b0d23e0208d46cd634271bf39356` |
| Migration mechanism | Flyway only |
| Manual SQL substitution | FORBIDDEN |
| Active migration selection | Exactly one requirement at a time, in proved authoritative order |
| Current-main exact source head | **V170** |

The older V176 expectation is retained only as historical audit data and is superseded by the current GitHub source inventory through V170 at the frozen baseline.

## 3. Verified Neon TEST Target — 26 Aug 2026

Fresh live Neon verification now proves the previously missing target is available.

| Item | Verified value |
|---|---|
| Platform | Neon Serverless PostgreSQL |
| Environment role | Separate TEST environment; not direct external production |
| Target project | `neon-for-cylinder-db` |
| Project ID | `small-bread-22546365` |
| Required branch | `main` |
| Main branch ID | `br-delicate-mountain-ayzs1f3l` |
| Database | `neondb` |
| Database user | `neondb_owner` |
| PostgreSQL server version | `18.6` |
| Public table count | **0** |
| `flyway_schema_history` | **ABSENT** |
| Branch creation performed | **NO** |
| Database writes during verification | **0** |

The absence of `flyway_schema_history` is **not a blocker** here. The verified `main` database is a fresh empty target with zero public tables, so BL-008 can now start the initial governed Flyway baseline sequence.

## 4. Blocker Resolution

The prior runtime blocker `BLK-BL008-006 / BLOCKED_REQUIRED_MAIN_BRANCH_NOT_VISIBLE` is **RESOLVED**.

```text
Old state
  Project visible
  main not visible
  exact database unproved
       ↓
Live verification
       ↓
Project small-bread-22546365 verified
main br-delicate-mountain-ayzs1f3l verified
neondb / neondb_owner / PostgreSQL 18.6 verified
0 public tables; no flyway_schema_history
       ↓
New state
READY_TARGET_VERIFIED
```

BL-008 is **not complete**. The environment blocker is solved; the next work is to select, prove, validate and apply the first authoritative Flyway requirement.

## 5. Sequential Requirement Rule

For each database requirement, the Orchestrator must perform this loop:

1. Select exactly one next requirement from the authoritative Flyway source order and the live target state.
2. Prove migration version, filename/checksum, order and prerequisites.
3. Reconfirm the exact Neon `main` target and database identity.
4. Run Flyway validation for the current requirement/sequence state.
5. Apply only the selected next requirement through Flyway to Neon `main`.
6. Verify `flyway_schema_history`, schema integrity, ownership rules and critical data integrity.
7. Record PASS/FAIL and evidence in this ledger and BL-008 runtime.
8. Select the next requirement only after the current requirement is PASS and synchronized.

Database migration writes under BL-008 have effective parallelism **1**.

## 6. Ownership Integrity Requirements

The migration must preserve and validate the supported ownership model:

- `COMPANY_OWNED`: no supplier owner and no customer owner.
- `SUPPLIER_OWNED`: supplier owner required; customer owner forbidden.
- `CUSTOMER_OWNED`: customer owner required; supplier owner forbidden.
- Supplier and customer ownership must never both be populated for one ownership record.
- Cylinder identity, state/history, custody/logistics and audit relationships must be preserved unless an authoritative versioned migration explicitly changes them.

## 7. Current Database Quality Gate

```text
BL-008 governance                PASS
Neon environment role           PASS (separate TEST environment)
Required branch policy          PASS (main only; no branch creation)
One-requirement-at-a-time rule   PASS
Current Flyway source inventory PASS (current main = V170 at 3ae6e614...)
Live Neon target project        PASS (neon-for-cylinder-db / small-bread-22546365)
Required main branch visibility PASS (br-delicate-mountain-ayzs1f3l)
Exact main database identity    PASS (neondb / neondb_owner / PostgreSQL 18.6)
Fresh schema check              PASS (0 public tables)
flyway_schema_history           ABSENT ON FRESH TARGET - NOT A BLOCKER
Active database requirement     NONE - READY TO SELECT INITIAL REQUIREMENT
Flyway execution                NOT STARTED
Database mutation               NOT YET AUTHORIZED
Manual SQL substitution         NOT ALLOWED
```

## 8. Database Change Ledger

| Date | Change / requirement | Flyway version | Source | Neon branch | Database | Status | Validation / notes |
|---|---|---|---|---|---|---|---|
| 2026-08-16 | Created dedicated Neon project for CylinderManagement | N/A | N/A | historical | historical | HISTORICAL | Initial project creation record. |
| 2026-08-16 | Connectivity validation against former target | N/A | N/A | `production` | historical | HISTORICAL | Former-policy evidence only. |
| 2026-08-26 | Adopt Neon main-only sequential migration policy | N/A | `vvekselva/CylinderManagement` | `main` | live target | PASS_POLICY | Test environment; no branch creation; one requirement at a time. |
| 2026-08-26 | Reconcile authoritative Flyway source inventory | V170 head | `CylinderManagement@3ae6e614...` | `main` | live target | PASS_SOURCE_INVENTORY | Migration tree proves source through V170. |
| 2026-08-26 18:12 IST | Revalidate project while main was not visible to prior invocation | N/A | frozen source | `main` required | unproved then | HISTORICAL_BLOCKER | Retained as audit history; superseded by later live verification. |
| 2026-08-26 | Verify Neon `main` and exact fresh database target | N/A | frozen source | `main` / `br-delicate-mountain-ayzs1f3l` | `neondb` | PASS_TARGET_VERIFIED | Project `small-bread-22546365`; user `neondb_owner`; PostgreSQL 18.6; 0 public tables; no `flyway_schema_history`; no writes performed. |

## 9. Application-to-Database Dependency Contract

A database requirement is complete only when:

1. the authoritative Flyway migration exists in `vvekselva/CylinderManagement`;
2. its exact order/version/checksum is proved;
3. the live Neon `main` project and database are verified;
4. Flyway validation passes;
5. the current requirement is applied through Flyway;
6. post-migration ownership/schema/data checks pass; and
7. this ledger and BL-008 runtime are synchronized.

No later requirement may start before these conditions pass for the current requirement.

## 10. Current Authoritative BL-008 Target

```text
Dependency repository : vvekselva/CylindnderManagementDependcies
Control branch         : chore/rename-dependency-files
Flyway source repo     : vvekselva/CylinderManagement
Source commit          : 3ae6e61442132d94a307275b08dd65fcef228d89
Current Flyway head    : V170
Neon target project    : neon-for-cylinder-db / small-bread-22546365
Required branch        : main / br-delicate-mountain-ayzs1f3l
Environment role       : TEST ONLY / NOT DIRECT EXTERNAL PRODUCTION
Database               : neondb
Database user          : neondb_owner
PostgreSQL             : 18.6
Current schema         : FRESH / 0 public tables
flyway_schema_history  : ABSENT - INITIAL BASELINE NOT YET APPLIED
Migration tool         : Flyway
Requirement handling   : ONE AT A TIME
Database write status  : NOT YET STARTED
```

## 11. Exact Next Action

Select the **initial authoritative Flyway requirement** from the frozen source, prove its version/order/checksum/prerequisites, run pre-apply validation against the verified Neon `main` / `neondb` target, apply exactly that one requirement through Flyway, then verify `flyway_schema_history` and schema/ownership/data integrity before proceeding.

This file must be updated after every BL-008 database requirement and whenever the environment, migration policy or authoritative Flyway source inventory changes.
