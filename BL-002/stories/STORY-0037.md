# STORY-0037 — Cylinder Delivery

- Release: R1
- Endpoint: `GET /cylinderDelivery`
- Functional area: Cylinder Delivery
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Cylinder Delivery / Delivery Challan Entry screen, identify the physical delivery challan, select the customer, delivery address, driver and vehicle, choose the cylinders delivered from that vehicle, and save the delivery order so that the delivery challan header and its cylinder lines are recorded as one business transaction.

## Entry and page preparation

`GET /cylinderDelivery` is handled by `Uc02Phase02CylinderDeliveryController.doGet()`. It creates a `UC02Phase02CylinderDeliveryRequestDto` containing an empty `OrderDto`, exposes it as model attribute `cylinderDelivery`, and renders `Uc02-Phase02-CylinderDeliveryView`. The GET itself performs no database mutation.

## Visible fields and their business meaning

- **Challan Number** identifies the physical delivery challan. The submitted value becomes `orderDto.challanNumber` and is trimmed by the service before persistence. `tbl_order.challan_number` is non-null and unique.
- **Challan Date** records the challan/delivery date as `orderDto.challanDate`.
- **Challan Type** identifies the type of challan by `challanTypeId`; the service resolves it to `tbl_order.fk_challan_type`.
- **Order Status** describes the delivery-order status. If null/blank when the service runs, current source defaults it to `DELIVERED`.
- **Driver** identifies the driver by `driverId`, persisted as `tbl_order.fk_driver`.
- **Vehicle** identifies the delivery vehicle by `vehicleId`, persisted as `tbl_order.fk_vehicle`, and together with Challan Date gates the browser's in-transit-cylinder lookup.
- **Remarks** records optional delivery remarks in `tbl_order.remarks`.
- **Customer** identifies the receiving customer by `customerId`, persisted as `tbl_order.fk_customer`.
- **Delivery Address** identifies the receiving customer address by `customerAddressId`, persisted as `tbl_order.fk_delivery_address`.
- **In-Transit Cylinder search** finds cylinders for the selected vehicle/date. Selected cylinder IDs become delivery order lines.
- **Quantity** is persisted per line. When omitted, the current service uses the resolved cylinder's `totalQuantity`.
- **Save Delivery Order** submits the embedded mutation capability described below.

## Search and dependent selector behavior

The page uses search-based selectors rather than static large lists. Vehicle uses `GET /search/vehicle/{term}`, Driver uses `GET /search/driver/{term}`, Customer uses `GET /search/customer/{term}`, Challan Type uses `GET /search/challantype/{term}`, and Order Status uses `GET /search/orderstatus/{term}` with the page's fallback status list when that lookup fails. These type-aheads use a 280 ms debounce and clear stale selected IDs when the visible text changes.

Selecting Customer calls `GET /search/address/customer/{customerId}`. Changing or clearing Customer first clears the selected customer/address identities, so an address from a previous customer is not silently retained in browser state.

The cylinder picker requires both selected vehicle ID and challan date. It calls `POST /search/cylinder/in-transit` for normal paging and `POST /search/cylinder/in-transit/by-serial` when a serial search term is supplied. Serial searching is debounced by 350 ms. Selected cylinder IDs are de-duplicated in browser state and submitted as `orderDto.orderLines[i].cylinder.cylinderId` with `orderDto.orderLines[i].quantity`.

## Browser submit guards

`submitOrder()` blocks submission when Challan Number, Challan Date, Challan Type ID, Customer ID, Driver ID, Vehicle ID or all cylinder lines are missing. Delivery Address, Remarks and Order Status are not part of this JavaScript required-field guard.

## Server validation

The submitted DTO is validated by `OrderIngestionRequestValidator` before persistence. Current frozen source requires:

1. non-null request DTO and Order DTO;
2. non-blank Challan Number;
3. Challan Date to be non-null and **strictly before** `LocalDate.now()` — today's date and future dates are rejected by the current validator;
4. positive/existing Challan Type ID;
5. positive/existing Customer ID;
6. positive/existing Delivery Address ID;
7. positive/existing Driver ID;
8. positive/existing Vehicle ID; and
9. at least one Order Line.

