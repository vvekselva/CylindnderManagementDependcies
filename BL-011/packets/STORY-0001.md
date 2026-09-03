# BL-011 Human-Readable Test Packet — STORY-0001 Login

## Governance
- Source Story: `BL-002/stories/STORY-0001.md`
- Approval: `APPROVED_AFTER_REWORK`
- Conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Business behavior protected
The `/login` flow must render/handle the governed authentication entry behavior without silently changing the reapproved contract. The test packet protects the controller/service behavior, expected success/failure presentation, and any source-bound authentication validation while keeping historical and revised-contract evidence separate.

## Unit Test Story
Validate the login component with mocked dependencies: successful valid input, invalid credentials/input, null/empty/boundary values defined by the source contract, and governed error handling. No external database state should be mutated by a failed login attempt unless the approved Story explicitly requires an audit side effect.

Executable: `BL-004/generated-tests/STORY-0001/Story0001LoginUnitTest.java`.

## Integration Test Story
Exercise the source-bound login path across the MVC/service boundary with the real configured persistence/authentication dependencies available in the faithful runtime. Verify observable response/navigation and failure behavior.

Executable: `BL-005/generated-tests/STORY-0001/Story0001LoginIntegrationTest.java`.

## Test Data Story
Readable data: `BL-009/test-data/STORY-0001.md`; structured rows: `BL-009/test-data/STORY-0001.csv`.
Seven mapped rows exist. Historical data-contract execution has durable PASS evidence for 7 rows, but revised application-behavior execution remains `NOT EXECUTED`; that historical result is not promoted to revised-contract PASS.

## Use-case / E2E Story
**Given** a user reaches the login entry point, **when** valid or invalid authentication input is submitted/processed according to the approved Story, **then** the expected success or governed failure outcome is visible and no unapproved side effect occurs.

Catalogue: `BL-009/stories/STORY-0001.md`; executable mapping: `BL-009/generated-tests/STORY-0001/Story0001TestDataDrivenTest.java`.

## Evidence state
- Unit: generated/source-bound, `NOT EXECUTED`.
- Integration: generated/source-bound, `NOT EXECUTED` for the revised contract.
- Revised application behavior: `NOT EXECUTED`.
- Coverage: no revised-contract durable coverage evidence.
- Packet narrative/traceability: `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
