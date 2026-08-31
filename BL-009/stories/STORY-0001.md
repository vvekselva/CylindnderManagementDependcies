# BL-009 / STORY-0001 — Human-Readable Test Catalogue

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: APPROVED
- Unit-test backlog: BL-004
- Integration-test backlog: BL-005
- Live validation tracking: Issue #4
- Test-data file: `BL-009/test-data/STORY-0001.csv`

## Test intent
Validate the approved Login Screen and Authentication Entry contract from UI rendering through authentication branches and daily-login persistence.

## TC-0001-01 — Login page renders
**Given** the user navigates to `GET /login` without status parameters.  
**When** the controller renders the page.  
**Then** the view is `final-version-1/login`, the Username and Password controls are present, and Sign In submits to `/perform_login`.

## TC-0001-02 — Username required
**Given** Username is empty and Password has a value.  
**When** Sign In is attempted in the browser.  
**Then** HTML required validation blocks submission.

## TC-0001-03 — Password required
**Given** Password is empty and Username has a value.  
**When** Sign In is attempted.  
**Then** HTML required validation blocks submission.

## TC-0001-04 — Password visibility toggle
**Given** the Password input is masked.  
**When** the visibility button invokes `togglePw()`.  
**Then** input type toggles between `password` and `text` without submitting the form.

## TC-0001-05 — Invalid credentials
**Given** credentials are not accepted.  
**When** authentication fails through `/perform_login`.  
**Then** the user returns to the login page and sees `Invalid username or password.`; no daily-login report is created.

## TC-0001-06 — Logout feedback
**Given** logout completes and the login page receives the logout indication.  
**When** `GET /login` renders.  
**Then** the visible message is `You have been successfully logged out.`

## TC-0001-07 — First successful login of day
**Given** no daily-login record exists for the current date.  
**When** valid authentication succeeds.  
**Then** one `DailyLoginReportDo` is persisted to `public.tbl_daily_login_report`, `login_time` is non-null, and navigation proceeds to `/ownership-dashboard`.

## TC-0001-08 — Repeat successful login same day
**Given** a daily-login record already exists for today.  
**When** another valid authentication succeeds.  
**Then** no duplicate daily-login row is persisted and navigation proceeds to `/ownership-dashboard`.

## TC-0001-09 — Persistence identity
**Given** a new daily-login report is saved.  
**When** JPA persists it through the normal application path.  
**Then** the generated identifier uses the mapped `pk_daily_login_report_id`/sequence behavior and the row has the required `login_time`.

## Execution mapping
- BL-004 JUnit: TC-0001-01 controller branches, TC-0001-05/06 message branches, TC-0001-07/08 handler save/no-save branches.
- BL-005 JUnit + Testcontainers: TC-0001-05, TC-0001-07, TC-0001-08, TC-0001-09 with real PostgreSQL/Flyway/JPA behavior.
- Authorized live test data: TC-0001-01 through TC-0001-08 as environment permits, using sanitized credentials/data only.

## Pass rule
A test case is PASS only from executable evidence. This catalogue being present does not mark the tests executed.
