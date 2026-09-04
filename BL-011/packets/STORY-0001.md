# BL-011 Human-Readable Test Packet — STORY-0001 Login Screen and Authentication Entry

## Rework state
Reworked under the mandatory per-test-case adjacent-code rule.

## Business behavior and scope
## 1. Story, approval, conformance and source
- Source Story: `BL-002/stories/STORY-0001.md`
- Approval: `APPROVED_AFTER_REWORK` (explicit reapproval 2026-08-31)
- Approval evidence: `BL-002/approval-evidence/STORY-0001-reapproval-20260831.md`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Source anchors verified in recovered local source:
  - `LoginController.showLoginPage(error, logout)`
  - `DailyLoginSuccessHandler.onAuthenticationSuccess(...)`
  - `DailyLoginReportJpaDao.existsByLoginDate(...)`
  - `DailyLoginReportDo`

## 2. Business behavior protected
The Login page is the controlled entry point to protected Cylinder Management functions. `GET /login` renders `final-version-1/login`. If the request contains `error`, the page shows `Invalid username or password.`; if it contains `logout`, it shows `You have been successfully logged out.`.

Credential submission is handled by Spring Security at `POST /perform_login`. On successful authentication, `DailyLoginSuccessHandler` checks whether today's daily-login report already exists. If not, it persists one row with a non-null login timestamp. It then targets `/ownership-dashboard`. Repeated successful logins on the same date must not create additional daily-login rows.

## 3. Preconditions and test inputs
- A user may open the Login page with no query parameters, `?error`, `?logout`, or both indicators.
- Username and password fields are browser-required inputs; empty values are client-blocked in the intended UI flow.
- Authentication credentials used in runtime tests must be synthetic/authorized; no real password is stored in BL-009 data.
- Integration tests require PostgreSQL 16, Flyway migrations, JPA and Testcontainers.
- Database isolation requires the daily-login table to be cleared before each persistence scenario.

## 4. Unit Test Story — BL-004
Executable: `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java`.

### UT-01 — Default page render
**Given** no error/logout query parameter, **when** `showLoginPage(null, null)` runs, **then** the exact login view is returned and neither message attribute exists.

### UT-02 — Invalid authentication feedback
**Given** the error indicator is present, **when** the login page is rendered, **then** `errorMessage` equals `Invalid username or password.` and the logout message is absent.

### UT-03 — Logout feedback
**Given** the logout indicator is present, **when** the page is rendered, **then** `logoutMessage` equals `You have been successfully logged out.` and the error message is absent.

### UT-04 — Both source-proved branches
If both indicators are supplied, both controller branches execute and both model messages are present. This protects exact current-source behavior without inventing mutual exclusion.

### UT-05 — First successful login today
**Given** `existsByLoginDate(today)` returns false, **when** authentication succeeds, **then** one `DailyLoginReportDo` is saved, its `loginTime` is non-null, and the success target is `/ownership-dashboard`.

### UT-06 — Repeat successful login same day
**Given** today's login report already exists, **when** authentication succeeds again, **then** the DAO existence check occurs but `save` is not called; navigation still targets `/ownership-dashboard`.

**Mocked dependencies:** DAO, servlet request/response and Spring Security `Authentication`.  
**Expected persistence:** only UT-05 models a write; UT-01..04 are read/render-only; UT-06 explicitly proves no duplicate save.

## 5. Integration Test Story — BL-005
Executable: `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java`.

Environment: PostgreSQL 16 Testcontainers, Asia/Kolkata time zone, Flyway migrations, real JPA DAO.

### IT-01 — Generated identity and login timestamp
Insert a new `DailyLoginReportDo` through the real DAO and flush. Expected: generated primary key, non-null `loginTime`, and row retrievable by ID.

### IT-02 — Today's date guard changes after persistence
Start with no rows. Expected `existsByLoginDate(today)=false`. Persist today's row. Expected the same query to return true.

### IT-03 — Boundary across calendar date
Persist a row timestamped yesterday. Expected `existsByLoginDate(LocalDate.now())=false`. This protects the date-scoped duplicate guard instead of merely checking that any historical row exists.

**Database outcome:** exactly the seeded/persisted rows for each isolated case; no manual SQL or H2 substitution is part of the governed integration path.

## 6. Test Data Story — BL-009
Human-readable data: `BL-009/test-data/STORY-0001.md`; structured data: `BL-009/test-data/STORY-0001.csv`; executable data-contract mapping: `BL-009/generated-tests/STORY-0001/Story0001TestDataDrivenTest.java`.

Seven governed rows cover:
1. blank username → browser/client blocked, zero daily-login writes;
2. blank password → browser/client blocked, zero writes;
3. invalid credentials → authentication failure, zero writes, invalid-credential outcome;
4. logout feedback → success message, no credential required;
5. first valid login today → success target `/ownership-dashboard`, one daily-login row;
6. repeated valid login same day → success target with row count remaining one;
7. persistence identity → generated ID plus non-null login timestamp.

