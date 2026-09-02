# STORY-0100 — Product UOM Search

- Release: R1
- Endpoint: `GET /search/product-uom/{searchText}`
- Controller: `RestfulProductUomServices.getProductUoms`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This read-only reference lookup accepts exact path variable `searchText`. `RestfulProductUomServices.getProductUoms` copies the value to `CylinderManagementApplicationRequestDto.searchTerm`, delegates to the Product UOM search service and returns `ProductUomSearchResponseDto`. A governed application exception is logged and converted to an empty response DTO.

The endpoint resolves matching Unit-of-Measure reference data for consuming forms/services; it performs no UOM persistence. Screen-specific typeahead timing/hidden identity rules are caller behavior and are not invented where no unique caller is bound to this Story.

## Completion and approval gate

The API input, search-service delegation, response/error behavior and read-only reference role are source-bound. STORY-0100 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
