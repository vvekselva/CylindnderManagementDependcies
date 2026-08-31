# STORY-0041 — Customer Registration

- Release: R1
- Endpoint: `GET /registerCustomer`
- Functional area: Customer Registration
- Approval: PENDING_USER_APPROVAL
- Review state: REWORK_REQUIRED_FIELD_COVERAGE
- Traceability state: DOWNSTREAM_REFERENCE_DATA_SOURCE_BOUND
- Enrichment state: BUSINESS_BEHAVIOR_REWORK_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Customer Registration screen through `GET /registerCustomer` so that I receive a blank customer-registration form and the reference data needed to enter a new customer.

## Request and controller behavior

`UC01RegisterCustomerController.doGet()` is mapped by `@GetMapping("/registerCustomer")`. The handler creates a new `UC01RegisterCustomerRequestDto`, initializes `addressDtos` and `phoneNumberDtos` as empty lists, creates a `ModelAndView` using `ViewConstants.REGISTER_CUSTOMER_VIEW`, binds the request object under model key `customer`, and binds `lookupDataCache.getAddressTypes()` under model key `addressTypes`.

`ViewConstants.REGISTER_CUSTOMER_VIEW` resolves to `final-version-1/UC01RegisterCustomer`, so the rendered Thymeleaf resource is `templates/final-version-1/UC01RegisterCustomer.html`.

## Screen behavior currently source-proved

The template renders the Register Customer workflow and posts to `/registerCustomer` with `th:object="${customer}"`. Existing frozen template evidence proves Customer Name bound to `customerDto.customerName` and GST Number bound to `customerDto.gstNumber`; GST has a 15-character maximum and browser-side uppercase behavior. The page also supports phone/address collection, Address Type selection from controller-supplied `addressTypes`, CSRF when available, and validation styling/messages carried by the bound DTO.

A normal GET does not persist a Customer. It prepares the blank form and reference data only.

## Address Type reference-data read — downstream source now resolved

`LookupDataCache.getAddressTypes()` returns the in-memory Address Type list and refreshes it when empty. Its refresh request asks for page 1, `Integer.MAX_VALUE` items, an empty search term and `activeOnly=false` through the injected Address Type fetch service.

The frozen concrete implementation is `AddressTypeFetchByPageService`. It normalizes page/size, sorts ascending by `addressType`, and:

- with a nonblank search term, calls `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCaseOrDescriptionContainingIgnoreCase(...)`;
- without a search term, calls `AddressTypeJpaDao.findAll(pageable)`.

The service maps `AddressTypeDo` rows to `AddressTypeDto` values and returns the list plus paging metadata with application response code `SUCCESS`.

`AddressTypeJpaDao` is a `JpaRepository<AddressTypeDo, Long>`. `AddressTypeDo` maps to `public.tbl_address_type` with generated primary key `pk_address_type_id` using sequence `public.pk_address_type_id_serial`; the business fields are `address_type` (required, unique, max 100) and `description` (required, max 100). Therefore the cache reload is a read of the governed Address Type reference table; it does not write Customer data.

## Selector UX review status

Address Type is a bounded reference classification used inside the address sub-form. The broader Customer Registration page still requires a complete control-by-control selector review before the Story can be promoted to the business-behavior-complete state. No Customer/Product/Supplier/Vehicle/Driver search conversion is inferred merely from the Address Type lookup implementation.

## Remaining business-behavior rework

The previous downstream source-resolution blocker is closed. The Story is nevertheless **not yet BUSINESS_BEHAVIOR_COMPLETE** because the complete rendered form still needs a source-bound inventory of every visible/entered/selected phone and address field, each field's business meaning and validation, add/remove/change behavior, submit interaction, related embedded operations, server-side relationship validation, success/error outcomes, and any applicable large-reference selector behavior.

No missing behavior is invented and no application code was changed.

## Approval

Approval remains pending. Completion of this source-detail repair does not auto-approve or auto-reapprove the Story.
