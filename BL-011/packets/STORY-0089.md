# BL-011 Human-Readable Test Packet — STORY-0089 City Search

- Source: `BL-002/stories/STORY-0089.md`; approval `APPROVED_AFTER_REWORK`; conformance PASS.
- Business behavior: `GET /search/city/{searchText}` is a read-only City lookup.
- Unit: match/no-match/governed error and mapping behavior; executable `BL-004/generated-tests/STORY-0089/Story0089CitySearchUnitTest.java`.
- Integration: source-bound MVC/service/JPA read path; executable `BL-005/generated-tests/STORY-0089/Story0089CitySearchIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0089.md` / `.csv`, 3 mapped rows; stable City IDs/names, isolated cases.
- E2E: search text returns matching selectable City reference identities or governed empty/error outcome, with no City mutation. Catalogue `BL-009/stories/STORY-0089.md`; executable `BL-009/generated-tests/STORY-0089/Story0089TestDataDrivenTest.java`.
- Execution `NOT EXECUTED`; coverage `NO DURABLE COVERAGE EVIDENCE`; packet `HUMAN_READABLE_TEST_PACKET_COMPLETE`.
