# STORY-0099 — Product Search

- Release: R1
- Endpoint: `GET /search/product/{searchText}`
- Controller: `RestfulProductServices.getProducts`
- Approval: APPROVED_AFTER_REWORK
- Review state: USER_APPROVED
- Rework state: APPROVED_AND_FAN_OUT
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Approval evidence: `BL-002/approval-evidence/USER-APPROVAL-STORY-0092-0098-0099-0100-0103-20260902-2159-IST.md`
- Post-approval conformance: CODE_CONFORMANCE_VERIFIED_PASS
- Conformance evidence: `BL-002/post-approval-code-conformance/RUN-008-STORY-0092-0098-0099-0100-0103-20260903.yaml`

## Business behavior

The endpoint accepts required path variable `searchText`, places it in `CylinderManagementApplicationRequestDto.searchTerm`, delegates to `ProductSearchService.searchWithText`, and returns `ProductSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO. The service validates with `PRODUCT_SEARCH_SERVICE`, queries `ProductJpaDao.findByProductNameContainingIgnoreCase`, maps entities to DTOs, and remains read-only.

A source-proved consuming flow is Customer Demand: its Product typeahead starts after 3 characters with a 280 ms debounce, calls this endpoint, displays product names and writes the selected persistent `productId` into the demand form; changing/clearing the visible product invalidates stale selected identity. Other callers may use the same API without inheriting that screen-specific timing rule.

## Completion and approval gate

Explicit user approval was recorded on 2026-09-02 21:59 IST and post-approval local-source conformance passed in RUN-008. No application-code or BL-010 mutation occurred.
