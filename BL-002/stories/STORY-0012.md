# STORY-0012 — Challan Book Registration Form

- Release: R1
- Endpoint: `GET /logistics/challan-books/add-form`
- Functional area: Challan Management
- Controller: `ChallanBookWebController`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0012-approval-20260902.md`
- Business-behavior rework: APPROVED_AFTER_REWORK
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This page prepares the operator to register a physical Challan Book used for delivery, empty-pickup, supplier filling-note, or customer spot-check paperwork. It renders the registration form and gives the user current Challan Book summary metrics before any new book is saved. The actual persistence operation is STORY-0013 (`POST /logistics/challan-books/save`).

Opening this GET does not create a Challan Book.

## What the user sees and enters

The page renders `final-version-1/add-challan-book.html` with an empty `ChallanBookIngestionRequestDto` and the following business inputs:

- **Challan Book Type** — selects the document/business purpose (`DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE`, or `CUSTOMER_SPOT_CYLINDER_CHECK`).
- **Book Reference Code** — required unique business code, maximum 30 characters.
- **Serial Prefix** — optional sheet-number prefix, maximum 10 characters.
- **Starting Sheet** — required numeric starting page, UI minimum 1.
- **Ending Sheet** — required numeric ending page, UI minimum 1.
- **Storage Location** — required current holding location of the physical book.
- **Submit/Register** — posts the form to `POST /logistics/challan-books/save` (STORY-0013).

These controls are bounded Challan Book metadata rather than large Customer/Product/Supplier/Vehicle/Driver/Address master-data selectors. No reference-search conversion is applicable to this page.

## Summary information loaded before registration

The controller uses `SummaryMetricLookupFetchService` to load three ordered metric groups:

### Total-book metrics
- `TOTAL_CHALLAN_BOOKS`
- `TOTAL_DELIVERY_CHALLAN_BOOKS`
- `TOTAL_EMPTY_PICKUP_BOOKS`
- `TOTAL_SUPPLIER_EMPTY_BOOKS`

### Active/closed metrics
- `TOTAL_ACTIVE_BOOKS`
- `TOTAL_CLOSED_BOOKS`
- `TOTAL_ACTIVE_DELIVERY_CHALLAN_BOOKS`
- `TOTAL_ACTIVE_EMPTY_PICKUP_BOOKS`
- `TOTAL_ACTIVE_SUPPLIER_EMPTY_DROPOFF_BOOKS`

### Unused-page metrics
- `TOTAL_UNUSED_PAGES_ACTIVE_DELIVERY_CHALLAN_BOOKS`
- `TOTAL_UNUSED_PAGES_ACTIVE_EMPTY_PICKUP_BOOKS`
- `TOTAL_UNUSED_PAGES_ACTIVE_SUPPLIER_EMPTY_DROPOFF_BOOKS`

The service is read-only and queries those keys through `SummaryMetricLookupJpaDao.findByLookUpKeyIn(...)`. It reconstructs the result in the business-defined key order and silently omits a requested key when no matching row exists.

## Exact database read identity

`SummaryMetricLookupDo` maps to `public.tbl_summary_metric_lookup` with generated primary key `pk_summary_metric_lookup_id`. `look_up_key` is non-null and unique; each record also stores a UI label, explanatory meaning, numeric value and decimal-value flag.

The DAO is `SummaryMetricLookupJpaDao extends JpaRepository<SummaryMetricLookupDo, Long>` and provides lookup by one key or a collection of keys.

## What happens when the page opens

1. The controller creates the blank registration request/model.
2. It fetches the three metric groups above from `public.tbl_summary_metric_lookup`.
3. It places the request and metric groups into the model.
4. It renders the Challan Book registration template.
5. No Challan Book registry row or page ledger is written by this GET.

## Validation and related submit behavior

Browser-required fields and numeric minima are enforced by the form. Deeper persistence validation belongs to STORY-0013. In the frozen POST implementation, intended service exceptions for null input and invalid sheet ranges are currently commented out, duplicate code is not explicitly pre-checked, and per-sheet ledger generation is commented out. Those are source-proved current-state gaps documented in STORY-0013 and are not falsely attributed to this GET page.

## Business impact

The page combines data entry with a live operational summary so the operator can see current book counts/availability while preparing a new registration. Because it is read-only until Submit, merely opening or refreshing the page cannot change Challan inventory.

## Approval and fan-out gate

**APPROVED_AFTER_REWORK.** The user explicitly approved this reworked Story on 2026-09-02. The approval applies to the GET form/read behavior documented here. It does not imply that STORY-0013 development gaps or downstream tests are implemented, executed or passing.
