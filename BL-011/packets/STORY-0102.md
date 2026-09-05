# STORY-0102 — Human-Readable Testing Packet

- Source Story: `BL-002/stories/STORY-0102.md`
- Title: Supplier Search
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Fan-out state: `ELIGIBLE_PACKET_PENDING`
- Packet completion: `NOT_COMPLETE`
- Execution: `NOT_EXECUTED`
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`

## Why this packet is pending

STORY-0102 became newly eligible after explicit user approval on 2026-09-05 and a source-bound post-approval conformance PASS.

The required BL-004 unit-test artifact, BL-005 integration-test artifact, and BL-009 test-case/test-data/executable mapping are queued but not yet generated for this Story. Under the BL-011 per-test-case code-adjacency policy, this packet must not be marked complete until every applicable unit, integration, test-data and E2E case has its exact adjacent executable code and production-code evidence.

## Approved business behavior

Supplier Search is a read-only typeahead flow. The UI trims search text, suppresses requests below three characters, uses a 280 ms debounce for qualifying input, calls `GET /search/supplier/{searchText}`, displays supplier name and persistent ID, propagates the selected supplier ID, and clears downstream exchange state when the selection is cleared.

The controller delegates the required `searchText` request to the governed supplier search service. Search behavior covers supplier name or GST number and returns `SupplierSearchResponseDto`. Governed application failure yields an empty response DTO. No data mutation is part of the approved contract.

## Traceability

- Approval evidence: `BL-002/approval-evidence/STORY-0102-approval-20260905.md`
- Conformance evidence: `BL-002/evidence/STORY-0102-post-approval-source-conformance-20260905.yaml`
- BL-004 queue: `BL-004/unit-test-task-queue.csv`
- BL-005 queue: `BL-005/integration-test-task-queue.csv`
- BL-009 queue: `BL-009/test-case-task-queue.csv`

## Next action

Generate the STORY-0102 BL-004, BL-005 and BL-009 artifacts from the approved frozen-source contract, then replace this pending packet with the complete per-test-case adjacent-code packet. Runtime execution and JaCoCo coverage remain separate evidence gates.
