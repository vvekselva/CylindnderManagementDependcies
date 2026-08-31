# STORY-0054 — Customer Demand Dashboard and Create-Demand Entry

- Release: R1
- Primary page endpoint: `GET /customer-demands`
- Related create action: `POST /customer-demands` (`STORY-0055`)
- Page controller: `CustomerDemandController.showDashboard`
- Approval: **NOT_APPROVED**
- Review state: **READY_FOR_USER_REVIEW_AFTER_IMPLEMENTATION_SOURCE_RECONCILIATION**
- Frozen behavior/source reference: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Implemented development source: PR #3, head `dde2b007c8ad5278f162cf153b5857397d5b35a0`
- Development backlog: `BL-010/DEV-0001`

## Business purpose
The Customer Demand page is used to record what a customer is asking the business to deliver and to monitor those demands. From the same page the user can view/filter existing demands and metrics and create a new demand with Customer, Delivery Address, Product, requested cylinders, required date, received-by and optional remarks.

A successful Save Request creates a durable pending customer-demand/order-request record for later monitoring and delivery planning.

## Reconciled implemented create-demand journey
The former long static Customer/Product reference lists are no longer the accepted target. The implementation in PR #3 now follows the source-bound searchable-selector contract below.

### 1. Customer — searchable selector
The visible Customer control is a search box. Browser behavior is now source-proved as:

- minimum input length: **3 characters**;
- debounce: **280 ms**;
- exact REST endpoint: `GET /search/customer/{searchText}` (browser URL under the deployed context: `/cylindermanagement/search/customer/{searchText}`);
- response collection: `customerDtos`;
- display value: `customerName`;
- selected identity: `customerId`;
- selected ID is stored in the hidden form field bound to `customerId`;
- editing/clearing Customer invalidates the selected Customer ID and also clears the dependent Address ID/options.

This reuses the existing Walk-in Sale search pattern and does not introduce a duplicate Customer endpoint.

### 2. Delivery Address — dependent on selected Customer
Address selection is disabled until a Customer is selected. The implementation then calls:

`GET /search/address/customer-address/{customerId}`

(browser URL `/cylindermanagement/search/address/customer-address/{customerId}`).

The response collection is `customerAddressDtos`; each option carries `customerAddressId`. Changing/clearing Customer resets `customerAddressId` and the Address options before another lookup. Server-side ownership validation remains authoritative: a submitted Address must belong to the submitted Customer.

### 3. Product — searchable selector
The visible Product control is a search box with:

- minimum input length: **3 characters**;
- debounce: **280 ms**;
- exact REST endpoint: `GET /search/product/{searchText}` (browser URL `/cylindermanagement/search/product/{searchText}`);
- response type: `ProductSearchResponseDto`;
- exact JSON collection: `productDtos` (source-proved from `ProductSearchResponseDto#getProductDtos()`);
- display value: `productName`;
- selected identity: `productId`;
- selected ID is stored in the hidden form field bound to `productId`;
- editing/clearing the Product search invalidates stale `productId`.

### 4. Other demand fields
| Field | Required | User meaning | System impact |
|---|---|---|---|
| Customer | Yes | Customer requesting cylinders/product | Search selection submits `customerId`. |
| Customer Address | No | Delivery location | Only selected Customer's addresses are offered; selection submits `customerAddressId`. |
| Product | Yes | Requested product | Search selection submits `productId`. |
| `requestedCylinders` | Yes | Requested cylinder quantity | Must be greater than zero. |
| `requiredDeliveryDate` | No | Required delivery date | Defaults to today if absent; contributes to SAME_DAY/PLANNED classification. |
| `receivedBy` | Yes | Person who received/recorded request | Must contain text and is persisted. |
| `remarks` | No | Additional instructions/context | Optional persisted information. |

## Save Request — business transaction
Save Request posts the hidden selected identities and entered fields to `POST /customer-demands`. Existing service rules remain authoritative:

- Customer is required and must exist;
- Product is required and must exist;
- requested quantity must be greater than zero;
- received-by must contain text;
- an optional Address must exist and belong to the selected Customer.

On valid input the system creates `CustomerDemandDo` through `CustomerDemandJpaDao.saveAndFlush` in `public.tbl_customer_order_request`. The existing transaction derives/generates request number (`CDM-` prefix), `PENDING` status, effective required-delivery date, `SAME_DAY` versus `PLANNED`, request timestamp, and the generated database identity `pk_customer_order_request_id` using `public.pk_customer_order_request_id_serial`.

A validation/reference/persistence failure must not create the demand and must return a visible error so the user can correct the input.

## Existing dashboard behavior
The page continues to show demand/delivery metrics and existing demands, with filters including status, request type, product name and search term plus pagination. These monitoring controls are separate from the new create-form reference searches.

## Implementation/source reconciliation evidence
`BL-010/DEV-0001` is source-validated against PR #3 head `dde2b007c8ad5278f162cf153b5857397d5b35a0`:

- exact Customer, Address and Product services are bound;
- exact Customer/Address response collections are bound;
- `ProductSearchResponseDto.productDtos` is proven directly from frozen DTO source;
- hidden submitted identities remain `customerId`, `customerAddressId`, `productId`;
- Customer change clears stale Address selection;
- Product change clears stale Product identity;
- minimum length/debounce are implemented as 3 / 280 ms;
- the PR was scope-minimized so the governed change is limited to `with-menu/CustomerDemandDashboard.html`;
- no live browser execution is claimed by this source-validation step.

## User/system impact
The user searches for a Customer instead of scanning a long list, sees only that Customer's delivery addresses, searches for a Product, enters demand details, and saves. The system still receives exact persistent IDs and retains server-side relationship validation, reducing incorrect Customer/Address/Product association while preserving the existing business transaction.

## Approval and fan-out gate
This Story is **NOT APPROVED**. Implementation completion and source reconciliation do not auto-approve it. Revised BL-004, BL-005 and BL-009 fan-out remains blocked until explicit user approval/reapproval of this reconciled Story.

## Review conclusion
The requested selector UX rework has now been implemented and source-reconciled into this Story. The previous `REWORK_REQUIRED_USER_UX_CHANGE` implementation gap is closed at source level. The Story is now **READY_FOR_USER_REVIEW_AFTER_IMPLEMENTATION_SOURCE_RECONCILIATION**, while approval remains explicitly pending.
