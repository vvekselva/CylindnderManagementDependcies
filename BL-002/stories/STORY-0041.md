# STORY-0041 — Customer Registration

- Release: R1
- Endpoint: `GET /registerCustomer`
- Functional area: Customer Registration
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Customer Registration screen through `GET /registerCustomer` so that I receive a blank customer-registration form and the reference data needed to enter a new customer.

## Frozen-source contract proved in this run

### Request and controller

`UC01RegisterCustomerController.doGet()` is mapped by `@GetMapping("/registerCustomer")`. The handler creates a new `UC01RegisterCustomerRequestDto`, initializes `addressDtos` and `phoneNumberDtos` as empty lists, creates a `ModelAndView` using `ViewConstants.REGISTER_CUSTOMER_VIEW`, binds the request object under model key `customer`, and binds `lookupDataCache.getAddressTypes()` under model key `addressTypes`.

`ViewConstants.REGISTER_CUSTOMER_VIEW` resolves to `final-version-1/UC01RegisterCustomer`, so the rendered Thymeleaf resource is `templates/final-version-1/UC01RegisterCustomer.html`.

### Screen and browser contract

The template renders the Register Customer workflow and posts to `/registerCustomer` with `th:object="${customer}"`. Frozen template evidence proves, among the visible registration controls, Customer Name bound to `customerDto.customerName` and GST Number bound to `customerDto.gstNumber`; the GST control has a 15-character maximum and upper-cases input in the browser. The page includes a CSRF hidden input when a CSRF token is available and supports phone/address collection plus an Address Type selection backed by the controller-supplied `addressTypes` model data. Validation styling/messages are rendered from validation state carried by the bound DTO.

### Reference-data behavior

`LookupDataCache.getAddressTypes()` returns the in-memory Address Type list. If that list is empty it invokes `refreshAddressTypes()`. The refresh constructs an `AddressTypeFetchByPageRequestDto` for page 1, `Integer.MAX_VALUE` items, empty search term, and `activeOnly=false`, then invokes the injected `addressTypeFetchService.processRequest(req)` and replaces the cached list with the returned `AddressTypeDto` list (or an empty list when none is returned). The same cache is loaded during `@PostConstruct init()` via `refreshAll()`.

### Response / visible outcome

On a normal GET, no customer write is performed by this controller. The response is the Customer Registration view containing a new blank `customer` request model plus Address Type reference data. A cache miss may cause the Address Type fetch service to be called before rendering.

## Exact remaining source-detail gap

Strict completion is deliberately **not** claimed. The frozen repository proves the controller, template/model binding, visible controls, browser behavior, cache boundary, request DTO used by the cache, and the injected application-service interface. However, the implementation behind `ICylinderManagementApplicationService<AddressTypeFetchByPageRequestDto, AddressTypeFetchByPageResponseDto>` is not present in the frozen repository tree available to this orchestration run. Therefore the service -> DAO/repository -> entity/table/column identity for the Address Type cache reload cannot be source-proved here without inventing an implementation.

Until that downstream implementation/database identity is available from authoritative frozen source, STORY-0041 remains `SOURCE_DETAIL_REVIEW_REQUIRED` and does not increase `strict_field_ui_complete`.

No behavior beyond frozen evidence is invented. No approval occurred.
