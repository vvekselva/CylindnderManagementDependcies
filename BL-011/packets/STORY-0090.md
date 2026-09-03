# BL-011 Human-Readable Test Packet — STORY-0090 Country Search

- Source `BL-002/stories/STORY-0090.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Behavior: `GET /search/country/{searchText}` performs read-only Country reference search.
- Unit: matching result mapping, no-match, governed validation/error; `BL-004/generated-tests/STORY-0090/Story0090CountrySearchUnitTest.java`.
- Integration: MVC/service/JPA read path; `BL-005/generated-tests/STORY-0090/Story0090CountrySearchIntegrationTest.java`.
- Data: `BL-009/test-data/STORY-0090.md` and `.csv`, 3 mapped rows.
- E2E: matching Country identities are returned or governed empty/error outcome; no persistence mutation. Catalogue `BL-009/stories/STORY-0090.md`; executable `BL-009/generated-tests/STORY-0090/Story0090TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
