# STORY-0001 — Login Screen and Authentication Entry

- Release: R1
- Endpoint: `GET /login`
- Controller: `LoginController.showLoginPage`
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_APPROVED_AFTER_REWORK
- Approval state: APPROVED AFTER REWORK — EXPLICIT USER REAPPROVAL ON 2026-08-31
- Historical approval: Explicit user approval recorded on 2026-08-31 before the mandatory global business-behavior rework
- Current approval evidence: `BL-002/approval-evidence/STORY-0001-reapproval-20260831.md`
- Legacy enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## What this page is for

The Login page is the controlled entry point into the Cylinder Management application. Its business purpose is to make sure that only an authenticated user can enter protected operational functions such as ownership, cylinder movement, yard, customer, supplier and trip activities.

A user comes to this page when opening the application without an authenticated session, when explicitly navigating to `/login`, after a failed sign-in attempt, or after logging out.

The business outcome of a successful login is not merely that credentials are accepted: the user is admitted into the protected application and is directed to the ownership dashboard. The application also records at most one daily-login report for the current date so that the system has a durable daily usage/login marker without creating a duplicate row for every successful login on the same day.

## What the user sees and enters

The rendered page title is `Sign in to your account` and the subtitle is `Enter your credentials to continue`.

The user-facing controls are:

| Field/control | What the user does | Business meaning | Source-proved behavior |
|---|---|---|---|
| Username | Enters the application username | Identifies which application user is requesting access | Text input `id="username"`, submitted as `userName`, placeholder `Enter your username`, HTML `required`, `autofocus`, `autocomplete="username"` |
| Password | Enters the password for that username | Proves the user's credentials to the authentication system | Password input `id="password"`, submitted as `password`, placeholder `Enter your password`, HTML `required`, `autocomplete="current-password"` |
| Password visibility button | Shows or hides the entered password | Helps the user verify what was typed without changing the authentication value | `type="button"`; `togglePw()` switches the input between `password` and `text`; it does not submit |
| Sign In | Submits the credentials | Requests authenticated access to protected Cylinder Management functions | POSTs the form to `/perform_login` after browser-required validation succeeds |

The form has `autocomplete="off"` at form level while the credential inputs explicitly define their appropriate browser autocomplete semantics.

## Validation and why it matters

Both Username and Password are HTML `required` fields. This prevents an obviously incomplete sign-in request from being submitted by the browser and gives the user immediate local feedback.

No source-proved custom minimum length, debounce, AJAX credential lookup or client-side authentication API is defined on this page. Authentication correctness is therefore decided by Spring Security when the form is submitted, not by a client-side lookup.

This matters because credential validity must be determined by the security layer rather than by the page itself.

## What happens when the user clicks Sign In

The form posts to `POST /perform_login`. Spring Security binds the username from request parameter `userName` and the password from request parameter `password`.

### Successful authentication

On successful authentication, `DailyLoginSuccessHandler.onAuthenticationSuccess` runs.

1. It calculates the current local date.
2. It checks `DailyLoginReportJpaDao.existsByLoginDate(today)`.
3. The source-proved DAO guard uses `COUNT(d) > 0` with `CAST(d.loginTime AS date) = :today`.
4. If a report already exists for that date, no additional daily-login row is created.
5. If no report exists, a new `DailyLoginReportDo` is created with `loginTime = LocalDateTime.now()` and saved through JPA.
6. The authenticated user is then directed to `/ownership-dashboard` through the normal Spring Security success handling.

### Failed authentication

Spring Security returns the user to the login page with the error indication. `GET /login` accepts optional query parameter `error`; when present, the controller adds `errorMessage = Invalid username or password.`. The page renders that as a danger alert and applies the defined shake animation to the login card.

The business effect is that access is denied, no authenticated business session is granted, and the user is given a clear reason to retry the credentials.

### Logout outcome

`GET /login` also accepts optional query parameter `logout`. When present, the controller adds `logoutMessage = You have been successfully logged out.` and the page renders the success message. The user is therefore visibly informed that the protected session has ended.

## Exact read/write and persistence effect

`GET /login` itself does not write to the database. It renders `LOGIN_FORM_VIEW`, whose frozen value is `final-version-1/login`, and optionally supplies the error/logout feedback attributes.

The only persistence described by this page-level business flow occurs after successful authentication through the daily-login success handler.

The persistent identity is:

- JPA entity: `DailyLoginReportDo`
- Table: `public.tbl_daily_login_report`
- Primary key: `pk_daily_login_report_id`
- Sequence: `public.pk_daily_login_id_serial`, allocation size 1
- Required timestamp column: `login_time`, `nullable=false`
- Migration evidence: `V1__DailyLogin.sql`

The daily-exists guard prevents multiple successful logins on the same calendar date from creating duplicate daily-login report rows.

## Downstream business impact

A successful authentication enables the user to proceed to the protected Cylinder Management application. The default successful landing page is `/ownership-dashboard`.

The daily-login record provides a system-level daily usage marker. Because the guard is date-based, repeated successful sign-ins on the same date do not inflate that report with duplicate daily rows.

A failed authentication has the opposite business effect: the user remains outside protected application functions.

## Related operations rendered or represented by this page

Although this registered Story is `GET /login`, the page contains and explains the embedded authentication action performed by `POST /perform_login`. The POST processing is handled by Spring Security rather than a separate business controller method, so the page Story includes the submit behavior instead of describing only the GET render.

The page also represents the result of the logout flow through its optional `logout` branch.

## Reference-selector UX review

The mandatory reference-selector review was performed for Customer, Product, Supplier, Vehicle, Driver, Address and other large business-reference controls.

**Result: NOT APPLICABLE.** This page contains credential fields only. Username and Password are authentication inputs, not business-reference selectors, so no static-list-to-search-box conversion or dependent-selector rework is required for STORY-0001.

## Current-state versus required-state assessment

No user-requested functional or selector UX change is currently identified for the Login page. The rework changes the Story contract/documentation so that it explains the complete user/business behavior, persistence impact and visible outcomes; it does not claim an application-code change.

## Approval and testing gate

The current revised STORY-0001 contract was explicitly reapproved by the user on 2026-08-31 with the instruction `Approved, Fanout Now`.

The Story is therefore **APPROVED_AFTER_REWORK**. Revised BL-004 unit-test, BL-005 PostgreSQL Testcontainers integration-test, and BL-009 catalogue/test-data/executable validation fan-out is authorized immediately. Fan-out authorization does not imply execution, PASS, or JaCoCo coverage; those require separate durable downstream evidence.
