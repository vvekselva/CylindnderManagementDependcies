# STORY-0042 — Customer Registration

- Release: R1
- Endpoint: `POST /registerCustomer`
- Functional area: Customer Registration
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit Customer Registration through `POST /registerCustomer` so that the entered customer, phone and address information is validated and handed to the registration use-case mediator, with validation feedback returned to the same screen when input is rejected.

## Frozen-source contract proved

### Browser / submitted model

`templates/final-version-1/UC01RegisterCustomer.html` submits the customer-registration form against the controller-bound `customer` object. Frozen template evidence proves visible Customer Name binding to `customerDto.customerName` and GST Number binding to `customerDto.gstNumber`. GST input has `maxlength="15"` and an `oninput` handler that upper-cases the browser value. The rendered error styling recognizes `CUSTOMER_NAME_INVALID`, `GST_NUMBER_NULL`, `GST_NUMBER_INVALID`, and `GST_NUMBER_ALREADY_EXISTS` validation codes.

### Controller and request identity

`UC01RegisterCustomerController.doPost()` is mapped by `@PostMapping("/registerCustomer")` and binds `@ModelAttribute("customer") UC01RegisterCustomerRequestDto requestDto`.

`UC01RegisterCustomerRequestDto` contains:

- `CustomerDto customerDto`
- `List<AddressDto> addressDtos`
- `List<PhoneNumberDto> phoneNumberDtos`
- `List<Long> addressTypeIds`

The DTO documents that `addressTypeIds[N]` maps to `addressDtos[N]` because Spring MVC cannot reliably construct the nested `AddressTypeDto` from the single submitted identifier property.

`CustomerDto` proves the submitted customer object carries `customerId`, `customerName`, `gstNumber`, `active`, and associated phone/address/business collections. No validation annotation is present on this DTO itself in the frozen source inspected here.

### Address-type resolution branch

Before mediator invocation, `doPost()` calls `resolveAddressTypes(requestDto)`.

- If `addressDtos` or `addressTypeIds` is null, resolution is skipped.
- For each address, a missing corresponding id is left unresolved.
- A supplied id is matched against `lookupDataCache.getAddressTypes()` by `addressTypeId`.
- When found, the full `AddressTypeDto` is set on the corresponding `AddressDto`.
- When not found, the address type remains null.

### Application handoff

After address-type resolution, the controller invokes the injected `ICylinderManagementApplicationMediator<UC01RegisterCustomerRequestDto, UC01RegisterCustomerResponseDto>` through `uC01RegisterCustomerMediator.invokeServices(requestDto)`.

This is the deepest concrete write-side application boundary proven from the frozen source available to this run.

### Validation-error response

`InvalidInputParameterException` is caught by the controller. When the exception carries a `CustomerIngestionRequestDto`, its validator-flagged `CustomerDto`, phone list and address list are copied back into the use-case request DTO. Validation errors remain attached for rendering. The controller then re-renders `ViewConstants.REGISTER_CUSTOMER_VIEW` with:

- model key `customer` = the rejected request DTO;
- model key `addressTypes` = `lookupDataCache.getAddressTypes()`.

The visible outcome is therefore the Customer Registration screen populated with rejected input and validation indicators/messages rather than a success redirect.

### Success response

If mediator invocation returns without `InvalidInputParameterException`, the controller logs successful registration and returns `redirect:` plus `ViewConstants.REDIRECT_HOME_LINK`.

## Exact remaining source-detail gap

Strict completion is deliberately **not** claimed. The frozen repository proves the POST endpoint, browser bindings, request DTO/model structure, address-type resolution, mediator boundary, validation exception branch, re-render behavior, and success redirect. However, the concrete implementation behind the injected UC01 mediator and its downstream customer-ingestion service -> DAO/repository -> entity/table/column write path is not present or otherwise source-resolvable in the frozen source evidence available to this orchestration run.

Therefore the exact database identities, uniqueness query/guard implementation, transaction boundary, persisted side effects, generated database identifiers, and downstream response population cannot be asserted without inventing behavior. `SOURCE_DETAIL_REVIEW_REQUIRED` remains correct and this Story does not increase `strict_field_ui_complete`.

No approval occurred.
