# STORY-0042 — Customer Registration

- Release: R1
- Endpoint: `POST /registerCustomer`
- Functional area: Customer Registration
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Traceability state: COMPLETE
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit Customer Registration through `POST /registerCustomer` so that the entered customer, phone and address information is validated, transformed into persistence entities, and saved as the customer master and its associated contact/address records, while rejected input is returned to the same registration screen with validation feedback.

## Browser / submitted model

`templates/final-version-1/UC01RegisterCustomer.html` submits the controller-bound `customer` object. Visible Customer Name binds to `customerDto.customerName`; GST Number binds to `customerDto.gstNumber`, is limited to 15 characters, and is upper-cased by the browser input handler. The page renders customer-name/GST validation codes and submits phone/address collections plus `addressTypeIds[N]`.

`UC01RegisterCustomerController.doPost()` is mapped by `@PostMapping("/registerCustomer")` and binds `@ModelAttribute("customer") UC01RegisterCustomerRequestDto requestDto`.

The request contains `CustomerDto customerDto`, `List<AddressDto> addressDtos`, `List<PhoneNumberDto> phoneNumberDtos`, and `List<Long> addressTypeIds`.

## Address-type resolution before business processing

Before invoking the mediator, the controller resolves each submitted `addressTypeIds[N]` against `lookupDataCache.getAddressTypes()` and places the matched `AddressTypeDto` on `addressDtos[N]`. Missing indexes, null identifiers, or unmatched identifiers remain unresolved for downstream validation.

## Mediator, validation and persistence path

The concrete Spring component `UC01RegisterCustomerMediator` maps the UC01 request into `CustomerIngestionRequestDto` and calls `CustomerIngestionService.processRequest(...)`.

`CustomerIngestionService` first invokes `CustomerIngestionRequstValidator`. The validator source proves null request/customer rejection, required customer name, GST required/format/state-code/duplicate checks, required phone collection with phone normalization/length/pattern/duplicate checks, required address collection, Address Type presence validation, address-line validation, and city/state/country validation.

After validation, the service:

1. maps `CustomerDto` to `CustomerDo`;
2. maps each `AddressDto` to `AddressDo`;
3. resolves `CityDo`, `StateDo`, and `CountryDo` from the submitted IDs;
4. creates `CustomerAddressDo` linking the customer and address;
5. maps each `PhoneNumberDto` to `PhoneNumberDo`;
6. creates `CustomerPhoneNumberDo` linking customer and phone;
7. attaches the child associations to `CustomerDo`;
8. calls `customerJpaDao.save(customerDo)`.

## Exact database identities and generated IDs

The frozen entity mappings prove:

- `CustomerDo` -> `public.tbl_customer`; sequence `public.pk_customer_id_serial`; columns `pk_customer_id`, `customer_name`, `gst_number`, `active`.
- `AddressDo` -> `public.tbl_address`; sequence `public.pk_address_id_serial`; columns `pk_address_id`, `address_line_1`, `address_line_2`, `address_line_3`, `landmark`, `fk_city`, `fk_state`, `fk_country`.
- `CustomerAddressDo` -> `public.tbl_customer_address`; sequence `public.pk_customer_address_id_serial`; columns `pk_customer_address_id`, `fk_customer`, `fk_address`, `fk_address_type`.
- `PhoneNumberDo` -> `public.tbl_phone_number`; sequence `public.pk_phone_number_id_serial`; columns `pk_phone_number_id`, `phone_number`.
- `CustomerPhoneNumberDo` -> `public.tbl_customer_phone_number`; sequence `public.pk_customer_phone_number_id_serial`; columns `pk_customer_phone_number_id`, `fk_customer`, `fk_phone_number`.

`CustomerDo.customerAddresses` and `CustomerDo.customerPhoneNumbers` use `CascadeType.ALL`, and the association entities cascade their newly mapped Address/Phone entities where configured, so the customer save is the source-proved persistence entry point for the graph.

## Transaction boundary

`CustomerJpaDao` extends `JpaRepository<CustomerDo, Long>`. The application uses Spring Boot 3.2.5 / Spring Data JPA 3.2.5, whose `SimpleJpaRepository.save()` is transaction-demarcated. No broader `@Transactional` boundary is source-proved on `UC01RegisterCustomerMediator` or `CustomerIngestionService`; the exact proved boundary begins at the repository-proxy `save()` invocation.

## Material source-proved behavior requiring user review

The controller resolves an `AddressTypeDto`, and `CustomerAddressDo` has the persistence field `fk_address_type`. However, `CustomerIngestionService` creates each `CustomerAddressDo` and sets only `customer` and `address`; it does **not** call `setAddressType(...)` in the frozen implementation.

Therefore the source proves that Address Type is validated/resolved in the request but does not prove that the resolved Address Type is persisted into `public.tbl_customer_address.fk_address_type` on this code path. This is recorded as current source behavior for user review. It is not automatically converted into a development change, and no application code is mutated without explicit approval of an exact change manifest.

## Validation-error response

`InvalidInputParameterException` is caught by the controller. When it carries a `CustomerIngestionRequestDto`, validator-flagged customer, phone and address DTOs are copied back to the request model, validation errors remain available for rendering, Address Type options are reloaded, and the same registration screen is returned with the rejected values.

## Success response

If mediator invocation completes without `InvalidInputParameterException`, the controller redirects to `ViewConstants.REDIRECT_HOME_LINK` (`/ownership-dashboard` in the frozen source).

## Completion and approval gate

The Story is Business Behavior Complete because its browser submission, controller request identity, address-type resolution, concrete mediator, validator, service mapping, repository persistence path, entity/table/column identities, generated IDs, transaction boundary, error behavior and success outcome are source-bound. The Address Type persistence omission is explicitly documented as source-proved current behavior rather than hidden or invented.

This Story is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with fan-out requested. The documented Address Type persistence omission remains approved current-source behavior and is not treated as corrected or implemented by this approval.
