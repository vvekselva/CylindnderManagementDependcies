# DEV-0001 — Exact source binding for STORY-0054 selector UX

Run: `CYLINDER-PRODUCTION-FIRE-20260831-075022Z`
Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Bound application sources

### Customer search
- Controller: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulCustomerServices.java`
- REST mapping: `GET /search/customer/{searchText}` under the application context.
- Request identity: path variable `searchText` is copied to `CylinderManagementApplicationRequestDto.searchTerm` and executed through `customerSearchService.searchWithText(...)`.
- Response type: `CustomerSearchResponseDto`.

### Customer-dependent address lookup
- Controller: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulAddressServices.java`
- REST mapping: `GET /search/address/customer-address/{customerId}` under the application context.
- Request identity: `customerId` is supplied as the search term to `customerAddressFetchByIDService.searchWithText(...)`.
- Response type: `CustomerAddressSearchResponseDto`.

### Product search
- Controller: `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/rest/RestfulProductServices.java`
- REST mapping: `GET /search/product/{searchText}` under the application context.
- Request identity: path variable `searchText` is copied to `CylinderManagementApplicationRequestDto.searchTerm` and executed through `productSearchService.searchWithText(...)`.
- Response type: `ProductSearchResponseDto`.

### Reusable Walk-in browser pattern
- Template: `cylindermanagement.web/src/main/resources/templates/with-menu/WalkinSaleIngestion.html`.
- Customer input minimum length: 3 characters.
- Customer debounce: 280 ms.
- Customer request URL in browser: `/cylindermanagement/search/customer/${encodeURIComponent(q)}`.
- Customer response collection: `customerDtos`.
- Selected identity mapping: `customerId`; display mapping: `customerName`.
- Selected Customer ID is stored in hidden form field `f-customerId`.
- Customer clear resets the hidden Customer ID and hidden Address ID.
- Address request URL: `/cylindermanagement/search/address/customer-address/${customerId}`.
- Address response collection: `customerAddressDtos`; selected identity: `customerAddressId` stored in `f-addressId`.

## Implementation conclusion
The previously unresolved exact source-binding gate is now closed for the reusable Customer search, dependent Customer Address lookup, Product search endpoint, and the Walk-in Customer browser interaction pattern. No duplicate REST endpoint is required.

The remaining implementation work is to rework the Customer Demand template to use these bound services/patterns, preserving its existing POST field identities (`customerId`, `customerAddressId`, `productId`) and server-side relationship validation. Product browser interaction may use the same minimum-length/debounce dropdown pattern, but its exact Customer-Demand implementation must be evidenced by the changed source after implementation rather than claimed from a pre-existing Product UI that was not proven here.

Story approval remains `NOT_APPROVED`; source binding or implementation must not auto-approve STORY-0054 or authorize downstream revised testing fan-out.
