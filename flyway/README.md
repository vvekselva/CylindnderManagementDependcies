# Flyway Migration Scripts

This folder is reserved for the CylinderManagement Flyway SQL migration scripts.

## Rules

- Store Flyway migration SQL files in this folder.
- Use Flyway versioned naming, for example `V176__Description.sql`.
- Do not place database passwords, Neon connection strings, or other secrets in this folder.
- Do not paste migration SQL into `database-dependency.md`.
- Every database change implemented by a Flyway script must also be recorded in the Database Change Ledger in `database-dependency.md`.
- Applied migrations must not be silently rewritten; introduce a new migration version for subsequent changes.
- The authoritative deployment target and Neon branch purpose are documented in `database-dependency.md`.

Current baseline target: **V176**.
Current production database: **`neon-for-cylinder-db`** on Neon branch **`production`**.
