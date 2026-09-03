# BL-011 Human-Readable Test Packet — STORY-0012 Challan Book Add Form

- Source: `BL-002/stories/STORY-0012.md`; approval `APPROVED_AFTER_REWORK`; conformance `CODE_CONFORMANCE_VERIFIED_PASS`.
- Business behavior: `GET /logistics/challan-books/add-form` prepares the source-bound Challan Book form/reference data without persisting a new book.
- Unit story: verify form preparation, required lookup/model values, governed empty/error paths and no write side effect. Executable: `BL-004/generated-tests/STORY-0012/Story0012ChallanBookFormUnitTest.java`.
- Integration story: exercise MVC/service/reference-data wiring and verify the form response/model under faithful runtime. Executable: `BL-005/generated-tests/STORY-0012/Story0012ChallanBookFormIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0012.md` / `.csv`; 5 catalogued rows cover valid form data plus source-bound missing/empty/error/boundary cases.
- E2E: Given required Challan reference data, when the add form is opened, then the governed form is populated and no Challan Book is persisted. Catalogue `BL-009/stories/STORY-0012.md`; executable mapping `BL-009/generated-tests/STORY-0012/Story0012TestDataDrivenTest.java`.
- Execution: `NOT EXECUTED`; coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability.
