# BL-004 / STORY-0001 — JUnit Unit Test Contract

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: APPROVED
- Framework: JUnit 5
- Mocking: Mockito where required
- Backlog state: QUEUED
- Tracking issue: #2

## Human-readable test objective
Verify the approved Login Screen and Authentication Entry behavior at unit scope without using a real database. Each test must trace to behavior explicitly proved in STORY-0001.

## Components under unit test
1. `LoginController.showLoginPage`
2. `DailyLoginSuccessHandler.onAuthenticationSuccess`
3. `DailyLoginReportJpaDao` collaborator boundary as observed by the success handler
4. Spring Security username/password parameter configuration where directly unit-testable from the frozen configuration

## Required JUnit test cases

### UT-0001-01 — default login page
Given no `error` and no `logout` query parameter, when `showLoginPage` is invoked, then the returned view is `final-version-1/login` and neither status message is added.

### UT-0001-02 — invalid-login message
Given `error` is present, when the login page is requested, then model attribute `errorMessage` equals `Invalid username or password.` and the login view is returned.

### UT-0001-03 — logout message
Given `logout` is present, when the login page is requested, then model attribute `logoutMessage` equals `You have been successfully logged out.` and the login view is returned.

### UT-0001-04 — both query indications
Given both `error` and `logout` are present, verify both source-proved model branches execute without inventing precedence not present in the controller.

### UT-0001-05 — first successful login of the day
Given `DailyLoginReportJpaDao.existsByLoginDate(today)` returns false, when authentication succeeds, then exactly one `DailyLoginReportDo` is saved, its `loginTime` is non-null, the lookup is performed for the current date, and the success target is `/ownership-dashboard`.

### UT-0001-06 — subsequent successful login of the same day
Given the DAO reports a login record already exists for today, when authentication succeeds, then no new `DailyLoginReportDo` is saved and the success target remains `/ownership-dashboard`.

### UT-0001-07 — DAO interaction count
Verify the date-existence guard is evaluated once per success-handler invocation and save is conditional on the result.

### UT-0001-08 — entity data boundary
When a new daily-login report is created by the success handler, verify only source-proved fields are asserted: generated ID is not manufactured by the unit test and `loginTime` is populated.

## Not unit-tested here
Real PostgreSQL schema/table/sequence behavior, Flyway compatibility, JPA persistence visibility, authentication filter-chain HTTP behavior and actual database duplication checks belong to BL-005.

## Completion gate
BL-004 STORY-0001 is complete only when executable JUnit source exists, is executed in an available compatible runtime, and durable PASS/FAIL evidence is recorded. Generation alone is not execution completion.
