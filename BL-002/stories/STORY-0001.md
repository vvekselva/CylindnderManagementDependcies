# STORY-0001 — Login Screen and Authentication Entry

- Release: R1
- Endpoint: `GET /login`
- Controller: `LoginController.showLoginPage`
- Approval: APPROVED
- Approval source: Explicit user approval in ChatGPT on 2026-08-31
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-integrity correction

The canonical `BL-002/story-register.csv` maps STORY-0001 to R1 `GET /login` in the Authentication / Login functional area. The previously materialized physical file incorrectly described `GET /offline-map/status`, which belongs to STORY-0002. This artifact is corrected to the canonical registered endpoint before strict enrichment; physical parity remains 134/134 because the Story file already existed.

## Screen entry and controller contract

`GET /login` is handled by `LoginController.showLoginPage`. It accepts two optional query parameters, `error` and `logout`. The controller renders `LOGIN_FORM_VIEW`, whose frozen constant value is `final-version-1/login`. If `error` is present it adds model attribute `errorMessage` with visible text `Invalid username or password.`; if `logout` is present it adds `logoutMessage` with visible text `You have been successfully logged out.`. Neither branch performs a database write.

Spring Security explicitly permits `/login`. Other non-whitelisted business requests require authentication. The configured form-login page is `/login`, and the authentication processing endpoint is `POST /perform_login`.

## Exact visible controls and browser behavior

The rendered page title is `Sign in to your account` and the subtitle is `Enter your credentials to continue`. The form posts to `/perform_login` using HTTP POST and has `autocomplete="off"`.

Visible authentication controls are:

- `Username`: text input `id="username"`, request/form field `name="userName"`, placeholder `Enter your username`, HTML `required`, `autofocus`, and `autocomplete="username"`.
- `Password`: password input `id="password"`, request/form field `name="password"`, placeholder `Enter your password`, HTML `required`, and `autocomplete="current-password"`.
- Password visibility button: `type="button"`, invoking `togglePw()`. It changes the password input type between `password` and `text` and changes the displayed icon between the hidden/visible states. It does not submit the form.
- `Sign In`: submit button that performs the form POST after browser-required validation succeeds.

No custom minimum-length, debounce, AJAX credential lookup, or client-side authentication API is defined in this template. The browser's HTML `required` constraints are the source-proved local validation for the two credential fields. An error model attribute renders a danger alert; a logout model attribute renders a success alert. When an error alert is present, page JavaScript applies the defined shake animation to the login card.

## Authentication binding, branch behavior and persistence

Spring Security binds the processing endpoint's username parameter from `userName` and password parameter from `password`. Authentication itself is handled by the configured Spring Security form-login flow rather than by `LoginController`. On failed authentication, Spring Security returns to the configured login page with the error indication consumed by the controller's optional `error` parameter; the controller then renders the invalid-credentials message. Logout is permitted and its login-page indication is consumed by optional `logout` to render the successful-logout message.

On successful authentication, `DailyLoginSuccessHandler.onAuthenticationSuccess` is invoked. It calculates the current local date and calls `DailyLoginReportJpaDao.existsByLoginDate(today)`. The DAO query proves the guard as `COUNT(d) > 0` where `CAST(d.loginTime AS date) = :today`. If a login report already exists for that date, no new report is saved. Otherwise the handler creates `DailyLoginReportDo`, sets `loginTime` to `LocalDateTime.now()`, and saves it through the JPA repository. It then sets the default target URL to `/ownership-dashboard` and delegates to the normal Spring Security success handling.

The exact persistent identity is JPA entity `DailyLoginReportDo` mapped to `public.tbl_daily_login_report`. Its generated identifier is column `pk_daily_login_report_id`, backed by sequence `public.pk_daily_login_id_serial` with allocation size 1; the required timestamp is column `login_time` (`nullable=false`). Frozen migration `V1__DailyLogin.sql` creates `public.tbl_daily_login_report` with `pk_daily_login_report_id` and `login_time timestamp NOT NULL`, a uniqueness constraint on the ID, and creates sequence `public.pk_daily_login_id_serial`.

The GET story therefore proves the login screen's entry path, exact rendered template, query branches, credential controls, browser behavior, authentication POST binding, failure/logout feedback, successful-authentication daily-report guard and conditional persistence, exact JPA/table/column/sequence identity, and successful redirect target.

## Approval and downstream testing

STORY-0001 was explicitly approved by the user on 2026-08-31. Approval fans out to BL-004 JUnit unit-test generation, BL-005 JUnit/Testcontainers integration-test creation, and BL-009 human-readable test-case/test-data generation. This approval applies only to STORY-0001 and does not auto-approve any other Story.
