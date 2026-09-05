# STORY-0096 — Human-Readable Testing Packet

- Source Story: `BL-002/stories/STORY-0096.md`
- Title: Cylinders by Customer
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Fan-out state: `ELIGIBLE_PACKET_PENDING`
- Packet completion: `NOT_COMPLETE`
- Execution: `NOT_EXECUTED`
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`

STORY-0096 is now conformance-pass and eligible for BL-004/BL-005/BL-009/BL-011 fan-out. The BL-004, BL-005 and BL-009 executable/test-data artifacts are queued but not yet generated, so the strict per-test-case adjacent-code packet cannot yet be marked complete.

Approved behavior: `POST /search/cylinder/by-customer` reads current customer custody through the ownership-model service, returns persistent cylinder IDs as selectable pickup candidates, and performs no mutation.

Traceability:
- `BL-002/approval-evidence/STORY-0096-fanout-confirmation-20260905.md`
- `BL-002/evidence/STORY-0096-post-approval-source-conformance-20260905.yaml`
- `BL-004/unit-test-task-queue.csv`
- `BL-005/integration-test-task-queue.csv`
- `BL-009/test-case-task-queue.csv`
