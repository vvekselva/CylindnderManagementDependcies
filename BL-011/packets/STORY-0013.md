# BL-011 Human-Readable Test Packet — STORY-0013 Challan Book Save

- Source: `BL-002/stories/STORY-0013.md`; approval `APPROVED_AFTER_REWORK`; conformance `CODE_CONFORMANCE_VERIFIED_PASS` for the approved current Story. Known proposed service hardening remains separately approval-gated and is not implemented here.
- Business behavior: `POST /logistics/challan-books/save` validates the Challan Book ingestion request and persists valid book/sheet information according to the approved current contract.
- Unit story: verify valid save/mapping, validation failures, null/empty/range/duplicate scenarios represented by the approved test catalogue, and DAO interaction boundaries. Executable: `BL-004/generated-tests/STORY-0013/Story0013ChallanBookIngestionServiceTest.java`.
- Integration story: verify controller/service/JPA persistence behavior and rejection paths against PostgreSQL when faithful runtime is available. Executable: `BL-005/generated-tests/STORY-0013/Story0013ChallanBookIntegrationTest.java`.
- Test data: `BL-009/test-data/STORY-0013.md` / `.csv`; 10 rows mapped. Do not treat DEV-0002/0003/0004 proposed behavior as implemented until explicit exact-manifest approval.
- E2E: Given a governed Challan Book request, when it is saved, then valid data is persisted and source-current validation failures are surfaced without unintended partial persistence. Catalogue `BL-009/stories/STORY-0013.md`; executable mapping `BL-009/generated-tests/STORY-0013/Story0013TestDataDrivenTest.java`.
- Execution: `NOT EXECUTED`; coverage: `NO DURABLE COVERAGE EVIDENCE`.
- Packet: `HUMAN_READABLE_TEST_PACKET_COMPLETE` for narrative/traceability.
