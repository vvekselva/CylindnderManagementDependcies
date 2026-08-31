# BL-005 / STORY-0001 — JUnit Testcontainers Integration Contract

- Source Story: `BL-002/stories/STORY-0001.md`
- Release: R1
- Approval: APPROVED
- Framework: JUnit 5
- Database runtime: PostgreSQL Testcontainers
- Backlog state: SOURCE_BOUND_EXECUTION_BLOCKED
- Tracking issue: #3
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable objective
Verify the approved login persistence contract against a disposable PostgreSQL container using the application's existing Spring/Flyway/JPA Testcontainers pattern. Security/HTTP-visible behavior remains separately traceable to the web module and is not falsely represented as executed by this JPA integration class.

## Exact frozen source bindings

### Existing integration-test convention
- `cylinder.application.jpa/src/test/java/com/sreyas/datamatics/application/jpa/dao/integration/tests/DailyLoginReportJpaDaoIntegrationTest.java`
- Package: `com.sreyas.datamatics.application.jpa.dao.integration.tests`
- Frozen blob: `9626e0700b5f87a2f9a8a3901d61c1aa29ffd798`
- Uses JUnit 5, `@DataJpaTest`, `@Testcontainers`, PostgreSQL `postgres:16`, `DynamicPropertySource`, and a Flyway bean with `classpath:db/migration`.

### DAO/entity
- DAO: `cylinder.application.jpa/src/main/java/com/sreyas/datamatics/application/jpa/dao/DailyLoginReportJpaDao.java`
- DAO frozen blob: `dfe7f645800e8dc839acd7adb1b7b0ca86d2cb7c`
- Entity: `cylinder.application.jpa/src/main/java/com/sreyas/datamatics/application/jpa/entity/DailyLoginReportDo.java`
- Entity frozen blob: `d46127a9a908bc7d3e936f04bcf73aae5a2f0ea3`
- Entity maps `public.tbl_daily_login_report`, generated sequence `public.pk_daily_login_id_serial`, and non-null `login_time`.
- DAO date guard is `COUNT(d) > 0` where `CAST(d.loginTime AS date) = :today`.

### Existing Testcontainers configuration
- `cylinder.application.jpa/src/test/resources/testcontainers.properties`
- Frozen blob: `0c09c2f4a82bea6002e2ee6f929f4cb62aada101`

## Generated source-bound integration file
`BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java`

It now follows the frozen application's existing DataJpaTest/Testcontainers/Flyway structure rather than using a generic standalone container check.

## Source-bound cases

### IT-0001-01 — migration/JPA/generated-identity path
Start PostgreSQL Testcontainers, run normal Flyway migrations, persist `DailyLoginReportDo` without manually assigning its ID, and verify the generated ID and non-null login time are readable through the DAO.

### IT-0001-02 — current-date guard
Before a current-day record exists, `existsByLoginDate(today)` must be false. After persisting a current-day record it must be true.

### IT-0001-03 — date boundary
A record dated yesterday must not satisfy today's `existsByLoginDate(today)` query.

## Story-level integration cases still requiring web/security execution
The approved Story also requires invalid-authentication/no-write behavior, successful authentication, same-day no-duplicate behavior through `DailyLoginSuccessHandler`, and `/ownership-dashboard` navigation. Those remain part of BL-005's Story-level completion gate; the JPA source-bound test above does not pretend to execute the Spring Security HTTP flow.

## Runtime execution status
Actual execution is blocked in the current ChatGPT runtime because Maven is unavailable and Docker/Testcontainers runtime is unavailable. Java 21 is available. No PASS/FAIL is inferred.

## Completion gate
BL-005 STORY-0001 completes only when its source-bound integration tests and required security/HTTP integration cases are executed in a compatible Maven + Docker/Testcontainers runtime and durable PASS/FAIL evidence is recorded.
