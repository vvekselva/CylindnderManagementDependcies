# BL-011 Human-Readable Test Packet — STORY-0001 Login Screen and Authentication Entry

## Rework state
Reworked under the BL-011 code-required policy. Explanation-only or path-only evidence is not sufficient.

## Reviewer-readable business/test narrative
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
Source package: verified frozen/recovered Cylinder application source.
File: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/test/LoginController.java`

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

## Unit Test Story + Code — BL-004
Executable: `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java`

```java
    private TestableDailyLoginSuccessHandler successHandler;

    @Test
    @DisplayName("STORY-0001 UT-01: default login request renders configured login view without messages")
    void defaultLoginRequestRendersConfiguredLoginViewWithoutMessages() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage(null, null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertFalse(result.getModel().containsKey("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-02: error query adds exact invalid-credential message")
    void errorQueryAddsExactInvalidCredentialMessage() {
        LoginController controller = new LoginController();

        ModelAndView result = controller.showLoginPage("present", null);

        assertEquals(LOGIN_VIEW, result.getViewName());
        assertEquals(ERROR_MESSAGE, result.getModel().get("errorMessage"));
        assertFalse(result.getModel().containsKey("logoutMessage"));
    }

    @Test
    @DisplayName("STORY-0001 UT-03: logout query adds exact logout message")
```

The unit-test excerpt above is the executable evidence for mocked/component-level behavior. It must be read with the narrative's positive, negative, boundary and duplicate/idempotency rules where applicable.

## Integration Test Story + Code — BL-005
Executable: `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java`

```java
@DataJpaTest
@ContextConfiguration(classes = TestApplication.class)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class Story0001LoginIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16")
            .withEnv("TZ", "Asia/Kolkata")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        POSTGRES.start();
        registry.add("spring.datasource.url",
                () -> POSTGRES.getJdbcUrl() + "?options=-c%20TimeZone%3DAsia%2FKolkata");
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Configuration
    static class FlywayConfig {
        @Bean(initMethod = "migrate")
        Flyway flyway() {
            return Flyway.configure()
                    .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                    .locations("classpath:db/migration")
```

The integration excerpt shows the real-layer/database/container test implementation where applicable. Generated code does not imply it executed.

## Test Data / Executable Mapping Code — BL-009
Executable: `BL-009/generated-tests/STORY-0001/Story0001TestDataContractRunner.java`

```java
package bl009.story0001;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dependency-free Java 21 substitution runner for the BL-009 STORY-0001
 * test-data CONTRACT only. This does not replace JUnit 5 application tests,
 * does not exercise the Cylinder application, and must never be treated as
 * application-behavior PASS or JaCoCo coverage evidence.
 */
public final class Story0001TestDataContractRunner {
    private static final String[] HEADER = {
        "data_id", "test_case", "username", "password", "preexisting_daily_login",
        "expected_authentication", "expected_daily_login_rows",
        "expected_visible_or_navigation_outcome", "data_classification"
    };

    private record Expected(
        String testCase,
        String preexisting,
        String authentication,
        String rows,
```

Readable/CSV test data remains governed under `BL-009/test-data/STORY-0001.md` and `BL-009/test-data/STORY-0001.csv` when present.

## Code-path trace
BL-002 approved Story -> frozen production code above -> BL-004 unit code -> BL-005 integration code -> BL-009 data/use-case mapping -> BL-011 reviewer packet.

## Execution and coverage
- Packet/code rework: `COMPLETE`
- Unit execution: `NOT EXECUTED`
- Integration execution: `NOT EXECUTED`
- Application/E2E execution: `NOT EXECUTED`
- Durable coverage evidence: `NONE`
- Coverage percentage: `NOT INFERRED`

## BL-011 validation
Validated against the code-required `BL-011/README.md` and `BL-011/human-readable-testing-policy.yaml`. The packet contains actual inline production code and governed BL-004/005/009 code evidence; code presence is not treated as execution evidence.

Status: `HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`.
