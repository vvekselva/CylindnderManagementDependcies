# STORY-0079 — Set Customer Active

- Release: R1
- Endpoint: `POST /setCustomerActive`
- Controller: `ToggleCustomerActiveStatusController.setCustomerActive`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator on the Customer List, I can reactivate an inactive customer. The screen opens an activation confirmation modal for the selected customer; confirming propagates that row's customer ID into a hidden form and posts it with the current pagination context. The controller asks the active-state service to set the customer active, displays a success or not-found flash message, then returns to the customer list.

## Exact screen/browser contract

The UI uses `confirmActivate(customerId, customerName)` and hidden form `#activate-form` whose action is `POST /setCustomerActive`. The form posts `customerId` through `#activate-form-id`, `returnPage` from `${page.currentPageNumber}`, `itemsPerPage` from `${page.itemsPerPage}`, and CSRF name/value when `_csrf` is present. The inspected form does not prove a posted `searchTerm`, although the controller accepts it optionally. No debounce/minimum-length rule applies.

## Controller/service contract

Required request parameters: `customerId: Long`, `returnPage: int`, `itemsPerPage: int`. Optional: `searchTerm: String`. The controller calls `customerService.updateActiveStatus(customerId, true)`. A `true` service result sets flash `message = "Customer activated successfully"`; `false` sets flash `error = "Customer not found."`.

Redirect is `redirect:/fetchCustomerByPage?pageNumber=<returnPage>&itemsPerPage=<itemsPerPage>` with `&searchTerm=<term>` appended only when the optional controller value is non-null and non-blank.

## Persistence / branch / outcome

The exact selected identity is posted `customerId`; target active state is literal boolean `true`. The service boolean is the explicit success branch. No delete occurs. The action returns to the customer list with pagination preserved by posted hidden fields. No deeper repository/table mutation is invented beyond the proved service boundary.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/ToggleCustomerActiveStatusController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/CustomerListPage.html` (`activate-form`, activation modal/JavaScript).

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
