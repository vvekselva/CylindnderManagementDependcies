# STORY-0041 — Register Customer Page and Embedded Registration Capability

- Release: R1
- Primary endpoint: `GET /registerCustomer`
- Embedded submit endpoint: `POST /registerCustomer` (cross-reference `STORY-0042`)
- Functional area: Customer Registration
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose and user goal

This page lets an authorized Cylinder Management user create a new customer record together with one or more contact phone numbers and one or more delivery/address records. The user enters through `GET /registerCustomer`; the controller prepares a fresh registration request and the page itself contains the full embedded registration form that submits to `POST /registerCustomer`.

The page-level contract includes the entry fields, dynamic phone/address management, location searches, validation feedback and the post-submit success/error outcomes described below.

## Page entry and initial state

`UC01RegisterCustomerController.doGet()` creates a new `UC01RegisterCustomerRequestDto`, initializes empty `addressDtos` and `phoneNumberDtos`, renders `ViewConstants.REGISTER_CUSTOMER_VIEW` (`final-version-1/UC01RegisterCustomer`), binds the request as model key `customer`, and supplies `addressTypes` from `LookupDataCache`.

The fresh page therefore starts without a persisted customer identity. Phone and address rows are added by the user in the browser. The page includes CSRF submission support when Spring Security exposes the token.

## Visible and entered business fields

### Company information

- **Customer Name** (`customerDto.customerName`) — the customer's registered/business name. The rendered validation contract recognizes `CUSTOMER_NAME_INVALID`.
- **GST Number** (`customerDto.gstNumber`) — the customer's GSTIN used as a business/tax identifier. The browser limits it to 15 characters and converts typed text to uppercase. The rendered validation contract recognizes `GST_NUMBER_NULL`, `GST_NUMBER_INVALID`, and `GST_NUMBER_ALREADY_EXISTS`.

The frozen template does not prove a separate registration-date entry on this page.

### Phone numbers

The page allows multiple `phoneNumberDtos[N].phoneNumber` values. Each displayed phone input is prefixed with `+91`, limited to 10 characters and can surface service validation messages. The first row is labelled **Primary** and later rows **Secondary**. The user can add and remove rows, but the browser prevents removal of the last remaining phone row once rows exist.

### Delivery/address records

For each `addressDtos[N]`, the user can maintain Address Type (`addressTypeIds[N]`), Address Lines 1–3, Landmark, and searchable Country/State/City identities. The controller resolves submitted Address Type IDs back to `AddressTypeDto` values before business processing.

## Reference-selector UX review

Country, State and City are type-ahead/search controls:

- Country: `GET /search/country/{q}`
- State: `GET /search/state/{q}`
- City: `GET /search/city/{q}`
- debounce: 280 ms
- search starts for any non-empty trimmed query
- selecting a result writes visible text plus hidden identity
- editing a selected value clears its hidden identity
- changing Country clears State and City; changing State clears City
- empty results render `No results found`

Address Type is a bounded domain lookup from `LookupDataCache`; no selector conversion is required.

## Embedded submit and exact persistence effect

The form submits the `customer` model to `POST /registerCustomer` (`STORY-0042`). STORY-0042 is the source-bound companion for this page and proves the exact downstream chain rather than leaving the GET page at a controller-only boundary:

1. `UC01RegisterCustomerController.doPost()` binds `UC01RegisterCustomerRequestDto` and resolves Address Type identities.
2. `UC01RegisterCustomerMediator` maps the request to `CustomerIngestionRequestDto`.
3. `CustomerIngestionService.processRequest(...)` invokes `CustomerIngestionRequstValidator`, maps Customer/Address/Phone DTOs to persistence entities and calls `customerJpaDao.save(customerDo)`.
4. `CustomerJpaDao` is the Spring Data JPA repository persistence entry point.
5. Source-bound entities map the graph to `public.tbl_customer`, `public.tbl_address`, `public.tbl_customer_address`, `public.tbl_phone_number`, and `public.tbl_customer_phone_number`, with generated primary-key sequences recorded in STORY-0042.

The same source proof also records the material Address Type behavior: the request Address Type is resolved and validated, but the frozen `CustomerIngestionService` does not source-prove a `setAddressType(...)` assignment when building `CustomerAddressDo`. Therefore persistence of `fk_address_type` is not asserted. This is current source behavior requiring user review, not an automatic development change.

## Visible outcomes

On successful mediator execution the controller redirects to `/ownership-dashboard`. On `InvalidInputParameterException`, validator-marked Customer, Phone and Address DTOs are restored to the request, Address Type options are reloaded and the same registration page is rendered with entered values and validation feedback.

## Completion and approval gate

The page entry, visible controls, selector behavior, submit identity, validation flow, concrete mediator/service/repository chain, exact persistence table identities, success path and error path are now source-bound through the page plus its embedded source-proved POST companion STORY-0042.

STORY-0041 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. No approval is inferred or automatically applied, and the Address Type persistence omission remains explicitly review-gated.
