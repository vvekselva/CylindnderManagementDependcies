# CylinderManagement Database Dependency

This repository is the authoritative **database requirements, dependencies, environment, branch-purpose, migration-status, and database-change ledger** for CylinderManagement.

> **Repository scope:** This repository does **not** store Flyway SQL migration scripts. The actual Flyway scripts remain in the main CylinderManagement source repository: `vvekselva/CylinderManagement`. Database migrations are executed from that source repository. This repository records the dependency and change-control information only.

## 1. Repository Responsibilities

This repository stores:

- database platform and version requirements;
- Neon organization/project/database identifiers;
- Neon branch names, IDs, parent relationships, and intended purpose;
- required Flyway migration version for the application;
- migration execution status and validation status;
- database dependency rules for application releases;
- a database change ledger describing what changed and why;
- database-related quality-gate results.

This repository must **not** store:

- Flyway SQL migration scripts;
- ad-hoc SQL used as a substitute for Flyway;
- database passwords, access tokens, or complete connection strings;
- application source code.

## 2. Flyway Source Repository

| Item | Current value |
|---|---|
| Flyway source repository | `vvekselva/CylinderManagement` |
| Migration execution source | CylinderManagement source repository |
| Application Flyway migration path | `cylinder.datascripts/src/main/resources/db/migration/` |
| Database migration mechanism | Flyway |
| Current required migration target | V176 |
| SQL stored in this dependency repository | No |

### Rule

Every database change has two separate responsibilities:

1. **Implementation:** Add the versioned Flyway SQL migration to `vvekselva/CylinderManagement`.
2. **Dependency/change control:** Update this `database-dependency-neon.md` with the migration requirement, purpose, target branch/database, execution status, and validation result.

The SQL must not be duplicated into this repository.

## 3. Database Platform

| Item | Current value |
|---|---|
| Database platform | Neon Serverless PostgreSQL |
| Neon organization | `selvakumar` |
| Neon organization ID | `org-spring-mode-70853603` |
| Neon project | `neon-for-cylinder-db` |
| Neon project ID | `holy-glitter-02245694` |
| PostgreSQL major version | 18 |
| Application database | `neon-for-cylinder-db` |
| Migration mechanism | Flyway |
| Required migration version | V176 |

No database password, access token, or full connection string may be stored in this repository. Credentials must be supplied through environment variables or another approved secret-management mechanism.

## 4. Neon Project, Branch, and Database Model

Neon uses the following hierarchy:

```text
Organization
└── Project
    └── Branch
        └── PostgreSQL Database
            ├── Schemas
            ├── Tables
            ├── Views
            ├── Functions
            ├── Triggers
            └── Data
```

A **Neon project** is the top-level PostgreSQL environment. A **Neon branch** is an isolated database history/environment inside that project. A child branch starts from its parent branch's state and can then change independently. A PostgreSQL **database** exists inside a branch.

This branching model allows database migrations and application/database integration to be tested without changing the controlled production branch.

## 5. Current Neon Branches and Their Purpose

### `main`

| Item | Value |
|---|---|
| Branch name | `main` |
| Branch ID | `br-holy-waterfall-awy01vfa` |
| Purpose | Clean parent/reference branch |
| CMAS application deployment | No |
| Flyway production target | No |
| Expected use | Preserve a clean baseline from which controlled branches can be created |

**Rule:** `main` is not the CylinderManagement production database. It should remain a clean reference/baseline unless a future database governance decision explicitly changes this policy.

### `production`

| Item | Value |
|---|---|
| Branch name | `production` |
| Branch ID | `br-steep-snow-aw6u5odt` |
| Parent branch | `main` |
| Application database | `neon-for-cylinder-db` |
| Purpose | Authoritative CylinderManagement production/integration database line |
| Flyway migration target | Yes |
| Current database state | Fresh, reachable and empty; Flyway migration pending |

**Rule:** Approved CylinderManagement migrations are executed through Flyway from the `vvekselva/CylinderManagement` source repository against this branch/database. Manual SQL replay is not an acceptable substitute for Flyway execution.

## 6. Future Neon Branch Purposes

Additional Neon branches should be created only when a separate database lifecycle purpose is required.

| Branch pattern | Purpose | May modify production directly? |
|---|---|---|
| `production` | Authoritative deployed CMAS database | N/A — controlled target |
| `migration-*` | Validate a Flyway migration sequence before production | No |
| `integration-*` | Application/database integration testing | No |
| `feature-*` | Database work isolated to a feature | No |
| `hotfix-*` | Validate an urgent database correction before production | No |

Temporary/test branches should be removed after their purpose is complete unless retained for audit or recovery.

## 7. Flyway and Database Change Governance

