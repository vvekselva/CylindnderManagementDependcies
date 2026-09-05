# STORY-0088 — Challan Type Search

- Release: R1
- Endpoint: `GET /search/challantype/{searchText}`
- Controller: `RestfulChallanTypeServices.getChallanTypes`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only lookup accepts exact path variable `searchText`. The recovered ZIP confirms `RestfulChallanTypeServices` at `/search/challantype` and the downstream search flow through `ChallanTypeSearchService`, `SearchRequestValidator`, `ChallanTypeJpaDao.findByChallanTypeContainingIgnoreCase`, `ChallanTypeDo` / `public.tbl_challan_type`, DTO mapping and `ChallanTypeSearchResponseDto`.

Successful lookup returns the matching response DTO; application-service failure returns an empty DTO. The endpoint itself performs no database mutation. No screen-specific debounce, minimum length or hidden-ID propagation is attributed where the endpoint/source does not bind one.

## Completion and approval gate

The exact input, validation/search/DAO/table path, result/error behavior and read-only effect are source-bound. STORY-0088 is therefore `APPROVED_AFTER_REWORK`; explicit user approval and fan-out authorization are durably recorded.

User approval recorded on 2026-09-05. Fan-out is authorized subject to post-approval source/code conformance; runtime execution and coverage must remain evidence-based.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004 unit testing, BL-005 integration testing, BL-009 test-case/test-data catalogue, BL-011 human-readable testing packet
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
