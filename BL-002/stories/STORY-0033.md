# STORY-0033 — Submit Walk-in Sale

- Release: R1
- Endpoint: `POST /walkin-sale`
- Functional area: Walk-in Sale
- Controller: `WalkinSaleIngestionController.doPost(...)`
- Service: `WalkinSaleServiceImpl.processRequest(...)`
- Approval: NOT_APPROVED
- Business-behavior rework: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This operation completes a counter/yard transaction where a customer can receive selected FULL cylinders and/or return selected EMPTY cylinders without creating a vehicle trip or stop. A delivery portion can create a delivered customer order and consume a DELIVERY challan leaf; an empty-return portion creates a walk-in pickup and yard receipt flow.

The entry screen and searchable Customer/Product/cylinder selection behavior are described by STORY-0032. This Story owns submission, validation, transaction processing and persistence.

## Submitted business data

The page posts model attribute `walkinSale` as `WalkinSaleRequestDto` containing:

- `customer.customerId` — selected customer receiving/returning cylinders;
- `customerAddress.customerAddressId` — delivery address used for a walk-in delivery order;
- `challanLeaf.challanType` and `challanLeaf.challanNumber` — challan context/leaf for the delivery portion;
- `fullCylinderIdForDelivery` — selected FULL cylinders to deliver to the customer;
- `emptyCylinderIdForYard` — selected EMPTY cylinders returned by the customer to the yard.

Before persistence, `WalkinSaleServiceImpl` delegates to the configured `walkinSaleRequestValidator` using service code `WALKIN_SALE_SERVICE`. The controller preserves the submitted request and redisplays the page when validation/application exceptions are surfaced.

## Transaction boundary

`WalkinSaleServiceImpl.processRequest(...)` is `@Transactional(rollbackFor = Exception.class)`. The delivery, empty-return and challan-link operations therefore execute inside one application transaction and are rolled back when an exception escapes the service.

## Customer/address resolution

After validation, the service loads the Customer and Customer Address by the submitted database IDs. These are the identities used when creating downstream business records.

## FULL-cylinder delivery behavior

When `fullCylinderIdForDelivery` is non-empty **and** the submitted challan type is `DELIVERY`:

1. A delivered `OrderDo` header is created with the submitted customer/address, today's challan date, delivery challan type, challan number, status `DELIVERED`, creation time and initially no order lines.
2. The header is flushed first because the source explicitly states the database trigger on `tbl_order_line` requires an OPEN `tbl_walk_in_sale` row before FULL-cylinder lines can be inserted.
3. An OPEN `WalkInSaleDo` is created for the order/customer with `soldBy = WALK_IN_COUNTER`, today's sale date, total selected full cylinders and creation metadata.
4. Each selected cylinder is loaded by ID and converted into an `OrderLineDo` using the cylinder's product and total quantity.
5. The order with lines is saved/flushed.
6. The walk-in sale is changed from OPEN to `COMPLETED`, updated timestamp set, and saved/flushed. fileciteturn150file0L2-L2

If full cylinders are selected but the challan type is not DELIVERY, the frozen service logs a warning and **skips order creation** rather than creating a delivery order. If no full cylinders are selected, delivery-order creation is skipped.

## EMPTY-cylinder return behavior

When `emptyCylinderIdForYard` is non-empty:

1. An OPEN `WalkInPickupDo` is created for the customer with `pickedBy = WALK_IN_COUNTER`, today's pickup date, selected-cylinder count, remarks and creation time.
2. For each selected empty cylinder, the cylinder is loaded and a `WalkInPickupLineDo` is saved/flushed first.
3. The source documents that the database trigger on the pickup-line table moves the cylinder from `DELIVERED_FOR_CONSUMPTION` to `EMPTY_IN_TRANSIT_TO_YARD`.
4. Only after that flush, a `YardEntryDo` is created with the cylinder, current entry time, `receivedBy = WALK_IN_COUNTER` and customer/pickup remarks. The source documents this as the step that completes the EMPTY yard-receipt transition.
5. The pickup is changed to `COMPLETED`, updated timestamp set, and saved/flushed. fileciteturn151file0L2-L2

If no empty cylinders are selected, this pickup/yard path is skipped.

## Delivery challan leaf behavior

A challan leaf is linked only when a challan number is supplied and its type is DELIVERY. The service resolves the submitted sheet number from `ChallanPageAuditLedgerJpaDao`, rejects a missing sheet with `CylinderManagementApplicationException`, removes any old transaction link for that page, and when a delivery order exists:

- marks the page `USED_CONFIRMED`;
- saves the page audit row; and
- creates a new `ChallanTransactionLinkDo` linked to the created order/business job.

If a DELIVERY leaf is supplied but no walk-in delivery order was generated, the service logs the condition and does not create the new business-job link. fileciteturn153file0L2-L2

## Exact persistence effects

The frozen service uses JPA DAOs for the customer/address/cylinder lookups and writes the business transaction through `OrderJpaDao`, `WalkInSaleJpaDao`, `WalkInPickupJpaDao`, `WalkInPickupLineJpaDao`, `YardEntriesJpaDao`, `ChallanPageAuditLedgerJpaDao` and `ChallanTransactionLinkJpaDao`. The source-proved write identities are the corresponding order/order-line, walk-in sale, walk-in pickup/pickup-line, yard-entry, challan-page ledger and challan transaction-link entities/tables. No vehicle trip or stop is created by this service.

## Visible success/error outcome

On success the controller redirects to the governed home/back destination. On `InvalidInputParameterException`, it redisplays `final-version-1/WalkinSaleIngestion`, preserves the request/back link and shows `Walk-in sale validation failed. Please correct the highlighted details.` On another `CylinderManagementApplicationException`, it redisplays the same page and shows `Walk-in sale could not be processed. Please verify the challan and cylinder selection.`

## Selector UX review

The selector UX belongs primarily to STORY-0032's GET page. This POST consumes selected IDs and does not independently render static reference selectors. Server-side validation remains mandatory; the submission must never rely only on browser labels/hidden IDs.

## Business impact and testing boundaries

This operation can simultaneously complete a counter delivery and an empty-cylinder return. Tests must cover delivery-only, empty-return-only, combined flow, non-DELIVERY challan with full cylinders, missing/invalid challan leaf resolution, rollback behavior and the trigger-dependent sequencing of pickup-line then yard-entry persistence.

## Rework gate

**BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW**. The concrete Walk-in Sale service, transaction boundary, business branching, persistence sequence and challan-journal behavior are frozen-source bound. No automatic approval and no revised BL-004/BL-005/BL-009 fan-out is authorized until explicit user approval/reapproval.
