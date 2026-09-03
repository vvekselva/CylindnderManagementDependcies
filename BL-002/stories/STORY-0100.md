# STORY-0100 — Product UOM Search

- Release: R1
- Endpoint: `GET /search/product-uom/{searchText}`
- Controller: `RestfulProductUomServices.getProductUoms`
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

This read-only reference lookup accepts exact path variable `searchText`. `RestfulProductUomServices.getProductUoms` copies the value to `CylinderManagementApplicationRequestDto.searchTerm`, delegates to `ProductUomSearchService.searchWithText` and returns `ProductUomSearchResponseDto`. The service validates with `PRODUCT_UOM_SEARCH_SERVICE`, queries `ProductUomJpaDao.findByProductUomContainingIgnoreCase`, maps matching UOM entities, and performs no UOM persistence. A governed application exception is logged and converted to an empty response DTO.

Screen-specific typeahead timing/hidden identity rules are caller behavior and are not invented where no unique caller is bound to this Story.

## Completion and approval gate

Explicit user approval was recorded on 2026-09-02 21:59 IST and post-approval local-source conformance passed in RUN-008. No application-code or BL-010 mutation occurred.
