# STORY-0047 — Customer Maintenance

- Release: R1
- Endpoint: `POST /updateCustomer`
- Functional area: Customer Maintenance
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user or system consumer, I want to submit a customer-maintenance request to **POST `/updateCustomer`** so that the application validates the supplied customer identity/details and, when valid, updates the persistence-backed customer relationships proven by the frozen source.

## Exact frozen-source contract proved

### HTTP/controller boundary

`CustomerUpdateController.doPost(...)` is the exact `@PostMapping("/updateCustomer")` handler. Spring binds model attribute `customer` to `CustomerUpdateRequestDto`. The controller invokes the injected `ICylinderManagementApplicationService<CustomerUpdateRequestDto, CustomerUpdateResponseDto>` via `customerUpdateService.processRequest(requestDto)`.

On successful service completion the controller redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`. On `InvalidInputParameterException` it returns the Thymeleaf view `UC01RegisterCustomer` with the submitted `CustomerUpdateRequestDto` under model key `customer`. A general `CylinderManagementApplicationException` builds a `ModelAndView` using the back-link string and returns the submitted customer object.

### Validation contract

`CustomerUpdateRequestValidator` proves the update request must contain a customer object and customer ID. It validates a non-blank customer name; a non-blank GST number matching the configured GST regex with state code 01–38; at least one phone number with normalization/10-digit/pattern checks; and at least one address. The validator also checks address fields and referenced location identities as applicable in the frozen implementation. Validation errors are attached to the request/nested DTOs and can raise input-validation failure.

### Service/branch/side-effect contract

The concrete bean is `CustomerUpdateService`; no separate `CustomerUpdateApplicationService` is required or proved for this path. The service:

1. validates using `CustomerUpdateRequestValidator` with service code `UPDATE_CUSTOMER`;
2. reads `customerDto.customerId` and loads the existing entity with `CustomerJpaDao.findById(customerId)`;
3. when the requested GST differs from the stored GST, checks global ownership and rejects a GST owned by another customer;
4. normalizes requested phone numbers, checks newly introduced numbers for ownership by another customer, and constructs replacement `CustomerPhoneNumberDo` mappings;
5. constructs replacement `CustomerAddressDo` mappings from requested addresses;
6. assigns the rebuilt phone/address collections to the managed `CustomerDo` and calls `CustomerJpaDao.save(existingCustomerDo)`;
7. returns `CustomerUpdateResponseDto` with SUCCESS response code when processing succeeds.

The frozen service contains `modelMapper.map(customerDto, existingCustomerDo)` only as commented-out code and logs `TO DO Mapper updates`. Therefore this Story **does not claim** that customer-name or GST scalar values are actively assigned to the persisted `CustomerDo` by this implementation. The GST value is actively validated/ownership-checked when changed, but a scalar GST assignment is not source-proved.

### DAO/entity/database identity

`CustomerJpaDao` extends `JpaRepository<CustomerDo, Long>`, so the active `findById`/`save` operations are Spring Data JPA persistence operations on `CustomerDo`. `CustomerDo` is `@Entity @Table(name="tbl_customer", schema="public")`; its primary key is `pk_customer_id`, generated from sequence `public.pk_customer_id_serial`. The entity maps `customer_name`, unique non-null `gst_number`, `active`, and one-to-many customer phone/address relationships. The active update service rebuilds the phone/address mappings and saves this managed customer aggregate.

## Visible/browser evidence and strict-completion blocker

The frozen controller's validation-error view is `UC01RegisterCustomer`. The frozen `UC01RegisterCustomer.html` form is explicitly:

`th:action="@{/registerCustomer}" th:object="${customer}" method="post"`

and the template contains no `/updateCustomer` action. Therefore the available frozen visible UI proves a **registration** browser submission, not a browser event that submits to STORY-0047's exact endpoint `POST /updateCustomer`.

This endpoint can be source-traced through controller, validator, service, DAO, entity and database identity, but the strict BL-002 standard also requires the exact applicable visible-control/browser-event contract. The frozen source currently does not prove such an update form. Treating the registration form as if it posted to `/updateCustomer` would invent behavior.

## Exact remaining source-detail gap

Strict completion is blocked until frozen authoritative source proves the user-visible update screen/control path and browser event that actually submits `CustomerUpdateRequestDto` to `POST /updateCustomer` (or proves that no browser UI is applicable under the governed Story contract). The commented scalar mapper also means no customer-name/GST database mutation may be asserted beyond what executable code proves.

No approval occurred. Physical materialization remains complete. No strict-field/UI completion is claimed for this Story in this run.
