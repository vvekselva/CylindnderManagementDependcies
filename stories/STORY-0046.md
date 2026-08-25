# STORY-0046 — Register a customer and persist customer contact and address relationships

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /registerCustomer`  
**Controller:** `UC01RegisterCustomerController.doPost`  
**Source baseline:** `3ae6e61442132d94a307275b08dd65fcef228d89`  
**Fingerprint:** `63cf5af46c92099508bf691b7465bfa1b829e88b8a5bc1c637319ff4a604b923`

A caller submits the customer-registration flow. The accepted trace proves submitted address-type identifiers, GST number, phone number, and city/state/country reference IDs because those values are consumed by the proved cache, validation, and reference-resolution branches. The accepted evidence does not preserve the complete request-field contract, so other fields are not invented.

Address types are first resolved from `LookupDataCache`. If that cache is empty, it is refreshed through `AddressTypeFetchByPageService.processRequest` with a blank search term and `AddressTypeJpaDao.findAll(pageable) -> AddressTypeDo -> public.tbl_address_type`. No other normalization/default behavior is asserted.

The ordered application flow is `UC01RegisterCustomerController.doPost -> UC01RegisterCustomerMediator.invokeServices -> CustomerIngestionService.processRequest`. The service invokes `CustomerIngestionRequstValidator.validate`. GST uniqueness is checked through `CustomerDetailsExistenceUtility.isGstNumberExists -> CustomerJpaDao.existsByGstNumberIgnoreCase -> CustomerDo -> public.tbl_customer`. Phone uniqueness is checked through `CustomerDetailsExistenceUtility.isPhoneNumberExists -> PhoneNumberJpaDao.existsByPhoneNumber -> PhoneNumberDo -> public.tbl_phone_number`.

The service then resolves city, state and country through their respective `JpaDao.findById` branches. Persistence is rooted at `CustomerJpaDao.save(CustomerDo) -> public.tbl_customer`. The proved cascade writes `CustomerAddressDo -> public.tbl_customer_address -> AddressDo -> public.tbl_address` and `CustomerPhoneNumberDo -> public.tbl_customer_phone_number -> PhoneNumberDo -> public.tbl_phone_number`.

On success, the controller returns `redirect:/ownership-dashboard`. A validation-failure path is also proved: `final-version-1/UC01RegisterCustomer` is rendered and address types are repopulated through the same cache/cache-miss path.

This Story remains **NEEDS_CLARIFICATION** because the accepted canonical evidence does not preserve the complete submitted field list, additional normalization/default rules, exact invalid-value predicates, precise validation ordering, or exact caller-visible validation messages. Those details must not be invented.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-150939.md`

## Downstream test assertion candidate

Verify that `POST /registerCustomer` follows the proved controller → mediator → service chain, performs GST and phone uniqueness reads, resolves city/state/country references, persists the proved customer/address/phone graph, and reaches the proved success or validation terminal path. This assertion is not downstream-authoritative until the Story receives explicit user approval.
