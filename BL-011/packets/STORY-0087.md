# BL-011 Human-Readable Test Packet — STORY-0087 Address Type Search

- Source: `BL-002/stories/STORY-0087.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Business behavior: `GET /search/addresstype/{searchText}` performs a read-only Address Type reference search.
- Unit story: valid fragment returns mapped matches; no-match and governed validation/error paths return the approved outcome; no mutation. Executable `BL-004/generated-tests/STORY-0087/Story0087AddressTypeSearchUnitTest.java`.
- Integration story: verify read-only MVC/service/JPA search against source-bound data. Executable `BL-005/generated-tests/STORY-0087/Story0087AddressTypeSearchIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0087.md` / `.csv`; 3 mapped rows for match, no-match and error/boundary behavior.
- E2E catalogue: `BL-009/stories/STORY-0087.md`; executable `BL-009/generated-tests/STORY-0087/Story0087TestDataDrivenTest.java`.
- Expected persistence: unchanged Address Type rows.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
