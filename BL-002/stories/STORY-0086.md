# STORY-0086 — Customer Address Search

- Release: R1
- Endpoint: `GET /search/address/customer-address/{customerId}`
- Register controller group: `Restful Address Services`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User intent and screen trigger
On Customer Stop, after the operator selects a customer from the customer-name search results, `selectCustomer(id,name)` stores the exact selected customer ID in hidden `vehicleTripStop.customer.customerId` and immediately calls `fetchAddresses(id)`. The address card is displayed with a loading indicator while the dependent lookup runs.

## Browser/API contract
The browser calls exactly `GET /cylindermanagement/search/address/customer-address/${customerId}`. There is no free-text debounce for this dependent lookup: it is triggered by selecting a customer. The path value is the selected result's numeric `customerId`.

The response contract is `CustomerAddressSearchResponseDto`; the UI reads `customerAddressDtos`. Each result exposes `customerAddressId` plus nested address data used for the visible address cards (`addressLine1`, `addressLine2`, `city`). If the list is empty, the screen displays `No addresses on file`; fetch failure displays `Failed to load addresses`.

## Selection propagation
Clicking an address card clears the previous selected-card CSS state, marks the clicked card selected, writes the exact `item.customerAddressId` to hidden field `vehicleTripStop.deliveryAddress.customerAddressId`, recomputes Customer Stop completion eligibility, and triggers exchange loading for the already-selected customer. Clearing the customer clears this address ID and hides downstream exchange state.

## Controller/service/database path
The canonical BL-001 trace proves `RestfulAddressServices.getCustomerAddressByCustomerId` -> `CustomerAddressFetchByIDService.searchWithText` -> `CustomerAddressJpaDao` over `public.tbl_customer_address`, `public.tbl_customer`, and `public.tbl_address` -> `CustomerAddressSearchResponseDto`.

The controller has explicit alternate outcomes: blank customer ID returns a null response body; invalid numeric ID or service exception returns an empty `CustomerAddressSearchResponseDto`. The UI consequently treats an empty DTO/list as no addresses rather than inventing an address.

## Persisted/read identity
This endpoint is read-only. The governing identity is the selected `customerId`; the returned selectable identity is `customerAddressId`. The downstream Customer Stop form persists the chosen address identity under `vehicleTripStop.deliveryAddress.customerAddressId`, but this search endpoint itself performs no write.

## Approval boundary
Strict field/UI enrichment is complete from frozen source plus canonical BL-001 trace. This is **not** approval; approval remains `PENDING_USER_APPROVAL`.
