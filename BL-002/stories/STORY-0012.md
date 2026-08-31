# STORY-0012 — Challan Book Add Form

- Release: R1
- Endpoint: `GET /logistics/challan-books/add-form`
- Controller: `ChallanBookWebController`
- Controller method: `showAddBookForm()`
- View: `final-version-1/add-challan-book.html`
- Approval: NOT_APPROVED
- Business-behavior rework: IN_PROGRESS_SOURCE_DETAIL_GAP
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User story

When an operator opens the Challan Book add-form URL, the application prepares a blank Challan Book registration screen and attempts to load three summary-metric groups. This GET request prepares the screen; the actual book registration mutation belongs to the separate POST `/logistics/challan-books/save` endpoint.

## Exact source-bound GET flow

1. Browser requests `GET /logistics/challan-books/add-form` under controller base `/logistics/challan-books`.
2. `ChallanBookWebController.showAddBookForm()` creates `ModelAndView("final-version-1/add-challan-book.html")`.
3. It creates a blank `ChallanBookIngestionRequestDto` and exposes it as model attribute `ingestionRequest`.
4. `populateSummaryMetrics(...)` calls `SummaryMetricLookupFetchService` for total, active, and unused-page Challan Book metrics.
5. On successful metric reads, the model receives `challanBookTotalMetrics`, `challanBookActiveMetrics`, and `challanBookUnusedMetrics`.
6. If a runtime exception occurs while loading metrics, the controller substitutes empty metric lists and exposes `summaryMetricErrorMessage = "Summary metrics are temporarily unavailable."`; the registration form still renders.

## Exact visible registration controls

The bound template posts separately to `/logistics/challan-books/save` with model object `ingestionRequest`. Relevant controls include:

| Visible control | Bound field / behavior |
|---|---|
| Challan Book Type | radio choices bound to `challanBook.bookType`: `DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE`, `CUSTOMER_SPOT_CYLINDER_CHECK` |
| Book Reference Code | `challanBook.bookCode`; required; maxlength 30 |
| Serial Prefix | `challanBook.seriesPrefix`; optional; maxlength 10 |
| Starting Sheet | `challanBook.startSheetNumber`; numeric; min 1; required |
| Ending Sheet | `challanBook.endSheetNumber`; numeric; min 1; required |
| Storage Location | `challanBook.currentLocation`; required; selectable values shown by the template |
| Submit | posts to the separate `POST /logistics/challan-books/save` handler |

The GET Story does not claim the POST registration mutation as its own side effect.

## Service / database depth

The metric reads are source-proved at the controller boundary as:

- `fetchChallanBookTotalMetrics()`
- `fetchChallanBookActiveMetrics()`
- `fetchChallanBookUnusedPageMetrics()`

The injected interface is `com.sreyas.datamatics.cylinder.management.services.SummaryMetricLookupFetchService`.

The exact frozen implementation -> DAO/repository -> entity/view -> table/view read identity has not yet been bound. That missing depth is recorded instead of guessing a database source.

Therefore STORY-0012 is **canonical-identity repaired and controller/template/UI source-bound, but not yet revised business-behavior complete**.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: bind `SummaryMetricLookupFetchService` to its exact implementation and downstream database read identity. No automatic Story approval occurs.