1. Flyway SQL implementation belongs only in `vvekselva/CylinderManagement`.
2. This dependency repository records requirements, dependencies, branch/database targets, status, and validation evidence only.
3. Migration scripts must follow Flyway versioning and naming rules.
4. Existing applied migration scripts must not be silently rewritten after application to a controlled database.
5. A subsequent database change requires a new Flyway migration version.
6. Flyway must own migration ordering and maintain `flyway_schema_history`.
7. Manual SQL substitution for the migration sequence is **not allowed**.
8. Every database migration/change must be recorded in the Database Change Ledger below.
9. A database change is not complete until both the Flyway execution and its validation are recorded here.
10. Secrets must never be committed to either repository.

## 8. Current Database Quality Gate

```text
Fresh Neon project               PASS
production branch                PASS
Fresh CMAS database              PASS
Neon database connectivity       PASS
Database empty before migration  PASS
V1–V176 migration source present PASS
Flyway execution                 PENDING
Manual SQL substitution          NOT ALLOWED
```

### Gate interpretation

- **Fresh Neon project — PASS:** Dedicated Neon project `neon-for-cylinder-db` exists.
- **production branch — PASS:** Controlled `production` branch exists under the new project.
- **Fresh CMAS database — PASS:** PostgreSQL database `neon-for-cylinder-db` exists on `production`.
- **Neon database connectivity — PASS:** A read-only connection test reached the intended `production` database using the database owner role; PostgreSQL reported version 18.4.
- **Database empty before migration — PASS:** The connectivity validation confirmed zero public base tables and no `flyway_schema_history` table before Flyway execution.
- **V1–V176 migration source present — PASS:** The authoritative CylinderManagement workspace/source set contains the Flyway migration source through V176.
- **Flyway execution — PENDING:** The fresh production database has not yet been migrated through Flyway.
- **Manual SQL substitution — NOT ALLOWED:** Migration SQL must be executed under Flyway control from the CylinderManagement source repository.

The database baseline is **not migration-complete** until Flyway execution and post-migration validation both pass.

## 9. Database Change Ledger

Every database-related change must add or update an entry here. Do not paste SQL into this ledger.

| Date | Change / requirement | Flyway version | Flyway source repository | Neon branch | Database | Status | Validation / notes |
|---|---|---|---|---|---|---|---|
| 2026-08-16 | Created dedicated Neon project for CylinderManagement | N/A | N/A | `main` | `neondb` | PASS | Project `neon-for-cylinder-db` created as a fresh Neon project. |
| 2026-08-16 | Created controlled production branch | N/A | N/A | `production` | inherited databases | PASS | `production` created from clean `main`. |
| 2026-08-16 | Created fresh CylinderManagement application database | N/A | N/A | `production` | `neon-for-cylinder-db` | PASS | Database verified empty before migration. |
| 2026-08-16 | Validate connectivity to the authoritative Neon target | N/A | N/A | `production` | `neon-for-cylinder-db` | PASS | Connected as `neondb_owner`; PostgreSQL 18.4; zero public base tables; `flyway_schema_history` absent. No schema/data change was made. |
| 2026-08-16 | Establish required Flyway baseline through ownership/status workflow | V1–V176 | `vvekselva/CylinderManagement` | `production` | `neon-for-cylinder-db` | PENDING | Flyway execution has not yet been run on the fresh database. |

### Required fields for future entries

For each future database change, record:

- date;
- short business/technical purpose or dependency requirement;
- Flyway version/script identifier;
- source repository containing the implementation;
- Neon branch where it was validated or deployed;
- target database;
- result (`PLANNED`, `TESTING`, `PASS`, `FAILED`, `ROLLED BACK`, or `SUPERSEDED`);
- validation evidence and important dependency notes.

## 10. Application-to-Database Dependency Contract

A CylinderManagement source-code release must not be treated as database-compatible unless:

1. the required Flyway migration scripts exist in `vvekselva/CylinderManagement`;
2. this `database-dependency-neon.md` identifies the required database/Flyway version;
3. Flyway validates successfully against the target database;
4. the database migration quality gate is PASS;
5. application integration tests use the intended Neon branch/database; and
6. no application source change assumes a database structure newer than the dependency recorded here.

If application code introduces or depends on a database change, the source-code change and the corresponding dependency-ledger update must be treated as one release requirement even though they live in separate repositories.

## 11. Current Authoritative Target

```text
Dependency repository : vvekselva/CylindnderManagementDependcies
Flyway source repo     : vvekselva/CylinderManagement
Neon organization     : selvakumar
Neon project          : neon-for-cylinder-db
Project ID            : holy-glitter-02245694
Branch                : production
Branch ID             : br-steep-snow-aw6u5odt
Database              : neon-for-cylinder-db
Connectivity          : PASS
PostgreSQL            : 18.4
Migration tool        : Flyway
Required version      : V176
Migration status      : PENDING
```

This file must be updated whenever the database requirement, Neon environment, branch purpose, migration target, execution status, or validation status changes.