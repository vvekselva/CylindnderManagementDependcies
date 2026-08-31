# STORY-0012 — Challan Book Add Form

- Release: R1
- Endpoint: `GET /logistics/challan-books/add-form`
- Controller: `ChallanBookWebController`
- Controller method: `addForm(Model model)`
- View: `final-version-1/add-challan-book`
- Approval: NOT_APPROVED
- Business-behavior rework: IN_PROGRESS_SOURCE_DETAIL_GAP
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User story

When an operator opens the Challan Book add-form URL, the application prepares the Challan Book creation screen. The page shows the create form plus summary/filter information. This GET request prepares data for the screen; it does not itself create or mutate a Challan Book.

## Exact source-bound request flow

1. Browser requests `GET /logistics/challan-books/add-form`.
2. `ChallanBookWebController.addForm(Model model)` resolves the current/default state filter.
3. The controller calls `populateAddFormModel(model, currentState.get())`.
4. The model receives the form object, available book types, available book locations, state-name choices, current filtered metrics, and an all-time view summary.
5. The controller renders `final-version-1/add-challan-book`.

## Exact visible form controls

The bound template contains a creation form posting separately to `/logistics/challan-books`. Its visible/posted controls include:

| Visible control | Bound field / behavior |
|---|---|
| Book Type | `bookType`; options come from `${bookTypes}` |
| Start Number | `startNumber`; numeric, `min=1`, required |
| End Number | `endNumber`; numeric, `min=1`, required |
| Challans Per Book | `challansPerBook`; numeric, `min=1`, required |
| Book Location | `bookLocation`; options come from `${bookLocations}` |
| State Name | `stateName`; text input backed by `${states}` datalist |
| Create Challan Book | submits the separate POST form to `/logistics/challan-books` |

The GET Story does not claim the POST creation behavior as its own mutation. POST creation is a separate endpoint/Story boundary.

## Model preparation proven from controller

`populateAddFormModel(...)` binds:

- `form` — Challan Book web form object;
- `bookTypes` — all `bookTypeEnum` values;
- `bookLocations` — all `BookLocation` values;
- `states` — distinct, non-null state names derived from all-time summary metrics;
- `metrics` — summary metrics for the selected/current state filter;
- `viewSummary` — all-time summary metrics.

## Database / service depth

The controller's metric reads are delegated through `SummaryMetricLookupFetchService`. During this rework the exact frozen controller and template were bound, but the service implementation -> DAO/repository -> entity/view -> exact table/view read identity has not yet been proven from frozen source. That missing depth is recorded rather than guessed.

Therefore this Story is **identity-repaired and UI/controller source-bound, but not yet business-behavior complete** under the revised deepest-source contract.

## Validation / side effects

- This GET path has no bound database mutation in the controller.
- Form HTML enforces `min=1` and `required` on the three numeric creation fields, but those constraints apply when the separate POST form is submitted.
- No automatic Story approval occurs.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: bind `SummaryMetricLookupFetchService` to its exact implementation and downstream database read identity before revised business-behavior completion can be claimed.
