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
| Migration path | `cylinder.datascripts/src/main/resources/db/migration/` |
| Migration mechanism | Flyway only |
| Manual SQL substitution | FORBIDDEN |
| Active migration selection | Exactly one requirement at a time, in proved authoritative order |
| Previously documented expected head | V176 |
| Current-main exact source head | DISCOVERY_REQUIRED |

The previous dependency ledger stated that V1-V176 were present. A later frozen-source inspection used for BL-001 proved files only through V172 at that frozen commit. Those two statements are not treated as interchangeable truth. BL-008 must inventory the **current authoritative migration source** before selecting the active requirement.

## 3. Neon Environment

| Item | Current value |
|---|---|
| Platform | Neon Serverless PostgreSQL |
| Organization | `selvakumar` |
| Historical organization ID | `org-spring-mode-70853603` |
| Project | `neon-for-cylinder-db` |
| Historical project ID | `holy-glitter-02245694` |
| BL-008 branch | `main` |
| Branch creation | FORBIDDEN |
| Environment role | Separate TEST environment; not direct external production |
| Application database | VERIFY_FROM_LIVE_NEON_BEFORE_FIRST_WRITE |
| PostgreSQL version | VERIFY_FROM_LIVE_NEON_BEFORE_FIRST_WRITE |

### Live connector state on 2026-08-26 manual fire

The connected Neon tool returned **zero visible projects** when BL-008 attempted live target verification. Therefore the project/branch/database identity cannot currently be re-proved from live Neon evidence. This is a fail-closed execution blocker only for database mutation; no database write was attempted.

## 4. Sequential Requirement Rule

For each database requirement, the Orchestrator must perform this loop:

1. Select exactly one next requirement from the authoritative Flyway source order.
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
Required branch policy           PASS (main only; no branch creation)
One-requirement-at-a-time rule   PASS
Live Neon project visibility     BLOCKED (connector currently shows zero projects)
Exact database identity          BLOCKED pending live Neon visibility
Current Flyway source inventory  IN PROGRESS / not yet reconciled
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
Neon project          : neon-for-cylinder-db (historical ID holy-glitter-02245694; live verification pending)
Branch                : main
Branch creation       : FORBIDDEN
Environment role      : TEST ONLY / NOT DIRECT EXTERNAL PRODUCTION
Database              : VERIFY_FROM_LIVE_NEON_BEFORE_WRITE
Migration tool        : Flyway
Requirement handling  : ONE AT A TIME
Source inventory      : DISCOVERY/RECONCILIATION REQUIRED
Database write status : NOT AUTHORIZED
```

This file must be updated after every BL-008 database requirement and whenever the environment or migration policy changes.
