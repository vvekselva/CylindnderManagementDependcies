# STORY-0032 — Open Walk-in Sale

- Release: R1
- Endpoint: `GET /walkin-sale`
- Controller: `WalkinSaleIngestionController.doGet`
- Approval: PENDING_USER_APPROVAL
- Business-behavior state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User story

As a counter-sale operator, when I open the Walk-in Sale page, the application must prepare an empty walk-in-sale request and render the governed Walk-in Sale screen so that I can select a customer, select that customer's address, choose cylinders for delivery/return, enter the delivery challan leaf number and submit the transaction through the separate `POST /walkin-sale` Story.

## Exact GET behavior proved from frozen source

`WalkinSaleIngestionController.doGet()` handles `GET /walkin-sale`. It does not execute the walk-in-sale service and performs no database mutation. It creates a `ModelAndView` for `final-version-1/WalkinSaleIngestion`, adds model attribute `walkinSale`, and adds `backLink`.

The empty request is created by `buildEmptyRequest()`:

- `customer` is initialized with a new `CustomerDto`;
- `customerAddress` is initialized with a new `CustomerAddressDto`;
- `challanLeaf` is initialized with a new `ChallanLeafDto`;
- `challanLeaf.challanType` is preset to `DELIVERY`.

## Rendered screen contract

The frozen Thymeleaf template binds a form to `${walkinSale}` and posts to `/walkin-sale`. It preserves CSRF when available and carries these governed form identities:

- hidden `customer.customerId`;
- hidden `customerAddress.customerAddressId`;
- hidden `challanLeaf.challanType=DELIVERY`;
- generated `fullCylinderIdForDelivery` hidden inputs;
- generated `emptyCylinderIdForYard` hidden inputs;
- visible numeric `challanLeaf.challanNumber` input.

The page presents three user stages: customer selection, address selection and cylinder exchange.

## Browser-side selection behavior proved from the template

Customer search is not a static selector. After at least 3 typed characters and a 280 ms debounce, the page calls `GET /cylindermanagement/search/customer/{searchText}` and renders `customerDtos`. Selecting a result writes the exact `customerId` into `customer.customerId` and starts address loading.

Address loading calls `GET /cylindermanagement/search/address/customer-address/{customerId}` and renders `customerAddressDtos`. Selecting an address writes `customerAddressId` into `customerAddress.customerAddressId` and starts cylinder loading.

Cylinder exchange then loads two independent data sets:

- yard delivery candidates through `POST /cylindermanagement/search/cylinder/by-state` with FULL-state search criteria;
- customer return candidates through `POST /cylindermanagement/search/cylinder/by-customer` with the selected customer ID and governed state criteria.

Checking rows materializes the selected cylinder IDs into the hidden delivery/return request fields. The summary shows the selected serials and the `Complete Walk-in Sale` button submits the form.

## Visible failure/empty behavior

The template shows explicit states for customer-search failure/no results, missing/failed address loading, no yard FULL cylinders, failed yard-stock loading, no customer holdings, and failed customer-holdings loading.

## Persistence and transaction boundary

This GET Story performs **no persistence write and no transaction-producing service call**. Its responsibility is page initialization and rendering. The actual sale mutation, server-side validation, service/DAO/database effects, success redirect and submission-error handling belong to `STORY-0033 — POST /walkin-sale` and must not be invented into this GET Story.

## Review gate

The source-proved GET contract is complete for business-behavior review. No user approval is implied or recorded.
