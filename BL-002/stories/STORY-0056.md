# STORY-0056 — Mark Customer Demand Delivered

- Release: R1
- Endpoint: `POST /customer-demands/{requestId}/mark-delivered`
- Controller: `CustomerDemandController.markDelivered`
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

The user marks a customer demand as delivered so that the demand record accurately reflects fulfillment, captures when delivery completed and records the elapsed delivery duration used by the Customer Demand dashboard/monitoring flow.

## User action and visible control

Each dashboard demand row whose `requestStatus != 'DELIVERED'` renders a normal POST form whose action includes `row.customerDemandId` and ends `/mark-delivered`. Its submit button is `Mark Delivered`. When the row status is already `DELIVERED`, the form/button is not rendered.

The frozen template has no script block, so no confirmation dialog, AJAX submission, debounce, or client-side state transition is source-proved.

## Exact request/controller contract

The endpoint is `POST /customer-demands/{requestId}/mark-delivered`. `requestId` is a required `Long` path variable bound by `@PathVariable("requestId")`. The controller invokes `CustomerDemandService.markDelivered(requestId)`.

On success it adds flash attribute `successMessage = "Customer demand marked delivered"`. Any `RuntimeException` is caught and its message becomes `errorMessage`. Both paths redirect to `/customer-demands`.

## Service guard and business mutation

The service loads the demand with `CustomerDemandJpaDao.findById(customerDemandId)`. A missing identity throws `IllegalArgumentException("Customer demand not found: " + customerDemandId)`.

For an existing demand it:

1. sets `deliveredAt = LocalDateTime.now()`;
2. sets `requestStatus = "DELIVERED"`;
3. computes `deliveryDurationMinutes` as the whole-minute duration from existing `requestedAt` to the new delivered timestamp;
4. persists the mutated entity with `saveAndFlush`.

This closes the demand from a monitoring perspective and gives the business both completion state and elapsed fulfillment time.

## Exact persistence identity

`CustomerDemandDo` maps to `public.tbl_customer_order_request`; primary identity is `pk_customer_order_request_id`. The operation updates the identified demand row's `delivered_at`, `request_status`, and `delivery_duration_minutes` values, with entity lifecycle also updating `updated_at`.

## Guard / repeated-call behavior

No service-side predicate rejects a demand already marked delivered. The normal dashboard suppresses the button once a row renders with `DELIVERED`, but a direct repeated POST is not source-proved idempotent: it would assign a new delivered timestamp and recalculate duration.

This is a current-source behavior observation, not an authorized code change. Any proposal to add a service-level already-delivered guard must first be presented as a Story/code drift manifest with exact source location, proposed change, business impact and tests, then explicitly approved by the user before BL-010 implementation.

## Visible outcome

After redirect, successful execution displays `Customer demand marked delivered`; a caught runtime failure displays its exception message. The refreshed row renders delivered state and no longer offers the Mark Delivered button.

## Selector UX applicability

This action operates on the demand row's persistent `requestId` and does not introduce Customer/Product/Address or another large reference selector. No selector conversion or dependent-selector rework is applicable to this Story.

## Review gate

The source proves the user action, request identity, missing-record guard, exact state/timestamp/duration mutation, database identity, repeated-call boundary and visible result. `STORY-0056` is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No approval/reapproval or code mutation occurred, and BL-004/BL-005/BL-009 fan-out remains blocked until explicit approval/reapproval plus current post-approval Story/code conformance PASS.
