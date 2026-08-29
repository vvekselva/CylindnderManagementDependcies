# STORY-0102 — Supplier Search

- Release: R1
- Endpoint: `GET /search/supplier/{searchText}`
- Controller: `RestfulSupplierSearchService.getSuppliers`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and visible control
On the frozen Supplier Stop page, the visible supplier search control `supSearch` listens to the browser `input` event. Input is trimmed; fewer than 3 characters closes the dropdown and sends no request. Eligible input is debounced for 280 ms before `fetchSuppliers(q)`. Blur closes the dropdown after 180 ms.

## Exact API call and result handling
`fetchSuppliers` calls `GET /search/supplier/${encodeURIComponent(q)}`. The response list is `supplierDtos`. Each dropdown row shows `supplierName` and `supplierId`. No matches displays `No suppliers found`; request failure displays `Search failed — try again`.

## Selected value and propagation
Choosing a result invokes `selectSupplier(supplierId, supplierName)`, stores both values in `selectedSupplier`, writes the name back to the visible search control, writes the exact ID to hidden field `f-supplierId`, updates the supplier banner, then calls `loadExchange(id)`. Clearing supplier resets the visible value and hidden supplier ID, hides the banner and exchange section.

## Controller/service contract
The REST controller binds required path variable `searchText`, creates `CylinderManagementApplicationRequestDto`, sets `searchTerm`, creates `Pageable` through `PaginationUtils.createPageable`, and calls `supplierSearchService.searchWithText(requestDto, pageable)`. The endpoint searches supplier name or GST number. Success returns `SupplierSearchResponseDto`; `CylinderManagementApplicationException` is logged and converted to an empty response DTO.

## Approval boundary
Strict field/UI contract is complete from frozen UI and controller source. Approval remains pending.
