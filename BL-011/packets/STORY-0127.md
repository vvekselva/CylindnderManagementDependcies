# BL-011 Human-Readable Test Packet — STORY-0127 Legacy Lookup Redirect

- Source `BL-002/stories/STORY-0127.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: the legacy lookup route must redirect to the approved destination/context and perform no business-data mutation.
- Unit: verify exact redirect destination/context and no service/DAO write; `BL-004/generated-tests/STORY-0127/Story0127LegacyLookupRedirectUnitTest.java`.
- Integration: exercise MVC redirect mapping; database runtime is not applicable to this navigation-only path. Executable `BL-005/generated-tests/STORY-0127/Story0127LegacyLookupRedirectIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0127.md` / `.csv`, 4 catalogued rows for route/context/boundary behavior.
- E2E: Given a caller reaches the legacy route, when it is invoked, then navigation ends at the governed destination with no persistence change. Catalogue `BL-009/stories/STORY-0127.md`; executable `BL-009/generated-tests/STORY-0127/Story0127TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
