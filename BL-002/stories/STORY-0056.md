# STORY-0056 — Mark Customer Demand Delivered

- Release: R1
- Endpoint: `POST /customer-demands/{requestId}/mark-delivered`
- Controller: `CustomerDemandController.markDelivered`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User action and visible control
Each dashboard demand row whose `requestStatus != 'DELIVERED'` renders a normal POST form whose action includes `row.customerDemandId` and ends `/mark-delivered`. Its submit button is `Mark Delivered`. When the row status is already `DELIVERED`, the form/button is not rendered.

The frozen template has no script block, so no confirmation dialog, AJAX submission, debounce, or client-side state transition is source-proved.

## Exact request/controller contract
The endpoint is `POST /customer-demands/{requestId}/mark-delivered`. `requestId` is a required `Long` path variable bound by `@PathVariable("requestId")`. The controller invokes `CustomerDemandService.markDelivered(requestId)`.

On success it adds flash attribute `successMessage = "Customer demand marked delivered"`. Any `RuntimeException` is caught and its message becomes `errorMessage`. Both paths redirect to `/customer-demands`.

## Service guard and mutation
The service loads the demand with `CustomerDemandJpaDao.findById(customerDemandId)`. A missing identity throws `IllegalArgumentException("Customer demand not found: " + customerDemandId)`.

For an existing demand it sets `deliveredAt = LocalDateTime.now()`, sets `requestStatus = "DELIVERED"`, and sets `deliveryDurationMinutes` to the whole-minute duration from the existing `requestedAt` to the new delivered timestamp. The mutated entity is persisted with `saveAndFlush` and mapped to a DTO.

## Persistence identity
`CustomerDemandDo` maps to `public.tbl_customer_order_request`; primary identity is `pk_customer_order_request_id`. The delivery mutation therefore updates the identified demand row's `delivered_at`, `request_status`, and `delivery_duration_minutes` values, with entity update lifecycle also updating `updated_at`.

## Guard/idempotency boundary
No service-side predicate rejects a demand already marked delivered. The normal dashboard UI suppresses the Mark Delivered form after a row is rendered with status `DELIVERED`, but a direct repeated POST is not source-proved idempotent: the service would assign a new delivered timestamp and recalculate duration again. No additional authorization/current-status guard is present in this controller/service method.

## Visible outcome
After redirect, successful execution displays `Customer demand marked delivered`; a caught runtime failure displays its exception message. The refreshed row is rendered with delivered status and no Mark Delivered button.

## Governed conclusion
The frozen template/controller/service/entity source resolves the path-variable, UI/button-state, status/timestamp/duration mutation, missing-ID, repeat-call and visible-outcome gaps. STORY-0056 is `STRICT_FIELD_UI_COMPLETE`; approval remains `PENDING_USER_APPROVAL`.
