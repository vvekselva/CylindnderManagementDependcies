# STORY-0038 — Cylinder Delivery

- Release: R1
- Endpoint: `POST /cylinderDelivery`
- Functional area: Cylinder Delivery
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit the Cylinder Delivery / Delivery Challan Entry form so that the application validates the delivery, persists its delivery-challan header and cylinder lines, and returns me to the order list on success or redisplays the entered form with a visible validation error on failure.

## Screen, controls and browser submission

The frozen `Uc02-Phase02-CylinderDeliveryView.html` is the exact visible screen. Its form is `th:action="@{/cylinderDelivery}"`, model object `cylinderDelivery`, method `post`, id `order-form`.

The source-proved visible controls and submitted identities include Challan Number (`orderDto.challanNumber`), Challan Date (`orderDto.challanDate`), Challan Type hidden ID, Order Status, Driver hidden ID, Vehicle hidden ID, Remarks, Customer hidden ID, Delivery Address hidden ID, and selected in-transit cylinder rows propagated as `orderDto.orderLines[i].cylinder.cylinderId` plus `orderDto.orderLines[i].quantity`.

The screen performs vehicle, driver, customer, challan-type, order-status and customer-address lookups, and gates the in-transit cylinder picker on both selected vehicle and challan date. It calls the in-transit cylinder search endpoints documented in STORY-0037. `submitOrder()` blocks submission when Challan Number, Challan Date, Challan Type ID, Customer ID, Driver ID, Vehicle ID or at least one cylinder is missing. If these browser guards pass, the form submits to the exact registered endpoint `POST /cylinderDelivery`.

## Controller and request identity

`Uc02Phase02CylinderDeliveryController.doPost(...)` is annotated `@PostMapping("/cylinderDelivery")` and binds `@ModelAttribute("cylinderDelivery") UC02Phase02CylinderDeliveryRequestDto`.

It calls `uc02Phase02CylinderDeliveryMediator.invokeServices(requestDto)`.

- Success: redirects to `/orderList?pageNumber=1&itemsPerPage=10`.
- `InvalidInputParameterException`: redisplays `Uc02-Phase02-CylinderDeliveryView`, preserves the submitted request under model key `cylinderDelivery`, and adds `errorMessage`, which the page renders in its server-side error banner.

## Mediator contract

`Uc02Phase02CylinderDeliveryMediator` is the concrete mediator. It creates `OrderIngestionRequestDto`, copies the submitted `OrderDto` into it, and invokes `orderIngestionService.processRequest(orderRequest)`. On success it copies the returned saved `OrderDto` into `UC02Phase02CylinderDeliveryResponseDto` and sets SUCCESS response code.

The only executable downstream service in this mediator is the order-ingestion service. A future cylinder-state-transition service appears only in commented example code and is **not** claimed as an active side effect.

## Validation and branches

`OrderIngestionRequestValidator` validates the service request using `UC_002_PHASE_02_PLACE_ORDER`. Frozen-source checks include:

- request and nested `OrderDto` presence;
- non-blank challan number;
- challan date must be non-null and `isBefore(LocalDate.now())` (the executable validator therefore rejects today/future dates even though the browser initializes the field to today; this implementation mismatch is recorded, not normalized away);
- valid/existing challan type;
- valid/existing customer;
- valid/existing customer delivery address;
- valid/existing driver;
- valid/existing vehicle;
- non-empty order lines;
- cylinder identity checks for each order line.

The cylinder-existence branch in the frozen validator is written as `if (cylinderIdNull && cylinderJpaDao.findById(lineDto.getCylinder().getCylinderId()).isEmpty())`. This exact branch is retained as source truth; no safer intended behavior is invented.

When accumulated validation errors exist, `InvalidInputParameterException.throwInputValidationFailure(...)` prevents persistence and returns control to the controller error path.

## Transactional service and persistence side effects

`OrderIngestionService.processRequest(...)` is `@Transactional`.

After validation it builds `OrderDo` and actively assigns:

- trimmed challan number;
- challan date;
- order status, defaulting to `DELIVERED` when submitted status is null/blank;
- remarks;
- created/updated timestamps.

It resolves the submitted FK identities through `ChallanTypeJpaDao`, `CustomerJpaDao`, `CustomerAddressJpaDao`, `DriverJpaDao`, and `VehicleJpaDao`. For each submitted `OrderLineDto` it resolves `CylinderDo`, constructs `OrderLineDo`, assigns the parent order, cylinder, the cylinder's product, and quantity (submitted quantity or the cylinder total quantity fallback), then attaches the line list to `OrderDo`.

The active write is `orderJpaDao.save(orderDo)`. The earlier standalone order-save block is commented out and is not counted as another write.

## DAO/entity/database identity

`OrderJpaDao` extends `JpaRepository<OrderDo, Long>`.

`OrderDo` maps to `public.tbl_order` with primary key `pk_order_id` generated from `public.pk_order_id_serial`. Source-proved persisted columns/joins applicable here include `challan_number`, `challan_date`, `fk_challan_type`, `fk_customer`, `fk_delivery_address`, `fk_driver`, `fk_vehicle`, `order_status`, `remarks`, `created_at`, `updated_at`, and the one-to-many `orderLines` relationship with `CascadeType.ALL`.

`OrderLineDo` maps to `public.tbl_order_line`, primary key `pk_order_line_id` generated from `public.pk_order_line_id_serial`, with `fk_order`, `fk_cylinder`, `fk_product`, `quantity`, and optional `fk_delivery_address`. Because `OrderDo.orderLines` is cascade-all and the service saves the assembled `OrderDo`, the attached order lines are included in that JPA aggregate persistence operation.

No database behavior beyond executable JPA mapping/service evidence is invented.

## Response and visible outcome

On successful transactional service completion, the mediator returns success and the controller redirects the browser to the paged order list. On input-validation failure, no successful save path is completed and the user sees the same delivery screen with the submitted model and `errorMessage` banner.

## Strict completion decision

Strict field/UI completion is **PASS** for registered `POST /cylinderDelivery`. Frozen source now proves the exact visible form/control and browser submission path; POST controller and DTO; concrete mediator; validator and executable branches; transactional `OrderIngestionService`; FK DAOs; `OrderJpaDao`; `OrderDo`/`OrderLineDo`; exact `public.tbl_order`/`public.tbl_order_line` identities; persistence side effects; success redirect; and visible validation-error outcome.

No approval occurred; approval remains explicitly pending user approval.
