# BL-011 Human-Readable Test Packet — STORY-0132 City Save

- Source `BL-002/stories/STORY-0132.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: governed City save validates acceptable input and persists the City reference record; rejected data must not create unintended state.
- Unit: valid save, source-bound invalid/null/empty, duplicate/conflict and boundary cases; `BL-004/generated-tests/STORY-0132/Story0132CitySaveUnitTest.java`.
- Integration: MVC/service/persistence save path and rejection behavior; `BL-005/generated-tests/STORY-0132/Story0132CitySaveMvcIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0132.md` / `.csv`, 4 mapped rows.
- E2E: valid City input is persisted and becomes available; invalid/conflicting data follows governed failure behavior without partial/unintended persistence. Catalogue `BL-009/stories/STORY-0132.md`; executable `BL-009/generated-tests/STORY-0132/Story0132TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
