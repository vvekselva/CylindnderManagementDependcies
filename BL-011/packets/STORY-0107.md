# STORY-0107 — Human-Readable Testing Packet

- Source Story: `BL-002/stories/STORY-0107.md`
- Title: Cylinders on Vehicle
- Approval: `APPROVED_AFTER_REWORK`
- Post-approval conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Fan-out state: `ELIGIBLE_PACKET_PENDING`
- Packet completion: `NOT_COMPLETE`
- Execution: `NOT_EXECUTED`
- Coverage: `NO_DURABLE_COVERAGE_EVIDENCE`

STORY-0107 is newly approved, conformance-pass and eligible for BL-004/BL-005/BL-009/BL-011 fan-out. The generated unit/integration/catalogue artifacts are still pending, so the strict per-test-case adjacent-code packet remains incomplete.

Approved behavior: `POST /search/cylinder/on-vehicle` reads active vehicle-load contents through the ownership-model logistics path, exposes persistent cylinder IDs for Supplier Stop selection, clears stale selection on exchange reload, and performs no mutation.

Traceability:
- `BL-002/approval-evidence/STORY-0107-approval-20260905.md`
- `BL-002/evidence/STORY-0107-post-approval-source-conformance-20260905.yaml`
- `BL-004/unit-test-task-queue.csv`
- `BL-005/integration-test-task-queue.csv`
- `BL-009/test-case-task-queue.csv`
