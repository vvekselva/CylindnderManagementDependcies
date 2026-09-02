# STORY-0099 — Product Search

- Release: R1
- Endpoint: `GET /search/product/{searchText}`
- Controller: `RestfulProductServices.getProducts`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

The endpoint accepts required path variable `searchText`, places it in `CylinderManagementApplicationRequestDto.searchTerm`, delegates to the product search service and returns `ProductSearchResponseDto`; a governed application exception is logged and converted to an empty response DTO. The API is read-only.

A source-proved consuming flow is Customer Demand: its Product typeahead starts after 3 characters with a 280 ms debounce, calls this endpoint, displays product names and writes the selected persistent `productId` into the demand form; changing/clearing the visible product invalidates stale selected identity. Other callers may use the same API without inheriting that screen-specific timing rule.

## Completion and approval gate

The exact API request/response/error role plus the source-proved Customer Demand selector behavior and selected product identity propagation are bound. STORY-0099 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
