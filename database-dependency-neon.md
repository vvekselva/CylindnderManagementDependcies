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

Historical references below to a Neon `production` branch are retained only as audit history and are **superseded for BL-008 execution** by the main-only policy above.

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
| Previously documented expected head | V176 — superseded by live current-main inventory |
| Current-main exact source head | **V170** |

The current authoritative `CylinderManagement/main` branch was re-read on 2026-08-26. Its migration tree contains versioned Flyway SQL through **V170** and no V171+ entry. The older V176 statement is retained only as historical audit data and must not override the live GitHub main inventory.

## 3. Neon Environment

| Item | Current value |
|---|---|
| Platform | Neon Serverless PostgreSQL |
| Organization | `selvakumar` |
| Historical organization ID | `org-spring-mode-70853603` |
| Authoritative historical project | `neon-for-cylinder-db` |
| Historical project ID | `holy-glitter-02245694` |
| Newly visible connected project | `cylinder_db_for_testing` (`weathered-heart-89789162`) |
| BL-008 required branch | `main` |
| Newly visible project branch | `production` |
| Branch creation | FORBIDDEN |
| Environment role | Separate TEST environment; not direct external production |
| Application database | VERIFY_ON_EXISTING_MAIN_BEFORE_FIRST_WRITE |
| PostgreSQL version | VERIFY_ON_EXISTING_MAIN_BEFORE_FIRST_WRITE |

### Live connector state on 2026-08-26

The connected Neon integration exposes **one project**, `cylinder_db_for_testing` (`weathered-heart-89789162`). The project exposes/defaults to branch **`production`**, while BL-008 is governed to use an already-existing **`main` only** and is forbidden from creating a Neon branch. The visible project also does not by itself prove identity equivalence to the historical authoritative project record `neon-for-cylinder-db` / `holy-glitter-02245694`. Therefore exact `main` project/database identity and `flyway_schema_history` remain unproved. No SQL or database write is authorized against `production` as a substitute for `main`.

## 4. Sequential Requirement Rule

For each database requirement, the Orchestrator must perform this loop:

1. Select exactly one next requirement from the authoritative Flyway source order and the live target's `flyway_schema_history`.
2. Prove its migration version, filename/checksum and prerequisites.
3. Verify the live Neon `main` target and exact database identity.
4. Run Flyway validation for the current requirement/sequence state.
5. Apply only the selected next requirement through Flyway to Neon `main`.
6. Verify `flyway_schema_history`, schema integrity, ownership rules and critical data integrity.
7. Record PASS/FAIL and evidence in this ledger and BL-008 runtime.
8. Select the next requirement only after the current requirement is PASS and synchronized.

Database migration writes under BL-008 have effective parallelism **1**.

## 5. Ownership Integrity Requirements

The migration must preserve and validate the supported ownership model:

- `COMPANY_OWNED`: no supplier owner and no customer owner.
- `SUPPLIER_OWNED`: supplier owner required; customer owner forbidden.
- `CUSTOMER_OWNED`: customer owner required; supplier owner forbidden.
- Supplier and customer ownership must never both be populated for one ownership record.
- Cylinder identity, state/history, custody/logistics and audit relationships must be preserved unless an authoritative versioned migration explicitly changes them.

## 6. Current Database Quality Gate

```text
BL-008 governance                PASS
Neon environment role           PASS (separate TEST environment)
Required branch policy          PASS (main only; no branch creation)
One-requirement-at-a-time rule   PASS
Current Flyway source inventory PASS (current main = V170 at 3ae6e614...)
Live Neon project visibility     PASS (one connected project visible)
Authoritative target match       BLOCKED (visible project identity not proved equivalent)
Required main branch visibility  BLOCKED (visible/default branch is production)
Exact main database identity     BLOCKED
flyway_schema_history            NOT VERIFIED
Active database requirement      NONE — selection blocked pending live main history
Flyway execution                 NOT STARTED
Database mutation                NOT AUTHORIZED
Manual SQL substitution          NOT ALLOWED
```

## 7. Database Change Ledger

