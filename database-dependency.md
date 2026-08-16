# CylinderManagement Database Dependency

This file is the authoritative database dependency, environment, branch-purpose, migration-status, and database-change ledger for the CylinderManagement project.

> **Quality rule:** Every database-related change must be reflected in this file. SQL implementation scripts must **not** be embedded in this document. Flyway SQL scripts are stored separately under the repository's `flyway/` folder.

## 1. Database Platform

| Item | Current value |
|---|---|
| Database platform | Neon Serverless PostgreSQL |
| Neon organization | `selvakumar` |
| Neon organization ID | `org-spring-mode-70853603` |
| Neon project | `neon-for-cylinder-db` |
| Neon project ID | `holy-glitter-02245694` |
| PostgreSQL major version | 18 |
| Application database | `neon-for-cylinder-db` |
| Database migration mechanism | Flyway |
| Current Flyway target version | V176 |
| SQL script location in this repository | `flyway/` |

No database password, access token, or full connection string may be stored in this repository. Application and Flyway credentials must be supplied through environment variables or another approved secret-management mechanism.

## 2. Neon Project, Branch, and Database Model

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

This allows database changes to be developed and tested without modifying the production branch until they are approved.

## 3. Current Neon Branches and Their Purpose

### `main`

| Item | Value |
|---|---|
| Branch name | `main` |
| Branch ID | `br-holy-waterfall-awy01vfa` |
| Purpose | Clean parent/reference branch |
| CMAS application deployment | No |
| Flyway migration target | No |
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
| Current database state | Fresh and empty; Flyway migration pending |

**Rule:** Approved CylinderManagement database migrations are applied to the `production` branch through Flyway. Manual substitution of Flyway migrations by directly replaying SQL is not permitted.

## 4. Recommended Future Branch Purposes

Additional Neon branches should be created only when a separate database lifecycle purpose is required. The recommended model is:

| Branch pattern | Purpose | May modify production directly? |
|---|---|---|
| `production` | Authoritative deployed CMAS database | N/A — controlled target |
| `migration-*` | Validate a new Flyway migration sequence before production | No |
| `integration-*` | Application/database integration testing | No |
| `feature-*` | Database work isolated to a feature | No |
| `hotfix-*` | Validate an urgent database correction before production | No |

Temporary/test branches should be removed after their purpose is complete unless they are required for audit or recovery.

## 5. Flyway Governance

1. All database schema/data migration implementation scripts must be stored under `flyway/`.
2. Migration scripts must follow Flyway versioning and naming rules, for example `V176__Description.sql`.
3. Existing applied migration scripts must not be silently rewritten after being applied to a controlled database.
4. New database changes require a new Flyway migration version.
5. Flyway must own migration ordering and maintain its migration history table.
6. Manual SQL substitution for the migration sequence is **not allowed**.
7. Before a migration is considered complete, its result must be recorded in the Database Change Ledger below.
8. This file records **what changed, why, where, migration version, validation result, and deployment status**; the SQL itself remains in `flyway/`.
9. Secrets must never be committed in Flyway configuration, Maven properties, application configuration, this document, or SQL scripts.

## 6. Current Database Quality Gate

```text
Fresh Neon project               PASS
production branch                PASS
Fresh CMAS database              PASS
Database empty before migration  PASS
V1–V176 migration source present PASS
Flyway execution                 PENDING
Manual SQL substitution          NOT ALLOWED
```

### Gate interpretation

- **Fresh Neon project — PASS:** A new Neon project dedicated to CylinderManagement exists.
- **production branch — PASS:** A dedicated `production` branch exists under the new project.
- **Fresh CMAS database — PASS:** PostgreSQL database `neon-for-cylinder-db` exists on `production`.
- **Database empty before migration — PASS:** The CMAS database was verified to contain no application tables before Flyway execution.
- **V1–V176 migration source present — PASS:** The authoritative CylinderManagement workspace contains the Flyway migration source through V176. The current source set contains 175 migration files spanning the version history through V176.
- **Flyway execution — PENDING:** The clean database has not yet been migrated through Flyway.
- **Manual SQL substitution — NOT ALLOWED:** SQL files must not be manually replayed as a replacement for Flyway migration execution and history tracking.

The database baseline is **not considered migration-complete** until Flyway execution and post-migration validation both pass.

## 7. Database Change Ledger

Every database change must add or update an entry here. Do not paste SQL into this ledger.

| Date | Change | Flyway version/script | Neon branch | Database | Status | Validation / notes |
|---|---|---|---|---|---|---|
| 2026-08-16 | Created dedicated Neon project for CylinderManagement | N/A | `main` | `neondb` | PASS | Project `neon-for-cylinder-db` created as a fresh database project. |
| 2026-08-16 | Created controlled production branch | N/A | `production` | inherited databases | PASS | `production` created from clean `main`. |
| 2026-08-16 | Created fresh CylinderManagement application database | N/A | `production` | `neon-for-cylinder-db` | PASS | Database verified empty before migration. |
| 2026-08-16 | Establish Flyway baseline target through ownership/status workflow | V1–V176 source set | `production` | `neon-for-cylinder-db` | PENDING | Flyway execution has not yet been run on the fresh database. |

### Required fields for future entries

For each future database change, record:

- date;
- short business/technical purpose;
- Flyway version and script filename;
- Neon branch where it was validated;
- target database;
- result (`PLANNED`, `TESTING`, `PASS`, `FAILED`, `ROLLED BACK`, or `SUPERSEDED`);
- validation evidence or important dependency notes.

## 8. Dependency Rules for CylinderManagement

The CylinderManagement application depends on the database state represented by the successfully applied Flyway migrations in the authoritative Neon environment.

A source-code release must not be treated as database-compatible unless:

1. the corresponding Flyway scripts are present under `flyway/`;
2. this `database-dependency.md` ledger identifies the required database version;
3. Flyway validates successfully against the target database;
4. the database migration quality gate is PASS;
5. application integration tests use the intended Neon branch/database; and
6. no application source change assumes a database structure newer than the recorded dependency.

## 9. Current Authoritative Target

```text
Neon organization : selvakumar
Neon project      : neon-for-cylinder-db
Project ID        : holy-glitter-02245694
Branch            : production
Branch ID         : br-steep-snow-aw6u5odt
Database          : neon-for-cylinder-db
Migration tool    : Flyway
Migration target  : V176
Migration status  : PENDING
```

This section must be updated whenever the authoritative project, branch, database, or required Flyway version changes.
