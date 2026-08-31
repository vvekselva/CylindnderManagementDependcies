# BL-009 / STORY-0001 — Human-Readable Test Catalogue

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: `APPROVED_AFTER_REWORK` — explicit user reapproval recorded 2026-08-31
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Test-data file: `BL-009/test-data/STORY-0001.csv`
- Human-readable data: `BL-009/test-data/STORY-0001.md`
- Executable mapping: `BL-009/generated-tests/STORY-0001/Story0001TestDataDrivenTest.java`

## Test intent
Validate the reapproved Login Screen and Authentication Entry contract from UI rendering through Spring Security outcomes and daily-login persistence.

## TC-0001-01 — Login page renders
**Given** the user navigates to `GET /login` without status parameters.  
**When** the controller renders the page.  
**Then** the view is `final-version-1/login`, Username and Password controls are present, and Sign In submits to `/perform_login`.

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
**When** `togglePw()` is invoked.  
**Then** input type toggles between `password` and `text` without submitting the form.

## TC-0001-05 — Invalid credentials
**Given** credentials are not accepted.  
**When** authentication fails through `/perform_login`.  
**Then** the user returns to the login page and sees `Invalid username or password.`; no successful-authentication daily-login record is created.

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
**Then** the generated identifier follows the mapped `pk_daily_login_report_id` / `public.pk_daily_login_id_serial` identity and the row has required `login_time`.

## Execution mapping
The seven machine-readable data rows cover TC-0001-02/03/05/06/07/08/09. TC-0001-01 and TC-0001-04 have no dedicated CSV row because they require no variable business data; they remain executable UI/controller scenarios. BL-004 binds controller/handler branches; BL-005 binds PostgreSQL/Flyway/JPA persistence; BL-009 maps governed data rows to executable case IDs.

## Pass rule
Reconciliation/generation is not PASS. Application behavior and JaCoCo coverage require actual execution against the frozen source with the faithful JUnit/PostgreSQL runtime.