| Date | Change / requirement | Flyway version | Source | Neon branch | Database | Status | Validation / notes |
|---|---|---|---|---|---|---|---|
| 2026-08-16 | Created dedicated Neon project for CylinderManagement | N/A | N/A | `main` | `neondb` | HISTORICAL | Initial project creation record. |
| 2026-08-16 | Created controlled `production` branch | N/A | N/A | `production` | inherited | SUPERSEDED_FOR_BL008 | Historical branch record; BL-008 no longer uses this branch. |
| 2026-08-16 | Created fresh CylinderManagement application database | N/A | N/A | `production` | `neon-for-cylinder-db` | HISTORICAL | Historical target under former policy. |
| 2026-08-16 | Connectivity validation against former target | N/A | N/A | `production` | `neon-for-cylinder-db` | HISTORICAL | Earlier evidence reported PostgreSQL 18.4 and empty database. Must not substitute for current main-only live verification. |
| 2026-08-26 | Adopt Neon main-only sequential migration policy | N/A | `vvekselva/CylinderManagement` | `main` | VERIFY_FROM_LIVE_NEON | PASS_POLICY | Neon is a separate test environment; no Neon branch creation; one database requirement at a time. |
| 2026-08-26 | Manual production fire live Neon target discovery | N/A | N/A | `main` | VERIFY_FROM_LIVE_NEON | BLOCKED | Connected Neon integration exposed zero projects. No DB mutation performed. |
| 2026-08-26 | Reconcile current authoritative Flyway source inventory | V170 head | `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89` | `main` | VERIFY_FROM_LIVE_NEON | PASS_SOURCE_INVENTORY | Migration tree `c2b6e219...` proves current main through V170. Older V176 expectation superseded. Live Neon remained unavailable at that checkpoint. |
| 2026-08-26 | Governed fire at 11:16 IST: reverify configured Neon target | N/A | `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89` | `main` | VERIFY_FROM_LIVE_NEON | BLOCKED_SAME_REQUIREMENT | Required historical project was not returned and a follow-up lookup encountered connector authentication failure. No DB mutation. |
| 2026-08-26 | Governed fire at 12:02 IST: live Neon project rediscovery | N/A | `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89` | `main` required; visible `production` | VERIFY_ON_EXISTING_MAIN | BLOCKED_TARGET_MISMATCH | Connector exposes `cylinder_db_for_testing` (`weathered-heart-89789162`), but its visible/default branch is `production`; no existing `main` was proved and branch creation is forbidden. No mutation occurred. |
| 2026-08-26 | Governed fire at 12:58 IST: revalidate main-only target gate | N/A | `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89` | `main` required; visible `production` | VERIFY_ON_EXISTING_MAIN | BLOCKED_SAME_TARGET_MISMATCH | Live discovery again exposes only `cylinder_db_for_testing` / `production`; `main` is not proved. No requirement selected, no SQL/Flyway write, no branch creation, no manual SQL. |
| 2026-08-26 | Governed fire at 15:13 IST: revalidate authoritative main-only target | N/A | `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89` | `main` required; visible `production` | VERIFY_ON_EXISTING_MAIN | BLOCKED_SAME_TARGET_MISMATCH | Owned and shared searches return no `holy-glitter-02245694`/`neon-for-cylinder-db`. The only visible project remains `cylinder_db_for_testing` (`weathered-heart-89789162`) with primary/default branch `production` (`br-holy-scene-ax0ddw93`). No requirement selected, no Flyway validation/migration, no SQL write, no branch creation, no manual SQL, no external production deployment. |

## 8. Application-to-Database Dependency Contract

A database requirement is complete only when:

1. the authoritative Flyway migration exists in `vvekselva/CylinderManagement`;
2. its exact order/version/checksum is proved;
3. the live Neon `main` project and database are verified;
4. Flyway validation passes;
5. the current requirement is applied through Flyway;
6. post-migration ownership/schema/data checks pass; and
7. this ledger and BL-008 runtime are synchronized.

No later requirement may start before these conditions pass for the current requirement.

## 9. Current Authoritative BL-008 Target

```text
Dependency repository : vvekselva/CylindnderManagementDependcies
Flyway source repo     : vvekselva/CylinderManagement
Source branch          : main
Source commit          : 3ae6e61442132d94a307275b08dd65fcef228d89
Current Flyway head    : V170
Historical Neon target : neon-for-cylinder-db / holy-glitter-02245694
Currently visible      : cylinder_db_for_testing / weathered-heart-89789162
Required branch        : main
Visible/default branch : production
Branch creation        : FORBIDDEN
Environment role       : TEST ONLY / NOT DIRECT EXTERNAL PRODUCTION
Database               : VERIFY_ON_EXISTING_MAIN_BEFORE_WRITE
Migration tool         : Flyway
Requirement handling   : ONE AT A TIME
Database write status  : NOT AUTHORIZED
```

## 10. Latest Governed Invocation Evidence — 2026-08-26 12:58 IST

- Invocation: `CYLINDER-PRODUCTION-FIRE-20260826-1258IST`.
- Authoritative Flyway source remains `CylinderManagement/main@3ae6e61442132d94a307275b08dd65fcef228d89`, migration tree `c2b6e219cfc8b0d23e0208d46cd634271bf39356`, head V170.
- Connected Neon discovery returns one project: `cylinder_db_for_testing` (`weathered-heart-89789162`).
- Its visible/default and only proved branch is `production`; no existing `main` branch is proved.
- User policy requires `main` only and prohibits creating Neon branches.
- Identity equivalence between the visible project and historical target `neon-for-cylinder-db` / `holy-glitter-02245694` remains unproved.
- Decision: `BLOCKED_TEST_DATABASE_CONTROL_PLANE_TARGET_MISMATCH`; remain before selecting any database requirement.
- `flyway_schema_history`: not read because the required main target is not proved.
- Flyway validation: not run.
- Flyway migration: not run.
- SQL reads against `production` as a substitute for `main`: zero.
- Database writes: zero.
- Neon branches created: zero.
- Manual SQL substitutions: zero.
- External production deployments: zero.

## 11. Latest Governed Invocation Evidence — 2026-08-26 15:13 IST

- Invocation: `CYLINDER-PRODUCTION-FIRE-20260826-151312IST`.
- Owned-project search by required project ID `holy-glitter-02245694`: zero matches.
- Shared-project search by required project ID: zero matches.
- Owned-project search by required project name `neon-for-cylinder-db`: zero matches.
- The connected organization currently exposes one project: `cylinder_db_for_testing` (`weathered-heart-89789162`).
- Fresh project description proves one branch, `production` (`br-holy-scene-ax0ddw93`), marked primary/default.
- Required existing branch `main` is not visible; identity equivalence to the governed project remains unproved; branch creation remains forbidden.
- Decision: remain at `BLOCKED_TEST_DATABASE_CONTROL_PLANE_TARGET_MISMATCH` before requirement selection.
- Active database requirement: none.
- `flyway_schema_history`: not read from `production` as a substitute for `main`.
- Flyway validation/migration: not run.
- Database writes: zero.
- Neon branches created: zero.
- Manual SQL substitutions: zero.
- External production deployments: zero.

This file must be updated after every BL-008 database requirement and whenever the environment, migration policy or authoritative Flyway source inventory changes.