**Boundary/duplicate rule:** repeated successful login on the same date is the business duplicate/idempotency scenario.  
**Security rule:** successful rows use `<RUNTIME_AUTHORIZED_TEST_SECRET>`; no production secret is stored.

## 7. Use-case / End-to-End Test Story
**Given** an unauthenticated user reaches the Login page, **when** the user supplies valid credentials and authentication succeeds, **then** protected access is granted, the user is routed to `/ownership-dashboard`, and at most one daily-login report exists for that calendar date.

**Given** invalid credentials, **when** Spring Security returns the user to `/login?error`, **then** the page shows the exact invalid-credential message and no successful authenticated-session outcome is claimed.

**Given** the user has logged out, **when** `/login?logout` is rendered, **then** the logout-success message is visible.

Browser-required-field behavior and the password-visibility toggle require UI/runtime evidence; their existence in the Story/test-data catalogue does not mean they have been executed.

## 8. Traceability
- BL-002: `STORY-0001.md`
- BL-004: `Story0001LoginUnitTest.java`
- BL-005: `Story0001LoginIntegrationTest.java`
- BL-009 catalogue/data: `BL-009/stories/STORY-0001.md`, `BL-009/test-data/STORY-0001.md`, `STORY-0001.csv`
- BL-009 executable data mapping: `Story0001TestDataDrivenTest.java`

## 9. Execution and coverage status
- Unit test execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- UI/application-behavior execution: `NOT EXECUTED`
- Durable JaCoCo evidence: `NONE`
- Coverage percentage: `NOT INFERRED`
Generated source and data-contract mapping are preparation evidence only.

## 10. BL-011 validation outcome
Validated against `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`: business behavior, preconditions, inputs, validation, happy/negative/boundary/duplicate scenarios, API/UI/database outcomes, executable references, four-backlog traceability, and execution/coverage separation are present.

Status: `HUMAN_READABLE_TEST_PACKET_REWORKED_AND_VALIDATED`.

## Production Code Evidence
```java
@GetMapping("/login")
public ModelAndView showLoginPage(@RequestParam(value = "error", required = false) String error,
        @RequestParam(value = "logout", required = false) String logout) {
    ModelAndView modelAndView = new ModelAndView(LOGIN_FORM_VIEW);
    if (error != null) {
        modelAndView.addObject("errorMessage", "Invalid username or password.");
    }
    if (logout != null) {
        modelAndView.addObject("logoutMessage", "You have been successfully logged out.");
    }
    return modelAndView;
}
```

