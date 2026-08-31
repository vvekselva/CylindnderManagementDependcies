# STORY-0041 — Register Customer Page and Embedded Registration Capability

- Release: R1
- Primary endpoint: `GET /registerCustomer`
- Embedded submit endpoint: `POST /registerCustomer` (cross-reference `STORY-0042`)
- Functional area: Customer Registration
- Approval: PENDING_USER_APPROVAL
- Rework state: REWORK_IN_PROGRESS_SOURCE_BINDING_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose and user goal

This page lets an authorized Cylinder Management user create a new customer record together with one or more contact phone numbers and one or more delivery/address records. The user enters through `GET /registerCustomer`; the controller prepares a fresh registration request and the page itself contains the full embedded registration form that submits to `POST /registerCustomer`.

The page is therefore not merely a read-only GET. Its business capability is customer master creation, and the page-level contract includes the entry fields, dynamic phone/address management, location searches, validation feedback and the post-submit success/error outcomes described below.

## Page entry and initial state

`UC01RegisterCustomerController.doGet()` creates a new `UC01RegisterCustomerRequestDto`, initializes empty `addressDtos` and `phoneNumberDtos`, renders `ViewConstants.REGISTER_CUSTOMER_VIEW` (`final-version-1/UC01RegisterCustomer`), binds the request as model key `customer`, and supplies `addressTypes` from `LookupDataCache`.

The fresh page therefore starts without a persisted customer identity. Phone and address rows are added by the user in the browser. The page includes CSRF submission support when Spring Security exposes the token.

## Visible and entered business fields

### Company information

- **Customer Name** (`customerDto.customerName`) — the customer's registered/business name. The rendered validation contract recognizes `CUSTOMER_NAME_INVALID`.
- **GST Number** (`customerDto.gstNumber`) — the customer's GSTIN used as a business/tax identifier. The browser limits it to 15 characters and converts typed text to uppercase. The rendered validation contract recognizes `GST_NUMBER_NULL`, `GST_NUMBER_INVALID`, and `GST_NUMBER_ALREADY_EXISTS`.

The current frozen template does **not** prove a separate registration-date entry on this page; earlier aggregate/legacy descriptions mentioning such a visible field are not carried forward as current page behavior without source proof.

### Phone numbers

The page allows multiple `phoneNumberDtos[N].phoneNumber` values. Each displayed phone input is prefixed with `+91`, limited to 10 characters and can surface service validation messages. The first row is labelled **Primary** and later rows **Secondary**. The user can add and remove rows, but the browser prevents removal of the last remaining phone row once rows exist, reflecting the page rule that at least one phone number is required.

### Delivery/address records

For each `addressDtos[N]`, the user can maintain:

- **Address Type** — selected from the server-provided `addressTypes` domain list and submitted as `addressTypeIds[N]`; the controller resolves that identifier back to an `AddressTypeDto` before invoking the business mediator.
- **Address Line 1** — plot/house/building information; rendered validation recognizes `ADDRESS_LINE1_INVALID`.
- **Address Line 2** — street/colony/area information; rendered validation recognizes `ADDRESS_LINE2_INVALID`.
- **Address Line 3** — optional additional address text.
- **Landmark** — optional location landmark.
- **Country** — searchable reference with submitted `countryId` plus display name.
- **State** — searchable reference with submitted `stateId` plus display name.
- **City** — searchable reference with submitted `cityId` plus display name.

The user can add or remove address cards. The browser prevents removal of the last remaining address once address rows exist, expressing the page requirement that a registration retains at least one address.

## Reference-selector UX review

This Story has been reviewed against the mandatory large-reference selector policy.

Country, State and City are already implemented as type-ahead/search controls rather than static large list boxes:

- Country: `GET /search/country/{q}` → `countryDtos[{countryId,countryName}]`
- State: `GET /search/state/{q}` → `stateDtos[{stateId,stateName}]`
- City: `GET /search/city/{q}` → `cityDtos[{cityId,cityName}]`
- debounce: **280 ms**
- search begins for any non-empty trimmed query; no higher minimum-length threshold is source-proved
- selecting a result writes both the visible text and hidden selected ID/name
- editing a selected value clears its hidden ID/name so stale identities are not submitted
- changing/clearing Country clears State and City
- changing/clearing State clears City
- an empty result renders `No results found`

Address Type is a bounded domain lookup supplied from `LookupDataCache`, not a large business-reference selector requiring conversion to a search REST service. No Customer/Product/Supplier/Vehicle/Driver selector exists on this create-customer page. Therefore **no selector search conversion is required for STORY-0041** under current source evidence.

## What happens on submit

The form posts the complete `customer` model to `POST /registerCustomer` (`STORY-0042`). Before the application mediator is invoked, the controller resolves every submitted `addressTypeIds[N]` against `lookupDataCache.getAddressTypes()` and assigns the matching `AddressTypeDto` to `addressDtos[N]`. A missing index, null identifier or identifier not found in the cache leaves that address type unresolved for downstream validation rather than inventing a replacement.

The controller then calls the typed `ICylinderManagementApplicationMediator<UC01RegisterCustomerRequestDto, UC01RegisterCustomerResponseDto>` through `uC01RegisterCustomerMediator.invokeServices(requestDto)`.

### Visible success outcome

When mediator invocation completes without `InvalidInputParameterException`, the controller treats registration as successful and redirects to `ViewConstants.REDIRECT_HOME_LINK`, which is `/ownership-dashboard` in the frozen source.

### Visible validation-error outcome

When `InvalidInputParameterException` carries a `CustomerIngestionRequestDto`, the controller copies the validator-flagged Customer, Phone and Address DTOs back into the page request, preserves validation error DTOs, reloads the Address Type options and re-renders the same registration page. The user therefore sees the rejected values together with field/card error highlighting and MessageSource-resolved error text instead of losing the entered data.

## Exact system read/write effect — current source boundary

Reads source-proved at page/controller level:

- Address Type reference data from `LookupDataCache`; existing downstream evidence binds that cache refresh through `AddressTypeFetchByPageService` / `AddressTypeJpaDao` to `public.tbl_address_type`.
- Country/State/City search results from the established `/search/country/{q}`, `/search/state/{q}`, and `/search/city/{q}` REST patterns.

Write intent source-proved at page/controller level:

- the submitted customer, phone and address model is handed to the UC01 customer-registration mediator after Address Type identity resolution.

The exact downstream mediator implementation, customer-ingestion service transaction, DAO/repository calls, generated persisted customer/address/phone identifiers, exact table/column writes, uniqueness query implementation and transaction boundaries are **not yet source-bound in the frozen evidence available to this run**. `STORY-0042` independently records the same deepest proven write boundary. Those details must not be invented merely to declare this GET page complete.

## Downstream business impact

When the embedded registration operation eventually succeeds, the intended business capability is creation of a customer master that can subsequently participate in customer search, address selection, delivery/custody and other customer-linked operations. The precise persisted identities and side effects remain gated on concrete mediator/service/DAO source binding; no unproved database effect is asserted here.

## Rework completion gate

The page/UI/business-flow and selector-UX portions are source-bound. STORY-0041 remains `REWORK_IN_PROGRESS_SOURCE_BINDING_REQUIRED` because the mandatory exact write-side persistence identity/effect cannot yet be proved. It is **not awaiting approval yet**, and no approval is inferred from historical downstream artifacts.
