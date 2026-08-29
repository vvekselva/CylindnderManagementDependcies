# STORY-0097 — Cylinders by Supplier

- Release: R1
- Endpoint: `POST /search/cylinder/by-supplier`
- Controller: `RestfulCylinderServices.getCylindersBySupplier`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Intent and endpoint contract
This is the ownership-model supplier-holding search. The REST controller accepts a required JSON `@RequestBody CylinderManagementApplicationRequestDto`, creates paging through `PaginationUtils.createPageable(requestDto)`, and delegates to the bean qualified `cylindersBySupplierSearchServiceWithOwnershipModel` via `searchWithText(requestDto, pageable)`.

## Source-proved custody identity
The controller documentation states that results are cylinders currently held by a supplier from active `SUPPLIER` rows in `tbl_cylinder_party_custody`; the derived current state is `EMPTY_DELIVERED_FOR_REFILL`. Thus the persisted/read identity is the cylinder plus its active supplier-party custody relationship, not the legacy current-status table.

## Response/error behavior
Success returns `CylinderSearchResponseDto`. A `CylinderManagementApplicationException` is logged and converted to an empty `CylinderSearchResponseDto`; this endpoint performs no database mutation.

## UI applicability
The frozen Supplier Stop page does not call `/by-supplier`; after supplier selection it loads supplier holdings through `/search/cylinder/get-cylinder-holding?supplierId=...` and vehicle stock through `/search/cylinder/on-vehicle`. Therefore typing/debounce/hidden-field behavior is not applicable to this endpoint itself and is not invented here. The endpoint is a reusable read API whose source-proved contract is controller/request/service/custody-response behavior.

## Approval boundary
Strict field/UI contract is complete for all applicable behavior proved by frozen source. Approval remains pending; no auto-approval occurred.
