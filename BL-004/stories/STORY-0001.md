# BL-004 / STORY-0001 — JUnit Unit Test Contract

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: APPROVED
- Framework: JUnit 5
- Mocking: Mockito at unit boundaries
- Backlog state: SOURCE_BOUND_EXECUTION_BLOCKED
- Tracking issue: #2
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable test objective
Verify the approved Login Screen and Authentication Entry behavior at unit scope without a real database. Each assertion maps to source-proved STORY-0001 behavior.

## Exact frozen application bindings

### Login page controller
- Source: `cylinder.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/LoginController.java`
- Package: `com.sreyas.datamatics.cylindermanagement.web.controller.test`
- Class: `LoginController`
- Method: `showLoginPage(String error, String logout)`
- Frozen blob: `fd7403fa1c98c6402ca8ed33f3e80bbeaeef09ec`

### Authentication success handler
- Source: `cylinder.web/src/main/java/com/sreyas/datamatics/security/handler/DailyLoginSuccessHandler.java`
- Package: `com.sreyas.datamatics.security.handler`
- Method: `onAuthenticationSuccess(...)`
- Frozen blob: `976b4b1b7437c09edf7ca4e27bb75f61825f3519`

### Daily-login DAO/entity boundary
- DAO: `cylinder.application.jpa/src/main/java/com/sreyas/datamatics/application/jpa/dao/DailyLoginReportJpaDao.java`
- DAO package: `com.sreyas.datamatics.application.jpa.dao`
- DAO frozen blob: `dfe7f645800e8dc839acd7adb1b7b0ca86d2cb7c`
- Entity: `cylinder.application.jpa/src/main/java/com/sreyas/datamatics/application/jpa/entity/DailyLoginReportDo.java`
- Entity frozen blob: `d46127a9a908bc7d3e936f04bcf73aae5a2f0ea3`

## Generated source-bound JUnit file
`BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java`

The generated file now imports the exact frozen application packages and directly exercises `LoginController.showLoginPage`. Mockito injects the DAO collaborator into a testable `DailyLoginSuccessHandler` subclass so the save/no-save guard can be verified without a database.

## Required JUnit cases

### UT-0001-01 — default login page
No `error` and no `logout` returns `final-version-1/login` with no status-message model attributes.

### UT-0001-02 — invalid-login message
An error indication returns the login view and exact `errorMessage = Invalid username or password.`.

### UT-0001-03 — logout message
A logout indication returns the login view and exact `logoutMessage = You have been successfully logged out.`.

### UT-0001-04 — both query indications
Both source-proved controller branches execute; no precedence is invented.

### UT-0001-05 — first successful login of the day
When `existsByLoginDate` returns false, exactly one `DailyLoginReportDo` is passed to `save`, `loginTime` is non-null, the date guard runs once, and the configured target is `/ownership-dashboard`.

### UT-0001-06 — subsequent successful login of the same day
When the DAO reports an existing record, the date guard runs once, `save` is never called, and the target remains `/ownership-dashboard`.

## Runtime execution status
Source binding is complete. Actual JUnit execution is **not** represented as PASS or FAIL because the current ChatGPT execution runtime has Java 21 but no Maven dependency runner. This is an execution-runtime blocker, not a source-binding blocker.

## Completion gate
BL-004 STORY-0001 completes only after the source-bound JUnit test is executed in a compatible Maven/JUnit runtime and durable PASS/FAIL evidence is recorded. Generation/source binding alone is not execution completion.
