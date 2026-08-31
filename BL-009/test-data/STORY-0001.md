# BL-009 / STORY-0001 — Human-Readable Test Data

## Purpose and scope
This file is the human-readable companion to `BL-009/test-data/STORY-0001.csv` for approved STORY-0001. The CSV remains the machine-readable source. This companion preserves row-for-row semantic parity and explains how each governed row is intended to be exercised by executable testing.

No real password, token, personal data, or production secret is stored here. `<RUNTIME_AUTHORIZED_TEST_SECRET>` is a placeholder only and must be resolved at authorized runtime without persistence.

## Test data explanation
- `TD-0001-01` and `TD-0001-02` exercise client-side required-field blocking.
- `TD-0001-03` exercises the invalid-authentication branch and expects no daily-login row.
- `TD-0001-04` exercises logout feedback rendering and requires no credential.
- `TD-0001-05` exercises the first successful login of the day and expects one daily-login row plus dashboard navigation.
- `TD-0001-06` exercises a repeat successful login on the same day and expects no duplicate beyond the pre-existing single row.
- `TD-0001-07` exercises JPA persistence identity and non-null `login_time`.

## Test data table

| data_id | test_case | username | password | preexisting_daily_login | expected_authentication | expected_daily_login_rows | expected_visible_or_navigation_outcome | data_classification |
|---|---|---|---|---|---|---|---|---|
| TD-0001-01 | TC-0001-02 | *(blank)* | SyntheticValidPassword! | NO | CLIENT_BLOCKED | 0 | USERNAME_REQUIRED | SYNTHETIC_NON_SECRET |
| TD-0001-02 | TC-0001-03 | synthetic.user | *(blank)* | NO | CLIENT_BLOCKED | 0 | PASSWORD_REQUIRED | SYNTHETIC_NON_SECRET |
| TD-0001-03 | TC-0001-05 | synthetic.invalid | InvalidCredential! | NO | FAIL | 0 | INVALID_USERNAME_OR_PASSWORD | SYNTHETIC_NON_SECRET |
| TD-0001-04 | TC-0001-06 | N/A | N/A | N/A | N/A | N/A | LOGOUT_SUCCESS_MESSAGE | SYNTHETIC_NON_SECRET |
| TD-0001-05 | TC-0001-07 | synthetic.valid.first | `<RUNTIME_AUTHORIZED_TEST_SECRET>` | NO | SUCCESS | 1 | /ownership-dashboard | SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED |
| TD-0001-06 | TC-0001-08 | synthetic.valid.repeat | `<RUNTIME_AUTHORIZED_TEST_SECRET>` | YES | SUCCESS | 1 | /ownership-dashboard | SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED |
| TD-0001-07 | TC-0001-09 | synthetic.valid.persistence | `<RUNTIME_AUTHORIZED_TEST_SECRET>` | NO | SUCCESS | 1 | GENERATED_ID_AND_NON_NULL_LOGIN_TIME | SYNTHETIC_ID_RUNTIME_SECRET_NOT_STORED |

## Executable-code linkage
The seven CSV rows are consumed by `BL-009/generated-tests/STORY-0001/Story0001TestDataDrivenTest.java` for executable data-contract validation. Application-behavior PASS still requires the row's corresponding frozen-source-bound BL-004, BL-005, or authorized BL-009 runtime/UI test to execute successfully.

Current application-behavior linkage:
- TC-0001-01: BL-004 LoginController default-render unit test.
- TC-0001-02 / TD-0001-01: BL-009 data-driven row; browser required-field behavior requires runtime/UI execution.
- TC-0001-03 / TD-0001-02: BL-009 data-driven row; browser required-field behavior requires runtime/UI execution.
- TC-0001-04: password-toggle browser behavior requires runtime/UI execution.
- TC-0001-05 / TD-0001-03: BL-004 invalid-message branch; full authentication-failure behavior requires integration/runtime execution.
- TC-0001-06 / TD-0001-04: BL-004 logout-message branch.
- TC-0001-07 / TD-0001-05: BL-004 first-login handler branch plus BL-005 persistence/date-guard behavior.
- TC-0001-08 / TD-0001-06: BL-004 repeat-login no-save branch plus BL-005 date-guard behavior.
- TC-0001-09 / TD-0001-07: BL-005 generated-identity and `login_time` persistence behavior.

## Acceptance rule
This companion is complete only while it remains semantically identical to the CSV. Data-contract generation does not mark any application behavior PASS. Actual execution evidence and JaCoCo coverage evidence remain separate mandatory gates.