## BL-004 Unit Test Cases
### defaultLoginRequestRendersConfiguredLoginViewWithoutMessages

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#defaultLoginRequestRendersConfiguredLoginViewWithoutMessages`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `defaultLoginRequestRendersConfiguredLoginViewWithoutMessages()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-01: default login request renders configured login view without messages")
    void defaultLoginRequestRendersConfiguredLoginViewWithoutMessages() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage(null, null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertFalse(result.getModel().containsKey("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }
```

### errorQueryAddsExactInvalidCredentialMessage

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#errorQueryAddsExactInvalidCredentialMessage`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `errorQueryAddsExactInvalidCredentialMessage()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-02: error query adds exact invalid-credential message")
    void errorQueryAddsExactInvalidCredentialMessage() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage("present", null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertEquals(ERROR_MESSAGE, result.getModel().get("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }
```

### logoutQueryAddsExactLogoutMessage

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#logoutQueryAddsExactLogoutMessage`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `logoutQueryAddsExactLogoutMessage()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-03: logout query adds exact logout message")
    void logoutQueryAddsExactLogoutMessage() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage(null, "present");

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertEquals(LOGOUT_MESSAGE, result.getModel().get("logoutMessage"));
        assertFalse(result.getModel().containsKey("errorMessage"));
    }
```

### errorAndLogoutIndicationsExecuteBothSourceProvedBranches

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#errorAndLogoutIndicationsExecuteBothSourceProvedBranches`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `errorAndLogoutIndicationsExecuteBothSourceProvedBranches()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-04: error and logout indications execute both source-proved branches")
    void errorAndLogoutIndicationsExecuteBothSourceProvedBranches() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage("present", "present");

        assertEquals(ERROR_MESSAGE, result.getModel().get("errorMessage"));
        assertEquals(LOGOUT_MESSAGE, result.getModel().get("logoutMessage"));
    }
```

### firstSuccessfulLoginOfDaySavesOneReportAndTargetsDashboard

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#firstSuccessfulLoginOfDaySavesOneReportAndTargetsDashboard`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `firstSuccessfulLoginOfDaySavesOneReportAndTargetsDashboard()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-05: first successful login of day saves one report and targets dashboard")
    void firstSuccessfulLoginOfDaySavesOneReportAndTargetsDashboard() throws Exception {
        when(dailyLoginReportJpaDao.existsByLoginDate(any(LocalDate.class))).thenReturn(false);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        ArgumentCaptor<LocalDate> dateCaptor = ArgumentCaptor.forClass(LocalDate.class);
        verify(dailyLoginReportJpaDao, times(1)).existsByLoginDate(dateCaptor.capture());
        assertEquals(LocalDate.now(), dateCaptor.getValue());

        ArgumentCaptor<DailyLoginReportDo> reportCaptor = ArgumentCaptor.forClass(DailyLoginReportDo.class);
        verify(dailyLoginReportJpaDao, times(1)).save(reportCaptor.capture());
        assertNotNull(reportCaptor.getValue().getLoginTime());
        assertEquals(SUCCESS_TARGET, successHandler.exposedDefaultTargetUrl());
    }
```

### laterSuccessfulLoginSameDayDoesNotSaveDuplicate

**Layer:** BL-004  
**Executable:** `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java#laterSuccessfulLoginSameDayDoesNotSaveDuplicate`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `laterSuccessfulLoginSameDayDoesNotSaveDuplicate()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 UT-06: later successful login same day does not save duplicate")
    void laterSuccessfulLoginSameDayDoesNotSaveDuplicate() throws Exception {
        when(dailyLoginReportJpaDao.existsByLoginDate(any(LocalDate.class))).thenReturn(true);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        verify(dailyLoginReportJpaDao, times(1)).existsByLoginDate(any(LocalDate.class));
        verify(dailyLoginReportJpaDao, never()).save(any(DailyLoginReportDo.class));
        assertEquals(SUCCESS_TARGET, successHandler.exposedDefaultTargetUrl());
    }
```


## BL-005 Integration Test Cases
### normalFlywayJpaPathPersistsGeneratedDailyLoginIdentity

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java#normalFlywayJpaPathPersistsGeneratedDailyLoginIdentity`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `normalFlywayJpaPathPersistsGeneratedDailyLoginIdentity()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 IT-01: normal Flyway/JPA path persists generated daily-login identity")
    void normalFlywayJpaPathPersistsGeneratedDailyLoginIdentity() {
        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now());

        DailyLoginReportDo saved = dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(saved.getDailyLoginReportId()).isNotNull();
        assertThat(saved.getLoginTime()).isNotNull();
        assertThat(dailyLoginReportJpaDao.findById(saved.getDailyLoginReportId())).isPresent();
    }
```

### dateGuardReflectsPersistedLoginForToday

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java#dateGuardReflectsPersistedLoginForToday`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `dateGuardReflectsPersistedLoginForToday()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 IT-02: date guard is false before today's login and true after persistence")
    void dateGuardReflectsPersistedLoginForToday() {
        LocalDate today = LocalDate.now();
        assertThat(dailyLoginReportJpaDao.existsByLoginDate(today)).isFalse();

        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now());
        dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(dailyLoginReportJpaDao.existsByLoginDate(today)).isTrue();
    }
```

### yesterdayLoginDoesNotSatisfyTodayDateGuard

**Layer:** BL-005  
**Executable:** `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java#yesterdayLoginDoesNotSatisfyTodayDateGuard`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `yesterdayLoginDoesNotSatisfyTodayDateGuard()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 IT-03: yesterday's login does not satisfy today's date guard")
    void yesterdayLoginDoesNotSatisfyTodayDateGuard() {
        DailyLoginReportDo report = new DailyLoginReportDo();
        report.setLoginTime(LocalDateTime.now().minusDays(1));
        dailyLoginReportJpaDao.saveAndFlush(report);

        assertThat(dailyLoginReportJpaDao.existsByLoginDate(LocalDate.now())).isFalse();
    }
```


## BL-009 Test Data / Use-case Cases
### shouldContainGovernedRows

**Layer:** BL-009  
**Executable:** `BL-009/generated-tests/STORY-0001/Story0001TestDataDrivenTest.java#shouldContainGovernedRows`  
**Business objective:** Verify this exact governed test case.  
**Preconditions / input:** The adjacent code is the authoritative setup and data.  
**Action:** Execute `shouldContainGovernedRows()`.  
**Expected result:** The assertions in this same method define the expected outcome.  
**Persistence / side effects:** Only behavior explicitly asserted here is claimed.  
**Execution status:** `NOT EXECUTED`

```java
@Test
    @DisplayName("STORY-0001 has seven governed data rows")
    void shouldContainGovernedRows() throws IOException {
        List<TestRow> rows = readRows();
        assertEquals(7, rows.size());
        assertEquals("TD-0001-01", rows.get(0).dataId());
        assertEquals("TD-0001-07", rows.get(rows.size() - 1).dataId());
    }
```


## Traceability
BL-002 -> production source -> BL-004 -> BL-005 -> BL-009 -> BL-011.

## Execution and coverage
Packet rework `COMPLETE_PER_CASE_CODE`; all execution `NOT EXECUTED`; durable coverage `NONE`; coverage `NOT INFERRED`.

## Validation
Every executable JUnit test method has adjacent code in its own case section.

Status: `HUMAN_READABLE_TEST_PACKET_PER_CASE_CODE_COMPLETE`.
