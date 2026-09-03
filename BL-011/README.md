# BL-011 — Human-Readable Testing Stories, Test Data and Test Cases

## Purpose

BL-011 is the single umbrella backlog for converting technical testing assets into user-readable, business-readable stories. It covers unit tests, integration tests, test data, and use-case/end-to-end test cases in one governed backlog.

The intent is that a reviewer who does not read Java/JUnit/SQL can understand what is being tested, why it matters, which business rule is protected, what data is used, what result is expected, and which executable evidence proves it.

## Scope

Every eligible approved/reapproved BL-002 Story that passes the required conformance gates can produce the following BL-011 artifacts as applicable:

1. **Unit Test Story** — human-readable explanation of the class/method/business rule under unit test, dependencies mocked/stubbed, input conditions, expected result, negative/boundary behavior, and executable test reference.
2. **Integration Test Story** — human-readable explanation of the participating layers/components, database/container dependencies, setup, transaction/data flow, expected persistence/response behavior, failure behavior, and executable integration-test reference.
3. **Test Data Story** — readable description of prerequisite/master/transaction data, valid data, invalid data, boundary data, duplicate/conflict data, null/empty data, identifiers, expected database state, and cleanup/isolation requirements.
4. **Use-case / End-to-End Test Story** — readable Given/When/Then-style business scenario spanning the relevant controller/service/DAO/UI/database path, expected observable outcome, and mapped executable/catalogue evidence.

## Mandatory content for every human-readable test story

Each generated story must identify, when applicable:

- source BL-002 Story ID and approval/reapproval evidence;
- business behavior being protected;
- preconditions;
- actor or calling component;
- input/test data in readable terms;
- validation/business rules exercised;
- happy-path scenario;
- negative/error scenarios;
- boundary scenarios;
- duplicate/conflict/idempotency scenarios where relevant;
- expected service/API/UI response;
- expected database/persistence state;
- expected exception/error classification where relevant;
- mocked versus real dependencies;
- executable test class/method or catalogue case reference;
- BL-004 unit-test linkage;
- BL-005 integration-test linkage;
- BL-009 revised use-case/test-catalogue linkage;
- coverage/execution evidence when available;
- current status and blocker reason when execution evidence is unavailable.

## Governance

- BL-011 does **not** grant approval. Approval/reapproval remains explicit-user-only.
- No BL-011 downstream test story may claim the revised application behavior is approved unless the source BL-002 Story has current explicit approval/reapproval and required conformance gates have passed.
- BL-011 may describe generated-but-unexecuted tests, but must clearly label them **NOT EXECUTED** until durable execution evidence exists.
- Test generation, test execution, and coverage achievement are separate states and must never be conflated.
- Missing source material, executable runtime, test result, coverage report, test data, or approval evidence must be reported as a blocker rather than inferred.
- BL-011 must remain traceable to BL-002, BL-004, BL-005 and BL-009.
- No automatic approval, no inferred PASS, and no synthetic coverage percentage are permitted.

## Work model

BL-011 uses one master queue: `test-story-task-queue.csv`.

A source Story may have multiple rows because unit, integration, test-data and use-case narratives are distinct deliverables, but all rows belong to this single backlog.

Initial workstream order:

1. Inventory eligible approved/reapproved source Stories and existing BL-004/005/009 assets.
2. Create human-readable Unit Test Stories.
3. Create human-readable Integration Test Stories.
4. Create human-readable Test Data Stories.
5. Create human-readable Use-case/End-to-End Test Stories.
6. Cross-link executable test classes/methods/catalogue cases.
7. Reconcile generated versus executed versus coverage-evidenced states.
8. Produce reviewer-ready per-Story testing packets.

## Completion model

BL-011 backlog completion is not a single generated-file count. For every in-scope eligible Story, completion requires all applicable readable artifacts and traceability links to be complete.

A Story-level BL-011 packet is `HUMAN_READABLE_TEST_PACKET_COMPLETE` only when all applicable unit, integration, test-data and use-case/end-to-end narratives are complete and internally consistent.

Execution-based statuses require durable execution evidence. Coverage-based statuses require durable coverage evidence.

Until a reliable Story denominator is durably reconciled from current approval/conformance evidence, the whole-backlog percentage is `PERCENTAGE NOT DURABLY DERIVABLE`.

## Status vocabulary

- `NOT_STARTED`
- `INVENTORY_COMPLETE`
- `IN_PROGRESS`
- `HUMAN_READABLE_STORY_COMPLETE`
- `AWAITING_SOURCE_MATERIALIZATION`
- `AWAITING_EXECUTION_EVIDENCE`
- `AWAITING_COVERAGE_EVIDENCE`
- `APPROVAL_OR_CONFORMANCE_GATED`
- `NEEDS_CLARIFICATION`
- `HUMAN_READABLE_TEST_PACKET_COMPLETE`

## Definition of Done

BL-011 is complete only when all in-scope eligible Stories have a reviewer-readable testing packet that explains what is tested, how it is tested, which data drives it, the expected result, the executable evidence linkage, and the actual execution/coverage state without inference.
