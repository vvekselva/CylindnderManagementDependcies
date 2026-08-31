# STORY-0054 — Customer Demand Dashboard and Create-Demand Entry

- Release: R1
- Primary page endpoint: `GET /customer-demands`
- Page controller: `CustomerDemandController.showDashboard`
- Related create action: `POST /customer-demands` (`STORY-0055`)
- Approval: PENDING_USER_APPROVAL
- Review state: REWORKED_BUSINESS_BEHAVIOR_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## What this page is for
The Customer Demand page is the operational screen used to **record what a customer is asking the business to deliver and to monitor those customer demands afterwards**. It is not only a dashboard/list page.

A user can use the same screen to:
1. see existing customer demands;
2. filter/search them;
3. see daily demand/delivery metrics; and
4. **create a new customer demand** by identifying the customer, delivery location, product, required cylinder quantity, requested delivery date, who received the request, and optional remarks.

The business outcome of creating the demand is a new pending customer-order/request record that can subsequently participate in delivery planning, demand monitoring and later delivery-status processing.

## User journey — opening the page
When the user opens `/customer-demands`, the system renders `final-version-1/CustomerDemandDashboard`.

The page loads the current demand list, daily metrics, customer/product reference lists, and a blank `createRequest` form. The page therefore gives the user both a view of current demand and the ability to enter a new request without navigating to a separate create screen.

## Creating a customer demand from this page
The visible `Save Request` form submits a normal `POST /customer-demands`. The create action is implemented by `CustomerDemandController.create` and `CustomerDemandService.create` and is traced in detail by `STORY-0055`.

### Fields entered by the user and what they mean
| Field | Required | User meaning | System impact when the demand is created |
|---|---|---|---|
| `customerId` | Yes | Customer who is asking for cylinders/product | Links the new demand to the selected customer (`fk_customer`). The customer must exist. |
| `customerAddressId` | No | Delivery address/location for this demand | When supplied, links the request to the selected delivery address (`fk_delivery_address`). The address must exist and must belong to the selected customer. |
| `productId` | Yes | Product/cylinder product requested by the customer | Links the demand to the selected product (`fk_product`). The product must exist. |
| `requestedCylinders` | Yes | Number of cylinders requested | Persists the requested quantity. Value must be greater than zero and is later available to demand/delivery planning and metrics. |
| `requiredDeliveryDate` | No | Date by which the customer needs the request fulfilled | If omitted the service uses today. The effective date determines whether the request is `SAME_DAY` or `PLANNED`. |
| `receivedBy` | Yes | Person/user who received or recorded the customer's request | Persists who received the demand. It must contain text. |
| `remarks` | No | Additional business notes/instructions | Persists optional context associated with the request. |

The browser also enforces required fields for customer, product, requested quantity and received-by, and `requestedCylinders` has HTML minimum `1`. The frozen template contains no JavaScript/AJAX create workflow.

## What the system creates
On a valid submission, the service creates a `CustomerDemandDo` and persists it using `CustomerDemandJpaDao.saveAndFlush` into `public.tbl_customer_order_request`.

The system generates:
- a unique request number beginning `CDM-`;
- request status `PENDING`;
- an effective requested/required delivery date;
- request type `SAME_DAY` when the effective delivery date is today, otherwise `PLANNED`;
- the current request timestamp; and
- the generated database identity `pk_customer_order_request_id` using sequence `public.pk_customer_order_request_id_serial`.

This means `Save Request` is not only a UI action: it creates a durable customer-demand record that becomes part of the system's operational demand data.

## Validation and impact on the user
Creation is rejected when the request object is missing, customer is missing, product is missing, quantity is not greater than zero, `receivedBy` is blank, a selected customer/product/address does not exist, or the selected delivery address belongs to another customer.

If creation succeeds, the system redirects back to `/customer-demands` and shows `Customer demand created successfully`. The newly created request is then available to the dashboard/read model according to the normal persisted/view refresh path.

If a runtime validation/reference/persistence error occurs, the controller redirects back to the same page and exposes the exception message as `errorMessage`, so the user remains on the Customer Demand workflow and can correct the request.

## Existing-demand monitoring on the same page
The GET page also supports filters `status`, `requestType`, `productName`, `searchTerm`, with page/size pagination. Filtering is submitted as a normal GET form. The read path is `CustomerDemandService.fetchPage -> CustomerDemandDashboardViewJpaDao.search -> public.vw_customer_demand_dashboard`.

Status and request type use case-insensitive exact matching. Product name and search term use case-insensitive contains matching; search term checks customer name or request number. Results are ordered by `created_at DESC`, then `customer_demand_id DESC`.

The page shows previous/next pagination and preserves the active filters. Empty results display `No customer demands found.`

## Metrics shown to the user
The page reads today's request count/cylinder quantity, today's delivered count/cylinder quantity, average non-null delivery duration, and daily product metrics. These values help the user understand the operational demand workload in addition to entering a new request.

## Page-level business outcome
After this page is loaded, the user should understand both **what demand currently exists** and **how to register a new customer demand**. After a valid Save Request, the system has a persisted pending customer demand containing the selected customer/product/location, requested quantity, delivery timing and request-receipt details, and the user receives visible confirmation.

## Review conclusion
The earlier version over-focused on the GET endpoint and dashboard mechanics and did not explain the page's principal create-demand business capability. This Story has therefore been reworked and remains **not approved** pending user review. The create action remains separately traceable as `STORY-0055`, but this page Story explicitly includes the create-demand purpose, entered fields, validation, persistence effect and user/system impact because that capability is rendered and initiated from this page.
