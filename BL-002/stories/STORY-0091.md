# STORY-0091 — Customer Search

- Release: R1
- Endpoint: `GET /search/customer/{searchText}`
- Controller: `RestfulCustomerServices.getCustomers`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Customer Stop screen contract
Visible input is Customer Name (`#custSearch`). On every browser `input` event the previous timer is cleared and text is trimmed. Fewer than 3 characters closes the result dropdown and performs no request. At 3+ characters a 280 ms debounce invokes `fetchCustomers(q)`.

The exact request is `GET /cylindermanagement/search/customer/${encodeURIComponent(q)}`. The UI reads `customerDtos`; each result displays `customerName` and `customerId`. `onmousedown` selection captures the exact result ID/name. No result displays `No customers found`; request failure displays `Search failed — try again`. Blur closes the dropdown after 180 ms.

## Selected identity and invalidation
Selecting a customer writes `customerId` to hidden `vehicleTripStop.customer.customerId`, shows the selected-customer banner, hides stale address/exchange state, and triggers dependent `GET /search/address/customer-address/{customerId}`. Clearing customer clears customer/address hidden IDs, hides downstream state, and recomputes completion eligibility.

## Service/database path
Canonical trace proves `RestfulCustomerServices.getCustomers` -> `CustomerSearchService.searchWithText` -> `SearchRequestValidator.validate` -> `CustomerJpaDao.findByCustomerNameContainingIgnoreCase` -> `CustomerDo` -> `public.tbl_customer` -> `CustomerMapper.mapDoToDto` -> `CustomerSearchResponseDto`.

The endpoint is read-only. Its persisted/read identity is customer ID from `public.tbl_customer`; the selected ID is propagated to the later Customer Stop write but is not modified by this search call.

## Approval boundary
Strict field/UI contract is complete from frozen Customer Stop UI plus canonical trace. Approval remains pending; no auto-approval occurs.
