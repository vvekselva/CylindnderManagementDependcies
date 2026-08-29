# STORY-0055 — Create Customer Demand

- Release: R1
- Endpoint: `POST /customer-demands`
- Controller: `CustomerDemandController.create`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User intent and browser entry
On the Customer Demands dashboard, the user enters a new demand in the server-rendered create form and activates `Save Request`. The form performs a normal POST to `/customer-demands`; the frozen template contains no JavaScript submit/AJAX/debounce path.

## Exact visible controls / submitted fields
The form is bound to `createRequest` and submits: `customerId` (Long, required select), `customerAddressId` (Long, optional select), `productId` (Long, required select), `requestedCylinders` (Integer, required number, HTML min 1), `requiredDeliveryDate` (LocalDate, optional date), `receivedBy` (String, required text), and `remarks` (String, optional textarea). `Save Request` is the submit control.

The customer select uses customer IDs, the optional address select uses customer-address IDs, and the product select uses product IDs. All three option lists are server rendered by the GET dashboard. No source-proved dependent customer/address lookup or hidden-field propagation exists.

## Controller mapping and outcome
`CustomerDemandController.create` binds the form with `@ModelAttribute("createRequest") CustomerDemandCreateRequestDto` and calls `CustomerDemandService.create`.

Success adds flash attribute `successMessage = "Customer demand created successfully"`. Any `RuntimeException` is caught and its message is added as `errorMessage`. Both paths redirect to `/customer-demands`, where the dashboard template renders the flash message.

## Service validation and reference guards
The service proves these guards: request object must exist; `customerId` is required; `productId` is required; `requestedCylinders` must be greater than zero; `receivedBy` must contain text.

The selected customer must exist in customer persistence and selected product must exist in product persistence. If `customerAddressId` is supplied, that address must exist. If the loaded address has a customer and its customer ID differs from the submitted `customerId`, creation is rejected with `Selected delivery address does not belong to selected customer`.

The template also supplies browser-native required/min constraints for customer, product, requested cylinders and received-by. There is no source-proved custom JavaScript validation or disabled-button rule.

## Derived/default values
If `requiredDeliveryDate` is absent, the service uses `LocalDate.now()`. That date is written as both requested date and required delivery date. Request type is `SAME_DAY` when the effective date equals today, otherwise `PLANNED`. Request status is set to `PENDING`. `requestedAt` is current local date/time.

A request number is generated as prefix `CDM-` plus a `yyyyMMddHHmmssSSS` timestamp. The entity maps request number as non-null and unique; no separate application duplicate-check branch is source-proved.

## Persistence path and exact identity
The service creates `CustomerDemandDo` and persists with `CustomerDemandJpaDao.saveAndFlush`. The entity maps to `public.tbl_customer_order_request`; generated primary identity is `pk_customer_order_request_id` using sequence `public.pk_customer_order_request_id_serial`.

Persisted relationships/values include customer (`fk_customer`), optional delivery address (`fk_delivery_address`), product (`fk_product`), request number, requested cylinders, requested/required delivery dates, request type/status, received-by, remarks and requested timestamp. Entity lifecycle also supplies created/updated/default consistency behavior when applicable.

## Visible completion behavior
Successful creation redirects to the dashboard and displays `Customer demand created successfully`. A caught runtime validation/reference/persistence error redirects to the same dashboard and displays the exception message through `errorMessage`.

## Governed conclusion
The frozen template, controller, DTO, service and entity/DAO source resolve the prior posted-field, validation, ID-propagation, default/status/date, persistence and visible-outcome gaps. STORY-0055 is `STRICT_FIELD_UI_COMPLETE`. Approval remains `PENDING_USER_APPROVAL`; no approval is inferred.
