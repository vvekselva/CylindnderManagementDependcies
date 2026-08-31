# STORY-0054 — Customer Demand Dashboard and Create-Demand Entry

- Release: R1
- Primary page endpoint: `GET /customer-demands`
- Page controller: `CustomerDemandController.showDashboard`
- Related create action: `POST /customer-demands` (`STORY-0055`)
- Approval: NOT_APPROVED
- Review state: REWORK_REQUIRED_USER_UX_CHANGE
- Frozen source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Requirement source: explicit user review feedback on 2026-08-31

## What this page is for
The Customer Demand page is the operational screen used to record what a customer is asking the business to deliver and to monitor those demands afterwards. It is not only a dashboard/list page.

From the same page, the user must be able to:
1. see existing customer demands;
2. filter/search existing demands;
3. see demand/delivery metrics; and
4. create a new customer demand by selecting the customer, delivery address, product, requested cylinder quantity, delivery date, who received the request, and optional remarks.

The business result of Save Request is a durable pending customer-demand/order-request record that is available to later demand monitoring and delivery planning.

## Required user journey for creating a demand
The create-demand interaction must follow the same search-oriented user experience used elsewhere in the application, particularly the Walk-in Sale workflow. Large reference data such as customers and products must not be presented as long static list boxes when an existing application search service can be reused.

### 1. Select Customer — SEARCH BOX REQUIRED
`customerId` remains the persisted/submitted customer identity, but the visible control must be a searchable Customer field rather than a preloaded list box.

Required behavior:
- the user types part of the customer name/identifier into a Customer search box;
- the search box must reuse the same existing Customer REST/search service used by the Walk-in Sale customer selector, rather than introduce another independent customer-search implementation;
- matching customer results are displayed to the user;
- selecting a result stores the exact customer ID used by the create-demand request;
- changing or clearing the selected customer must invalidate/clear any previously selected customer address;
- the Story must identify the exact REST endpoint, request parameter/minimum-length/debounce behavior and hidden-ID propagation from frozen source once the Walk-in Sale implementation is bound during implementation/rework.

The current frozen Customer Demand template uses a server-rendered Customer list box. That is the current-state behavior, not the accepted target behavior. This Story therefore remains REWORK_REQUIRED until the page is changed and source-proved.

### 2. Populate Address after Customer Selection
`customerAddressId` represents the delivery location for the selected customer.

Required behavior:
- no unrelated global address list should be presented as the normal selection model;
- after a customer is selected, the system must fetch/populate only addresses belonging to that customer;
- the user then selects one of those customer addresses;
- if the customer changes, the address options and selected address must be reset;
- the existing customer-address REST/search service should be reused where the application already provides one;
- server-side validation must continue to reject an address that does not belong to the submitted customer.

Business impact: the demand is tied to the correct customer delivery location and the user is prevented from accidentally choosing another customer's address.

### 3. Select Product — SEARCH BOX REQUIRED
`productId` remains the persisted/submitted product identity, but the visible Product control must be a searchable field rather than a long static product list.

Required behavior:
- the user types part of the product name/code;
- results are obtained using the same existing Product REST/search service/pattern used on other application pages;
- the user selects the required product;
- the selected product ID is propagated into the create-demand request;
- clearing/changing the search selection must clear stale hidden product identity;
- exact endpoint, minimum-length/debounce/result mapping must be source-proved during implementation/rework.

### 4. Other demand fields
| Field | Required | User meaning | System impact when created |
|---|---|---|---|
| Customer | Yes | Customer requesting cylinders/product | Selected search result supplies `customerId`; persisted as the demand customer. |
| Customer Address | No | Delivery location for this demand | Populated only for selected customer; selected ID supplies `customerAddressId`. |
| Product | Yes | Product/cylinder product requested | Selected search result supplies `productId`; persisted as the requested product. |
| `requestedCylinders` | Yes | Number of cylinders requested | Must be greater than zero; becomes requested quantity for planning/metrics. |
| `requiredDeliveryDate` | No | Date by which customer requires delivery | Defaults to today if absent; drives SAME_DAY vs PLANNED classification. |
| `receivedBy` | Yes | Person/user who received or recorded request | Must contain text and is persisted with the demand. |
| `remarks` | No | Additional instructions/context | Optional information persisted with request. |

## Save Request — business transaction
When the user activates Save Request, the selected Customer ID, selected Address ID, selected Product ID and entered demand fields are submitted to `POST /customer-demands`.

The existing service rules remain applicable unless implementation changes prove otherwise:
- customer is required and must exist;
- product is required and must exist;
- requested quantity must be greater than zero;
- received-by must contain text;
- optional selected address must exist and belong to the selected customer.

On a valid request the system creates a `CustomerDemandDo` through `CustomerDemandJpaDao.saveAndFlush` in `public.tbl_customer_order_request`.

The system currently derives/generates:
- request number with `CDM-` prefix;
- status `PENDING`;
- effective requested/required delivery date;
- `SAME_DAY` when effective date is today, otherwise `PLANNED`;
- request timestamp; and
- generated database identity `pk_customer_order_request_id` using `public.pk_customer_order_request_id_serial`.

## User/system impact
A successful Save Request creates a new operational demand that can appear in demand dashboards and participate in delivery-planning and later delivery-status processing. The user receives confirmation on the Customer Demand page.

A validation/reference/persistence error must leave the demand uncreated and return a useful visible error so the user can correct the input.

## Existing demand monitoring
The same page continues to show/filter existing demands and metrics. Existing filters include status, request type, product name and search term with pagination. These dashboard behaviors are separate from the new required search controls used inside the create-demand form.

## Current-state versus required-state gap
Current frozen source proves server-rendered static Customer, Address and Product lists on this page. The user-required target is:

`Customer search -> select Customer -> load that Customer's addresses -> select Address -> Product search -> select Product -> enter quantity/date/received-by/remarks -> Save Request`

This target must reuse the same Customer/Product search REST services/patterns already used by established pages such as Walk-in Sale, and reuse the existing customer-address service where applicable. Exact endpoint names and browser behavior must be bound from authoritative source during implementation; they must not be invented in this Story.

## Cross-page rework rule introduced by this review
This page is an exemplar for a wider UX rework. During BL-002 rework, any page that currently renders large Customer/Product/Supplier/Vehicle/Driver or similar reference datasets as static list boxes must be reviewed against existing application search controls. Where a reusable search service/pattern already exists, the target Story should describe the searchable control, selected-ID propagation, dependent-list population/reset behavior and user/system impact instead of accepting a long static list merely because the current source renders one.

## Approval and fan-out gate
This Story is explicitly **NOT APPROVED**.

No revised BL-004 unit-test, BL-005 integration-test or BL-009 test-case/test-data fan-out is authorized for this revised behavior until the user explicitly approves the reworked Story. Existing historical downstream artifacts, if any, must not be treated as approval of this revised UX contract.

## Review conclusion
STORY-0054 remains `REWORK_REQUIRED_USER_UX_CHANGE`. The business purpose is now documented, but approval is blocked until the Customer and Product selectors are reworked as search boxes, customer-dependent Address population/reset behavior is implemented/source-proved, and the resulting Story is explicitly approved by the user.