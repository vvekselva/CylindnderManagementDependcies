# STORY-0055 — Create Customer Demand

- Release: R1
- Endpoint: `POST /customer-demands`
- Controller: `CustomerDemandController.create`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen transaction source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Related reconciled create page: `STORY-0054` / BL-010 DEV-0001 implementation source PR #3 head `dde2b007c8ad5278f162cf153b5857397d5b35a0`

## Business purpose

The user records a customer request for a product/cylinders so that the business has a durable PENDING demand/order-request that can be monitored and planned for delivery. This POST is the Save Request transaction embedded in the Customer Demand page documented by STORY-0054.

## User entry and selector behavior

The approved target is not the former long static Customer/Product lists. The related page has been source-reconciled after DEV-0001 to use searchable Customer and Product controls and a Customer-dependent Address control:

- Customer: minimum 3 characters, 280 ms debounce, `GET /search/customer/{searchText}`, display `customerName`, hidden submitted identity `customerId`.
- Address: enabled/populated only after Customer selection through `GET /search/address/customer-address/{customerId}`; submitted identity `customerAddressId`; changing/clearing Customer clears stale Address identity/options.
- Product: minimum 3 characters, 280 ms debounce, `GET /search/product/{searchText}`, display `productName`, response collection `productDtos`, hidden submitted identity `productId`; changing/clearing Product clears stale identity.

The POST continues to receive persistent IDs rather than display text. Server-side Customer/Address relationship validation remains authoritative.

## Submitted fields and business meaning

`CustomerDemandController.create` binds `@ModelAttribute("createRequest") CustomerDemandCreateRequestDto` containing:

- `customerId` — required Customer requesting the demand.
- `customerAddressId` — optional delivery location belonging to that Customer.
- `productId` — required requested Product.
- `requestedCylinders` — required requested cylinder quantity; must be greater than zero.
- `requiredDeliveryDate` — optional requested delivery date.
- `receivedBy` — required person who received/recorded the request.
- `remarks` — optional business notes/instructions.

## Validation and relationship guards

`CustomerDemandService.create` proves:

1. request object must exist;
2. `customerId` is required and must resolve in Customer persistence;
3. `productId` is required and must resolve in Product persistence;
4. `requestedCylinders` must be greater than zero;
5. `receivedBy` must contain text;
6. supplied `customerAddressId` must resolve;
7. if the loaded address has a Customer, its Customer ID must equal submitted `customerId`; otherwise creation is rejected with `Selected delivery address does not belong to selected customer`.

The browser also supplies required/min constraints for Customer, Product, requested quantity and Received By, but these do not replace server validation.

## Derived/default values

If `requiredDeliveryDate` is absent, the service uses `LocalDate.now()`. The effective date is written as both requested date and required delivery date. Request type becomes `SAME_DAY` when the effective date is today; otherwise `PLANNED`. Status is `PENDING`, and `requestedAt` is the current local date/time.

The service generates a request number with prefix `CDM-` plus a `yyyyMMddHHmmssSSS` timestamp. The mapped request number is non-null and unique; no separate application duplicate pre-check is source-proved.

## Exact persistence effect

The service constructs `CustomerDemandDo` and calls `CustomerDemandJpaDao.saveAndFlush`.

Exact persistence identity:

- table: `public.tbl_customer_order_request`;
- primary key: `pk_customer_order_request_id`;
- sequence: `public.pk_customer_order_request_id_serial`.

Persisted business data includes Customer (`fk_customer`), optional delivery Address (`fk_delivery_address`), Product (`fk_product`), generated request number, requested cylinders, requested/required dates, request type/status, Received By, remarks and request timestamp.

## User-visible outcome

On success the controller adds flash attribute `successMessage = "Customer demand created successfully"` and redirects to `/customer-demands`.

A caught `RuntimeException` adds its message as `errorMessage` and redirects to the same dashboard. The dashboard renders the corresponding flash message so the user can see the result and correct invalid input when necessary.

## Business impact

A successful Save Request creates the durable demand used by the Customer Demand monitoring and delivery-planning flow. The searchable-selector page contract reduces incorrect Customer/Product selection and prevents stale Address association while preserving exact persistent IDs and server-side ownership validation.

## Story/code-change governance

The selector implementation belongs to the reconciled page contract in STORY-0054/DEV-0001. This Story records the POST transaction that consumes those selected identities; it does not authorize any new application-code mutation.

Any future conformance drift or proposed fix must first produce the governed user-review manifest with exact repository/ref, file/class/method or template/database location, current-versus-approved behavior, proposed change, business impact, tests and database impact. No BL-010 implementation is authorized without explicit user approval of that manifest.

## Review gate

The POST business transaction is source-bound from user-entered/selected values through controller/service validation, relationship guards, defaults, exact persistence identity and visible completion behavior, and is reconciled with the related searchable-selector page contract.

`STORY-0055` is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No Story approval/reapproval occurred. BL-004/BL-005/BL-009 fan-out remains blocked until explicit approval/reapproval of the current contract and a current post-approval Story/code conformance PASS.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
