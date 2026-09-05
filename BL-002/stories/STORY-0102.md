# STORY-0102 — Supplier Search

- Release: R1
- Endpoint: `GET /search/supplier/{searchText}`
- Controller: `RestfulSupplierSearchService.getSuppliers`
- Approval: APPROVED_AFTER_REWORK
- Review state: USER_APPROVED
- Rework state: APPROVED_AND_FAN_OUT
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Approval evidence: `BL-002/approval-evidence/STORY-0102-approval-20260905.md`
- Post-approval conformance: CODE_CONFORMANCE_VERIFIED_PASS
- Conformance evidence: `BL-002/evidence/STORY-0102-post-approval-source-conformance-20260905.yaml`

## Business behavior

On Supplier Stop, visible `supSearch` trims input, performs no request under 3 characters, and at 3+ characters waits 280 ms before calling `GET /search/supplier/{encoded query}`. Results display supplier name and persistent supplier ID; selecting one writes the exact ID to hidden `f-supplierId`, updates the selected-supplier banner and loads the supplier exchange. Clearing selection removes the ID and downstream exchange state. No-result, request-failure and delayed blur-close behavior are source-bound.

The recovered ZIP confirms the REST controller binds required `searchText`, sets `CylinderManagementApplicationRequestDto.searchTerm`, creates paging, and delegates to `supplierSearchService`. The search covers supplier name or GST number and returns `SupplierSearchResponseDto`; governed application failure returns an empty response DTO. The API is read-only.

## Completion and approval gate

The typeahead timing, selected identity propagation/reset, controller/search-service contract and read-only business role are source-bound. STORY-0102 is therefore `APPROVED_AFTER_REWORK` with post-approval code conformance verified.

Explicit user approval was recorded on 2026-09-05. BL-004, BL-005, BL-009 and BL-011 fan-out is authorized after source-bound conformance PASS. No application-code or BL-010 mutation occurred, and no runtime execution or coverage is inferred.