The browser does not require Delivery Address while the server validator does, so that difference is a current-state validation gap and is not silently normalized in this Story.

The validator also contains a current-source defect in its cylinder existence logic: the DAO existence branch is guarded by `cylinderIdNull` instead of the non-null case. Consequently this source does not safely prove the intended cylinder-existence validation and may attempt an unsafe dereference in a null-cylinder path. This is documented as current behavior; no code correction is authorized by Story rework alone.

## Save Delivery Order — exact server transaction

`POST /cylinderDelivery` passes the assembled `UC02Phase02CylinderDeliveryRequestDto` to `Uc02Phase02CylinderDeliveryMediator.invokeServices()`.

The concrete mediator creates an `OrderIngestionRequestDto`, copies the submitted `OrderDto`, and calls `OrderIngestionService.processRequest()`.

`OrderIngestionService.processRequest()` is annotated `@Transactional`. After validation it:

1. constructs `OrderDo`;
2. trims the challan number;
3. copies challan date and remarks;
4. defaults status to `DELIVERED` when submitted status is null/blank;
5. sets server-side `createdAt` and `updatedAt` timestamps;
6. resolves Challan Type, Customer, Delivery Address, Driver and Vehicle using their JPA DAOs;
7. resolves every submitted Cylinder using `CylinderJpaDao`;
8. constructs one `OrderLineDo` per cylinder, assigning the cylinder's Product and submitted/defaulted Quantity;
9. attaches the line collection to the header; and
10. calls `OrderJpaDao.save(orderDo)`.

`OrderJpaDao` is a Spring Data `JpaRepository<OrderDo, Long>`. `OrderDo` maps to `public.tbl_order`, whose primary identity is `pk_order_id`. Its `orderLines` relationship is `@OneToMany(mappedBy="order", cascade=CascadeType.ALL)`, so the attached `OrderLineDo` records are persisted with the header by the same transactional save. `OrderLineDo` maps to `public.tbl_order_line`, primary identity `pk_order_line_id`, with `fk_order`, `fk_cylinder`, `fk_product` and `quantity`.

The header persistence also carries `fk_challan_type`, `fk_customer`, `fk_delivery_address`, `fk_driver` and `fk_vehicle`. Although `OrderLineDo` supports an optional per-line `fk_delivery_address`, this particular service path does not populate it.

## Downstream/current-state behavior proved from source

This source path proves persistence of the delivery order header and cylinder lines. It does **not** prove that an explicit cylinder-state transition service runs after the save. The mediator contains only a commented future example for moving cylinders from `IN_TRANSIT` to `DELIVERED_FOR_CONSUMPTION`; commented code is not treated as executed behavior.

There is also a current error-path gap: `InvalidInputParameterException` is rethrown by the mediator, but `CylinderManagementApplicationException` from the order-ingestion service is caught and only logged. The mediator then continues and sets a SUCCESS response code. The Story records this exact current-source behavior without treating it as approved target behavior.

## Visible outcome

On a normal successful submit, the page/controller flow returns to the order list. Validation errors are redisplayed on the delivery form with the submitted model and an error message according to the controller path. The Story does not claim an unproved cylinder-state/location transition beyond the order/order-line persistence described above.

## Review and approval gate

The business-behavior rework is complete because the embedded Save capability is now bound from controller through the concrete mediator, transactional service, DAOs/entities and exact database identities, including source-proved validation and current-state gaps.

This Story remains **BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW** and is **not approved**. Explicit user approval/reapproval is required before post-approval code conformance and downstream BL-004/BL-005/BL-009 fan-out.

If post-approval conformance later detects Story/code drift, the orchestrator may automatically analyze the mismatch and prepare a reviewer-readable drift packet, but it must not mutate application code or execute BL-010 code rework until the user explicitly approves the exact drift/code-change manifest. The packet must identify current versus approved behavior, business impact, exact repository/ref and source locations, proposed change, reason, tests, and database impact. Any implementation scope beyond the approved manifest requires fresh user approval.
