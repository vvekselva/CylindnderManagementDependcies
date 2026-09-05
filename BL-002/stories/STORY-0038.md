# STORY-0038 — Cylinder Delivery

- Release: R1
- Endpoint: `POST /cylinderDelivery`
- Functional area: Cylinder Delivery
- Approval: PENDING_USER_APPROVAL — EXPLICIT_USER_APPROVAL_REQUIRED
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Canonical Use Case review: `BL-002/usecases/SUC-015.md`
- Review-state reconciliation: `BL-002/evidence/STORY-0038-review-state-reconciliation-20260905.yaml`
- Legacy navigation note: `BL-002/usecase-review.md#suc-015` is a compatibility anchor only; this Story is **not superseded**.

## Human-readable story

As an authorized Cylinder Management user, I want to submit the Cylinder Delivery / Delivery Challan Entry form so that the application validates the physical challan and receiving-party identities, records the delivery challan header and its selected cylinder lines in one transaction, and returns a visible success or validation-error outcome.

## Submitted business information

The form posts to `/cylinderDelivery` as model object `cylinderDelivery`. Source-proved submitted values include Challan Number, Challan Date, Challan Type ID, Order Status, Driver ID, Vehicle ID, Remarks, Customer ID, Delivery Address ID, and each selected cylinder as `orderDto.orderLines[i].cylinder.cylinderId` with `orderDto.orderLines[i].quantity`.

The page uses search-based Vehicle, Driver, Customer, Challan Type and Order Status controls. Customer selection loads addresses for that Customer and clears stale Customer/Address IDs when the Customer changes. The in-transit cylinder picker is gated by Vehicle and Challan Date. Client submit guards require Challan Number, Challan Date, Challan Type, Customer, Driver, Vehicle and at least one cylinder.

## Controller and concrete service path

`Uc02Phase02CylinderDeliveryController.doPost(...)` binds `UC02Phase02CylinderDeliveryRequestDto` and invokes `Uc02Phase02CylinderDeliveryMediator.invokeServices(requestDto)`.

The concrete mediator creates `OrderIngestionRequestDto`, copies the submitted `OrderDto`, and invokes `OrderIngestionService.processRequest()`.

`OrderIngestionService.processRequest()` is `@Transactional`. It validates the request, builds `OrderDo` and `OrderLineDo` objects, resolves the submitted foreign-key identities through their JPA DAOs, and saves the assembled order through `OrderJpaDao.save(orderDo)`.

## Server validation

Current frozen source requires:

1. non-null request and nested Order DTO;
2. non-blank Challan Number;
3. Challan Date to be non-null and strictly before `LocalDate.now()`;
4. positive/existing Challan Type ID;
5. positive/existing Customer ID;
6. positive/existing Delivery Address ID;
7. positive/existing Driver ID;
8. positive/existing Vehicle ID; and
9. non-empty Order Lines with cylinder identities.

The browser initializes an empty Challan Date to today, but the server rejects today because it requires `isBefore(LocalDate.now())`. This is recorded as current-source behavior rather than normalized.

The cylinder-existence branch is also source-defective: it performs the DAO existence lookup under the `cylinderIdNull` condition rather than the safe non-null condition. The Story documents this exact behavior and does not authorize a code fix.

## Exact persistence and business effect

The service trims Challan Number, copies Challan Date and Remarks, uses the submitted Order Status or defaults it to `DELIVERED` when null/blank, and sets server-side created/updated timestamps.

For every line it resolves the Cylinder, sets the line Product from the resolved Cylinder, and uses submitted Quantity or the Cylinder's `totalQuantity` as fallback.

`OrderJpaDao` is `JpaRepository<OrderDo, Long>`. `OrderDo` maps to `public.tbl_order` with primary key `pk_order_id`. Relevant persisted identities include `challan_number`, `challan_date`, `fk_challan_type`, `fk_customer`, `fk_delivery_address`, `fk_driver`, `fk_vehicle`, `order_status`, `remarks`, `created_at` and `updated_at`.

`OrderDo.orderLines` is `CascadeType.ALL`. Its `OrderLineDo` children therefore persist with the header into `public.tbl_order_line`, primary key `pk_order_line_id`, with `fk_order`, `fk_cylinder`, `fk_product` and `quantity`.

The proved business effect is creation of the delivery order/challan record and its cylinder lines. The mediator contains a cylinder-state-transition service only as commented future example code, so no explicit cylinder-state transition is claimed for this source path.

## Current error-path gap

`InvalidInputParameterException` is rethrown by the mediator and reaches the controller's validation-error path. However, `CylinderManagementApplicationException` from the order-ingestion service is caught and only logged by the mediator; execution then continues to set a SUCCESS response code. This is a current-source gap, not approved target behavior.

## Visible outcome

On the normal successful controller path the browser redirects to `/orderList?pageNumber=1&itemsPerPage=10`. On `InvalidInputParameterException`, the same delivery form is rendered with the submitted model and `errorMessage`.

## Review and approval gate

The POST business behavior is source-bound from visible submission through controller, concrete mediator, validator, transactional service, JPA repository/entities and the exact `public.tbl_order` / `public.tbl_order_line` identities. STORY-0038 is an active canonical Story under `SUC-015` and is **not superseded**.

Current state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. No explicit user approval for STORY-0038 is durably recorded yet, so BL-004 / BL-005 / BL-009 / BL-011 fan-out is not authorized. After explicit approval, post-approval source/code conformance must pass before downstream executable fan-out. Any required application-code correction must still present the exact Drift / Code Change Manifest and receive explicit user approval before BL-010 or application-source mutation.
