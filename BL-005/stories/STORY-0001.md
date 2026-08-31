# BL-005 / STORY-0001 — JUnit Testcontainers Integration Contract

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: APPROVED
- Framework: JUnit 5
- Database runtime: PostgreSQL Testcontainers
- Backlog state: QUEUED
- Tracking issue: #3

## Human-readable objective
Verify the approved login/authentication flow against a disposable PostgreSQL container using the application's normal Spring/Flyway/JPA path.

## Required cases
- IT-0001-01: application context starts against PostgreSQL Testcontainer and normal migrations succeed.
- IT-0001-02: `public.tbl_daily_login_report` is available through the mapped JPA path.
- IT-0001-03: first successful login of a day creates exactly one daily-login row with non-null `login_time`.
- IT-0001-04: a second successful login on the same day creates no duplicate daily-login row.
- IT-0001-05: invalid authentication creates no daily-login row.
- IT-0001-06: successful authentication resolves to `/ownership-dashboard` where the integration boundary exposes the redirect.
- IT-0001-07: generated identifier/sequence behavior works through JPA without manual ID fabrication.

## Data isolation
Each execution uses disposable container data. No external hosted database and no GitHub Actions/runners are permitted.

## Completion gate
Generated source alone is not PASS. The test must be bound into the actual application test source set, executed against Testcontainers, and durable evidence must record container version, migrations, tests run, failures and result.
