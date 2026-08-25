# STORY-0032 — Save a challan book and conditionally persist its page ledger

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /logistics/challan-books/save`  
**Controller:** `ChallanBookWebController.processBookIngestion`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`  
**Fingerprint:** `c5f8674196bffe41ba9c4a39307eb9a850134708ece1419a7f4c2aab04debe61`

## Trigger and context

A caller submits `POST /logistics/challan-books/save`. The accepted BL-001 evidence proves that the controller passes a request DTO into `ChallanBookIngestionService.processRequest`, which maps and persists a challan-book aggregate. The accepted trace does not preserve the exact caller-visible request-field contract, so this Story does not invent field names or validation semantics.

## Inputs, normalization and validation

The request DTO itself is source-proved. Exact request fields, required/optional rules, normalization, defaults, validation order and the exact invalid values that raise `CylinderManagementApplicationException` are not preserved in the accepted trace. Those details remain unresolved rather than inferred.

## Main flow

1. `ChallanBookWebController.processBookIngestion` receives the POST request.
2. The controller invokes `ChallanBookIngestionService.processRequest`.
3. `ChallanBookRegistryMapper.mapDtoToDo` maps the request DTO to `ChallanBookRegistryDo`.
4. `ChallanBookRegistryJpaDao.saveAndFlush` persists the registry entity to `public.tbl_challan_book_registry`.
5. When page DTOs are present, `ChallanBookRegistryMapper` calls `ChallanPageAuditLedgerMapper` and creates `ChallanPageAuditLedgerDo` children.
6. `ChallanBookRegistryDo.pages` uses `CascadeType.ALL`, making `public.tbl_challan_page_audit_ledger` a proved conditional persistence dependency.
7. The proved success path ends with `redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`.

## Ordered component flow

`ChallanBookWebController.processBookIngestion` → `ChallanBookIngestionService.processRequest` → `ChallanBookRegistryMapper.mapDtoToDo` → `ChallanBookRegistryJpaDao.saveAndFlush` → `ChallanBookRegistryDo` → `public.tbl_challan_book_registry`.

Conditional page branch: `ChallanBookRegistryMapper` → `ChallanPageAuditLedgerMapper` → `ChallanPageAuditLedgerDo` → `public.tbl_challan_page_audit_ledger`.

## Reads, writes and side effects

The endpoint writes `public.tbl_challan_book_registry`. When page DTOs exist, it conditionally writes `public.tbl_challan_page_audit_ledger` through the source-proved parent-child cascade. No additional state change or audit behaviour is asserted unless separately proved.

## Alternate and error path

`CylinderManagementApplicationException` is caught by the controller. The controller re-renders `final-version-1/add-challan-book` and reloads summary metrics through `SummaryMetricLookupFetchService` → `SummaryMetricLookupJpaDao` → `SummaryMetricLookupDo` → `public.tbl_summary_metric_lookup`.

The exact invalid values, field-level rules, validation order and user-facing messages that cause this branch are not proved by the accepted trace and therefore remain `NEEDS_CLARIFICATION`.

## Output and postconditions

On success, the proved terminal outcome is the customer-page redirect after the challan-book persistence branch. On the proved application-error path, the add-book view is returned with summary metrics reloaded. No unproved response semantics are added.

## Evidence

- Canonical matrix row: `POST /logistics/challan-books/save`
- `logs/runs/PRODUCTION-FIRE-20260824-003111.md`

## Technical validation result

The persistence chains and terminal branches are sufficiently proved for a technical Story candidate. The request contract and validation semantics are not sufficiently proved for a complete human-readable behavioural Story, so the Story remains `NEEDS_CLARIFICATION` and is not approved automatically.
