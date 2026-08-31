# DEV-0001 implementation plan

Target application branch: `automation/bl010-dev0001-customer-demand-search` from current `CylinderManagement/main`.

Planned source change is limited to `cylindermanagement.web/src/main/resources/templates/with-menu/CustomerDemandDashboard.html` unless source validation proves a backend correction is required.

The existing Customer Demand POST identity and server-side validation are preserved. The UI will replace create-form static Customer, Address and Product selects with searchable/dependent controls using the already bound REST services:
- `/cylindermanagement/search/customer/{searchText}`
- `/cylindermanagement/search/address/customer-address/{customerId}`
- `/cylindermanagement/search/product/{searchText}`

Customer and Product searches will use 3-character minimum input and 280 ms debounce. Selection stores the exact IDs in hidden form fields named `customerId`, `customerAddressId`, and `productId`. Customer clear/change resets the dependent address identity/options.

No Story approval or downstream revised testing fan-out is implied by this development work.
