# STORY-0078 — Set Customer Inactive

- Release: R1
- Endpoint: `POST /setCustomerInactive`
- Controller: `ToggleCustomerActiveStatusController.setCustomerInactive`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator on the Customer List, I can choose to set a customer inactive. The screen first opens a confirmation modal naming the selected customer. Confirming copies that row's customer ID into a hidden form and submits it together with the current page and page-size values. The controller asks `CustomerActiveStateUpdateService` to update that customer to inactive, shows a success or not-found flash message, and returns to the customer list page.

## Exact screen/browser contract

- UI JavaScript entry: `confirmInactive(customerId, customerName)`.
- It sets modal text to `"<customerName>" will be set inactive. Their data is preserved and can be re-activated.`
- It assigns `customerId` into hidden input `#inactive-form-id`, opens `#inactive-modal`, and wires `#inactive-modal-confirm` to close the modal then submit `#inactive-form`.
- Hidden form action: `POST /setCustomerInactive`.
- Hidden request fields: `customerId` from the selected row; `returnPage` from `${page.currentPageNumber}`; `itemsPerPage` from `${page.itemsPerPage}`; CSRF name/value when `_csrf` is present.
- The inspected inactive form does **not** contain a `searchTerm` field even though the controller accepts optional `searchTerm`; therefore this UI path does not prove preservation of an active search term and none is invented.
- No debounce or minimum-length rule applies to this action.

## Controller/service contract

Required controller parameters are `customerId: Long`, `returnPage: int`, and `itemsPerPage: int`; `searchTerm: String` is optional. The controller logs the customer ID and calls `customerService.updateActiveStatus(customerId, false)`.

If the service returns `true`, flash attribute `message` is exactly `Customer deactivated successfully`. If it returns `false`, flash attribute `error` is exactly `Customer not found.`

Redirect construction is `redirect:/fetchCustomerByPage?pageNumber=<returnPage>&itemsPerPage=<itemsPerPage>` and appends `&searchTerm=<term>` only when the optional controller `searchTerm` is non-null and non-blank. Because the inspected inactive form does not post that field, the standard UI action supplies only page/page-size plus customer identity.

## Persistence boundary

Controller → `CustomerActiveStateUpdateService.updateActiveStatus(customerId, false)`. The exact selected identity is the posted `customerId`; the target state value is the literal boolean `false`. This strict story does not invent deeper repository/entity/table behavior not proved by the inspected frozen source.

## Branch / reset / visible outcome

The service boolean is the only explicit controller success branch. On either branch the browser is redirected back to `/fetchCustomerByPage` with page number and page size. The action changes active status; it does not delete customer data. Modal state is closed immediately before submit. No button-disable predicate is proved in the inspected action code.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/ToggleCustomerActiveStatusController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/CustomerListPage.html` (`inactive-form`, `confirmInactive`).

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
