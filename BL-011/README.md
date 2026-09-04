# BL-011 — Human-Readable Testing Stories, Test Data, Test Cases and Code

## Purpose
BL-011 is the single umbrella backlog for reviewer-readable testing packets. Every eligible packet must explain the business behavior **and also show the relevant code** so a reviewer can move from business rule -> production implementation -> unit test -> integration test -> test data -> use-case/E2E evidence without opening separate files merely to understand what is being verified.

## Required packet sections
Every eligible BL-011 Story packet must contain, when applicable:
1. Story/approval/conformance/source identity.
2. Business behavior and business impact.
3. Preconditions, actor/caller, input/test data and validation/business rules.
4. **Production Code Evidence** — one or more fenced code excerpts from the frozen/recovered application source showing the relevant controller/service/DAO/validator/template/database anchor. Each excerpt must name repository/source package, file path, class/component and method/block.
5. **Unit Test Story + Unit Test Code** — readable scenario explanation plus fenced excerpt(s) from the BL-004 executable test source, including test method names/assertions/mocking that prove the stated behavior.
6. **Integration Test Story + Integration Test Code** — readable scenario explanation plus fenced excerpt(s) from BL-005 showing real component/database/container setup and key assertions.
7. **Test Data Story + Test Data/Executable Mapping Code** — readable data matrix plus representative data rows and/or fenced excerpt from BL-009 executable mapping showing how data is consumed/asserted.
8. **Use-case / End-to-End Test Story + Code Trace** — Given/When/Then business flow plus the code-path trace across controller/service/DAO/UI/database and mapped executable/catalogue evidence.
9. Traceability to BL-002/BL-004/BL-005/BL-009.
10. Execution and coverage status, kept separate from generation/rework.

## Code-content rules
- A link/path alone is **not sufficient**. The packet must include actual fenced code excerpts.
- Code excerpts must be source-bound; do not invent or pseudocode production behavior when frozen source is available.
- The production excerpt must be taken from the recovered/frozen application source or an equivalent verified byte-identical source package.
- Test excerpts must come from the governed BL-004/BL-005/BL-009 executable artifacts.
- Excerpts should be focused enough for a reviewer to understand the protected behavior and assertions; the whole source file need not be duplicated when a smaller excerpt is sufficient.
- When a current-source defect is intentionally characterized, the code excerpt must make that defect visible and the narrative must label it as current-state behavior, not desired future behavior.
- Proposed BL-010 code is never shown as implemented code unless the exact manifest was approved and implementation evidence exists.
- Database/SQL snippets may be included when the Story's correctness depends on a database constraint, migration, query or object.
- Missing code evidence is a blocker; explanation-only packets are incomplete.

## Mandatory business/test content
Each packet must identify, when applicable:
- source BL-002 Story ID and approval/reapproval evidence;
- conformance status;
- business behavior and impact;
- preconditions and actor/calling component;
- readable input/test data;
- validation/business rules;
- happy path;
- negative/error scenarios;
- boundary scenarios;
- duplicate/conflict/idempotency scenarios where relevant;
- expected service/API/UI outcome;
- expected database/persistence state;
- expected exception/error classification;
- mocked versus real dependencies;
- production-code anchors and excerpts;
- executable test classes/methods and code excerpts;
- BL-004 linkage;
- BL-005 linkage;
- BL-009 use-case/test-data linkage;
- actual execution evidence when available;
- coverage evidence when available;
- blocker reason when execution/coverage is unavailable.

## Governance
- Approval/reapproval remains explicit-user-only.
- No auto-approval.
- No application-code mutation is authorized by BL-011 packet rework.
- Generated/reworked code excerpts do not mean tests executed.
- Test generation, packet rework, test execution and coverage achievement are separate states.
- No inferred PASS and no synthetic coverage percentage.
- Missing source, test code, execution results or coverage reports must be reported rather than inferred.
- BL-011 must remain traceable to BL-002, BL-004, BL-005 and BL-009.

## Completion model
A Story is complete only when all applicable narrative **and code** sections are present, source-bound, internally consistent and validated against this README and `human-readable-testing-policy.yaml`.

The terminal packet status is:
`HUMAN_READABLE_TEST_PACKET_WITH_CODE_COMPLETE`

An explanation-only packet, or a packet that only lists paths without showing code, is not complete.

Execution statuses require durable execution evidence. Coverage statuses require durable coverage evidence.

## Definition of Done
For every eligible Story, a reviewer can read the business behavior, inspect the relevant production/test/data code directly inside the packet, understand positive/negative/boundary/duplicate behavior, see expected API/UI/database outcomes, follow BL-002/004/005/009 traceability, and see the actual execution/coverage state without inference.
