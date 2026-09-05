# STORY-0059 — Supplier Lookup Page

- Release: R1
- Endpoint: `GET /fetchSupplierByPage`
- Controller: `SupplierFetchByPageController.doGet`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## User intent and screen entry
Opening `/fetchSupplierByPage` displays the supplier list and allows the operator to search by supplier name/GST, restrict the list to active suppliers, change page size, page through results, reset filters, or navigate to Register Supplier.

## Exact GET request/controller contract
`SupplierFetchByPageController.doGet` accepts: `pageNumber` int default `1`; `itemsPerPage` int default `10`; optional `searchTerm` String; `activeOnly` boolean default `true`.

The controller normalizes pageNumber with `max(1,pageNumber)`. itemsPerPage is retained only when >0, otherwise becomes 10. searchTerm and activeOnly are mapped to `SupplierFetchByPageRequestDto`.

On success it returns `final-version-1/SupplierListPage` with model attributes `page`, `searchTerm`, `activeOnly`, `itemsPerPage`, `pageSizeOptions` = 5/10/20/50, and `baseUrl` = `/fetchSupplierByPage`. A `CylinderManagementApplicationException` causes redirect to `/fetchSupplierByPage?pageNumber=1&itemsPerPage=10&activeOnly=true`.

## Exact visible controls and browser events
The frozen GET form targets `/fetchSupplierByPage` and has id `filterForm`. It contains text input `searchTerm` with placeholder `Search supplier name or GST`; select `itemsPerPage`; checkbox `activeOnly` with submitted value `true`; hidden input `pageNumber=1`; and `Apply` submit.

Changing `itemsPerPage` immediately submits `filterForm` through the inline `onchange` handler. Changing `activeOnly` likewise immediately submits the form. Typing in searchTerm has no source-proved keyup/AJAX/debounce/minimum-length behavior; search runs on normal form submission. Reset is a normal link to `/fetchSupplierByPage`, thereby restoring controller defaults. There is no dependent lookup or hidden supplier-ID propagation on this list page.

## Service normalization, filtering and sorting
`SupplierFetchByPageService.processRequest` is `@Transactional(readOnly=true)`. It resolves invalid/null request paging to page 1 and 10 items; activeOnly defaults true when the request object is null; searchTerm is trimmed and blank becomes null.

It creates zero-based `PageRequest.of(pageNumber - 1, itemsPerPage, Sort.by("supplierName").ascending())`.

The DAO branch is exact:
- activeOnly=true + search: active suppliers whose supplierName contains searchTerm ignoring case OR active suppliers whose gstNumber contains it ignoring case;
- activeOnly=true + no search: `isActive=true`;
- activeOnly=false + search: supplierName OR GST contains searchTerm ignoring case across both active/inactive suppliers;
- activeOnly=false + no search: all suppliers.

`SupplierJpaDao` is a Spring Data `JpaRepository<SupplierDo,Long>` and these predicates are expressed by the repository method identities proved in source.

## Database/read identity and row mapping
`SupplierDo` maps to `public.tbl_supplier`; row identity is `pk_supplier_id` / `supplierId`. The list mapping exposes supplier ID, supplier name, GST number, active flag, primary phone number when present, and address information when present. Address mapping includes address ID/lines/landmark and mapped city/state/country values.

The supplier entity links address through `fk_address` and phone through `fk_phone_number`. This endpoint is read-only; no supplier/database mutation is asserted.

## Exact visible list/result behavior
When suppliers exist, the template renders columns `#`, Supplier, GST Number, Phone, City, Status. Supplier name is shown with `ID: {supplierId}`. Missing GST/phone/city values display `-`. Status is rendered as Active or Inactive; inactive rows are visually de-emphasized. There is no supplier-detail row link/action in this frozen template.

The page exposes `Register Supplier` linking to `/ingestSupplier`.

When no suppliers are returned it displays `No suppliers found` and `Try changing the search term or active-only filter.`

## Exact pagination behavior
The response carries current page number, items per page and total item count from the Spring Data page. The template renders current/total pages and total-items information and builds previous, numbered and next links preserving `itemsPerPage`, `searchTerm`, and `activeOnly` while changing `pageNumber`. Previous/Next are visually disabled according to `hasPreviousPage` / `hasNextPage` from the response contract.

## Governed conclusion
The recovered ZIP confirms the controller, template, service, DAO and supplier entity contract above. The user goal, filters, browser events, search branches, paging/sort behavior, row identity, empty state and read-only impact satisfy the current business-behavior standard.

STORY-0059 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains `PENDING_USER_APPROVAL`; no code mutation or auto-approval occurred.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
