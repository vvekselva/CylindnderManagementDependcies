# BL-011 Human-Readable Test Packet — STORY-0130 Country Save

- Source `BL-002/stories/STORY-0130.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed Country save validates acceptable input and persists the reference record; invalid/conflicting input must not create unintended state.
- Unit: source-bound valid, invalid, null/empty, duplicate/conflict and boundary behavior; `BL-004/generated-tests/STORY-0130/Story0130CountrySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection state; `BL-005/generated-tests/STORY-0130/Story0130CountrySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0130.md` / `.csv`, 4 mapped rows.
- E2E: valid Country data is persisted and subsequently available; rejected input follows governed error behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0130.md`; executable `BL-009/generated-tests/STORY-0130/Story0130TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
